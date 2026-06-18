# HandoffPad Skill

Use this skill when an agent needs to hand work to another agent or reviewer with a concise, redacted bundle.

## Required Inputs

- A task brief or checklist file.
- Optional command log with verification results.
- Optional git diff range.

## Side-Effect Boundaries

The CLI reads local files and git state, then writes a local bundle. It must not post externally, publish, merge, or approve anything. Any external sharing requires an explicit human action after reviewing the rendered Markdown.

## Workflow

1. Run `handoffpad create --task <file> --output <bundle.json>`.
2. Run `handoffpad validate <bundle.json>`.
3. Run `handoffpad render <bundle.json> --format markdown`.
4. Review redactions, commands, changed files, and next steps before sharing.

## Example

```bash
handoffpad create --task docs/TASKS.md --since HEAD~3 --log tmp/commands.log --output tmp/handoff.json
handoffpad validate tmp/handoff.json
handoffpad render tmp/handoff.json --format markdown
```

## Verification

Use `npm test`, `npm run smoke`, or `bash scripts/validate.sh` before relying on a bundle in a review or handoff.
