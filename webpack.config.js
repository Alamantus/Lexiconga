// Set BUILDMODE to:
//  'production' to reduce overhead.
//  'donotsave' to clear the dictionary details and database on each load.
//  'emptydetails' to clear the dictionary details on each load.
//  'emptydb' to clear the database on each load.
//  'development' to not do anything special.
const BUILDMODE = 'donotsave';

const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const webpackConfig = {
  entry: APP_DIR + '/index.jsx'
, output: {
    path: BUILD_DIR
  , filename: 'lexiconga.js'
  }
, module: {
    rules: [
      {
        test: (/\.scss$/)
      , exclude: (/node_modules/)
      , use: [
          'style-loader'
        , 'css-loader'
        , {
            loader: 'sass-loader'
          , options: {
              file: './src/sass/styles.scss',
              outFile: './public/styles.css',
              outputStyle: 'compressed'
            }
          }
        ]
      }
    , {
        test: (/\.jsx?$/)
      , exclude: (/node_modules/)
      , use: [
          {
            loader: 'babel-loader'
          , options: {
              presets: [
                'es2016'
              ]
            , plugins: [
                'inferno'
              ]
            }
          }
        ]
      }
    , {
        test: (/\.woff$/)
      , exclude: (/node_modules/)
      , use: [
          {
            loader: 'url-loader'
          , options: {
              limit: 65000
            , mimetype: 'application/font-woff'
            , name: './assets/fonts/[name].[ext]'
            }
          }
        ]
      }
    , {
        test: (/\.woff2$/)
      , exclude: (/node_modules/)
      , use: [
          {
            loader: 'url-loader'
          , options: {
              limit: 65000
            , mimetype: 'application/font-woff2'
            , name: './assets/fonts/[name].[ext]'
            }
          }
        ]
      }
    , {
        test: (/\.[ot]tf$/)
      , exclude: (/node_modules/)
      , use: [
          {
            loader: 'url-loader'
          , options: {
              limit: 65000
            , mimetype: 'application/octet-stream'
            , name: './assets/fonts/[name].[ext]'
            }
          }
        ]
      }
    , {
        test: (/\.eot$/)
      , exclude: (/node_modules/)
      , use: [
          {
            loader: 'url-loader'
          , options: {
              limit: 65000
            , mimetype: 'application/vnd.ms-fontobject'
            , name: './assets/fonts/[name].[ext]'
            }
          }
        ]
      }
    ]
  }
, resolve: {
    extensions: [
      '.js'
    , '.jsx'
    ]
  }
, plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(BUILDMODE)
      }
    })
  ]
};

if (BUILDMODE === 'production') {
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: true
    , compress: {
        warnings: false
      }
    })
  );

  webpackConfig.devtool = 'hidden-source-map';
}

module.exports = webpackConfig;
