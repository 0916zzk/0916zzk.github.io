const { merge } = require('webpack-merge');
const path = require('path')
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: "development",
  devtool: 'eval',
  devServer: {
    contentBase: 'assets',
    inline: true,
    host: 'localhost',
    port: 3000,
    open: true,
    publicPath: "/"
  },
  resolve: {
    alias: {
      Templates: path.resolve(__dirname, '../src/views'),
    },
  },
});