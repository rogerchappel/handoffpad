import test from "node:test";
import assert from "node:assert/strict";
import { parseCommandLog } from "../src/commands.js";

const fixture = new URL("./fixtures/commands.txt", import.meta.url).pathname;

test("parses command logs with statuses and summaries", async () => {
  const parsed = await parseCommandLog(fixture);
  assert.equal(parsed.commands.length, 3);
  assert.deepEqual(parsed.commands[0], {
    command: "npm test",
    status: "pass",
    summary: "12 tests passed"
  });
  assert.equal(parsed.commands[1].status, "fail");
});
