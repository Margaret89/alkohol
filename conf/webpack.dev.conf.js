const webpack =  require('webpack')
const merge = require('webpack-merge')
const ImageSpritePlugin = require('image-sprite-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new ImageSpritePlugin({
      commentOrigin: true,
      compress: false,
      extensions: ['png'],
      indent: '  ',
      log: true,
      //outputPath: './public',
      outputFilename: 'assets/sprites/sprite.png',
      padding: 20,
      suffix: ''
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})
