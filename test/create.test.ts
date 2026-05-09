import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createBundle } from "../src/create.js";

function makeRepo(): string {
  const dir = join(tmpdir(), `handoffpad-${process.pid}-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  execFileSync("git", ["init", "-b", "main"], { cwd: dir, stdio: "ignore" });
  execFileSync("git", ["config", "user.email", "test@example.com"], { cwd: dir });
  execFileSync("git", ["config", "user.name", "Test User"], { cwd: dir });
  writeFileSync(join(dir, "task.md"), "# Fixture task\n\n## One-liner\n\nShip useful context.\n");
  writeFileSync(join(dir, "file.txt"), "first\n");
  execFileSync("git", ["add", "."], { cwd: dir });
  execFileSync("git", ["commit", "-m", "initial"], { cwd: dir, stdio: "ignore" });
  writeFileSync(join(dir, "file.txt"), "first\nsecond token=abc123\n");
  writeFileSync(join(dir, "commands.txt"), "pass: npm test # ok\n");
  return dir;
}

test("creates a redacted bundle from a real git fixture", async () => {
  const cwd = makeRepo();
  try {
    const bundle = await createBundle({
      cwd,
      task: "task.md",
      since: "HEAD",
      output: "handoff.json",
      commandLog: "commands.txt",
      includeDiff: true,
      note: ["Ready for review."],
      nextStep: ["Inspect the diff."],
      omission: ["No remote state checked."]
    });
    assert.equal(bundle.schemaVersion, "handoffpad.v1");
    assert.equal(bundle.git.changedFiles[0]?.path, "file.txt");
    assert.equal(bundle.commands[0]?.status, "pass");
    assert.equal(bundle.git.diff?.includes("abc123"), false);
    assert.equal(JSON.parse(readFileSync(join(cwd, "handoff.json"), "utf8")).task.summary, "Fixture task — Ship useful context.");
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
