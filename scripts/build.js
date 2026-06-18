"use strict";

const { execFileSync } = require("node:child_process");

execFileSync(process.execPath, ["--check", "src/index.js"], {
  stdio: "ignore"
});
execFileSync(process.execPath, ["--check", "bin/handoffpad.js"], {
  stdio: "ignore"
});
process.stdout.write("build: commonjs entrypoints parse\n");
