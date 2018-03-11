# Webpack+React工程架构项目

## 前端技术选型

#### 单页应用

所有的页面内容通过前端生成，用到的所有数据通过javascript主动向后端去请求拿到数据在前端页面渲染展示。
JS承担更多的业务逻辑，后端只提供API
页面路由跳转不需要经过后端，由前端处理

* 常用类库
    * react.js 是一个单项数据绑定的类库,数据自上而下传递
    * vue.js 是一个双向数据绑定的类库
    * angular.js 整体是用typeScript开发
    * backbone.js 实现了一套非常精简的MVC内容，和他的名字一样就是一个骨架，需要我们自己来实现功能，不像react.js、vue.js给我们封装了很多功能。

#### 多页应用

传统的网站每个页面都需要浏览器的跳转，内容由服务端用模板生成。每次页面跳转都要经过服务端，JS更多只是做做动画

* 传统多页应用常用类库
    - Jquery
    - mootools 修改js原生prototype上面的一些东西
    - yui 更侧重UI层面，在jquery之前，目前使用很少

#### 打包工具

* grunt
* gulp
* webpack
* rollup.js 打包效率比webpack高，实现了按需加载，引用到哪几个函数它把这部分代码给包含进去
* browserify 不太适合做单页应用

#### 模块化工具

目前这两种规范都已过时，遵循CommonJS规范

* seajs 遵循 CMD 规范
* requirejs 遵循AMD规范

#### 包管理器

* npm
* bower
* jspm 面向未来的，把前端和NodeJs的类库进行区分

