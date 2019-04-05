# console模块解读之实现一个console.log

## 目录

* [console是同步的还是异步的?](#console是同步的还是异步的?)

* [实现一个console.log](#实现一个console.log)

    * [实现步骤](#实现步骤)

    * [创建logger.js文件](#创建logger.js文件)

* [使用说明](#使用说明)

    * [基础例子log、info、error、warn、clear](#基础例子)

    * [trace打印错误堆栈](#trace打印错误堆栈)

    * [dir显示一个对象的所有属性和方法](#dir显示一个对象的所有属性和方法)

    * [time和timeEnd计算程序执行消耗时间](#time和timeEnd计算程序执行消耗时间)

## console是同步的还是异步的?

console.log既不是总是同步的，也不总是异步的。是否为同步取决于链接的是什么流以及操作系统是Windows还是POSIX:

注意: 同步写将会阻塞事件循环直到写完成。 有时可能一瞬间就能写到一个文件，但当系统处于高负载时，管道的接收端可能不会被读取、缓慢的终端或文件系统，因为事件循环被阻塞的足够频繁且足够长的时间，这些可能会给系统性能带来消极的影响。当你向一个交互终端会话写时这可能不是个问题，但当生产日志到进程的输出流时要特别留心。

* 文件(Files): Windows和POSIX平台下都是同步

* 终端(TTYs): 在Windows平台下同步，在POSIX平台下异步

* 管道(Pipes): 在Windows平台下同步，在POSIX平台下异步

## 实现一个console.log

> 实现console.log在控制台打印，利用process.stdout将输入流数据输出到输出流(即输出到终端)，一个简单的例子输出hello world ``` process.stdout.write('hello world!' + '\n'); ```，以下例子是对console源码解读实现，将Console取名为Logger。

#### 实现步骤

1. 初始化Logger对象
2. 对参数进行检验，当前对象是否为Logger实例，是否为一个可写流实例
3. 为Logger对象定义_stdout，_stderr等属性
4. 将原型方法上的属性绑定到Logger实例上
5. 实现log、error、warning、trace、clear等方法

#### 创建logger.js文件

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

## 使用说明

#### 基础例子

无特殊说明，日志都是默认打印到控制台

```js
const logger = reuqire('logger');

logger.log('hello world') // 普通日志打印
logger.info('hello world') // 等同于logger.log
logger.error('hello world') // 错误日志打印
logger.warn('hello world') // 等同于logger.error
logger.clear() // 清除控制台信息
```

将调试信息打印到本地指定文件，这里要注意版本问题，以下代码示例在nodev10.x以下版本可以，具体原因参考 [TypeError: Console expects a writable stream instance](https://github.com/nodejs/node/issues/21366)

```js
const fs = require('fs');
const output = fs.createWriteStream('./stdout.txt');
const errorOutput = fs.createWriteStream('./stderr.txt');
const { Logger } = require('./logger');

const logger = Logger(output, errorOutput);

logger.info('hello world!'); // 内容输出到stdout.txt文件
logger.error('错误日志记录'); // 内容输出到stderr.txt文件
```

#### trace打印错误堆栈

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

#### dir显示一个对象的所有属性和方法

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

#### time和timeEnd计算程序执行消耗时间

logger.time 和 logger.timeEnd用来测量一个javascript脚本程序执行消耗的时间，单位是毫秒

```js
// 启动计时器
logger.time('计时器');

// 中间写一些测试代码
for(let i=0; i < 1000000000; i++){}

// 停止计时器
logger.timeEnd('计时器');

// 计时器: 718.034ms
```
