# HandoffPad PRD

Status: in-progress

## One-liner

Agent handoff bundle builder.

## Summary

A local-first CLI that packages the exact context a follow-up agent needs: task brief, changed files, commands run, test results, and safe next steps.

## Problem

Agent-to-agent handoffs are often verbose, lossy, or include private clutter. Teams need a compact, redacted, reviewable bundle format.

## Target users

Agentic coding teams, maintainers doing async reviews, support engineers.

## V1 scope

- Create handoff bundles from git diff, selected docs, command logs, and test summaries
- Redact secrets and home paths by default
- Validate bundle completeness against a checklist
- Render concise Markdown for chat or PR comments
- Keep all data local unless the user sends it

## CLI shape

```bash
handoffpad create --task docs/TASKS.md --since HEAD~3 --output handoff.json
handoffpad validate handoff.json
handoffpad render handoff.json --format markdown
```

## Non-goals

- No SaaS backend.
- No hidden telemetry.
- No external posting or mutation by default.
- No secret collection beyond explicit, redacted local inputs.

## Differentiation

Unlike generic archive tools, HandoffPad is structured around safe agent continuation and explicit omissions.

## Safety and privacy

- Local-first by default.
- Explicit opt-in for any external command preview/execution.
- Fixture-backed tests for parsing, reporting, and redaction behavior.
- Clear failure modes and deterministic output suitable for CI.

## Acceptance criteria

- TypeScript CLI scaffolded with StackForge under `/Users/roger/Developer/my-opensource/handoffpad`.
- `docs/PRD.md`, `docs/TASKS.md`, `docs/ORCHESTRATION.md`, and `docs/orchestration.json` exist.
- Functional MVP with fixtures and tests.
- `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh` pass where present.
- Public GitHub repository `rogerchappel/handoffpad` exists with useful description and topics.
- Branch protection attempted for `main`.

## Source attribution

Original idea from OSS Factory/sub-agent orchestration handoff needs. No external repo copied.
