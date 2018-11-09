const merge = require('webpack-merge');
const common = require('./webpack.common');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        hot: true,
        contentBase: './../dist',
        host: '0.0.0.0',
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                      {
                        loader: 'css-loader',
                        options: { url: false }
                      },
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
});
