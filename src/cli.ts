#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Command } from "commander";
import { createBundle } from "./create.js";
import { renderMarkdown } from "./render.js";
import { hasErrors, readBundle, validateBundle } from "./validate.js";

const program = new Command();

program
  .name("handoffpad")
  .description("Local-first agent handoff bundle builder.")
  .version("0.1.0");

program
  .command("create")
  .description("Create a redacted handoff JSON bundle from a task brief and git context.")
  .requiredOption("--task <path>", "Task or PRD markdown file to summarize")
  .option("--since <ref>", "Git ref/range base for changed files", "HEAD~1")
  .option("--output <path>", "Output JSON path", "handoff.json")
  .option("--commands <path>", "Optional command log with lines like 'pass: npm test # summary'")
  .option("--no-diff", "Omit patch diff; changed-file summary is still included")
  .option("--note <text>", "Extra note to include", collect, [])
  .option("--next-step <text>", "Safe next step to include", collect, [])
  .option("--omission <text>", "Known omission to record", collect, [])
  .action(async (options) => {
    const bundle = await createBundle({
      task: options.task,
      since: options.since,
      output: options.output,
      cwd: process.cwd(),
      commandLog: options.commands,
      includeDiff: options.diff,
      note: options.note,
      nextStep: options.nextStep,
      omission: options.omission
    });
    console.log(`Wrote ${options.output} with ${bundle.git.changedFiles.length} changed file(s).`);
  });

program
  .command("validate")
  .description("Validate a handoff JSON bundle checklist.")
  .argument("bundle", "Bundle JSON path")
  .action(async (bundlePath) => {
    const bundle = await readBundle(resolve(bundlePath));
    const issues = validateBundle(bundle);
    if (issues.length === 0) {
      console.log("Bundle is valid.");
      return;
    }
    for (const issue of issues) console.log(`${issue.level.toUpperCase()}: ${issue.message}`);
    if (hasErrors(issues)) process.exitCode = 1;
  });

program
  .command("render")
  .description("Render a handoff bundle for chat, PR comments, or review notes.")
  .argument("bundle", "Bundle JSON path")
  .option("--format <format>", "Output format: markdown", "markdown")
  .option("--output <path>", "Optional output file")
  .action(async (bundlePath, options) => {
    if (options.format !== "markdown") throw new Error("Only markdown rendering is supported in v1.");
    const markdown = renderMarkdown(await readBundle(resolve(bundlePath)));
    if (options.output) {
      await writeFile(resolve(options.output), markdown, "utf8");
      console.log(`Wrote ${options.output}.`);
    } else {
      process.stdout.write(markdown);
    }
  });

function collect(value: string, previous: string[]): string[] {
  previous.push(value);
  return previous;
}

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
