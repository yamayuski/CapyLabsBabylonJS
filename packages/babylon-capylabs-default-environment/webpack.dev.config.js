const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        index: resolve(__dirname, 'src', 'test', 'index'),
        build: resolve(__dirname, 'src', 'index'),
    },
    output: {
        library: 'BabylonCapyLabs',
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: [
            '.js',
            '.ts',
            '.html',
        ],
    },
    plugins: [
        new HtmlWebpackPlugin(),
    ],
    devServer: {
        static: './dist',
    },
    optimization: {
        runtimeChunk: 'single',
    },
};
