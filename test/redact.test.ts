import test from "node:test";
import assert from "node:assert/strict";
import { redactText } from "../src/redact.js";

test("redacts home paths and common secret shapes", () => {
  const result = redactText("path=/Users/roger/project token=supersecret Bearer abc.def.ghi", "/Users/roger");
  assert.equal(result.text.includes("/Users/roger"), false);
  assert.equal(result.text.includes("supersecret"), false);
  assert.match(result.text, /~\/project/);
  assert.deepEqual(result.redactions, ["bearer-token", "generic-secret-assignment", "home-path"]);
});
