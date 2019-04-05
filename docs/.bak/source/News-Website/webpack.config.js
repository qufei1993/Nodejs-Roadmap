var webpack = require("webpack");
var path = require("path");

module.exports = {
    context:__dirname + '/src',
    entry: "./js/index.js",
    devtool: 'source-map',　　// 调试时定位到编译前的代码位置，推荐安装react插件
    output: {
        path: __dirname + "/public/bundle/",
        publicPath: "/bundle/",
        filename: "bundle.js",
        chunkFilename: '[name].js'
    },
    devServer: {
        contentBase: __dirname + "\\public\\",
        historyApiFallback: true,
        inline: true,
        host: '127.0.0.1',
        port: 8080,
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                  presets: ['react', 'es2015'],
                  plugins: ['react-html-attrs'], //添加组件的插件配置
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader?modules'
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    resolve: {
        // 现在你import文件的时候可以直接使用import Func from './file'，不用再使用import Func from './file.js'
        extensions: ['.js', '.jsx', '.json', '.coffee']
    }
};