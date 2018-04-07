'use strict';

module.exports = {
  glob: ['packages/*/test/**/*.ts'],
  src: ['packages/*/src/*/**/*.ts'],
  watchGlob: ['packages/*/src/**/*.ts', 'packages/*/test/*/**/*.ts'],
  nyc: {
    require: ['ts-node/register', './setup.ts'],
    babel: false,
    extension: ['.ts'],
    include: 'packages/*/src',
  },
  mocha: {
    bail: false,
  },
  coverage: true,
};