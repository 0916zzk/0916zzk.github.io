const common = require('./webpack.common');
const { merge } = require('webpack-merge');

// 压缩打包生成文件
// const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');


module.exports = merge(common, {
  mode: "production", //development|production
  output: {
    filename: '[name].[hash:7].js'
  },
  plugins: [
    // new webpack.optimize.SplitChunksPlugin(),
    // new UglifyjsWebpackPlugin()
  ],
  //排除 例外规则 指定某些模块不打包
  externals: {
    // jquery: 'jQuery',
    // axios: 'axios',
    wangeditor: 'wangEditor'
  },
  // 提取多入口模块中的第三方库 单独整合打包
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        }
      }
    }
  }

})