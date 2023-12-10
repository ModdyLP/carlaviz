// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable no-process-env */
const {resolve, join} = require('path');
const webpack = require('webpack');

const BABEL_CONFIG = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/proposal-class-properties']
};

const CONFIG = {
    mode: 'development',
    entry: {
        app: resolve('./src/app.js')
    },
    devtool: 'source-map',
    output: {
        path: resolve('./dist'),
        filename: 'bundle.js'
    },
    devServer: {
        host: process.env.CARLAVIZ_FRONTEND_HOST || '0.0.0.0',
        compress: true,
        port: process.env.CARLAVIZ_FRONTEND_PORT || 8080,
        open: false,
    },
    module: {
        noParse: /(mapbox-gl)\.js$/,
        rules: [
            {
                // Compile ES2015 using bable
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: BABEL_CONFIG
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                // Unfortunately, webpack doesn't import library sourcemaps on its own...
                test: /\.js$/,
                use: ['source-map-loader'],
                enforce: 'pre'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = (env) => {
    let config = Object.assign({}, CONFIG);

    // This switch between streaming and static file loading

    config.plugins = config.plugins.concat([new webpack.DefinePlugin({
        'env': {
            'CARLAVIZ_BACKEND_PORT': JSON.stringify(process.env.CARLAVIZ_BACKEND_PORT),
            'CARLAVIZ_BACKEND_HOST': JSON.stringify(process.env.CARLAVIZ_BACKEND_HOST)
        }
    })])
    
    
    console.log("OUT", process.env, config)
    return config;
};
