# HandoffPad

HandoffPad builds compact, redacted agent handoff bundles from local task notes, git state, and command logs. It is designed for follow-up agents, reviewers, and maintainers who need the exact next context without dumping a whole transcript.

## Quick Start

Install the published CLI:

```bash
npm install -g handoffpad
```

For local development:

```bash
npm install
npm run smoke
node bin/handoffpad.js create --task fixtures/task.md --log fixtures/commands.log --output tmp/handoff.json
node bin/handoffpad.js validate tmp/handoff.json
node bin/handoffpad.js render tmp/handoff.json --format markdown
```

Run the full release-readiness gate before publishing or promotion:

```bash
npm run release:check
```

The release check runs the project check, tests, build validation, CLI smoke
flow, and dry-run npm package review.

## What It Captures

- Task brief and open checklist items
- Changed-file summary from `git diff`
- Short git status
- Command log lines with pass/fail hints
- Explicit omissions and local-only safety notes

## Safety Notes

HandoffPad is local-first. It does not send data to external services, create remote issues, publish packages, or mutate repositories beyond writing the requested output file. Home paths and common token forms are redacted before bundle validation.

## Limitations

V1 uses deterministic text extraction instead of LLM summarisation. It is best for concise task files and command logs. Review generated bundles before pasting them into external systems.
