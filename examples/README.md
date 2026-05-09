# Examples

- `command-log.txt` shows the lightweight command log syntax accepted by `handoffpad create --commands`.
- `handoff.example.json` is a small complete bundle suitable for renderer and validator examples.

Try:

```bash
npm run build
node dist/src/cli.js validate examples/handoff.example.json
node dist/src/cli.js render examples/handoff.example.json --format markdown
```
