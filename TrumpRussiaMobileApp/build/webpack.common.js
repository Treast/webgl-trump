const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: {
        app: './src/js/app.js'
    },
    output: {
        path: path.join(__dirname, './../dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'assets/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlPlugin({
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, './../src', 'images'),
                to: 'assets/',
            },
        ]),
        new Dotenv(),
    ]
};
