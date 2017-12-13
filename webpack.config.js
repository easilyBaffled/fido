var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'fetchUtil',
        libraryTarget: 'umd'
    },
    externals: {
        'bluebird': "bluebird",
        'path-to-regexp': "path-to-regexp",
        'whatwg-fetch': "whatwg-fetch",
        'node-fetch': "node-fetch",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        //plugins: ["transform-es2015-modules-commonjs"]
                    }
                }
            }
        ]
    }
};
