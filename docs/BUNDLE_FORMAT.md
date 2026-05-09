# Bundle Format

HandoffPad writes JSON using `schemaVersion: "handoffpad.v1"`.

## Required sections

- `task`: the source task path and a short summary.
- `git`: root, branch, head, selected base ref, changed files, and optional redacted diff.
- `commands`: command claims copied from an explicit command log.
- `notes`: extra context worth preserving.
- `omissions`: known gaps, skipped checks, or external state not inspected.
- `nextSteps`: safe continuation actions.
- `redactions`: names of redaction rules that changed the output.

## Compatibility

The v1 format is intentionally small. New fields may be added in minor versions, but existing v1 fields should remain stable until a v2 schema is introduced.
