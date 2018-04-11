'use strict';

const yargs = require('yargs');
const path = require('path');

const setup = path.resolve(__dirname, 'setup.ts');
const defaultRequire = ['ts-node/register', setup];

const argv = yargs
  .options({
    'opt.basePath': {
      description: 'Base path',
      type: 'string',
      default: 'packages/*/',
    },
    'opt.package': {
      description: 'Package name',
      type: 'string',
      default: '*',
      alias: 'p',
    },
    require: {
      description: 'Require',
      type: 'array',
      default: [],
      alias: 'r',
    },
  })
  .coerce('opt', (opt) => {
    if (opt.package !== '*') {
      if (process.cwd() === __dirname) {
        opt.basePath = 'packages/'
        opt.package += '/';
      } else {
        opt.basePath = ''
        opt.package = '';
      }
    } else {
      defaultRequire.push('./packages/aurelia-sortable/test/setup.ts');
    }
    return opt;
  })
  .argv;

module.exports = {
  glob: [`${argv.opt.basePath}${argv.opt.package}test/**/*.spec.ts`],
  src: [`${argv.opt.basePath}${argv.opt.package}src/**/*(!oribella).ts`],
  watchGlob: [`${argv.opt.basePath}${argv.opt.package}src/**/*.ts`, `${argv.opt.basePath}${argv.opt.package}test/**/*.spec.ts`],
  nyc: {
    require: [...defaultRequire, ...argv.require],
    babel: false,
    extension: ['.ts'],
    include: `${argv.opt.basePath}${argv.opt.package}src`,
  },
  coverage: true,
};