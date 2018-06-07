var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'app/index.js'),

    output: {
        path:__dirname + '/build',
        filename: "bundle.js"
    },

    resolve:{
        extensions:['.js','.jsx']
    },

    module: {
        loaders: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loaders: [
                  "style-loader",
                  "css-loader?importLoaders=1",
                  {
                    loader: "postcss-loader",
                    options: {
                      plugins: (loader)=>[
                        require('autoprefixer')({
                            broswers:['last 5 versions']
                        })
                      ]
                    },
                  }
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                loaders: [
                  "style-loader",
                  "css-loader?importLoaders=2",
                  {
                    loader: "postcss-loader",
                    options: {
                      plugins: (loader)=>[
                        require('autoprefixer')({
                            broswers:['last 5 versions']
                        })
                      ]
                    },
                  },
                  "less-loader"
                ]
            },
            { test:/\.(png|gif|jpg|jpeg|bmp)$/i, loader:'url-loader?limit=5000' },  // 限制大小5kb
            { test:/\.(png|woff|woff2|svg|ttf|eot)($|\?)/i, loader:'url-loader?limit=5000'} // 限制大小小于5k
        ]
    },

    plugins: [
        // html 模板插件
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.tpl.html'
        }),

        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),

        // 打开浏览器
        /*new OpenBrowserPlugin({
          url: 'http://localhost:8080'
        }),*/

        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
          //__DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
            __DEV__:true
        })
    ],
    devServer: {
        proxy: {
            // 凡是 `/api` 开头的 http 请求，都会被代理到 localhost:3000 上，由 koa 提供 mock 数据。
            // koa 代码在 ./mock 目录中，启动命令为 npm run mock
            '/api': { target: 'http://127.0.0.1:3000/', secure: false }
        },
        historyApiFallback: true, //不跳转，在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true, //实时刷新
        contentBase:'/',
        hot: true  //使用热加载插件 HotModuleReplacementPlugin
    }
}
