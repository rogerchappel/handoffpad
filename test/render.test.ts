import test from "node:test";
import assert from "node:assert/strict";
import { readBundle } from "../src/validate.js";
import { renderMarkdown } from "../src/render.js";

const fixture = new URL("../examples/handoff.example.json", import.meta.url).pathname;

test("renders markdown handoff with commands and next steps", async () => {
  const markdown = renderMarkdown(await readBundle(fixture));
  assert.match(markdown, /^# Handoff: HandoffPad Tasks/);
  assert.match(markdown, /\*\*PASS\*\* `npm test`/);
  assert.match(markdown, /Run validation before continuing/);
});
