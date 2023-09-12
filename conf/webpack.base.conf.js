const path = require('path')
const fs = require('fs')
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const globImporter = require('node-sass-glob-importer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');


const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/',
  fonts: 'assets/fonts',
  img: 'assets/img',
  sprites:'assets/sprites/',
  svgicon:'../src/assets/svg-icon/',
  svgcoloricon:'../src/assets/svg-color-icon/',
}

const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src,
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
  },
  optimization: {
    // minimize: false,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.pug$/,
      loader: 'pug-loader',
      options:{
        pretty: '\t'
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loader: {
          scss: 'vue-style-loader!css-loader!sass-loader'
        }
      }
    }, {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: PATHS.fonts,
        publicPath: '../fonts/'
      }
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: PATHS.img,
        publicPath: '../img/'
      }
    },
    {
      test: /\.svg$/,
      include: [
        path.resolve(__dirname, PATHS.svgicon),
      ],
      use:[{
        loader: 'svg-sprite-loader',
        options: {
          esModule: false,
          extract: true,
          spriteFilename: 'sprite.svg',
          // outputPath: PATHS.sprites,
          publicPath: PATHS.sprites,
        }
      },{
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeNonInheritableGroupAttrs: true },
            { collapseGroups: true },
            { removeAttrs: { attrs: '(fill|stroke)' } },
          ]
        }
      }]
    },
    {
      test: /\.svg$/,
      include: [
        path.resolve(__dirname, PATHS.svgcoloricon),
      ],
      use:[{
        loader: 'svg-sprite-loader',
        options: {
          esModule: false,
          extract: true,
          spriteFilename: 'spritecolor.svg',
          // outputPath: PATHS.sprites,
          publicPath: PATHS.sprites,
        }
      },{
        loader: 'svgo-loader',
        options: {
          plugins: [
            { removeNonInheritableGroupAttrs: true },
            { collapseGroups: true },
          ]
        }
      }]
    },
    
    {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./conf/postcss.config.js` } }
        }, {
          loader: 'sass-loader',
          options: { 
            sourceMap: true,
            // importer: globImporter()
          }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./conf/postcss.config.js` } }
        }
      ]
    }]
  },
  resolve: {
    alias: {
      '~': PATHS.src,
      'vue$': 'vue/dist/vue.js',
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new SpriteLoaderPlugin({
      plainSprite: true
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
      // { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
      // { from: `${PATHS.src}/static`, to: '' },
    ]),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.pug/,'.html')}`
    }))
  ],
}
