const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'camera-2d.min.umd',
    library: 'camera-2d.umd',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
    ],
  },
  module: {
    rules: [
      // Run ESLint first
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      // Transpile ES6 to ES5
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new UnminifiedWebpackPlugin(),
  ],
};
