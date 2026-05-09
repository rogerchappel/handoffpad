# Orchestration

HandoffPad is designed for local agent-to-agent continuation without hidden network behavior.

## Roles

- **Builder agent:** runs `handoffpad create` before pausing or transferring work.
- **Reviewer agent:** runs `handoffpad validate` and checks warnings before trusting the bundle.
- **Continuation agent:** reads `handoffpad render` output, verifies commands, and follows the safe next steps.

## Default flow

```bash
handoffpad create --task docs/TASKS.md --since HEAD~3 --commands command-log.txt --output handoff.json
handoffpad validate handoff.json
handoffpad render handoff.json --format markdown --output handoff.md
```

## Safety expectations

- Bundle creation is local-only.
- The CLI never posts to GitHub, Slack, or any external service.
- Home directories and common token shapes are redacted by default.
- Omissions should be explicit so the next agent knows what not to assume.
- Failed commands are allowed, but validation reports them as warnings.

## Handoff quality bar

A useful bundle should answer:

1. What was the task?
2. What changed?
3. What commands were run and what happened?
4. What was intentionally omitted?
5. What should the next agent safely do next?
