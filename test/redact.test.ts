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

test("redacts every supported secret pattern, including repeated matches", () => {
  const input = [
    "ghp_abcdefghijklmnopqrstuvwxyz1234 ghp_zyxwvutsrqponmlkjihgfedcba1234",
    "AKIA1234567890ABCDEF AKIAFEDCBA0987654321",
    "api_key=firstsecret token=secondsecret",
    "Bearer first.token Bearer second.token"
  ].join(" | ");
  const original = input;
  const result = redactText(input, "");

  assert.equal(input, original, "redaction must not mutate the input string");
  assert.equal(result.text.includes("ghp_"), false);
  assert.equal(result.text.includes("AKIA"), false);
  assert.equal(result.text.includes("firstsecret"), false);
  assert.equal(result.text.includes("secondsecret"), false);
  assert.equal(result.text.includes("first.token"), false);
  assert.equal(result.text.includes("second.token"), false);
  assert.equal((result.text.match(/\[REDACTED:GITHUB_TOKEN\]/g) ?? []).length, 2);
  assert.equal((result.text.match(/\[REDACTED:AWS_ACCESS_KEY\]/g) ?? []).length, 2);
  assert.equal((result.text.match(/\[REDACTED:SECRET\]/g) ?? []).length, 2);
  assert.equal((result.text.match(/Bearer \[REDACTED:BEARER_TOKEN\]/g) ?? []).length, 2);
  assert.deepEqual(result.redactions, ["aws-access-key", "bearer-token", "generic-secret-assignment", "github-token"]);
});
