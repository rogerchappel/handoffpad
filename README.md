# HandoffPad

HandoffPad is the little clipboard you pass to the next agent when the work is too important for “see transcript above.” It builds a compact, redacted, reviewable handoff bundle from your task brief, git changes, command results, omissions, and safe next steps.

Local-first. No telemetry. No posting. Just a tidy bundle that says what happened and what to do next.

## Install

```bash
npm install -g @rogerchappel/handoffpad
```

Or run from a checkout:

```bash
npm install
npm run build
node dist/src/cli.js --help
```

## Quick start

```bash
handoffpad create \
  --task docs/TASKS.md \
  --since HEAD~3 \
  --commands examples/command-log.txt \
  --output handoff.json \
  --note "Parser work is ready for review." \
  --omission "No remote deploy was attempted." \
  --next-step "Run tests after rebasing."

handoffpad validate handoff.json
handoffpad render handoff.json --format markdown --output handoff.md
```

## Command log format

Each non-empty line is parsed as:

```text
pass: npm test # 12 tests passed
fail: npm run lint # missing lint config
unknown: npm run smoke
```

## What goes into a bundle?

- Task source and summary
- Git branch, head, changed files, and optional redacted patch diff
- Commands run with pass/fail/unknown status
- Notes, omissions, and safe next steps
- Redaction names applied during creation

## Privacy posture

HandoffPad works on local files and local git state only. It redacts common token shapes and replaces your home path with `~`. You still own review: validate and inspect bundles before sharing them.

## Scripts

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Example output

See [`examples/handoff.example.json`](examples/handoff.example.json) and [`docs/ORCHESTRATION.md`](docs/ORCHESTRATION.md).

## Development

Run the same local checks used for release readiness before opening changes:

- `npm run check`
- `npm test`
- `npm run build`
- `npm run smoke`
- `npm run package:smoke`
- `npm run release:check`
