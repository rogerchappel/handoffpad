# Orchestration

HandoffPad fits at the end of an agent run.

1. Agent completes a task or reaches a blocker.
2. Agent records verification commands in a text log.
3. HandoffPad creates a local bundle from the task, command log, and git state.
4. Validation checks the bundle has enough context and no unredacted home path.
5. A human or follow-up agent reviews the rendered Markdown.

External posting, approvals, publishing, and merges are out of scope for the tool and require separate explicit approval.
