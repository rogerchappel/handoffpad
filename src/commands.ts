import { readFile } from "node:fs/promises";
import type { HandoffCommand } from "./schema.js";
import { redactText } from "./redact.js";

export interface ParsedCommands {
  commands: HandoffCommand[];
  redactions: string[];
}

export async function parseCommandLog(path?: string): Promise<ParsedCommands> {
  if (!path) return { commands: [], redactions: [] };
  const raw = await readFile(path, "utf8");
  const redacted = redactText(raw);
  const commands = redacted.text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseCommandLine);
  return { commands, redactions: redacted.redactions };
}

function parseCommandLine(line: string): HandoffCommand {
  const match = /^(pass|fail|unknown)\s*[:|-]\s*(.+)$/i.exec(line);
  if (match) {
    const status = match[1].toLowerCase() as HandoffCommand["status"];
    const rest = match[2];
    const [command, ...summaryParts] = rest.split(/\s+#\s*/);
    return { command: command.trim(), status, summary: summaryParts.join(" # ").trim() || status };
  }
  return { command: line, status: "unknown", summary: "recorded command" };
}
