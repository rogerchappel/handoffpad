import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { parseCommandLog } from "./commands.js";
import { getChangedFiles, getDiff, getGitBranch, getGitHead, getGitRoot } from "./git.js";
import { mergeRedactions, redactText } from "./redact.js";
import type { CreateOptions, HandoffBundle } from "./schema.js";
import { readTaskSummary } from "./task.js";

export async function createBundle(options: CreateOptions): Promise<HandoffBundle> {
  const cwd = resolve(options.cwd);
  const [task, commands, root, head, branch, changedFiles] = await Promise.all([
    readTaskSummary(resolve(cwd, options.task)),
    parseCommandLog(options.commandLog ? resolve(cwd, options.commandLog) : undefined),
    getGitRoot(cwd),
    getGitHead(cwd),
    getGitBranch(cwd),
    getChangedFiles(cwd, options.since)
  ]);

  let diff: string | undefined;
  let diffRedactions: string[] = [];
  if (options.includeDiff) {
    const rawDiff = await getDiff(cwd, options.since);
    const redacted = redactText(rawDiff);
    diff = redacted.text;
    diffRedactions = redacted.redactions;
  }

  const bundle: HandoffBundle = {
    schemaVersion: "handoffpad.v1",
    createdAt: new Date().toISOString(),
    task: {
      source: relative(root, resolve(cwd, options.task)) || options.task,
      summary: task.summary
    },
    git: {
      root: redactText(root).text,
      since: options.since,
      head,
      branch,
      changedFiles,
      ...(diff ? { diff } : {})
    },
    commands: commands.commands,
    notes: options.note,
    omissions: options.omission.length ? options.omission : ["No omissions recorded."],
    nextSteps: options.nextStep.length ? options.nextStep : ["Review bundle, verify tests, and continue from the task summary."],
    redactions: mergeRedactions(task.redactions, commands.redactions, diffRedactions, redactText(root).redactions)
  };

  await mkdir(dirname(resolve(cwd, options.output)), { recursive: true });
  await writeFile(resolve(cwd, options.output), `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  return bundle;
}
