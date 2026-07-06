#!/usr/bin/env node
"use strict";

const { accessSync, constants, existsSync } = require("node:fs");
const { spawnSync } = require("node:child_process");
const { join } = require("node:path");
const { bin } = require("../package.json");

const requiredFiles = [
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CHANGELOG.md",
  "SKILL.md"
];

for (const file of requiredFiles) {
  accessSync(join(process.cwd(), file), constants.R_OK);
}

for (const [name, relativePath] of Object.entries(bin || {})) {
  const binPath = join(process.cwd(), relativePath);
  accessSync(binPath, constants.R_OK | constants.X_OK);

  const result = spawnSync(process.execPath, [binPath, "--help"], {
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`${name} --help exited with status ${result.status}`);
  }

  if (!result.stdout.includes("Usage:")) {
    throw new Error(`${name} --help did not print usage text`);
  }
}

const pack = spawnSync("npm", ["pack", "--dry-run"], {
  encoding: "utf8",
  stdio: "pipe"
});

if (pack.status !== 0) {
  process.stdout.write(pack.stdout);
  process.stderr.write(pack.stderr);
  throw new Error(`npm pack --dry-run exited with status ${pack.status}`);
}

for (const file of requiredFiles) {
  if (!pack.stderr.includes(file) && !pack.stdout.includes(file) && existsSync(file)) {
    throw new Error(`npm pack --dry-run output did not mention ${file}`);
  }
}
