import type { HandoffBundle } from "./schema.js";

export function renderMarkdown(bundle: HandoffBundle): string {
  const changedFiles = bundle.git.changedFiles.length
    ? bundle.git.changedFiles.map((file) => `- ${file.path} (${file.status}${formatCounts(file.additions, file.deletions)})`).join("\n")
    : "- No changed files detected for the selected range.";

  const commands = bundle.commands.length
    ? bundle.commands.map((command) => `- **${command.status.toUpperCase()}** \`${command.command}\` — ${command.summary}`).join("\n")
    : "- No commands recorded.";

  return [
    `# Handoff: ${bundle.task.summary}`,
    "",
    `Created: ${bundle.createdAt}`,
    `Git: \`${bundle.git.branch}\` @ \`${bundle.git.head}\` since \`${bundle.git.since}\``,
    "",
    "## Changed files",
    changedFiles,
    "",
    "## Commands",
    commands,
    "",
    "## Notes",
    list(bundle.notes, "No extra notes recorded."),
    "",
    "## Omissions",
    list(bundle.omissions, "No omissions recorded."),
    "",
    "## Safe next steps",
    list(bundle.nextSteps, "Review bundle and continue from the task summary."),
    "",
    "## Redactions",
    list(bundle.redactions, "None reported."),
    ""
  ].join("\n");
}

function list(items: string[], fallback: string): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : `- ${fallback}`;
}

function formatCounts(additions?: number, deletions?: number): string {
  if (additions === undefined && deletions === undefined) return "";
  return `, +${additions ?? 0}/-${deletions ?? 0}`;
}
