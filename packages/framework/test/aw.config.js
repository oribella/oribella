'use strict';

module.exports = {
  glob: ['test/**/*.ts'],
  src: ['src/**/*.ts'],
  watchGlob: ['src/**/*.ts', 'test/**/*.ts'],
  nyc: {
    require: ['ts-node/register', './test/setup.ts'],
    babel: false,
    extension: ['.ts'],
    include: 'src',
  },
  coverage: true,
};