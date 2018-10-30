const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/js/app.ts',
  },
  output: {
    path: path.join(__dirname, './../dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: 'tslint.json',
              tsConfigFile: 'tsconfig.json',
              typeCheck: true,
            },
          },
        ],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
        ],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new Dotenv(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, './../src', 'images'),
        to: 'assets/',
      },
    ]),
  ],
  node: {
    fs: 'empty',
  },
};
