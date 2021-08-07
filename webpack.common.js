const path = require('path');

module.exports = {
    target: 'node',
    entry: ['./index.ts'],
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/(node_modules)/, /__test__/],
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
