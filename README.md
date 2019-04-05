# Node.js技术栈

> 本文档是作者从事```Node.js Developer```以来的学习历程，旨在为大家提供一个较详细的学习教程，侧重点更倾向于Node.js服务端所涉及的技术栈，如果本文能为您得到帮助，请给予支持！

**如何支持：**
- 搜索公众号“```Node.js技术栈```”或“``` NodejsDeveloper```”进行关注
- 点击右上角Star给予关注
- 分享给您身边更多的小伙伴

> **作者：** 五月君，Node.js Developer，[慕课网认证作者](https://www.imooc.com/u/2667395)。

## JavaScript

- **基础** [[more]](/docs/javascript/base.md)
    - ```[基础]``` [常见问题](/docs/javascript/base.md#常见问题)
    - ```[基础]``` [undefined与undeclared的区别？](/docs/javascript/base.md#undefined与undeclared的区别)
    - ```[基础]``` [typeof、instanceof 类型检测](/docs/javascript/base.md#类型检测)
    - ```[作用域]``` [eval()、with 欺骗词法作用域](/docs/javascript/base.md#欺骗词法作用域)
    - ```[Error]``` [错误类型ReferenceError、TypeError的区别？](/docs/javascript/base.md#错误)
    - ```[面试]``` ```编写一个函数实现多维数组去重？```，参考：[数组去重的三种实现方式](/docs/javascript/base.md#数组去重的三种实现方式)
    - ```[面试]``` ```实现对多维数组降维？```，参考：[数组降维--扁平化多维数组](/docs/javascript/base.md#数组降维)
- **This** [[more]](/docs/javascript/this.md)
    * ```[This指向]``` [指向自身](/docs/javascript/this.md#指向自身)、[指向函数的作用域](/docs/javascript/this.md#指向函数的作用域)
    * ```[绑定规则]``` [默认绑定](/docs/javascript/this.md#默认绑定)、 [隐式绑定](/docs/javascript/this.md#隐式绑定)、[显示绑定](/docs/javascript/this.md#显示绑定)、[new绑定](/docs/javascript/this.md#new绑定)
- **函数** [[more]](/docs/javascript/func.md)
    - ```[Function]``` [函数声明与函数表达式](/docs/javascript/func.md#函数声明与函数表达式)
    - ```[Function]``` [内置函数](/docs/javascript/func.md#内置函数)
    - ```[Function]``` [arguments对象](/docs/javascript/func.md#arguments对象)
    - ```[Function]``` [call和apply的使用与区别?](/docs/javascript/func.md#call和apply的使用与区别)
    - ```[Function]``` [引用传递](/docs/javascript/func.md#引用传递)
    - ```[面试]``` ``` 递归调用实现一个阶乘函数？  ```，参考：[arguments对象](/docs/javascript/func.md#arguments对象)
    - ```[面试]``` ```如何理解JavaScript中的引用传递与值传递？JS中是否拥有引用传递？```，参考：[引用传递](/docs/javascript/func.md#引用传递)
    - ```[面试]``` ```经典面试题：什么是匿名函数和闭包？```，参考：[深入理解匿名函数与闭包](/docs/javascript/func.md#深入理解匿名函数与闭包)
- **对象** [[more]](/docs/javascript/object.md)
    * ```[Object]``` [创建对象的四种方法](/docs/javascript/object.md#创建对象的四种方法)：[对象字面量](/docs/javascript/object.md#对象字面量创建)、[new关键字构造形式](/docs/javascript/object.md#使用new关键字构造形式创建)、[create方法](/docs/javascript/object.md#对象的create方法创建)、[原型prototype创建](/docs/javascript/object.md#原型prototype创建)
    * ```[面试]``` ``` 什么是引用传递？{} == {} 是否等于true  ```，参考：[对象引用类型示例分析](/docs/javascript/object.md#引用类型示例分析)
    * ```[面试]``` ``` 如何编写一个对象的深度拷贝函数？ ```，参考：[对象copy实现](/docs/javascript/object.md#对象copy实现)
    * ```[面试]``` ``` new操作符具体做了哪些操作，重要知识点！ ```，参考：[使用new关键字构造形式创建](/docs/javascript/object.md#使用new关键字构造形式创建)
- **原型** [[more]](/docs/javascript/prototype.md)
    * ```[ProtoType]``` [原型概念](/docs/javascript/prototype.md#原型概念)
    * ```[ProtoType]``` [原型模式的执行流程](/docs/javascript/prototype.md#原型模式的执行流程)
    * ```[ProtoType]```  [构造函数实例属性方法](/docs/javascript/prototype.md#构造函数实例属性方法)
    *  ```[ProtoType]``` [构建原型属性方法](/docs/javascript/prototype.md#构建原型属性方法)
    * ```[ProtoType]```  [原型字面量创建对象](/docs/javascript/prototype.md#原型字面量创建对象)、[字面量创建对象](/docs/javascript/prototype.md#字面量创建对象)、[构造函数创建对象](/docs/javascript/prototype.md#构造函数创建对象)
    * ```[ProtoType]```  [原型的实际应用](/docs/javascript/prototype.md#原型的实际应用)、[jquery中原型应用](/docs/javascript/prototype.md#jquery中原型应用)、[zepto中原型的应用](/docs/javascript/prototype.md#zepto中原型的应用)
    *  ```[面试]``` 如何实现原型的扩展？，参考：[原型的扩展](/docs/javascript/prototype.md#原型的扩展)
- **正则** [[more]](/docs/javascript/regexp.md)
    - ```[RegExp]```  [模式修饰符参数](/docs/javascript/regexp.md#模式修饰符参数)
    - ```[RegExp]```  [两个测试方法](/docs/javascript/regexp.md#两个测试方法)
    - ```[RegExp]```  [4个正则表达式方法](/docs/javascript/regexp.md#4个正则表达式方法)
    - ```[RegExp]```  [匹配模式](/docs/javascript/regexp.md#匹配模式)
    - ```[RegExp]```  [常用正则表达式](/docs/javascript/regexp.md#常用正则表达式)
    
## ECMAScript6

## Node.js
- **模块** [[more]](/docs/nodejs/module.md)
    - ```[Module]``` [模块的分类](/docs/nodejs/module.md#模块的分类)：[系统模块](/docs/nodejs/module.md#系统模块)、[第三方模块](/docs/nodejs/module.md#第三方模块)
    - ```[Module]``` [模块加载机制](/docs/nodejs/module.md#模块加载机制)
    - ```[Module]``` [模块循环引用](/docs/nodejs/module.md#模块循环引用)
    - ```[面试]``` ```require的加载机制？ ```，参考：[模块加载机制](/docs/nodejs/module.md#模块加载机制)
    - ```[面试]``` ```module.exports与exports的区别```，参考：[module.exports与exports的区别](/docs/nodejs/module.md#module.exports与exports的区别)
    - ```[面试]``` ``` 假设有a.js、b.js两个模块相互引用，会有什么问题？是否为陷入死循环？```，参考：[#](/docs/nodejs/module.md#问题1)
    - ```[面试]``` ``` a模块中的undeclaredVariable变量在b.js中是否会被打印？```，参考：[#](/docs/nodejs/module.md#问题2)
- **中间件** [[more]](/docs/nodejs/middleware.md)
    - ```[Mddleware]``` [常用Web框架&中间件汇总](#) [[more]](/docs/nodejs/middleware.md)

## 数据库

## 微服务

- **服务注册发现之Consul** [[more]](/docs/microservice/consul.md)
    - ```[Consul]``` [使用Consul解决了哪些问题](/docs/microservice/consul.md#使用consul解决了哪些问题)
    - ```[Consul]``` [微服务Consul系列之服务部署、搭建、使用](/docs/microservice/consul.mdconsul架构)
    - ```[Consul]``` [微服务Consul系列之集群搭建](/docs/microservice/consul.md#集群搭建)
    - ```[Consul]``` [微服务Consul系列之服务注册与服务发现](/docs/microservice/consul.md#服务注册与发现)
    - ```[Question]``` [微服务Consul系列之问题汇总篇](/docs/microservice/consul.md#问题总结)

- **消息中间件之RabbitMQ** [[more]](/docs/microservice/rabbitmq.md)
    - ```[RabbitMQ]``` [主流消息中间件简介](/database/rabbitmq_base.md#主流消息中间件简介)
    - ```[RabbitMQ]``` [RabbitMQ安装、部署、启动](/database/rabbitmq_base.md#安装)
        -  Mac版安装
        - Linux系统（Ubuntu、CentOS）安装 
        - 运行与启动 


## HTTP协议实战

## DevOps

- **Node.js生产环境完整部署指南** [[more]](/docs/devops/node-deploy.md)
    - ```[Node.js]``` [用户权限管理及登陆服务器](#用户权限管理及登陆服务器)
    - ```[Node.js]``` [增强服务器安全等级](#增强服务器安全等级)
    - ```[Node.js]``` [Node.js生产环境部署](#nodejs生产环境部署)
    - ```[Node.js]``` [Nginx端口映射](#nginx映射)
    - ```[Node.js]``` [Mongodb生产环境部署](#mongodb)
    - ```[Node.js]``` [实现服务器与第三方仓库的关联-PM2代码部署](#本地代码同步第三方仓库进行生产部署)
- **NPM模块管理** [[more]](/docs/devops/npm-deploy.md)
    - ```[NPM]``` [npm源设置](#npm源设置)
    - ```[NPM]``` [nnpm注册登录](#npm注册登录)
    - ```[NPM]``` [npm module 发布](#npm-module-发布)
    - ```[NPM]``` [可能遇到的问题](#可能遇到的问题)

## 工具

- **Git** [[more]](/docs/tools/git.md)
    - ```[Git]``` [Git常用命令及日常问题集锦](/docs/tools/git.md)
- **SEO** [[more]](/docs/tools/seo.md)
    - ```[SEO实战]``` [SEO网站优化title设置与快速排名](/docs/tools/seo.md)

## 资料

- **书籍推荐** [[more]](/docs/materials/book.md)

