"use strict";

const fs = require("node:fs/promises");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");

const execFileAsync = promisify(execFile);

const SECRET_PATTERNS = [
  [/gh[pousr]_[A-Za-z0-9_]{20,}/g, "[REDACTED_GITHUB_TOKEN]"],
  [/(api[_-]?key|token|secret|password)\s*[:=]\s*["']?[^"'\s]+/gi, "$1=[REDACTED]"],
  [new RegExp(process.env.HOME ? escapeRegExp(process.env.HOME) : "^$", "g"), "~"]
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function redact(text) {
  return String(text || "").split(/\r?\n/).map((line) => {
    let output = line;
    for (const [pattern, replacement] of SECRET_PATTERNS) {
      output = output.replace(pattern, replacement);
    }
    return output;
  }).join("\n");
}

async function readOptional(filePath) {
  if (!filePath) return "";
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

async function git(args) {
  try {
    const { stdout } = await execFileAsync("git", args, { maxBuffer: 1024 * 1024 * 5 });
    return stdout;
  } catch {
    return "";
  }
}

function parseCommandLog(logText) {
  return redact(logText).split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const passed = /\b(pass|passed|ok|success)\b/i.test(line);
    const failed = /\b(fail|failed|error|exit 1)\b/i.test(line);
    return { line, status: failed ? "failed" : passed ? "passed" : "recorded" };
  });
}

function summarizeDiff(diffText) {
  const files = new Map();
  for (const line of diffText.split(/\r?\n/)) {
    const match = line.match(/^diff --git a\/(.+?) b\/(.+)$/);
    if (match) files.set(match[2], { path: match[2], additions: 0, deletions: 0 });
    const current = Array.from(files.values()).at(-1);
    if (!current) continue;
    if (line.startsWith("+") && !line.startsWith("+++")) current.additions += 1;
    if (line.startsWith("-") && !line.startsWith("---")) current.deletions += 1;
  }
  return Array.from(files.values());
}

function extractNextSteps(taskText) {
  const lines = taskText.split(/\r?\n/);
  const checklist = lines.filter((line) => /^\s*[-*]\s+\[[ x]\]/i.test(line)).map((line) => line.trim());
  const open = checklist.filter((line) => !/\[[xX]\]/.test(line));
  return open.length ? open : lines.filter((line) => /next|todo|follow/i.test(line)).slice(0, 5);
}

async function createBundle(options) {
  const taskText = await readOptional(options.taskPath);
  const logText = await readOptional(options.logPath);
  const diff = options.includeDiff ? await git(["diff", options.since || "HEAD"]) : "";
  const status = await git(["status", "--short"]);
  return {
    schema: "handoffpad.bundle.v1",
    createdAt: new Date().toISOString(),
    source: {
      cwd: redact(process.cwd()),
      taskPath: options.taskPath,
      since: options.since || "HEAD"
    },
    taskBrief: redact(taskText).trim(),
    changedFiles: summarizeDiff(redact(diff)),
    gitStatus: redact(status).trim().split(/\r?\n/).filter(Boolean),
    commands: parseCommandLog(logText),
    nextSteps: extractNextSteps(redact(taskText)),
    omissions: [
      "No external systems were contacted by handoffpad.",
      "Secrets and home paths are redacted with deterministic local rules."
    ]
  };
}

async function writeBundle(bundle, outputPath) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(bundle, null, 2)}\n`);
}

function validateObject(bundle) {
  const messages = [];
  if (bundle.schema !== "handoffpad.bundle.v1") messages.push("error: unsupported schema");
  if (!bundle.taskBrief) messages.push("error: missing task brief");
  if (!Array.isArray(bundle.nextSteps)) messages.push("error: missing next steps");
  if (!Array.isArray(bundle.commands)) messages.push("error: missing command log array");
  if (JSON.stringify(bundle).includes(process.env.HOME || "\u0000")) messages.push("error: unredacted home path");
  if (!messages.length) messages.push("ok: bundle is complete and redacted");
  return { ok: messages.every((line) => line.startsWith("ok:")), messages };
}

async function validateBundle(filePath) {
  const bundle = JSON.parse(await fs.readFile(filePath, "utf8"));
  return validateObject(bundle);
}

function renderMarkdown(bundle) {
  const commands = bundle.commands.map((command) => `- ${command.status}: \`${command.line}\``).join("\n") || "- No commands recorded";
  const files = bundle.changedFiles.map((file) => `- ${file.path} (+${file.additions}/-${file.deletions})`).join("\n") || "- No diff files captured";
  const next = bundle.nextSteps.map((step) => `- ${step}`).join("\n") || "- No next steps found";
  return `# Agent Handoff

Created: ${bundle.createdAt}

## Task Brief

${bundle.taskBrief}

## Changed Files

${files}

## Commands

${commands}

## Next Steps

${next}

## Omissions

${bundle.omissions.map((item) => `- ${item}`).join("\n")}
`;
}

async function renderBundle(filePath, options = {}) {
  const bundle = JSON.parse(await fs.readFile(filePath, "utf8"));
  if (options.format !== "markdown") return `${JSON.stringify(bundle, null, 2)}\n`;
  return renderMarkdown(bundle);
}

module.exports = {
  createBundle,
  redact,
  renderBundle,
  renderMarkdown,
  validateBundle,
  validateObject,
  writeBundle
};
