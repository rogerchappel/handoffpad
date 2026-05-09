#!/usr/bin/env bash
set -euo pipefail
ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

cd "$TMP"
git init -b main >/dev/null
git config user.email smoke@example.com
git config user.name "Smoke Test"
cat > TASK.md <<'TASK'
# Smoke task

## One-liner

Prove the CLI can hand off local work.
TASK
printf 'one\n' > file.txt
git add .
git commit -m initial >/dev/null
printf 'one\ntwo token=smokesecret\n' > file.txt
cat > commands.txt <<'LOG'
pass: npm test # fixture tests passed
LOG

node "$ROOT/dist/cli.js" create --task TASK.md --since HEAD --commands commands.txt --output handoff.json --note "smoke note" --next-step "continue safely" --omission "no remote checks"
node "$ROOT/dist/cli.js" validate handoff.json
node "$ROOT/dist/cli.js" render handoff.json --format markdown --output handoff.md

grep -q "Smoke task" handoff.md
if grep -q "smokesecret" handoff.json; then
  echo "secret leaked in handoff.json" >&2
  exit 1
fi
