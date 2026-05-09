# Contributing

Thanks for helping make agent handoffs calmer and sharper.

## Local setup

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Development expectations

- Keep the CLI local-first; do not add hidden network calls.
- Add fixture-backed tests for parsing, rendering, validation, and redaction changes.
- Prefer clear failure messages over clever behavior.
- Update docs when command shape or bundle fields change.
- Keep bundles reviewable as plain JSON.

## Commit style

Use small, meaningful commits when practical:

- `feat: add compact markdown renderer`
- `fix: preserve failed command summaries`
- `docs: clarify redaction limits`
- `test: cover bearer token redaction`

## Pull request checklist

- [ ] `npm test` passes.
- [ ] `npm run check` passes.
- [ ] `npm run build` passes.
- [ ] `npm run smoke` passes.
- [ ] `bash scripts/validate.sh` passes.
- [ ] Security/privacy implications are documented.
