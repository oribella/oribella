#! /usr/bin/env node

'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const globby = require('globby');
const rimraf = util.promisify(require('rimraf'));
const modules = ['amd', 'commonjs', 'system', 'esnext'];

// const packages = () => globby(['packages/*', '!packages/framework'], { onlyDirectories: true });
const clean = async () => rimraf(`packages/*/dist`);
const compileModule = async (cwd, mod) => {
  const cmd = path.relative(cwd, 'node_modules/.bin/tsc');
  return exec(`${cmd} -p tsconfig.build.json --module ${mod} --outDir dist/${mod}`, { cwd });
}
const compileModules = async (cwd) => Promise.all(modules.map(mod => compileModule(cwd, mod)));
const compileFramework = async () => compileModules('packages/framework');
const compileOribella = async () => compileModules('packages/oribella');
const compileAureliaSortable = async () => compileModules('packages/aurelia-sortable');
// const compile = async () => packages().then(pkgs => Promise.all(pkgs.map(cwd => compileModules(cwd))));

(async () => {
  try {
    await clean()
    await compileFramework();
    await compileOribella();
    await compileAureliaSortable();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
    return;
  }
  process.exitCode = 0;
})();