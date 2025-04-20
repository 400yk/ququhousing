// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js', // Where Webpack starts bundling
    output: {
        filename: 'bundle.js', // The name of the output bundle
        path: path.resolve(__dirname, 'dist'), // The output directory
    },
    resolve: {
        preferRelative: true,
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                        ]
                    }
                },
                exclude: /node_module/,
            },
            {
                test: /\.(jpg|png|gif|jpeg)$/, // 针对这三种格式的文件使用file-loader处理
                use: {
                    loader: 'file-loader',
                    options: {
                        // 定义打包后文件的名称；
                        // [name]:原文件名，[hash]:hash字符串（如果不定义名称，默认就以hash命名，[ext]:原文件的后缀名）
                        name: '[name]_[hash].[ext]',
                        outputPath: 'images/' //  定义图片输出的文件夹名（在output.path目录下）
                    }
                }
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                ],
            }
        ]
    }
};
