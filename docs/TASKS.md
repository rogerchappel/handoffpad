# HandoffPad Tasks

## MVP checklist

- [x] Scaffold TypeScript OSS CLI with StackForge.
- [x] Define the `handoffpad.v1` bundle schema.
- [x] Implement `create` for task summaries, git context, command logs, notes, omissions, and next steps.
- [x] Redact home paths and common secret patterns by default.
- [x] Implement `validate` for checklist-driven bundle completeness.
- [x] Implement `render --format markdown` for chat and PR comments.
- [x] Add fixture-backed tests and CLI smoke coverage.
- [x] Document local-first safety, contribution flow, and orchestration.

## Post-MVP ideas

- Add JSON Schema export for bundle validation in other tools.
- Support pluggable redaction rules from a local config file.
- Add `--from-transcript` import helpers for agent logs.
- Add deterministic timestamp option for reproducible CI fixtures.
- Add compact mode for very small chat handoffs.
