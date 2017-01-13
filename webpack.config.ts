import path = require('path');

module.exports = {
  entry: './src/oribella.ts',
  output: {
    library: 'oribella',
    libraryTarget: 'amd',
    filename: './dist/oribella.js'
  },
  resolve: {
    alias: {
      'oribella-framework': path.resolve(__dirname, 'node_modules/oribella-framework/src/oribella-framework.ts')
    },
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, use: [{ loader: 'awesome-typescript-loader' }] },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  devtool: 'source-map'
};
