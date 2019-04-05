## webpack初始化react  
#### 1.npm init	初始化package.json

#### 2.依赖(插件)
##### 安装webpack插件  
	npm install webpack webpack-dev-server --save-dev

##### 安装react插件  
	npm install react react-dom --save

##### 安装module模块下的依赖  
	//js代码、css代码、图片、less、字体图标
	npm i postcss-loader --save-dev
	npm i style-loader css-loader --save-dev
	npm i less less-loader postcss-loader url-loader --save-dev


##### html模板插件  
	npm i html-webpack-plugin --save-dev
	在plugins中使用html-webpack-plugin插件将会插入index.html文件
		filename：在output.path指定的目录下创建index.html文件
		template: 插入的模板
		inject: 指定插入的位置 可以指定插入在 head里面 或者 body里面

##### 热加载插件   
	npm i open-browser-webpack-plugin --save-dev

#####
	npm install --save-dev babel-plugin-react-html-attrs
	webpack配置如下
	query: {
      plugins: ['react-html-attrs'] //添加组件的插件配置
    }

##### .babelrc文件下所需依赖   
	npm i babel-core babel-loader babel-preset-es2015 babel-preset-react babel-plugin-react-transform --save-dev

##### 注意:save 和 --save-dev的区别
	npm install时使用--save和--save-dev，可分别将依赖（插件）记录到package.json中的dependencies和devDependencies下面。
	dependencies下记录的是项目在运行时必须依赖的插件，常见的react jquery等，即使项目打包好了、上线了，这些也是需要用的，否则程序无法正常执行。
	devDependencies下记录的是项目在开发过程中使用的插件，但是一旦项目打包发布、上线了之后，webpack就都没有用了，可卸磨杀驴。

##### include与exclude的区别
	include表示必须要包含的文件或者目录，而exclude的表示需要排除的目录

##### devServer
	contentBase	默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）
	port	设置默认监听端口，如果省略，默认为”8080“
	inline	设置为true，当源文件改变时会自动刷新页面
	colors	设置为true，使终端输出的文件为彩色的
	historyApiFallback	在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
	devServer: {
	    contentBase: "./public",
	    historyApiFallback: true,
	    inline: true,
	    host: '127.0.0.1',
	    port: 8080,
	}

##### webpack与webpack-dev-server的区别：
	webpack-dev-server只是个本地的文件服务器，它只做文件服务，生成的文件会在内存里，不做打包服务，当您更改资源中的某些内容时，将会重新加载文件。
	如果第一次对文件打包可以使用webpack


### webpack踩坑之路
	错误1：
	configuration has an unknown property 'postcss'. These properties are valid:
	对策1：
	Webpack 2.1.0-beta23 之后的config里不能直接包含自定义配置项
	解决：将postcss和devServer替换成以下写法即可（https://github.com/webpack/webpack/pull/2974#issuecomment-245857168）
	plugins: {
	  new webpack.LoaderOptionsPlugin({
	    options: {
	      postcss: function () {
	        return [precss, autoprefixer];
	      },
	      devServer: {
	        contentBase: "./public", //本地服务器所加载的页面所在的目录
	        colors: true, //终端中输出结果为彩色
	        historyApiFallback: true, //不跳转
	        inline: true //实时刷新
	      }
	    }
	  })
	}  
	错误2：
	postcss-loader 有版本问题,高版本的会对低版本的配置报错
	ERROR in ./~/css-loader!./~/postcss-loader/lib!./app/static/css/main.css
	Module build failed: Error: No PostCSS Config found in:
	对策2：
	采用以下方法配置
	{
        test: /\.css$/,
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
    问题3
    配置package.json文件，注意windows和linux 之间的不同按照下面的即可
    对策3：
    配置生产环境
		linux下配置：
			"start": "NODE_ENV=dev webpack-dev-server --progress --colors"
		windows下配置：
			"start": "set NODE_ENV=dev && webpack-dev-server --progress --colors"
	配置开发环境
		linux下配置：
		"build": "rm -rf ./build && NODE_ENV=production webpack --config ./webpack.production.config.js --progress --colors"		
		windows下配置：
		"build": "rd/s/q build && set NODE_ENV=production && webpack --config ./webpack.server.js --progress --colors"
		如果还有问题 在项目目录下建一个build文件夹  

	问题4
		OccurenceOrderPlugin构造器错误
	对策4
		此问题一般出现在webpack2中，解决办法很简单，将OccurenceOrderPlugin改为OccurrenceOrderPlugin即可  

	问题5：
		ant-design与css Modules的冲突
		配置了css-modules的相关功能会把antd的样式也hash化了，导致样式不匹配
	对策5：
		定义两个css loaders像下面这样
		// CSS modules
		{
	        test: /\.css$/,
	        exclude: /node_modules/,
	        loader: 'style-loader!css-loader?modules'
	    },
	    //ant-design
	    {
	        test: /\.css$/,
	        include: /node_modules/,
	        loader: 'style-loader!css-loader'
	    }  
