const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: [
        './src/index.ejs',
        './assets/js/index.js',
        './assets/scss/style.scss',
    ],
    mode: 'development',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.ProvidePlugin({
            join: ['lodash', 'join']
        }),
        new MiniCssExtractPlugin({
            filename: "css/style.css"
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader"
            ]
        }, {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.ejs$/,
            use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'index.html',
                        context: './src/',
                        outputPath: ''
                    }
                },
                {
                    loader: 'extract-loader'
                },
                {
                    loader: "ejs-webpack-loader",
                    options: {
                        data: {
                            title: "New Title",
                            someVar: "hello world"
                        },
                        htmlmin: true
                    }
                }
            ]
        }]
    }
};