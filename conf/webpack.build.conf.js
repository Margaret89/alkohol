const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const ImageSpritePlugin = require('image-sprite-webpack-plugin');

const buildWebpackConfig = merge(baseWebpackConfig, {
  // BUILD config
  mode: 'production',
  plugins: [
    new ImageSpritePlugin({
      commentOrigin: false,
      compress: true,
      extensions: ['png'],
      indent: '',
      log: true,
      //outputPath: './public',
      outputFilename: 'assets/sprites/sprite-[hash].png',
      padding: 20
      // suffix: '?' + Date.now() // do not need to use it with a outputFilename's [hash].
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})
