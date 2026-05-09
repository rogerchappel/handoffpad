import test from "node:test";
import assert from "node:assert/strict";
import { readBundle } from "../src/validate.js";
import { renderMarkdown } from "../src/render.js";

const fixture = "examples/handoff.example.json";

test("renders markdown handoff with commands and next steps", async () => {
  const markdown = renderMarkdown(await readBundle(fixture));
  assert.match(markdown, /^# Handoff: HandoffPad Tasks/);
  assert.match(markdown, /\*\*PASS\*\* `npm test`/);
  assert.match(markdown, /Run validation before continuing/);
});
