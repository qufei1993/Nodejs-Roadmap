# Node.js技术栈

> 为Node.js学习贡献一份自己微小的力量，本文档是作者从事```Node.js Developer```以来的学习历程，旨在为大家提供一个较详细的学习教程，侧重点更倾向于Node.js服务端所涉及的技术栈，如果本文能为您得到帮助，请给予支持！

**如何支持：**
- 搜索公众号 **```Node.js技术栈```** 进行关注
- 点击右上角Star :star: 给予关注
- 分享给您身边更多的小伙伴

> **Github**：[https://github.com/Q-Angelo/Nodejs-Roadmap](https://github.com/Q-Angelo/Nodejs-Roadmap)

[```JavaScript```](#JavaScript)| [`ECMAScript6`](#ECMAScript6) | [`Node.js`](#Nodejs) | [`DataBase`](#DataBase) | [`Microservice`](#Microservice) | [`HTTP`](#HTTP协议实战) | [`DevOps`](#DevOps) | [`工具`](#工具) | [`资料`](#资料)
 :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-:

## JavaScript

- **基础** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md)
    - ```[基础]``` [常见问题](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#常见问题)
    - ```[基础]``` [undefined与undeclared的区别？](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#undefined与undeclared的区别)
    - ```[基础]``` [typeof、instanceof 类型检测](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#类型检测)
    - ```[作用域]``` [eval()、with 欺骗词法作用域](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#欺骗词法作用域)
    - ```[Error]``` [错误类型ReferenceError、TypeError的区别？](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#错误)
    - ```[面试]``` ```编写一个函数实现多维数组去重？```，参考：[数组去重的三种实现方式](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#数组去重的三种实现方式)
    - ```[面试]``` ```实现对多维数组降维？```，参考：[数组降维--扁平化多维数组](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/base.md#数组降维)
- **This** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md)
    * ```[This指向]``` [指向自身](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md#指向自身)、[指向函数的作用域](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md#指向函数的作用域)
    * ```[绑定规则]``` [默认绑定](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md#默认绑定)、 [隐式绑定](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md#隐式绑定)、[显示绑定](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md#显示绑定)、[new绑定](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/this.md#new绑定)
- **函数** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md)
    - ```[Function]``` [函数声明与函数表达式](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#函数声明与函数表达式)
    - ```[Function]``` [内置函数](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#内置函数)
    - ```[Function]``` [arguments对象](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#arguments对象)
    - ```[Function]``` [call和apply的使用与区别?](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#call和apply的使用与区别)
    - ```[Function]``` [引用传递](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#引用传递)
    - ```[面试]``` ``` 递归调用实现一个阶乘函数？  ```，参考：[arguments对象](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#arguments对象)
    - ```[面试]``` ```如何理解JavaScript中的引用传递与值传递？JS中是否拥有引用传递？```，参考：[引用传递](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#引用传递)
    - ```[面试]``` ```经典面试题：什么是匿名函数和闭包？```，参考：[深入理解匿名函数与闭包](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/func.md#深入理解匿名函数与闭包)
- **对象** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md)
    * ```[Object]``` [创建对象的四种方法](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#创建对象的四种方法)：[对象字面量](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#对象字面量创建)、[new关键字构造形式](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#使用new关键字构造形式创建)、[create方法](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#对象的create方法创建)、[原型prototype创建](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#原型prototype创建)
    * ```[面试]``` ``` 什么是引用传递？{} == {} 是否等于true  ```，参考：[对象引用类型示例分析](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#引用类型示例分析)
    * ```[面试]``` ``` 如何编写一个对象的深度拷贝函数？ ```，参考：[对象copy实现](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#对象copy实现)
    * ```[面试]``` ``` new操作符具体做了哪些操作，重要知识点！ ```，参考：[使用new关键字构造形式创建](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/object.md#使用new关键字构造形式创建)
- **原型** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md)
    * ```[ProtoType]``` [原型概念](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#原型概念)
    * ```[ProtoType]``` [原型模式的执行流程](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#原型模式的执行流程)
    * ```[ProtoType]```  [构造函数实例属性方法](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#构造函数实例属性方法)
    *  ```[ProtoType]``` [构建原型属性方法](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#构建原型属性方法)
    * ```[ProtoType]```  [原型字面量创建对象](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#原型字面量创建对象)、[字面量创建对象](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#字面量创建对象)、[构造函数创建对象](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#构造函数创建对象)
    * ```[ProtoType]```  [原型的实际应用](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#原型的实际应用)、[jquery中原型应用](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#jquery中原型应用)、[zepto中原型的应用](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#zepto中原型的应用)
    *  ```[面试]``` 如何实现原型的扩展？，参考：[原型的扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/prototype.md#原型的扩展)
- **正则** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/regexp.md)
    - ```[RegExp]```  [模式修饰符参数](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/regexp.md#模式修饰符参数)
    - ```[RegExp]```  [两个测试方法](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/regexp.md#两个测试方法)
    - ```[RegExp]```  [4个正则表达式方法](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/regexp.md#4个正则表达式方法)
    - ```[RegExp]```  [匹配模式](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/regexp.md#匹配模式)
    - ```[RegExp]```  [常用正则表达式](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/javascript/regexp.md#常用正则表达式)
    
## ECMAScript6
- **变量声明** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md)
    - ```[Variable]``` [新增let&const变量声明](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#新增声明变量)
- **解构赋值** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#解构赋值)
    - ```[Deconstruction]``` [数组解构赋值](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#数组解构赋值)
    - ```[Deconstruction]``` [对象解构赋值](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#对象解构赋值)
- **扩展系列** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#解构赋值)
    - ```[Extension]``` [正则表达式扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#正则表达式扩展)
    - ```[Extension]``` [字符串扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#字符串扩展)
    - ```[Extension]``` [数值扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#数值扩展)
    - ```[Extension]``` [数组扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#数组扩展)
    - ```[Extension]``` [函数扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#函数扩展)
    - ```[Extension]``` [对象扩展](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/readme.md#对象扩展)
- **集合系列** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#解构赋值)
    - ```[Set]``` [集合Set](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#set)、[WeakSet](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#weakset)
    - ```[Map]``` [集合Map](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#map)、[WeakMap](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#weakmap)
    - ```[Map-Array]``` [Map与Array横向对比增、查、改、删](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#map与array对比)
    - ```[Set-Array]``` [Set与Array增、查、改、删对比](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#set与array)
    - ```[Map-Set-Array]``` [Map、Set、Object三者增、查、改、删对比](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/set-map.md#集合map集合set对象三者对比)
- **Promise** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md)
    - ```[Promise]``` [Promise的基本使用和原理](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#promise的基本使用和原理)
    - ```[Promise]``` [Callback方式书写](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#callback方式书写)
    - ```[Promise]``` [Promise方式书写](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#promise方式书写)
    - ```[Promise]``` [Promise.finally()](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#finally)
    - ```[Promise]``` [Promise并行执行 Promise.all()](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#promise并行执行)
    - ```[Promise]``` [Promise率先执行 Promise.race()](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#promise率先执行)
    - ```[Promise]``` [错误捕获](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#错误捕获) 
    - ```[面试]``` ```Promise 中 .then 的第二参数与 .catch 有什么区别?```，参考：[错误捕获](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#错误捕获)
    - ```[面试]``` ```怎么让一个函数无论promise对象成功和失败都能被调用？```，参考：[finally](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/promise.md#finally)
- **Decorators** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/decorators.md)
- **Symbol** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/symbol.md)
- **Generator** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/es6/generator.md)

## Nodejs
- **模块** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md)
    - ```[Module]``` [模块的分类](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#模块的分类)：[系统模块](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#系统模块)、[第三方模块](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#第三方模块)
    - ```[Module]``` [模块加载机制](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#模块加载机制)
    - ```[Module]``` [模块循环引用](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#模块循环引用)
    - ```[面试]``` ```require的加载机制？ ```，参考：[模块加载机制](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#模块加载机制)
    - ```[面试]``` ```module.exports与exports的区别```，参考：[module.exports与exports的区别](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#module.exports与exports的区别)
    - ```[面试]``` ``` 假设有a.js、b.js两个模块相互引用，会有什么问题？是否为陷入死循环？```，参考：[#](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#问题1)
    - ```[面试]``` ``` a模块中的undeclaredVariable变量在b.js中是否会被打印？```，参考：[#](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/module.md#问题2)
- **事件轮询（Event Loop）** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md)
    - `[EventLoop]` [线程模型、EventLoop介绍](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md#线程模型)
    - `[I/O]`[操作系统I/O模型及轮询技术演变](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md#操作系统的轮询技术演进)
    - `[I/O]`[白话风格（小明与妹子的邂逅）讲解I/O演进](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md#白话风格)
    - `[Node.js-EventLoop]` [Node.js中的Event Loop](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md#Node.js中的EventLoop)
    - `[Browser-EventLoop]` [浏览器中的Event Loop](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md#浏览器中的EventLoop)
    - `[Interview]` ``` I/O多路复用轮询技术select和epoll的区别？ ```，参考：[#](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/event-loop.md#select和epoll的区别)
- **中间件** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/middleware.md)
    - ```[Mddleware]``` [常用Web框架&中间件汇总](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/nodejs/middleware.md)
- **缓存**
  - `[Cache]` [memory-fs 将文件写入内存](https://github.com/webpack/memory-fs)
  - `[Cache]` [Memory Cache](https://github.com/ptarjan/node-cache#readme)
  - `[Cache]` [Node Cache](https://github.com/mpneuried/nodecache)
- **定时任务**
  - `[Schedule]` [node-schedule ](https://github.com/node-schedule/node-schedule)
  - `[Schedule]` [Agenda 将Node中的定时任务存储在数据库中（官方推荐MongoDB）](https://github.com/agenda/agenda)
- **模板引擎**
    - `[Template]` [Ejs](https://ejs.co/)
    - `[Template]` [Handlebarsjs](https://handlebarsjs.com/)
    - `[Template]` [Jade](http://jade-lang.com/)
- **日志记录收集**
    - `[Logger]` [Sentry--错误日志收集框架](https://sentry.io/welcome/)
    - `[Logger]` [log4js 日志记录工具](https://github.com/log4js-node/log4js-node)
    - `[Logger]` [ELK--开源的日志分析系统](https://www.elastic.co/cn/products)
    - `[Logger]` [winston日志模块](https://github.com/winstonjs/winston)
- **测试**
  * `Unit Testing` [mocha NodeJS里最常用的测试框架](https://mochajs.org/)
  * `Unit Testing` [chai 一个断言库](http://www.chaijs.com/api/)
  * `Unit Testing` [Jest — Facebook推出的一款测试框架，集成了 Mocha，chai，jsdom，sinon等功能。](https://jestjs.io/)
  * `BDD Testing` [Jasmine — 一款基于行为驱动的JavaScript测试框架](https://jasmine.github.io/)
  * `Testing Tool` [istanbul Istanbul - a JS code coverage tool written in JS 测试覆盖率](https://github.com/gotwarlost/istanbul)
  * `E2E Testing` [Puppeteer](https://github.com/GoogleChrome/puppeteer)
- **框架**
    - `[Framework]` [Express 中文版](http://www.expressjs.com.cn/)、[Express of English Version](http://www.expressjs.com.cn/)
    - `[Framework]` [Koa 中文版](https://koajs.com/)、[Koa of English Version](https://koajs.com/)
    - `[Framework]` [Egg 中文版](https://eggjs.org/zh-cn/intro/quickstart.html)、[Egg of English Version](https://eggjs.org/en/intro/quickstart.html)
    - `[Framework]` [Nest.js 中文版](https://docs.nestjs.cn/)、[Nest.js](https://docs.nestjs.com/)
- **ORM**
    - `[typeorm]` [typeorm](https://typeorm.io/) 【右上角切换中文】 
    - `[sequelize]` [sequelize](http://docs.sequelizejs.com/)
    - `[prisma]` [prisma](https://www.prisma.io/docs)
## DataBase
- **`Relational`**
    * [MySql](https://www.mysql.com/)
    * [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-2017)
    * [PostgreSQL](https://www.postgresql.org/)
    * [Oracle](https://www.oracle.com/index.html)
- **`NoSQL`**
    * [MongoDB](https://www.mongodb.com/)
    * [Redis](https://redis.io/)
    * [RocksDB](https://github.com/facebook/rocksdb/)、[RocksDB中文网](https://rocksdb.org.cn/)
    * [CouchDB](http://couchdb.apache.org/)
- **Search Engines** 
    * [ElasticSearch](https://www.elastic.co/)
    * [Solr](http://lucene.apache.org/solr/)
    * [Sphinxsearch](http://sphinxsearch.com/)

## Microservice
- **服务注册发现之Consul** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/consul.md)
    - ```[Consul]``` [使用Consul解决了哪些问题](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/consul.md#使用consul解决了哪些问题)
    - ```[Consul]``` [微服务Consul系列之服务部署、搭建、使用](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/consul.md#consul架构)
    - ```[Consul]``` [微服务Consul系列之集群搭建](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/consul.md#集群搭建)
    - ```[Consul]``` [微服务Consul系列之服务注册与服务发现](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/consul.md#服务注册与发现)
    - ```[Question]``` [微服务Consul系列之问题汇总篇](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/consul.md#问题总结)
- **消息中间件之RabbitMQ** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/microservice/rabbitmq-base.md)
    - ```[RabbitMQ]``` [主流消息中间件简介](/database/rabbitmq-base.md#主流消息中间件简介)
    - ```[RabbitMQ]``` [RabbitMQ安装、部署、启动](/database/rabbitmq-base.md#安装)
        - Mac版安装
        - Linux系统（Ubuntu、CentOS）安装 
        - 运行与启动 
- **轻量级数据通信**
   - `[RPC]` [gRPC 官方文档中文版](http://doc.oschina.net/grpc?t=57966)
   - `[RPC]` [Apache Thrift](http://thrift.apache.org/)
   - `[RPC]` [Apache Dubbo一款高性能Java RPC框架](http://dubbo.apache.org/zh-cn/index.html)
   - `[HTTP]` [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html) [Best Practices for Designing a Pragmatic RESTful API
](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#versioning)
   

## HTTP协议实战
- **http三次握手** [[more]](#http三次握手)
    * `[HTTP三次握手]` [三次握手时序图](#三次握手时序图)
    * `[HTTP三次握手]` [三次握手数据包详细内容分析](#三次握手数据包详细内容分析)
    * `[HTTP三次握手]` [分析总结](#总结)
    * `[面试]` `说下TCP三次握手的过程?`，参考：[三次握手时序图](#三次握手时序图)
- **跨域CORS** [[more]](#跨域cors)
    * `[CORS]` [跨域形成原理简介](#跨域cors)
    * `[CORS]` [实例来验证跨域的产生过程](#示例)
    * `[CORS]` [基于http协议层面的几种解决办法](#基于http协议层面的几种解决办法)
    * `[CORS]` [CORS预请求](#cors预请求)
    * `[面试]` `你之前遇见过跨域吗？说一下跨域的形成与实现。`，参考：[CORS](#跨域cors)
- **缓存头Cache-Control的含义和使用**
    * `[Cache-Control]` [可缓存性（public、private、no-cache）](#可缓存性)
    * `[Cache-Control]` [到期 （max-age、s-maxage、max-stale）](#到期)
    * `[Cache-Control]` [重新验证 （must-revalidate、proxy-revalidate）](#重新验证)
    * `[Cache-Control]` [其它 （no-store、no-transform）](#其它)
    * `[Cache-Control]` [缓存cache-control示例](#缓存cache-control示例)
    1. `[思考]` `在页面中引入静态资源文件，为什么静态资源文件改变后，再次发起请求还是之前的内容，没有变化呢？`，参考：[#](#缓存cache-control示例)
    2. `[思考]` `在使用webpack等一些打包工具时，为什么要加上一串hash码？`，参考：[#](#缓存cache-control示例)
- **HTTP长链接**
    * `[KeepAlive]` [http长链接简介](#http长链接)
    * `[KeepAlive]` [http/1.1中长链接的实现示例](#http长链接)
    * `[KeepAlive]` [长链接在http2中的应用与http/1.1协议中的对比](#http长链接)
    * `[面试]` `Chrome浏览器允许的一次性最大TCP并发链接是几个？`，参考：[HTTP长链接分析](#http长链接)
- **Nginx服务配置**
    * `[Nginx]` [Nginx安装启动](#nginx安装启动)
    * `[Nginx]` [修改hosts文件配置本地域名](#修改hosts文件配置本地域名)
    * `[Nginx]` [Nginx配置缓存](#nginx配置缓存)
    * `[Nginx]` [nginx部署https服务](#nginx部署https服务)
    * `[Nginx]` [实现http2协议](#实现http2协议)

## DevOps
- **Node.js生产环境完整部署指南** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md)
    - ```[Node.js]``` [用户权限管理及登陆服务器](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md#用户权限管理及登陆服务器)
    - ```[Node.js]``` [增强服务器安全等级](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md#增强服务器安全等级)
    - ```[Node.js]``` [Node.js生产环境部署](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md#nodejs生产环境部署)
    - ```[Node.js]``` [Nginx端口映射](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md#nginx映射)
    - ```[Node.js]``` [Mongodb生产环境部署](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md#mongodb)
    - ```[Node.js]``` [实现服务器与第三方仓库的关联-PM2代码部署](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/node-deploy.md#本地代码同步第三方仓库进行生产部署)
- **NPM模块管理** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/npm-deploy.md)
    - ```[NPM]``` [npm源设置](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/npm-deploy.md#npm源设置)
    - ```[NPM]``` [nnpm注册登录](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/npm-deploy.md#npm注册登录)
    - ```[NPM]``` [npm module 发布](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/npm-deploy.md#npm-module-发布)
    - ```[NPM]``` [可能遇到的问题](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/npm-deploy.md#可能遇到的问题)
- **Linux系统问题汇总** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/devops/linux-question.md)

## 工具
- **Git** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/tools/git.md)
    - ```[Git]``` [Git常用命令及日常问题集锦](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/tools/git.md)
- **SEO** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/tools/seo.md)
    - ```[SEO实战]``` [SEO网站优化title设置与快速排名](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/tools/seo.md)

## 资料
- **书籍推荐** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/materials/book.md)
- **Blog推荐** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/materials/blog.md)
- **文章推荐** [[more]](https://github.com/Q-Angelo/Nodejs-Roadmap/blob/master/docs/materials/article.md)

**未完待续，持续更新中。。。**