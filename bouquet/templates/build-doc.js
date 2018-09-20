const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const root = process.cwd();

// Build all of the puml files that have changed.

const cmd = "docker run --rm -v " + root + "/docs:/doc nickjer/docker-sphinx sphinx-build -a -q -b singlehtml . _build_html";
console.error(cmd);


childProcess.execSync(cmd, {env: process.env, stdio: 'inherit', stderr: 'inherit'});
