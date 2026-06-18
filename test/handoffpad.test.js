"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createBundle, redact, renderMarkdown, validateObject, writeBundle } = require("../src");

test("redacts tokens and home paths", () => {
  const input = `${process.env.HOME}/repo token=ghp_abcdefghijklmnopqrstuvwxyz123456`;
  const output = redact(input);
  assert.match(output, /~/);
  assert.doesNotMatch(output, /ghp_/);
});

test("creates a fixture-backed bundle", async () => {
  const bundle = await createBundle({
    taskPath: "fixtures/task.md",
    logPath: "fixtures/commands.log",
    includeDiff: false
  });
  assert.equal(bundle.schema, "handoffpad.bundle.v1");
  assert.ok(bundle.taskBrief.includes("Prepare the release candidate"));
  assert.equal(bundle.commands.length, 2);
  assert.equal(validateObject(bundle).ok, true);
});

test("writes and renders markdown handoff", async () => {
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "handoffpad-"));
  const bundle = await createBundle({
    taskPath: "fixtures/task.md",
    logPath: "fixtures/commands.log",
    includeDiff: false
  });
  const out = path.join(temp, "handoff.json");
  await writeBundle(bundle, out);
  const markdown = renderMarkdown(bundle);
  assert.match(markdown, /# Agent Handoff/);
  assert.match(markdown, /npm test/);
});
