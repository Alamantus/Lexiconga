const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

 module.exports = {
    entry: APP_DIR + '/index.jsx',
    output: {
      path: BUILD_DIR,
      filename: 'dictionaryBuilder.js'
    },
    module: {
      loaders: [
        {
          test: /\.html?$/,
          exclude: /node_modules/,
          loaders: [
                    'file?name=[name].html',
                    'html-minify'
                  ]
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          loaders: ['style', 'css', 'sass']
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    // plugins: [
    // When you're ready to publish, check this article out.
    // http://dev.topheman.com/make-your-react-production-minified-version-with-webpack/
    //   new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false
    //     },
    //     output: {
    //       comments: false
    //     }
    //   })
    // ],
    sassLoader: {
      file: './src/sass/styles.scss',
      // includePaths: ['./node_modules/bootstrap-sass/assets/'],
      outFile: './public/styles.css',
      outputStyle: 'compressed'
    }
 };
