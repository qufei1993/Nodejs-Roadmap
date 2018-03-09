# 工作与学习笔记

## NodeJS

* [JavaScript基础问题](/nodejs/base.md)
  - [变量与作用域](/nodejs/base.md#变量与作用域)
  - [类型检测](/nodejs/base.md#类型检测)
  - [定时器](/nodejs/base.md#定时器)
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

## 数据库操作

* [聚合函数 aggregate](/database/mongo_Aggregate.md)

* [MongoDB数据引用](https://github.com/Q-Angelo/Summarize/blob/master/database/mongo_dbref.md)

* [Mac系统下安装MongoDB](https://github.com/Q-Angelo/Summarize/blob/master/database/mongo_install.md)

* [MongoDB之update更新操作](https://github.com/Q-Angelo/Summarize/blob/master/database/mongo_update.md)

* [Nodejs链接mongodb](https://github.com/Q-Angelo/Summarize/blob/master/database/mongo_nodejs_link.md)

### 项目发布

* [forever发布Nodejs项目](https://github.com/Q-Angelo/Summarize/blob/master/project-release/forever_deploy_nodejs.md)

* [Nginx配置与pm2发布nodejs项目](https://github.com/Q-Angelo/Summarize/blob/master/project-release/nodejs_deploy.md)

* [npm发布自己模块](https://github.com/Q-Angelo/Summarize/blob/master/project-release/npm_deploy.md)

* [React 项目发布](https://github.com/Q-Angelo/Summarize/blob/master/project-release/react_deploy.md)

## ES6语法扩展

* [let const声明变量](https://github.com/Q-Angelo/Summarize/blob/master/ES6/1-let%20const.md)

* [解构赋值](https://github.com/Q-Angelo/Summarize/blob/master/ES6/2-%E7%BB%93%E6%9E%84%E8%B5%8B%E5%80%BC.md)

* [正则扩展](https://github.com/Q-Angelo/Summarize/blob/master/ES6/3-%E6%AD%A3%E5%88%99%E6%89%A9%E5%B1%95.md)

* [字符串扩展](https://github.com/Q-Angelo/Summarize/blob/master/ES6/4-%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%89%A9%E5%B1%95.md)

* [数值扩展](https://github.com/Q-Angelo/Summarize/blob/master/ES6/5-%E6%95%B0%E5%80%BC%E6%89%A9%E5%B1%95.md)

* [数组扩展](https://github.com/Q-Angelo/Summarize/blob/master/ES6/6-%E6%95%B0%E7%BB%84%E6%89%A9%E5%B1%95.md)

* [函数扩展](https://github.com/Q-Angelo/Summarize/blob/master/ES6/7-%E5%87%BD%E6%95%B0%E6%89%A9%E5%B1%95.md)

* [对象扩展](https://github.com/Q-Angelo/Summarize/blob/master/ES6/8-%E5%AF%B9%E8%B1%A1%E6%89%A9%E5%B1%95.md)

* [Symbol用法](https://github.com/Q-Angelo/Summarize/blob/master/ES6/9-Symbol%E7%94%A8%E6%B3%95.md)

* [set-map用法](https://github.com/Q-Angelo/Summarize/blob/master/ES6/10-set-map%E7%94%A8%E6%B3%95.md)

* [Promise](https://github.com/Q-Angelo/Summarize/blob/master/ES6/13-Promise.md)

* [Symbol.iterator](https://github.com/Q-Angelo/Summarize/blob/master/ES6/14-Iterator.md)

* [Generator](https://github.com/Q-Angelo/Summarize/blob/master/ES6/15-Generator.md)

* [Decorators](https://github.com/Q-Angelo/Summarize/blob/master/ES6/16-Decorators.md)

