# 在 Node.js 中使用诊断报告快速追踪问题

![](./img/report.png)

**作者简介**：五月君，Software Designer，公众号「Nodejs技术栈」作者。

Diagnostic report 是 Node.js v14.x 提供的一个稳定功能，在某些情况下会生成一个 JSON 格式的诊断报告，可用于开发、测试、生产环境。报告会提供有价值的信息，包括：JavaScript 和本机堆栈信息、堆统计信息、平台信息、资源使用情况等，帮助用户快速追踪问题。

## 生成诊断报告

提供了多种触发诊断报告的时机，包括：API 调用的方式触发、针对未捕获的异常触发、用户信号触发、致命错误导致应用程序终止触发。

### API 触发

调用 `writeReport()` 方法，会立即生成一份诊断报告，该方法可以写在仅当你需要诊断报告时调用，以获取所需的信息。

```javascript
const process = require('process');
process.report.writeReport();
```

**报告默认目录**：Node.js 进程当前工作目录
**报告默认名称**：YYYYMMDD.HHMMSS.PID.SEQUENCE.txt

### 未捕获错误触发

当程序遇到未捕获错误时主动触发，需要在启动服务时加上 `--report-uncaught-exception` 标志，例如： `node --report-uncaught-exception app.js`

```javascript
// app.js
throw new Error('testerror')
```

### 信号触发

正在运行的 Node.js 进程在接收到特定的信号后生成诊断报告，默认的信号为 `-SIGUSR2`，同样在启动服务时加上  `--report-on-signal` 标志。

```javascript
// app.js
console.log(`process id: ${process.pid}`)
setInterval(() => {}, 1000);
```

启动服务 `node --report-on-signal app.js` 之后触发信号 `kill -SIGUSR2 55800` 会看到如下信息：

```javascript
process id: 3512
Writing Node.js report to file: report.20210113.211250.3512.0.001.json
Node.js report completed
```

基于信号的报告生成，目前 Windows 系统是不支持的。通常无需修改触发报告的信号，如果 `-SIGUSR2` 信号已用途其它用途，可通过 `--report-signal` 标志修改，例如在启动服务时这样执行： `node --report-on-signal --report-signal SIGPIPE app.js`

### 致命错误导致应用程序终止触发

在启动服务时上 `--report-on-fatalerror` 标志，当程序发生一些致命错误，例如内存泄漏、Node.js 运行时的内部错误等也会触发生成诊断报告。

以下是一个触发内存泄漏的例子：

```javascript
const format = bytes => (bytes / 1024 / 1024).toFixed(2) + ' MB';
const print = () => {
  const memoryUsage = process.memoryUsage();
  console.log(`heapTotal: ${format(memoryUsage.heapTotal)}, heapUsed: ${format(memoryUsage.heapUsed)}`);
}
const total = [];
setInterval(() => {
  total.push(new Array(20, 1024, 1024));
  print();
}, 1000)
```

## 用例分析

### 事件循环计时器（timer）具柄信息

以下代码就是每 10 秒中程序执行一次，你可以通过上面讲的信号的方式在启动之后获取诊断报告。

```javascript
console.log(process id: ${process.pid})
setInterval(() => {}, 1000 * 10);
```

诊断报告会有很多信息，我们要看 timer 的信息，定时器属于事件循环的阶段之一，所以定位到 libuv 这个数组里，以下报告则展示其句柄信息 is_active 就是活动的，firesInMsFromNow 是该计时器的触发还需要多长时间，当前示例大约还要 9 秒多执行。

```javascript
"libuv": [
  {
    "type": "timer",
    "is_active": true,
    "is_referenced": true,
    "address": "0x0000000105804100",
    "repeat": 0,
    "firesInMsFromNow": 9067,
    "expired": false
  }
]
```

参考：[Easily identify problems in Node.js applications with Diagnostic Report](https://developer.ibm.com/articles/easily-identify-problems-in-your-nodejs-apps-with-diagnostic-report/)

## 诊断工具（report-toolkit）

[report-toolkit](https://ibm.github.io/report-toolkit) 是 IBM 开发的一款工具，用于简化 Node.js 的诊断报告的使用，使用它在某些情况下可帮助我们快速定位问题。

首先全局安装它，如下命令，之后会生成一个全局的可执行命令 `rtk`

```javascript
npm install report-toolkit --global
```

### inspect 命令

inspect 命令用于自动发现 Node.js 诊断报告中的潜在问题，如果检测出问题会输出一条信息，可能是警告。

```javascript
const format = function (bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};
const print = function() {
  const memoryUsage = process.memoryUsage();
  console.log(`heapTotal: ${format(memoryUsage.heapTotal)}, heapUsed: ${format(memoryUsage.heapUsed)}`);
}
const total = [];
setInterval(function() {
  total.push(new Array(20 * 1024 * 1024)); // 大内存占用
  print();
}, 1000)
```

执行 `node --report-on-fatalerror test.js` 后过一小会报 `avaScript heap out of memory` 错误同时会生成一份诊断报告，下面是我们使用 rtk 诊断工具检测得到如下结果：

![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1610631618917-219361e4-cb6d-4754-9ef0-e9896e8fd052.png#align=left&display=inline&height=106&margin=%5Bobject%20Object%5D&name=image.png&originHeight=212&originWidth=2020&size=55667&status=done&style=none&width=1010)

### diff 命令

diff 命令正如它的名字一样，是用来比较多个报告之间的不同。

![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1610632170157-7f3c3761-9452-4cc1-ae8e-03bb8816a814.png#align=left&display=inline&height=439&margin=%5Bobject%20Object%5D&name=image.png&originHeight=878&originWidth=2868&size=518271&status=done&style=none&width=1434)
关于诊断报告工具 `report-toolkit` 的更多使用指南参考 [report-toolkit Quick Start](https://ibm.github.io/report-toolkit/quick-start/#transforming-a-report)。

## Reference

- [Node.js 14 版本：新的诊断工具、功能和性能增强](https://developer.ibm.com/zh/languages/node-js/blogs/nodejs-14-ibm-release-blog/)
- [Easily identify problems in Node.js applications with Diagnostic Report](https://developer.ibm.com/articles/easily-identify-problems-in-your-nodejs-apps-with-diagnostic-report/)
- [Introducing report-toolkit for Node.js Diagnostic Reports](https://developer.ibm.com/technologies/node-js/articles/introducing-report-toolkit-for-nodejs-diagnostic-reports)
- [Node.js latest v14.x Diagnostic report](https://nodejs.org/dist/latest-v14.x/docs/api/report.html)
