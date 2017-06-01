var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: ['./index.js'],
    
    output: {
        publicPath: '/dist/',
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    
    devServer: {
        contentBase: [path.join(__dirname), path.join(__dirname, 'dist')]
    },
    
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['react', 'es2015'] }
                }
            },
            {
                test: /\/css$/,
                include: /(node_modules\/bootstrap)/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                exlude: /(node_modules)/,
                use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"]
            }, 
            {
                test: /\.(png[jpg]svg)$/,
                exclude: /(node_modules)/,
                use: [{ loader: 'url-loader', options: { limit: 10000 } }]
            }
        ]
    },
    
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            options: { postcss: [autoprefixer()] }
        })
    ]
};

