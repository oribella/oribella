'use strict';

const yargs = require('yargs');
const path = require('path');

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
    }
    return opt;
  })
  .argv;

module.exports = {
  glob: [`${argv.opt.basePath}${argv.opt.package}test/**/*.spec.ts`],
  src: [`${argv.opt.basePath}${argv.opt.package}src/**/!(oribella)*.ts`],
  watchGlob: [`${argv.opt.basePath}${argv.opt.package}src/**/*.ts`, `${argv.opt.basePath}${argv.opt.package}test/**/*.spec.ts`],
  nyc: {
    require: ['ts-node/register', path.resolve(__dirname, 'setup.ts')],
    babel: false,
    extension: ['.ts'],
    include: `${argv.opt.basePath}${argv.opt.package}src`,
  },
  mocha: {
    reporter: 'min',
    bail: false,
  },
  coverage: true,
};