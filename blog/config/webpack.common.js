const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//webpack 查看打包模块依赖关系以及size 插件
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')


module.exports = {
  //指定入口
  entry: {
    main: './app/main.js'
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      title: "html plugn page",
      template: './index.html'
    }),
    // new CleanWebpackPlugin()
  ],
  output: {
    //输出文件名称
    filename: '[name].build.js',
    //输出文件路径
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader"
      },
      {
        test: /\.styl$/i,
        use: [
          "style-loader", "css-loader", "stylus-loader"
        ],
      },
    ]
  }
};