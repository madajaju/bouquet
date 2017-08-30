const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const cmd = process.argv[3]; // node, build, cmd
const root = process.cwd() + "/deploy/uservices";
npm_build_recursive(root);

// it will be `npm run-script build` inside root in the end.
console.log('===================================================================');
console.log(`Performing "npm ${cmd}" inside root folder: ` + root );
console.log('===================================================================');

function npm_build_recursive(folder)
{
  console.log("NPM Build Recursive: " + folder);

  for (let subfolder of subfolders(folder))
  {
    npm_build_recursive(subfolder)
  }

  const has_package_json = fs.existsSync(path.join(folder, 'package.json'))

  console.log("has package: " + has_package_json);
  if (!has_package_json && path.basename(folder) !== 'code')
  {
    return
  }

  if (folder !== root && has_package_json)
  {
    console.log('===================================================================')
    console.log(`Performing "npm ${cmd}" inside ${folder === root ? 'root folder' : './' + path.relative(root, folder)}`)
    console.log('===================================================================')

    npm_build(folder)
  }

  for (let subfolder of subfolders(folder))
  {
    npm_build_recursive(subfolder)
  }
}

function npm_build(where)
{
  child_process.execSync("npm run-script ${cmd}", { cwd: where, env: process.env, stdio: 'inherit' })
}

function subfolders(folder)
{
  return fs.readdirSync(folder)
    .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder))
}
