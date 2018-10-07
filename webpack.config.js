const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        main: './src/html-fixture.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'html-fixture.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                //exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({filename: 'bundle.css'})
    ]
};