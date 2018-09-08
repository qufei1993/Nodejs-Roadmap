# NodeJS

* [`[系统模块系列一]` console模块解读](/node/console.md)
  - `console是同步的还是异步的?`[`[more]`](/node/console.md#console是同步的还是异步的?)
  - `实现一个console.log`[`[more]`](/node/console.md#实现一个console.log)
  - `使用说明 基础例子log、info、error、warn、clear`[`[more]`](/node/console.md#使用说明)
  - `使用说明 trace打印错误堆栈`[`[more]`](/node/console.md#trace打印错误堆栈)
  - `使用说明 dir显示一个对象的所有属性和方法`[`[more]`](/node/console.md#dir显示一个对象的所有属性和方法)
  - `使用说明 time和timeEnd计算程序执行消耗时间`[`[more]`](/node/console.md#time和timeEnd计算程序执行消耗时间)

* [`[系统模块系列二]` 子进程child_process](/node/child_process.md)
  - `创建异步进程的四种方法 spawn、fork、exec、execFile`[`[more]`](/node/child_process.md#创建进程)
  - `采用child_process.spawn编写一个守护进程`[`[more]`](/node/child_process.md#采用child_process.spawn编写一个守护进程)
  - `fork创建子进程解决cpu计算密集程序阻塞`[`[more]`](/node/child_process.md#fork创建子进程解决cpu计算密集程序阻塞)

* [对象引用与理解module.exports与exports的关系](/node/object_reference.md)
  - `引用类型比较`[`[more]`](/node/object_reference.md#引用类型比较)
  - `数组对象深度拷贝`[`[more]`](/node/object_reference.md#数组对象深度拷贝)
  - `exports与module.exports的区别?`[`[more]`](/node/object_reference.md#exports与module.exports的区别)

* [JavaScript运行机制](/node/operational_mechanism.md)
  - `js工作机制，微任务与宏任务术语`[`[more]`](/node/operational_mechanism.md#js工作机制)
  - `javascript是单线程，只有同步代码执行完毕后，才会去执行异步代码，详情看示例`[`[more]`](/node/operational_mechanism.md#例2)
  - `process.nextTick与setTimeout递归调用区别?`[`[more]`](/node/operational_mechanism.md#process.nextTick与setTimeout递归调用区别)
  - `setImmediate与setTimeout分别在浏览器与node环境下的区别?`[`[more]`](/node/operational_mechanism.md#setImmediate与setTimeout)

* [性能优化](/node/performance_optimization.md)
  - `map比forEach功能强大, 但是map会创建一个新的数组, 将会占用内存.`[`[more]`](/node/performance_optimization.md#map与forEach)
  - `高并发应对之道.`[`[more]`](/node/performance_optimization.md#高并发应对之道)
  - `require特性与优化`[`[more]`](/node/performance_optimization.md#require特性与优化)
* [爬虫](/node/creeper.md)
  - `抓取目标数据，采用http模块、chromeless中间件`[`[more]`](/node/creeper.md#抓取目标数据)
  - `使用cheerio解析`[`[more]`](/node/creeper.md#使用cheerio解析)
  - `案例-爬取某网站课程标题信息`[`[more]`](/node/creeper.md#案例-爬取某网站课程标题信息)
* [crypto模块实现md5、Cipher等多种加密方式](/node/crypto.md)
  - `对称密钥加解密Cipher实例介绍` [`[more]`](/node/creeper.md#cipher)
  - `不可逆向解密的md5加密` [`[more]`](/node/creeper.md#md5加密)

* [常用插件](/node/plugins.md)
* [经纬度计算](/node/distance.md)
* [C++编写node插件](/node/c_addons.md)
* [Javascript排序](/node/sort.md)

## cpu密集 VS I/O密集

一个程序大部分时间用来做运算逻辑判断称为CPU密集 
一个程序大部分时间用来做存储设备，网络设施的一些读取操作称作为I/O密集

## 常用场景

Web Server、本地代码构建、使用工具开发


## Nodejs调试工具

* Inspector NodeJS自带的调试

* VS Code

## 项目初始化

* .gitignore
  参考文档 https://git-scm.com/docs/gitignore

* .npmignore
  在npm里一些文件在发布时不是必须的我们也可以忽略掉 参考文档 https://docs.npmjs.com/misc/developers

* .editorconfig
  团队开发中同一个项目多个人维护可能大家的编辑器不一样，没有统一的约定，例如有的人习惯两个空格、有的人习惯tab、有的人习惯四个空格，为了项目的风格能够统一可以采用editorConfig保持持续的代码风格 参考文档 http://editorconfig.org/

* .eslintrc
  eslint用于代码审查 参考文档 http://eslint.cn/docs/user-guide/configuring#configuration-file-formats
  eslint可以结合pre-commit插件使用 目的是在package.json 的scripts之前对一些指定的命令提前运行, 相当于一个勾子, 例如：

```javascript
//npm install --save-dev pre-commit

//package.json 文件
"scripts": {
  "dev": "node app",
  "lint": "eslint .",
  "fix": "eslint --fix ."
},
"pre-commit": [
  "fix",
  "lint"
],

//执行git commit -m 'test' 提交代码时 会先执行pre-commit中的代码
```

* .eslintignore
  用于忽略某些文件
