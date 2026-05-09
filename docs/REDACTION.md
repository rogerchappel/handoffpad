# Redaction

Redaction runs during bundle creation before handoff content is written.

## Built-in rules

- Home path replacement: `/Users/example` becomes `~`.
- GitHub token-like strings are replaced with `[REDACTED:GITHUB_TOKEN]`.
- AWS access key-like strings are replaced with `[REDACTED:AWS_ACCESS_KEY]`.
- Bearer token values are replaced with `[REDACTED:BEARER_TOKEN]`.
- Simple secret assignments such as `token=value` are replaced with `[REDACTED:SECRET]`.

## Limits

Redaction is conservative pattern matching. It cannot know every private project name, customer identifier, or proprietary string. Review bundles before sharing them beyond the intended audience.
