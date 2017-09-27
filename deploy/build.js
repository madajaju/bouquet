const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const root = process.cwd() + "/deploy/uservices";

let cmd = process.argv[2]; // node, build, cmd

npmBuildRecursive(root);

// it will be `npm run-script build` inside root in the end.
console.log('===================================================================');
console.log(`Performing "npm ${cmd}" inside root folder: ` + root );
console.log('===================================================================');

function npmBuildRecursive(folder)
{
  console.log("NPM Build Recursive: " + folder);

  for (let subfolder of subfolders(folder))
  {
    npmBuildRecursive(subfolder)
  }

  const has_package_json = fs.existsSync(path.join(folder, 'package.json'));

  console.log("has package: " + has_package_json);
  if (!has_package_json && path.basename(folder) !== 'code')
  {
    return
  }

  if (folder !== root && has_package_json)
  {
    console.log('===================================================================');
    console.log(`Performing "npm ${cmd}" inside ${folder === root ? 'root folder' : './' + path.relative(root, folder)}`);
    console.log('===================================================================');

    npmBuild(folder);
  }

  for (let subfolder of subfolders(folder))
  {
    npmBuildRecursive(subfolder);
  }
}

function npmBuild(where)
{
  childProcess.execSync('npm run-script ' + cmd, { cwd: where, env: process.env, stdio: 'inherit' })
}

function subfolders(folder)
{
  return fs.readdirSync(folder)
    .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder))
}
