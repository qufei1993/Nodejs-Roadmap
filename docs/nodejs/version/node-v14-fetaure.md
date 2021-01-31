# 一起来看看 Node.js v14.x LTS 中的这些新功能

![](https://cdn.nlark.com/yuque/0/2021/png/335268/1612083036565-194100b8-d2fe-4032-b6d6-8288f391da58.png#align=left&display=inline&height=383&margin=%5Bobject%20Object%5D&name=%E9%BB%98%E8%AE%A4%E6%96%87%E4%BB%B61612081754183.png&originHeight=383&originWidth=900&size=143201&status=done&style=none&width=900)

**作者简介**：五月君，Software Designer，公众号「Nodejs技术栈」作者。

Node.js 是一个基于 [Chrome V8 引擎](https://v8.dev/) 的 JavaScript 运行时。在 2020 年 10 月 27 日 Node.js v14.15.0 LTS 版已发布，即长期支持版本，其中包含了很多很棒的新功能，以下内容也是基于笔者在日常 Node.js 工作和学习中所总结的，可能不全，同时也欢迎补充，有些功能之前也曾单独写过文章来介绍，接下让我们一起看看都有哪些新的变化？

## 目录

- Optional Chaining（可选链）
- Nullish Coalescing（空值合并）
- Intl.DisplayNames（国际化显示名称）
- Intl.DateTimeFormat（国际化处理日期时间格式）
- String.prototype.matchAll (throws on non-global regex)
- Async Local Storage（异步本地存储）
- ES Modules 支持
- Top-Level Await（顶级 await 支持）
- Diagnostic report（诊断报告）
- Stream
- 使用异步迭代器

## Optional Chaining（可选链）

如果我们使用 JavaScript 不管是用在前端或者 Node.js 服务端都会出现如下情况，因为我们有时是不确定 user 对象是否存在，又或者 user 对象里面的 address 是否存在，如果不这样判断， 可能会得到类似于 **Cannot read property 'xxx' of undefined 这样的类似错误**。

```javascript
const user = {
  name: 'Tom',
  address: {
    city: 'ZhengZhou'
  }
}
if (user && user.address) {
  console.log(user.address.city)
}
```

现在我们有一种优雅的写法 "可选链操作符"，不必明确的验证链中的每个引用是否有效，以符号 "**?.**" 表示，在引用为 null 或 undefined 时不会报错，会发生短路返回 undefined。

```javascript
user.address?.city
user.address?.city?.length

// 结合 ?.[] 的方式访问相当于 user.address['city']
user.address?.['city']

// 结合 delete 语句使用，仅在 user.address.city 存在才删除
delete user.address?.city
```

参考 [v8.dev/features/optional-chaining](https://v8.dev/features/optional-chaining)

## Nullish Coalescing（空值合并）

逻辑或操作符（||）会在左侧为假值时返回右侧的操作符，例如我们传入一个属性为 enabled:0 我们期望输出左侧的值，则是不行的。

```javascript
function Component(props) {
  const enable = props.enabled || true; // true
}
Component({ enabled: 0 })
```

现在我们可以使用 **空值合并操作符（??）**来实现，仅当左侧为 undefined 或 null 时才返回右侧的值。

```javascript
function Component(props) {
  const enable = props.enabled ?? true; // 0
}

Component({ enabled: 0 })
```

参考：[v8.dev/features/nullish-coalescing](https://v8.dev/features/nullish-coalescing)

## Intl.DisplayNames（国际化显示名称）

对于国际化应用需要用到的语言、区域、货币、脚本的名称，现在 JavaScript 开发者可以使用 Intl.DisplayNames API 直接访问这些翻译，使应用程序更轻松的显示本地化名称。

### Language（语言）

```javascript
let longLanguageNames = new Intl.DisplayNames(['zh-CN'], { type: 'language' });
longLanguageNames.of('en-US'); // 美国英语
longLanguageNames.of('zh-CN'); // 中文（中国）

longLanguageNames = new Intl.DisplayNames(['en'], { type: 'language' });
longLanguageNames.of('en-US'); // American English
longLanguageNames.of('zh-CN'); // Chinese (China)
```

### Region（区域）

```javascript
let regionNames = new Intl.DisplayNames(['zh-CN'], {type: 'region'});
regionNames.of('US'); // 美国
regionNames.of('419'); // 拉丁美洲

regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
regionNames.of('US'); // United States
regionNames.of('419'); // Latin America
```

### Currency（货币）

```javascript
let currencyNames = new Intl.DisplayNames(['zh-CN'], {type: 'currency'});
currencyNames.of('CNY'); // 人民币
currencyNames.of('USD'); // 美元

currencyNames = new Intl.DisplayNames(['en'], {type: 'currency'});
currencyNames.of('CNY'); // Chinese Yuan
currencyNames.of('USD'); // US Dollar
```

### Script（脚本）

```javascript
let scriptNames = new Intl.DisplayNames(['zh-CN'], {type: 'script'});
scriptNames.of('Hans'); // 简体
scriptNames.of('Latn'); // 拉丁文

scriptNames = new Intl.DisplayNames(['en'], {type: 'script'});
scriptNames.of('Hans'); // Simplified
scriptNames.of('Latn'); // Latin
```

参考：[v8.dev/features/intl-displaynames](https://v8.dev/features/intl-displaynames) 上述实例用到的国家代号和 code 都可从参考地址获取。

## Intl.DateTimeFormat（国际化处理日期时间格式）

Intl.DateTimeFormat API 用来处理特定语言环境的日期格式。

```javascript
const date = new Date();

// Sunday, January 10, 2021 at 9:02:29 PM GMT+8
new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long'}).format(date)

// 21/1/10 中国标准时间 下午9:02:29.315
new Intl.DateTimeFormat('zh-CN', {
  year: '2-digit',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  fractionalSecondDigits: 3,
  timeZoneName: 'long'
}).format(date)
```

参考: [Intl/DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)

## String.prototype.matchAll (throws on non-global regex)

matchAll() 返回一个包含所有匹配正则表达式的结果，返回值为一个不可重用（不可重用意思为读取完之后需要再次获取）的迭代器。

matchAll() 方法在 Node.js v12.4.0 以上版本已支持，该方法有个限制，如果设置的正则表达式没有包含全局模式 `g` ，在 Node.js v14.5.0 之后的版本如果没有提供会抛出一个 TypeError 异常。

```javascript
// const regexp = RegExp('foo[a-z]*','g'); // 正确
const regexp = RegExp('foo[a-z]*'); // 错误，没有加全局模式
const str = 'table football, foosball, fo';
const matches = str.matchAll(regexp); // TypeError: String.prototype.matchAll called with a non-global RegExp argument

for (const item of matches) {
  console.log(item);
}
```

参考：[ES2020-features-String-prototype-matchAll-throws-on-non-global-regex](https://node.green/#ES2020-features-String-prototype-matchAll-throws-on-non-global-regex)

## Async Local Storage（异步本地存储）

Node.js Async Hooks 模块提供了 API 用来追踪 Node.js 程序中异步资源的声明周期，在最新的 v14.x LTS 版本中新增加了一个 AsyncLocalStorage 类可以方便实现上下文本地存储，在异步调用之间共享数据，对于实现日志链路追踪场景很有用。

下面是一个 HTTP 请求的简单示例，模拟了异步处理，并且在日志输出时去追踪存储的 id。

```javascript
const http = require('http');
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();
function logWithId(msg) {
  const id = asyncLocalStorage.getStore();
  console.log(`${id !== undefined ? id : '-'}:`, msg);
}
let idSeq = 0;
http.createServer((req, res) => {
  asyncLocalStorage.run(idSeq++, () => {
    logWithId('start');
    setImmediate(() => {
      logWithId('processing...');
      setTimeout(() => {
        logWithId('finish');
        res.end();
      }, 2000)
    });
  });
}).listen(8080);
```

下面是运行结果，我在第一次调用之后直接调用了第二次，可以看到我们存储的 id 信息与我们的日志一起成功的打印了出来。

![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1610371186959-15564bb5-c5c2-4922-82d4-c905ff934aae.png#align=left&display=inline&height=195&margin=%5Bobject%20Object%5D&name=image.png&originHeight=390&originWidth=2126&size=113876&status=done&style=none&width=1063)

便利性的同时也会牺牲一些性能上的代价，关于 AsyncLocalStorage 的详细使用介绍参见笔者的另一篇文章 “[在 Node.js 中使用 async hooks 模块的 AsyncLocalStorage 类处理请求上下文](https://mp.weixin.qq.com/s/DIDQaJgQcVwsdnbjx7LN_w)” 中的介绍。

## ES Modules 支持

ES Modules 的支持总体上来说是个好事，进一步的规范了 Node.js 与浏览器的模块生态，使之进一步趋同，同时避免了进一步的分裂。

在当前 Node.js v14.x LTS 版本中已移除试验性支持，现在使用无需使用标志了，它使用 import、export 关键字，两种使用方式：

### 使用 .mjs 扩展名

```javascript
// caculator.mjs
export function add (a, b) {
  return a + b;
};

// index.mjs
import { add } from './caculator.js';

console.log(add(4, 2)); // 6
```

### 告诉 Node.js 将 JavaScript 代码视为 ES Modules

默认情况下 Node.js 将 JavaScript 代码视为 CommonJS 规范，所以我们要在上面使用扩展名为 .mjs 的方式来声明，除此之外我们还可以在 package.json 文件中 `设置 type 字段为 module` 或在运行 node 时加上标志 --input-type=module 告诉 Node.js 将 JavaScript 代码视为 ES Modules。 

```javascript
// package.json
{
  "name": "esm-project",
  "type": "module",
  ...
}
```

前端的同学可能会对以上使用 ES Modules 的方式很熟悉。

详细使用参见笔者在文章 “[在 Nodejs 中 ES Modules 使用入门讲解](https://mp.weixin.qq.com/s/zrx0eFsojjDYV3EE6Y62RA)” 中的介绍。

## Top-Level Await（顶级 await 支持）

顶级 await 支持在异步函数之外使用 await 关键字，在 Node.js v14.x LTS 版本中已去掉试验性支持，现在使用也不再需要设置标志。

```javascript
import fetch from 'node-fetch';
const res = await fetch(url)
```

也可以像调用函数一样动态的导入模块。

```javascript
const myModule = await import('./my-module.js');
```

对于异步资源，之前我们必须在 async 函数内才可使用 await，这对一些在文件顶部需要实例化的资源可能会不
好操作，现在有了顶级 await 我们可以方便的在文件顶部对这些异步资源做一些初始化操作。

详细使用参见笔者在文章 “[Nodejs v14.3.0 发布支持顶级 Await 和 REPL 增强功能](https://mp.weixin.qq.com/s?__biz=MzIyNDU2NTc5Mw==&mid=2247485149&idx=1&sn=5e96f0e6141d5d3ba446687ca5aa90f1&scene=21#wechat_redirect)” 中的介绍。

## Diagnostic report（诊断报告）

Diagnostic report 是 Node.js v14.x LTS 提供的一个稳定功能，在某些情况下会生成一个 JSON 格式的诊断报告，可用于开发、测试、生产环境。报告会提供有价值的信息，包括：JavaScript 和本机堆栈信息、堆统计信息、平台信息、资源使用情况等，帮助用户快速追踪问题。

[https://github.com/IBM/report-toolkit](https://github.com/IBM/report-toolkit) 是 IBM 开发的一个款工具，用于简化报告工具的使用，如下是一个简单 Demo 它会造成服务的内存泄漏。

```javascript
const total = [];
setInterval(function() {
  total.push(new Array(20 * 1024 * 1024)); // 大内存占用，不会被释放
}, 1000)
```

最终生成的 JSON 报告被 [report-toolkit](https://github.com/IBM/report-toolkit) 工具诊断的结果可能是下面这样的。

![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1612011929059-b63563e5-9a55-4ab0-b3bf-165dadb4310b.png#align=left&display=inline&height=57&margin=%5Bobject%20Object%5D&name=image.png&originHeight=113&originWidth=1080&size=103596&status=done&style=none&width=540)

详细使用参见笔者在文章 “[在 Node.js 中使用诊断报告快速追踪问题](https://mp.weixin.qq.com/s/FHivPGyuV8ySV_YZhG_qHQ)” 中的介绍。

## Stream

新版本中包含了对 Stream 的一些更改，旨在提高 Stream API 的一致性，以消除歧义并简化 Node.js 核心各个部分的行为，例如：

- http.OutgoingMessage 与 stream.Writable 类似
- net.Socket 的行为与 stream.Duplex 完全相同
- 一个显著的变化 autoDestroy 的默认值为 true，使流在结束之后始终调用 `_destroy`

参考：[Node.js version 14 available now#Stream ](https://nodejs.medium.com/node-js-version-14-available-now-8170d384567e)

## 使用异步迭代器

使用异步迭代器我们可以对 Node.js 中的事件、Stream 亦或者 MongoDB 返回数据遍历，这是一件很有意思的事情，尽管它不是 Node.js v14.x 中新提出的功能，例如 event.on 是在 Node.js v12.16.0 才支持的，这些目前看到的介绍还不太多，因此我想在这里做下简单介绍。

### 在 Events 中使用

Node.js v12.16.0 中新增了 events.on(emitter, eventName) 方法，返回一个迭代 eventName 事件的异步迭代器，例如启动一个 Node.js 服务可以如下这样写，想知道它的原理的可以看笔者下面提到的相关文章介绍。

```javascript
import { createServer as server } from 'http';
import { on } from 'events';
const ee = on(server().listen(3000), 'request');
for await (const [{ url }, res] of ee)
  if (url === '/hello')
    res.end('Hello Node.js!');
  else
    res.end('OK!');
```

### 在 Stream 中使用

以往我们可以通过 on('data') 以事件监听的方式读取数据，通过异步迭代器可以一种更简单的方式实现。

```javascript
async function readText(readable) {
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}
```

目前在 JavaScript 中还没有被默认设定 `[Symbol.asyncIterator]` 属性的内建对象，在 Node.js 的一些模块 Events、Stream 中是可使用的，另外你还可以用它来遍历 MongoDB 的返回结果。

关于异步迭代器详细使用参见笔者在文章 “[探索异步迭代器在 Node.js 中的使用](https://mp.weixin.qq.com/s/PDCZ5FreFJDJDqpvOe3xKQ)” 中的介绍。
