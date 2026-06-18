#!/usr/bin/env node
"use strict";

const { createBundle, renderBundle, validateBundle, writeBundle } = require("../src/index");

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const args = { _: [] };
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = rest[index + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        index += 1;
      }
    } else {
      args._.push(token);
    }
  }
  return { command, args };
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2));

  if (!command || command === "help" || args.help) {
    process.stdout.write(`handoffpad

Usage:
  handoffpad create --task docs/TASKS.md --output handoff.json [--since HEAD~3] [--log commands.log]
  handoffpad validate handoff.json
  handoffpad render handoff.json --format markdown
`);
    return;
  }

  if (command === "create") {
    if (!args.task || !args.output) {
      throw new Error("create requires --task and --output");
    }
    const bundle = await createBundle({
      taskPath: args.task,
      since: args.since || "HEAD",
      logPath: args.log,
      includeDiff: args.diff !== "false"
    });
    await writeBundle(bundle, args.output);
    process.stdout.write(`Wrote ${args.output}\n`);
    return;
  }

  if (command === "validate") {
    const file = args._[0];
    if (!file) throw new Error("validate requires a bundle path");
    const result = await validateBundle(file);
    for (const line of result.messages) process.stdout.write(`${line}\n`);
    if (!result.ok) process.exitCode = 1;
    return;
  }

  if (command === "render") {
    const file = args._[0];
    if (!file) throw new Error("render requires a bundle path");
    process.stdout.write(await renderBundle(file, { format: args.format || "markdown" }));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  process.stderr.write(`handoffpad: ${error.message}\n`);
  process.exitCode = 1;
});
