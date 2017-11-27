# NodeJS

## cpu密集 VS I/O密集

一个程序大部分时间用来做运算逻辑判断称为CPU密集

一个程序大部分时间用来做存储设备，网络设施的一些读取操作称作为I/O密集

## 高并发应对之道

* 增加机器数

* 增加每台机器的CPU数 —— 多核

NodeJS性能好主要是好在单个的CPU(一个CPU只开一个进程，一个进程只开一个线程), 在单台机器的时候，在处理Web请求的时候和之前的java和apache是相同的,

## 常用场景

* Web Server

* 本地代码构建

* 使用工具开发

## require特性

* module被加载的时候执行，加载后缓存

* 一旦出现某个模块被循环加载, 就只输出已经执行的部分, 还未执行的部分不会输出

## exports与module.exports的区别

exports相当于module.exports 的快捷方式如下所示:

```javascript
const exports = modules.exports;
```

但是要注意不能改变exports的指向，我们可以通过 ``` exports.test = 'a' ``` 这样来导出一个对象, 但是不能向下面示例直接赋值，这样会改变exports的指向

```javascript
//错误的写法 将会得到undefined
exports = {
  'a': 1,
  'b': 2
}

//正确的写法
modules.exports = {
  'a': 1,
  'b': 2
}

```

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

* .eslintignore
  用于忽略某些文件
