const path = require('path');

module.exports = {
    target: 'node',
    entry: ['./src/index.ts'],
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
        extensions: ['.tsx', '.ts', '.js', 'json'],
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
