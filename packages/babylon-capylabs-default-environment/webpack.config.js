const { resolve } = require('path');
const { merge } = require('webpack-merge');

const baseConfig = {
    mode: 'production',
    entry: resolve(__dirname, 'src', 'index'),
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        modules: [resolve(__dirname, 'node_modules')],
        extensions: ['.ts'],
    },
    target: 'web',
};

module.exports = [
    /**
     * to UMD for npm
     */
    merge(baseConfig, {
        output: {
            library: 'babylon-capylabs-default-environment',
            libraryTarget: 'umd',
            filename: 'index.module.js',
            path: resolve(__dirname, 'dist'),
            clean: true,
        },
        externals: [
            /^@babylonjs\/.*$/,
        ],
    }),
    /**
     * to window.CapyLabsDefaultEnvironment
     */
    merge(baseConfig, {
        output: {
            library: 'CapyLabsDefaultEnvironment',
            libraryTarget: 'window',
            libraryExport: 'CapyLabsDefaultEnvironment',
            filename: 'index.js',
            path: resolve(__dirname, 'dist'),
            clean: true,
        },
        externals: [
            function ({request}, callback) {
                if (/^@babylonjs\/.*$/.test(request)) {
                    return callback(null, `window BABYLON`);
                }
                callback();
            },
        ],
    }),
]
