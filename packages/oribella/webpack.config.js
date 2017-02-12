const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

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
      { test: /\.ts$/, use: [{ loader: 'awesome-typescript-loader', query: { configFileName: './tsconfig.build.json', declaration: false } }] },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  plugins: [
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.map$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  devtool: 'source-map'
};
