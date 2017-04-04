// Set BUILDMODE to 'production' to reduce overhead.
const BUILDMODE = 'development';

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
