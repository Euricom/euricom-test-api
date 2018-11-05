const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');

const entries = {};

Object.keys(slsw.lib.entries).forEach((key) => (entries[key] = ['./source-map-install.js', slsw.lib.entries[key]]));

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: entries,
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'typeof window': '"object"',
    }),
  ],
  target: 'node',
  module: {
    rules: [],
  },
};
