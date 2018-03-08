# NodeJS

## 目录

* [JavaScript基础问题](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/base.md)
  - [变量与作用域](#变量与作用域)
  - [类型检测](#类型检测)
  - [定时器](#定时器)
  - [函数](#函数)
      - [`[函数]` push()数组添加新值后的返回值](#push()数组添加新值后的返回值)
      - [`[函数]` arguments.callee递归调用实现一个阶乘函数](#arguments.callee递归调用实现一个阶乘函数)
      - [`[函数]` call和apply的使用与区别?](#call和apply的使用与区别?)
      - [`[函数]` javascript没有引用传递都是按值传递的](#javascript没有引用传递都是按值传递的)
  - [匿名函数与闭包](#匿名函数与闭包)
      - [`[匿名函数与闭包]` 匿名函数的自我执行](#匿名函数的自我执行)
      - [`[匿名函数与闭包]` 函数里放一个匿名函数将会产生闭包](#函数里放一个匿名函数将会产生闭包)
      - [`[匿名函数与闭包]` 闭包中使用this对象将会导致的一些问题](#闭包中使用this对象将会导致的一些问题)

* [对象引用与理解module.exports与exports的关系](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/object_reference.md)

* [JavaScript运行机制](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/operational_mechanism.md)

* [常用插件](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/plugins.md)

* [经纬度计算](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/distance.md)

* [跨域](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/cors.md)

* [代码性能优化](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/performance_optimization.md)

* [爬虫](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/creeper.md)

* [C++编写NodeJs插件](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/c_addons.md)

## cpu密集 VS I/O密集

一个程序大部分时间用来做运算逻辑判断称为CPU密集 
一个程序大部分时间用来做存储设备，网络设施的一些读取操作称作为I/O密集

## 高并发应对之道

* 增加机器数
* 增加每台机器的CPU数 —— 多核

NodeJS性能好主要是好在单个的CPU(一个CPU只开一个进程，一个进程只开一个线程), 在单台机器的时候，在处理Web请求的时候和之前的java和apache是相同的,

## 常用场景

Web Server、本地代码构建、使用工具开发

## require特性

* module被加载的时候执行，加载后缓存

* 一旦出现某个模块被循环加载, 就只输出已经执行的部分, 还未执行的部分不会输出

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