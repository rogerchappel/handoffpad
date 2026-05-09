import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { HandoffFileChange } from "./schema.js";

const execFileAsync = promisify(execFile);

async function git(args: string[], cwd: string): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { cwd, maxBuffer: 10 * 1024 * 1024 });
  return stdout.trimEnd();
}

export async function getGitRoot(cwd: string): Promise<string> {
  return git(["rev-parse", "--show-toplevel"], cwd);
}

export async function getGitHead(cwd: string): Promise<string> {
  return git(["rev-parse", "--short", "HEAD"], cwd);
}

export async function getGitBranch(cwd: string): Promise<string> {
  return git(["branch", "--show-current"], cwd).then((branch) => branch || "detached");
}

export async function getChangedFiles(cwd: string, since: string): Promise<HandoffFileChange[]> {
  const output = await git(["diff", "--numstat", "--name-status", since], cwd).catch(async () => git(["diff", "--name-status", since], cwd));
  return output
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseChangedFileLine);
}

function parseChangedFileLine(line: string): HandoffFileChange {
  const parts = line.split("\t");
  if (/^\d+|-/.test(parts[0]) && parts.length >= 3) {
    const additions = parts[0] === "-" ? undefined : Number(parts[0]);
    const deletions = parts[1] === "-" ? undefined : Number(parts[1]);
    return { path: parts.slice(2).join("\t"), status: "modified", additions, deletions };
  }
  return { status: parts[0] ?? "unknown", path: parts.slice(1).join("\t") || line };
}

export async function getDiff(cwd: string, since: string): Promise<string> {
  return git(["diff", "--stat", "--patch", since], cwd);
}
