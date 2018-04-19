#! /usr/bin/env node

'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const globby = require('globby');
const rimraf = util.promisify(require('rimraf'));
const modules = ['amd', 'commonjs', 'system', 'esnext'];

const packages = (glob) => globby(glob, { onlyDirectories: true });
const clean = async () => rimraf(`packages/*/dist`);
const compileModule = async (cwd, mod) => {
  const cmd = path.relative(cwd, 'node_modules/.bin/tsc');
  return exec(`${cmd} -p tsconfig.build.json --module ${mod} --outDir dist/${mod}`, { cwd });
}
const compileModules = async (cwd) => Promise.all(modules.map(mod => compileModule(cwd, mod)));
const compileFramework = async () => compileModules('packages/framework');
const compileOribella = async () => compileModules('packages/oribella');
const compileAureliaPlugins = async () => packages(['packages/aurelia-*']).then(pkgs => Promise.all(pkgs.map(cwd => compileModules(cwd))));
// const compile = async () => packages().then(pkgs => Promise.all(pkgs.map(cwd => compileModules(cwd))));
const bundleOribella = async () => {
  const cwd = 'packages/oribella';
  const cmd = path.relative(cwd, 'node_modules/.bin/rollup');
  const cfg = path.resolve(__dirname, 'rollup.config.js');
  return exec(`${cmd} -c ${cfg}`, { cwd });
}

(async () => {
  try {
    await clean()
    await compileFramework();
    await compileOribella();
    await bundleOribella();
    await compileAureliaPlugins();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
    return;
  }
  process.exitCode = 0;
})();

//external: ['oribella', 'oribella-framework', 'aurelia-dependency-injection', 'aurelia-pal', 'aurelia-templating', 'aurelia-templating-resources', 'tslib'],