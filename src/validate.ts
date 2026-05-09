import { readFile } from "node:fs/promises";
import type { HandoffBundle, ValidationIssue } from "./schema.js";

export async function readBundle(path: string): Promise<HandoffBundle> {
  return JSON.parse(await readFile(path, "utf8")) as HandoffBundle;
}

export function validateBundle(bundle: HandoffBundle): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (bundle.schemaVersion !== "handoffpad.v1") issues.push(error("Unsupported schemaVersion."));
  if (!bundle.createdAt || Number.isNaN(Date.parse(bundle.createdAt))) issues.push(error("createdAt must be an ISO timestamp."));
  if (!bundle.task?.summary) issues.push(error("task.summary is required."));
  if (!bundle.git?.head) issues.push(error("git.head is required."));
  if (!Array.isArray(bundle.git?.changedFiles)) issues.push(error("git.changedFiles must be an array."));
  if (!Array.isArray(bundle.commands)) issues.push(error("commands must be an array."));
  if (!Array.isArray(bundle.nextSteps) || bundle.nextSteps.length === 0) issues.push(error("nextSteps must include at least one safe continuation step."));
  if (!Array.isArray(bundle.omissions) || bundle.omissions.length === 0) issues.push(warning("No omissions were recorded; confirm nothing was intentionally left out."));
  if (!Array.isArray(bundle.redactions)) issues.push(error("redactions must be an array."));

  const failedCommands = bundle.commands.filter((command) => command.status === "fail");
  for (const command of failedCommands) {
    issues.push(warning(`Command marked failed: ${command.command}`));
  }

  return issues;
}

const error = (message: string): ValidationIssue => ({ level: "error", message });
const warning = (message: string): ValidationIssue => ({ level: "warning", message });

export function hasErrors(issues: ValidationIssue[]): boolean {
  return issues.some((issue) => issue.level === "error");
}
