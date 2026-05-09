# Safety Notes

HandoffPad exists to make agent continuation safer and less lossy.

## Principles

- **Local first:** all inputs and outputs stay on disk unless you choose to share them.
- **Reviewable:** bundles are plain JSON and render to Markdown.
- **Explicit omissions:** missing context should be named, not hidden.
- **No external mutation:** the CLI does not create issues, comments, PRs, messages, or uploads.
- **Deterministic enough for CI:** validation and rendering avoid hidden network state.

## Recommended agent practice

Before handing off:

1. Create a bundle with task, git range, command log, omissions, and next steps.
2. Validate it.
3. Render it.
4. Read the rendered output as if you were the next agent.
5. Fix vague steps or missing omissions before sharing.

When receiving a bundle:

1. Validate it locally.
2. Treat command results as claims until reproduced.
3. Check git state before applying instructions.
4. Continue only from safe, explicit next steps.
