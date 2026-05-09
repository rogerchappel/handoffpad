import test from "node:test";
import assert from "node:assert/strict";
import { hasErrors, readBundle, validateBundle } from "../src/validate.js";

const fixture = new URL("../examples/handoff.example.json", import.meta.url).pathname;

test("accepts a complete bundle fixture", async () => {
  const issues = validateBundle(await readBundle(fixture));
  assert.equal(hasErrors(issues), false);
});

test("rejects incomplete bundle data", () => {
  const issues = validateBundle({ schemaVersion: "handoffpad.v1" } as never);
  assert.equal(hasErrors(issues), true);
  assert.match(issues.map((issue) => issue.message).join("\n"), /task\.summary/);
});
