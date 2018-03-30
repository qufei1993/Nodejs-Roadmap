# QuFei Blog

14年开始创建个人博客，之前由于服务器等因素，一次又一次迁移，最终选择了github来记录一些平常在工作或者学习中遇到的一些问题

* 14年第一版，采用织梦CMS内容管理系统，搭建个人站点，内容迁移到了第二版
* 16年第二版，采用PHP+MySql+Laravel框架前端blade做为模版引擎，发布于腾讯云服务器，可惜部分内容没有做好备份，当时设计的前端页面[个人博客](https://q-angelo.github.io/qublog/)
* 17年初第三版，采用github仓库进行管理

## NodeJS

* [JavaScript基础问题](/nodejs/base.md)
  - [变量与作用域](/nodejs/base.md#变量与作用域)
  - [类型检测](/nodejs/base.md#类型检测)
  - [定时器](/nodejs/base.md#定时器)
  - [数组](/nodejs/base.md#数组)
     - `[数组去重]` Set数组去重
     - `[数组去重]` reduce数组对象去重
     - `[数组去重]` lodash uniqBy去重
     - `[数组降维]` 数组降维三种方法
  - [函数](/nodejs/base.md#函数)
      - `[函数]` push()数组添加新值后的返回值
      - `[函数]` arguments.callee递归调用实现一个阶乘函数
      - `[函数]` call和apply的使用与区别?
      - `[函数]` javascript没有引用传递都是按值传递的
  - [匿名函数与闭包](/nodejs/base.md#匿名函数与闭包)
      - `[匿名函数与闭包]` 匿名函数的自我执行
      - `[匿名函数与闭包]` 函数里放一个匿名函数将会产生闭包
      - `[匿名函数与闭包]` 闭包中使用this对象将会导致的一些问题
  - [正则](/nodejs/base.md#正则)
    - `[正则]` 模式修饰符的可选参数
    - `[正则]` 两个测试方法test、exec
    - `[正则]` 4个正则表达式方法
    - `[正则]` 匹配模式
    - `[正则]` 常用正则表达式

* [对象引用与理解module.exports与exports的关系](/nodejs/object_reference.md)
  - `引用类型比较`[`[more]`](/nodejs/object_reference.md#引用类型比较)
  - `数组对象深度拷贝`[`[more]`](/nodejs/object_reference.md#数组对象深度拷贝)
  - `exports与module.exports的区别?`[`[more]`](/nodejs/object_reference.md#exports与module.exports的区别)

* [JavaScript运行机制](/nodejs/operational_mechanism.md)
  - `js工作机制，微任务与宏任务术语`[`[more]`](/nodejs/operational_mechanism.md#js工作机制)
  - `javascript是单线程，只有同步代码执行完毕后，才会去执行异步代码，详情看示例`[`[more]`](/nodejs/operational_mechanism.md#例2)
  - `process.nextTick与setTimeout递归调用区别?`[`[more]`](/nodejs/operational_mechanism.md#process.nextTick与setTimeout递归调用区别)
  - `setImmediate与setTimeout分别在浏览器与Nodejs环境下的区别?`[`[more]`](/nodejs/operational_mechanism.md#setImmediate与setTimeout)

* [常用插件](/nodejs/plugins.md)

* [经纬度计算](/nodejs/distance.md)

* [跨域](/nodejs/cors.md)

* [性能优化](/nodejs/performance_optimization.md)
  - `map比forEach功能强大, 但是map会创建一个新的数组, 将会占用内存.`[`[more]`](/nodejs/performance_optimization.md#map与forEach)
  - `高并发应对之道.`[`[more]`](/nodejs/performance_optimization.md#高并发应对之道)
  - `require特性与优化`[`[more]`](/nodejs/performance_optimization.md#require特性与优化)

* [爬虫](/nodejs/creeper.md)
  - `抓取目标数据，采用http模块、chromeless中间件`[`[more]`](/nodejs/creeper.md#抓取目标数据)
  - `使用cheerio解析`[`[more]`](/nodejs/creeper.md#使用cheerio解析)
  - `案例-爬取某网站课程标题信息`[`[more]`](/nodejs/creeper.md#案例-爬取某网站课程标题信息)

* [C++编写NodeJs插件](/nodejs/c_addons.md)

## 项目发布

* [npm发布自己模块](/project-release/npm_deploy.md)
    - `npm安装模块速度很慢的情况下可以将npm源设置为国内的淘宝源，npm发布需切换回npm源`[`[more]`](/project-release/npm_deploy.md#npm源设置)
    - `npm注册登录`[`[more]`](/project-release/npm_deploy.md#npm注册登录)
    - `npm module 发布`[`[more]`](/project-release/npm_deploy.md#npm-module-发布)
    - `在发布过程中可能遇到的问题汇总`[`[more]`](/project-release/npm_deploy.md#可能遇到的问题)

* [NodeJs线上服务器部署与发布](/project-release/nodejs_deploy.md)
    - `创建用户与修改用户权限`[`[more]`](/project-release/nodejs_deploy.md#创建用户)
    - `三种可选方法登录远程服务器`[`[more]`](/project-release/nodejs_deploy.md#登录远程服务器)
    - `增强服务器安全等级`[`[more]`](/project-release/nodejs_deploy.md#增强服务器安全等级)
        - `[增强服务器安全等级]` 出于基本的安全考虑修改端口号
        - `[增强服务器安全等级]` 设定iptables规则
        - `[增强服务器安全等级]` 设置fail2ban
    - `nodejs生产环境部署`[`[more]`](/project-release/nodejs_deploy.md#nodejs生产环境部署)
    - `Nginx映射配置`[`[more]`](/project-release/nodejs_deploy.md#Nginx映射)
    - `MongoDB`[`[more]`](/project-release/nodejs_deploy.md#mongodb)
        - `[MongoDB]` mongodb安装
        - `[MongoDB]` 防火墙中加入mongodb端口号
        - `[MongoDB]` 更改MongoDB默认端口号
        - `[MongoDB]` 开启MongoDB服务
    - `项目发布`[`[more]`](/project-release/nodejs_deploy.md#项目发布)
        - `[项目发布]` 选择代码托管仓库
        - `[项目发布]` 实现服务器与第三方仓库的关联
        - `[项目发布]` PM2部署代码到服务器

* [forever发布Nodejs项目](/project-release/forever_deploy_nodejs.md)

* [React 项目发布](/project-release/react_deploy.md)

## 数据库操作

* [聚合函数 aggregate](/database/mongo_Aggregate.md)

* [MongoDB数据引用](/database/mongo_dbref.md)

* [Mac系统下安装MongoDB](/database/mongo_install.md)

* [MongoDB之update更新操作](/database/mongo_update.md)

* [Nodejs链接mongodb](/database/mongo_nodejs_link.md)

## web前端

* [React基础](/web-front-end/react_base.md)
    - `React生命周期`[`[more]`](/web-front-end/react_base.md#React生命周期)
    - `ref是什么?`[`[more]`](/web-front-end/react_base.md#ref是什么?)

## 服务器

* [sudo 出现unable to resolve host 解决方法](/doc/linux_unable_to_host.md)

## 版本控制

* [git常用操作]

## ES6语法扩展
[`[let const声明变量]`](/ES6/1-let%20const.md) [`[解构赋值]`](/ES6/2-解构赋值.md) [`[正则扩展]`](/ES6/3-%E6%AD%A3%E5%88%99%E6%89%A9%E5%B1%95.md) [`[字符串扩展]`](/ES6/4-%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%89%A9%E5%B1%95.md) [`[数值扩展]`](/ES6/5-%E6%95%B0%E5%80%BC%E6%89%A9%E5%B1%95.md) [`[数组扩展]`](/ES6/6-%E6%95%B0%E7%BB%84%E6%89%A9%E5%B1%95.md)  

[`[函数扩展]`](/ES6/7-%E5%87%BD%E6%95%B0%E6%89%A9%E5%B1%95.md) [`[对象扩展]`](/ES6/8-%E5%AF%B9%E8%B1%A1%E6%89%A9%E5%B1%95.md) [`[Symbol用法]`](/ES6/9-Symbol%E7%94%A8%E6%B3%95.md) [`[set-map用法]`](/ES6/10-set-map%E7%94%A8%E6%B3%95.md) 

[`[Promise]`](/ES6/13-Promise.md) [`[Symbol.iterator]`](/ES6/14-Iterator.md) [`[Generator]`](/ES6/15-Generator.md) [`[Decorators]`](/ES6/16-Decorators.md)