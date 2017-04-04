const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
  entry: APP_DIR + '/index.jsx'
, output: {
    path: BUILD_DIR
  , filename: 'lexiconga.js'
  }
, module: {
    rules: [
      {
        test: /\.scss$/
      , exclude: /node_modules/
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
        test: /\.jsx?$/
      , exclude: /node_modules/
      , use: [
          {
            loader: 'babel-loader'
          , options: {
              presets: ['es2016']
            , plugins: ['inferno']
            }
          }
        ]
      }
    ]
  }
, resolve: {
  extensions: ['.js', '.jsx']
}
/*, plugins: [
  // When you're ready to publish, check this article out.
  // http://dev.topheman.com/make-your-react-production-minified-version-with-webpack/
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    })
  ]*/
};
