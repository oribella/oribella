#! /usr/bin/env node

'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const globby = require('globby');
const rimraf = util.promisify(require('rimraf'));
const modules = ['amd', 'commonjs', 'system', 'esnext'];

const packages = () => globby('packages/*', { onlyDirectories: true });
const clean = async () => packages().then(pkgs => Promise.all(pkgs.map(p => rimraf(`${p}/dist`))));
const compile = async () => packages().then(pkgs => Promise.all(pkgs.map(cwd => {
  const cmd = path.relative(cwd, 'node_modules/.bin/tsc');
  return Promise.all(modules.map(mod => exec(`${cmd} -p tsconfig.build.json --module ${mod} --outDir dist/${mod}`, { cwd })));
})));

(async () => {
  try {
    //  await clean()
    await compile();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
    return;
  }
  process.exitCode = 0;
})();