# HandoffPad PRD

## Summary

HandoffPad is a local-first CLI that packages the context a follow-up agent needs: task brief, changed files, command results, test summaries, omissions, and safe next steps.

## Users

- Agentic coding teams passing work between sessions.
- Maintainers preparing async review notes.
- Support engineers producing reproducible local handoffs.

## Requirements

- Create JSON handoff bundles from local files and git state.
- Redact secrets and home paths by default.
- Validate bundle completeness before sharing.
- Render concise Markdown suitable for chat or PR comments.
- Avoid hidden network, telemetry, or external mutation.

## Non-Goals

- Hosted storage.
- Automatic issue or PR posting.
- LLM summarisation in V1.
- Secret collection beyond deterministic local redaction.

## Acceptance Criteria

- Fixture-backed tests cover redaction, bundle creation, validation, and rendering.
- CLI smoke command creates, validates, and renders a bundle.
- README and `SKILL.md` document safety boundaries.
