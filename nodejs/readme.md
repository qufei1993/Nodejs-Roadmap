# NodeJS

## 目录

* [JavaScript基础问题](/nodejs/base.md)
  - [变量与作用域](/nodejs/base.md#变量与作用域)
  - [类型检测](/nodejs/base.md#类型检测)
  - [定时器](/nodejs/base.md#定时器)
  - [数组](#数组)
     - `[数组去重]` Set数组去重
     - `[数组去重]` reduce数组对象去重
     - `[数组去重]` lodash uniqBy数组去重
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
