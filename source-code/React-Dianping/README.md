## React仿大众点评WebApp开发
> 本次使用React与webpack构建工具来做这个项目的开发，数据存储方面用到了react+redux结合来实现，在开发中运用了木偶组件、智能组件的开发理念。
#### 技术栈
> React + react-router + redux + ES6 + less + webpack + fetch
#### 下载
> git clone https://github.com/Q-Angelo/React-Dianping.git  
cd React-Dianping  
npm install

#### 运行
> npm run dev (开发环境)  
  npm run mock (开启后端数据接口)
  访问 http://127.0.0.1:8080  
  npm run build (生产环境)
  
#### 项目文件结构
<pre>
├── app                   业务代码目录
  ├── actions             定义Redux的各个action  
  ├── components          木偶组件  
  ├── constants           定义Redux中用到的各个常量  
  ├── containers          智能组件  
  ├── config              项目配置  
  ├── static              静态资源
  ├── fetch               项目中获取、提交数据的方法
  ├── router              设置路由  
  ├── reducers            定义 Redux 的全局 store 对象
  ├── store               创建store  
  ├── util                工具函数
  ├── index.js            入口文件
  ├── index.tpl.html      模板文件
├── build                 webpack打包编译后的文件
  ├── css
  ├── js
  ├── bundle.js
  ├── index.html
├── mock                  后端数据模拟
  ├── detail              详情页
  ├── home                首页
  ├── orderlist           订单列表页
  ├── search              搜索结果页
  ├── server.js           后端启动文件
├── package.js
├── .babelrc              设置转码的规则和插件
├── webpack.config.js     开发环境配置
├── webpack.server.js     生产环境配置
</pre>
#### 效果预览
![首页](./Img/home.png)
![城市页](./Img/city.png)
![登录页](./Img/login.png)
![详情页](./Img/detail.png)
