import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { redactText } from "./redact.js";

export interface TaskSummary {
  source: string;
  summary: string;
  redactions: string[];
}

export async function readTaskSummary(taskPath: string): Promise<TaskSummary> {
  const raw = await readFile(taskPath, "utf8");
  const redacted = redactText(raw);
  const lines = redacted.text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const heading = lines.find((line) => line.startsWith("#"))?.replace(/^#+\s*/, "");
  const oneLinerIndex = lines.findIndex((line) => /^##\s+one-liner/i.test(line));
  const oneLiner = oneLinerIndex >= 0 ? lines[oneLinerIndex + 1] : undefined;
  const summary = [heading, oneLiner]
    .filter(Boolean)
    .join(" — ")
    .trim() || `${basename(taskPath)} handoff task`;

  return { source: taskPath, summary, redactions: redacted.redactions };
}
