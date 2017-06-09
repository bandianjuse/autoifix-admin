var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 80,
    hot:false,
    proxy: {
      "/": {
        target: "http://127.0.0.1:8360",
        bypass: function (req, res, proxyOptions) {
          if (req.url.indexOf(".png") !== -1 || req.url.indexOf(".jpg") !== -1 || req.url.indexOf(".gif") !== -1 || req.url.indexOf(".js") !== -1 || req.url.indexOf(".css") !== -1 || req.url.indexOf(".ico") !== -1 || req.url.indexOf(".html") !== -1 || req.url.indexOf("__webpack_hmr") !== -1 ) {
            return req.url;
          }
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
