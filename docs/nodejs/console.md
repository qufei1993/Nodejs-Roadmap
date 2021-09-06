# Console 模块解读及简单实现

Console 模块提供了简单的调试功能，这在一些测试调试中有时也是使用最方便、用的最多的，它和浏览器中的 console 类似，但是在浏览器中它是同步的，在 Node.js 中，就有个疑问了是同步还是异步？

本文主要参考了官方源码，实现了一个简单版的 Console 模块，介绍了一些基本使用，同时提出了一些常见的问题，供大家学习参考，具体看以下正文介绍。

## 快速导航
-  Logger 模块实现
    * [实现步骤](#实现步骤)
    * [创建 logger.js 文件](#创建logger文件)
-  Logger 模块基本使用
    * [日志输出至终端 log、info、error、warn、clear](#日志输出至终端)
    * [日志输出至文件](#日志输出至文件)
    * [trace 打印错误堆栈](#trace打印错误堆栈)
    * [dir 显示一个对象的所有属性和方法](#dir显示一个对象的所有属性和方法)
    * [time 和 timeEnd 计算程序执行消耗时间](#计算程序执行消耗时间)
- 面试指南
    * ``` console 是同步的还是异步的? ```，参考：[#](#Interview1)
    * ``` 如何实现一个 console.log? ```，参考：[#](#Interview2)
    * ``` 为什么 console.log() 执行完后就退出? ```，参考：[#](#Interview3)

## Logger 模块实现

### 实现步骤

1. 初始化 Logger 对象
2. 对参数进行检验，当前对象是否为 Logger 实例，是否为一个可写流实例
3. 为 Logger 对象定义 _stdout，_stderr 等属性
4. 将原型方法上的属性绑定到 Logger 实例上
5. 实现 log、error、warning、trace、clear 等方法

### 创建logger文件

```js
const util = require('util');

/**
 * 初始化Logger对象
 * @param {*} stdout
 * @param {*} stderr 
 */
function Logger(stdout, stderr){
    // step1 检查当前对象是否为Logger实例
    if(!(this instanceof Logger)){
        return new Logger(stdout, stderr);
    }

    //检查是否是一个可写流实例
    if(!stdout || !(stdout.write instanceof Function)){
        throw new Error('Logger expects a writable stream instance');
    }

    // 如果stderr未指定，使用stdout
    if(!stderr){
        stderr = stdout;
    }

    //设置js Object的属性
    let props = {
        writable: true, // 对象属性是否可修改,flase为不可修改，默认值为true
        enumerable: false, // 对象属性是否可通过for-in循环，flase为不可循环，默认值为true
        configurable: false, // 能否使用delete、能否需改属性特性、或能否修改访问器属性、，false为不可重新定义，默认值为true
    }

    // Logger对象定义_stdout属性
    Object.defineProperty(this, '_stdout', Object.assign(props, {
        value: stdout,
    }));

    // Logger对象定义_stderr属性
    Object.defineProperty(this, '_stderr', Object.assign(props, {
        value: stderr,
    }));

    // Logger对象定义_times属性
    Object.defineProperty(this, '_times', Object.assign(props, {
        value: new Map(),
    }));

    // 将原型方法上的属性绑定到Logger实例上
    const keys = Object.keys(Logger.prototype);

    for(let k in keys){
        this[keys[k]] = this[keys[k]].bind(this);
    }
}

//定义原型Logger的log方法
Logger.prototype.log = function(){
    this._stdout.write(util.format.apply(this, arguments) + '\n');
}

Logger.prototype.info = Logger.prototype.log;

// 定义原型Logger的warn方法
Logger.prototype.warn = function(){
    this._stderr.write(util.format.apply(this, arguments) + `\n`);
}

Logger.prototype.error = Logger.prototype.warn;

// 返回当前调用堆栈信息
Logger.prototype.trace = function trace(...args){
    const err = {
        name: 'Trace',
        message: util.format.apply(null, args)
    }

    // 源自V8引擎的Stack Trace API https://github.com/v8/v8/wiki/Stack-Trace-API
    Error.captureStackTrace(err, trace);

    this.error(err.stack);
}

// 清除控制台信息
Logger.prototype.clear = function(){
    
    // 如果stdout输出是一个控制台，进行clear 否则不进行处理
    if(this._stdout.isTTY){
        const { cursorTo, clearScreenDown } = require('readline');
        cursorTo(this._stdout, 0, 0); // 移动光标到给定的 TTY stream 中指定的位置。
        clearScreenDown(this._stdout); // 方法会从光标的当前位置向下清除给定的 TTY 流
    }
}

//直接输出某个对象
Logger.prototype.dir = function(object, options){
    options = Object.assign({ customInspect: false }, options);

    /**
     * util.inspect(object,[showHidden],[depth],[colors])是一个将任意对象转换为字符串的方法，通常用于调试和错误的输出。
     * showhidden - 是一个可选参数，如果值为true，将会输出更多隐藏信息。
     * depth - 表示最大递归的层数。如果对象很复杂，可以指定层数控制输出信息的多少。
     * 如果不指定depth,默认会递归3层，指定为null表示不限递归层数完整遍历对象。
     * 如果color = true，输出格式将会以ansi颜色编码，通常用于在终端显示更漂亮的效果。
     */
    this._stdout.write(util.inspect(object, options) + '\n');
}

// 计时器开始时间
Logger.prototype.time = function(label){

    // process.hrtime()方法返回当前时间以[seconds, nanoseconds] tuple Array表示的高精度解析值， nanoseconds是当前时间无法使用秒的精度表示的剩余部分。
    this._times.set(label, process.hrtime())
}

// 计时器结束时间
Logger.prototype.timeEnd = function(label){
    const time = this._times.get(label);

    if (!time) {
        process.emitWarning(`No such label '${label}' for console.timeEnd()`);
        return;
    }

    const duration = process.hrtime(time);
    const ms = duration[0] * 1000 + duration[1] / 1e6; // 1e6 = 1000000.0 1e6表示1*10^6
    this.log('%s: %sms', label, ms.toFixed(3));
    this._times.delete(label);
}

module.exports = new Logger(process.stdout, process.stderr);

module.exports.Logger = Logger;
```



## Logger 模块基本使用

### 日志输出至终端

无特殊说明，日志都是默认打印到控制台，在一些代码调试中也是用的最多的。

```js
const logger = require('logger');

logger.log('hello world') // 普通日志打印
logger.info('hello world') // 等同于logger.log
logger.error('hello world') // 错误日志打印
logger.warn('hello world') // 等同于logger.error
logger.clear() // 清除控制台信息
```

### 日志输出至文件

定义要输出的日志文件，实例化我们自定义的 Logger 对象

```js
const fs = require('fs');
const output = fs.createWriteStream('./stdout.txt');
const errorOutput = fs.createWriteStream('./stderr.txt');
const { Logger } = require('./logger');

const logger = Logger(output, errorOutput);

logger.info('hello world!'); // 内容输出到 stdout.txt 文件
logger.error('错误日志记录'); // 内容输出到 stderr.txt 文件
```

**版本问题**

将日志信息打印到本地指定文件，这里要注意版本问题，以下代码示例在 nodev10.x 以下版本可以，nodev10.x 及以上的版本这块有改动，可能会报错如下，具体原因参见 [https://github.com/nodejs/node/issues/21366](https://github.com/nodejs/node/issues/21366)

```bash
TypeError: Console expects a writable stream instance
    at new Console (console.js:35:11)
    at Object.<anonymous> (/Users/ryzokuken/Code/temp/node/console/21366.js:11:16)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    at Function.Module._load (module.js:497:3)
    at Function.Module.runMain (module.js:693:10)
    at startup (bootstrap_node.js:188:16)
    at bootstrap_node.js:609:3
```

### trace打印错误堆栈

```js
logger.trace('测试错误');
```
```
Trace: 测试错误
    at Object.<anonymous> (/Users/qufei/Documents/mycode/Summarize/test/console-test.js:7:8)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)
    at Function.Module.runMain (module.js:665:10)
    at startup (bootstrap_node.js:201:16)
    at bootstrap_node.js:626:3
```

### dir显示一个对象的所有属性和方法

depth - 表示最大递归的层数。如果对象很复杂，可以指定层数控制输出信息的多少。

```js
const family = {
    name: 'Jack',
    brother: {
        hobby: ['篮球', '足球']
    }
}

logger.dir(family, {depth: 3});

// { name: 'Jack', brother: { hobby: [ '篮球', '足球' ] } }
```

### 计算程序执行消耗时间

logger.time 和 logger.timeEnd 用来测量一个 javascript 脚本程序执行消耗的时间，单位是毫秒

```js
// 启动计时器
logger.time('计时器');

// 中间写一些测试代码
for(let i=0; i < 1000000000; i++){}

// 停止计时器
logger.timeEnd('计时器');

// 计时器: 718.034ms
```

## Interview1

> console 是同步的还是异步的?

console 既不是总是同步的，也不总是异步的。**是否为同步取决于链接的是什么流以及操作系统是 Windows 还是 POSIX**:

**注意**: 同步写将会阻塞事件循环直到写完成。 有时可能一瞬间就能写到一个文件，但当系统处于高负载时，管道的接收端可能不会被读取、缓慢的终端或文件系统，因为事件循环被阻塞的足够频繁且足够长的时间，这些可能会给系统性能带来消极的影响。当你向一个交互终端会话写时这可能不是个问题，但当生产日志到进程的输出流时要特别留心。

* 文件(Files): Windows 和 POSIX 平台下都是同步

* 终端(TTYs): 在 Windows 平台下同步，在 POSIX 平台下异步

* 管道(Pipes): 在 Windows 平台下同步，在 POSIX 平台下异步

## Interview2

> 如何实现一个 console.log? 

实现 console.log 在控制台打印，利用 process.stdout 将输入流数据输出到输出流(即输出到终端)，一个简单的例子输出 hello world

```js
process.stdout.write('hello world!' + '\n');
```

## Interview3

> 为什么 console.log() 执行完后就退出?

这个问题第一次看到是来自于朴灵大神的一次演讲，涉及到 EventLoop 的执行机制，一旦产生事件循环，就会产生一个 While(true) 的死循环，例如定时器 setInterval，但是 console.log 它没有产生 watch、handlers 在事件循环中执行了一次就退出了。同时另一个疑问开启一个 http server 为什么进程没有退出？参考下文章 [Node.js 为什么进程没有 exit？](https://mp.weixin.qq.com/s/r7qH147-88bd2Be5Guxd8w)。

## Reference

* [http://nodejs.cn/api/console.html](http://nodejs.cn/api/console.html)
* [http://nodejs.cn/api/process.html#process_a_note_on_process_i_o](http://nodejs.cn/api/process.html#process_a_note_on_process_i_o)
