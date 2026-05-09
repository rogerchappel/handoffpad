# Security Policy

HandoffPad is local-first handoff tooling. It does not run a service, collect telemetry, or post bundles anywhere by itself.

## Supported versions

Security fixes target the latest released `0.x` version until a stable `1.0` policy exists.

## Reporting a vulnerability

Please report suspected vulnerabilities through GitHub Security Advisories for `rogerchappel/handoffpad` when available, or open a minimal issue that avoids publishing secrets or exploit details.

## Redaction model

HandoffPad redacts:

- Local home directory paths (`/Users/name` → `~`)
- GitHub token-like values
- AWS access key-like values
- Bearer tokens
- Simple `token=`, `secret=`, `password=`, and `api_key=` assignments

This is a safety net, not a guarantee. Always review `handoff.json` before sharing it outside your machine.

## Out of scope

- HandoffPad does not sandbox arbitrary commands.
- HandoffPad does not verify that command logs are truthful.
- HandoffPad does not upload, publish, or message external systems.

## Safe sharing checklist

1. Run `handoffpad validate handoff.json`.
2. Inspect warnings, especially failed commands.
3. Search the bundle for secrets specific to your environment.
4. Prefer rendered Markdown for chat when the raw diff is not needed.
