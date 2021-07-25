# request 已废弃 - 推荐一个超快的 Node.js HTTP Client undici

request 这是一个在之前几乎接触过 Node.js 的朋友都会用到的 HTTP 请求工具，有些朋友或许还不知道，这个工具在 2020 年 2 月 11 日已经标记为弃用，在 NPM 基本上搜索不到了，除非直接访问地址，参见 [issues#3142 Request’s Past, Present and Future](https://github.com/request/request/issues/3142)，在这之后 node-fetch、axios 也许是一个不错的选择，参见 [issues#3143 Alternative libraries to request](https://github.com/request/request/issues/3143) 对比了一些常用的 Node.js HTTP Client。
​

今天我想给大家**推荐的是一个新的 Node.js HTTP Client undici，它比内置的 HTTP 模块还要快**，下文有基准测试数据。undici 团队致力于为 Node.js 开发快速、可靠且符合规范的 HTTP 客户端，且该项目位于 Node.js Github 组织下，其中的几位贡献者也是 Node.js 项目的贡献者，这个项目还是值得关注下的。

## 背景

“很多人仍然问我们为什么要构建 Node.js 核心 HTTP 堆栈的替代品——虽然它对他们来说效果很好。现实情况是，Node.js 核心 HTTP 堆栈存在基本设计问题，如果不破坏 API，就无法克服这些问题。在不破坏我们的大多数用户的情况下，我们无法修复某些错误或性能瓶颈——无论是在客户端还是服务器实现上，因为它们紧密相连。” 参考 [https://nodejs.medium.com/introducing-undici-4-1e321243e007](https://nodejs.medium.com/introducing-undici-4-1e321243e007)
​

## 基准测试
下面是一个在 Node.js 16 上做的一个基准测试，通过与最慢的数据做对比，之间相差还是挺大的。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1625785735717-fc4294fe-3944-4c16-b2a9-9d07aeba31e4.png#clientId=ub97153ab-6518-4&from=paste&height=579&id=u732008c8&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1158&originWidth=1408&originalType=binary&ratio=1&size=200798&status=done&style=none&taskId=u64dff026-c75d-4335-8a60-be06f72429d&width=704)
数据来源：[https://undici.nodejs.org/#/?id=benchmarks](https://undici.nodejs.org/#/?id=benchmarks)
## undici 基础使用
这是一个 NPM 模块，首先你需要安装且引用它，为了能够方便的使用 Top Level Await 这一特性，下文使用 ES Modules 模块规范。
```javascript
npm i undici -S
import undici from 'undici';
```
### 开启一个 Server
开始之前让我们先开启一个 Server，稍后我们使用 undici 的 HTTP 客户端请求本地的 Server 做一些测试。
```javascript
// server.mjs
import http from 'http';
const server = http.createServer((req, res) => {
  res.end(`Ok!`);   
});
server.listen(3000, () => {
	console.log('server listening at 3000 port');
});

// 终端启动
node server.mjs
```
### 使用 request 请求接口

它的返回结果支持异步迭代迭代器，你可以使用 for await...of 遍历返回的 body 数据。

不了解异步迭代器的可以参考 [探索异步迭代器在 Node.js 中的使用](https://mp.weixin.qq.com/s/PDCZ5FreFJDJDqpvOe3xKQ)。

```javascript
const {
  statusCode,
  headers,
  trailers,
  body
} = await undici.request('http://localhost:3000/api', {
  method: 'GET'
});
console.log('response received', statusCode)
console.log('headers', headers)
for await (const data of body) {
  console.log('data', data.toString());
}
console.log('trailers', trailers)
```
### 创建一个 client 实例请求接口

undici 提供了 Client 类，可以传入 URL 或 URL 对象，它仅包括协议、主机名、端口，用于预先创建一个基础通用的客户端请求实例。

我们还可以对返回结果监听 'data' 事件，获取响应的数据，就好比之前以流的方式从文件读取数据，监听 'data' 事件，不过现在以流的方式读取数据也支持异步迭代，还是参考 [**探索异步迭代器在 Node.js 中的使用**](https://mp.weixin.qq.com/s/PDCZ5FreFJDJDqpvOe3xKQ)。

```javascript
const client = new undici.Client('http://localhost:3000');
const { body } = await client.request({
  path: '/api',
  method: 'GET',
});
body.setEncoding('utf-8');
body.on('data', console.log);
body.on('end', () => console.log('end'));
```
### 使用 stream() 方法做接口代理

与 request 方法不同，client.stream 方法期望 factory 返回一个将写入 Response 的 Writable。当用户期望直接将 response body 传递到 Writable 时，通过避免创建一个中间的 Readable 来提高性能。
```javascript
const factory = ({ opaque: res }) => res;
const client = new undici.Client('http://localhost:3000');
http.createServer((req, res) => {
  client.stream({
    path: '/',
    method: 'GET',
    opaque: res
  }, factory, (err) => {
    if (err) {
      console.error('failure', err)
    } else {
      console.log('success')
    }
  });
}).listen(3010);
```
### 使用 stream 从网络读取一张图片写入本地
如果对上个例子 undici.stream 的使用还不了解的，在看看下面这个场景，首先从网络读取图片，返回值本身就是一个可读流对象，现在通过 opaque 指定一个可写流，这个时候图片在读取的过程中就会不断流入到可写流对象所指向的文件。
```javascript
const factory = ({ opaque: res }) => res;
const url = 'https://images.pexels.com/photos/3599228/pexels-photo-3599228.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500';
undici.stream(url, {
  opaque: fs.createWriteStream('./pexels-photo-3599228.jpeg')
}, factory, (err) => {
  if (err) {
    console.error('failure', err)
  } else {
    console.log('success')
  }
});
```
在之前是这样做的。
```javascript
import request from 'request';
import fs from 'fs';
const readable = request('https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1586785739&di=ba1230a76a1ebd25200448d5cf02ec40&src=http://bbs.jooyoo.net/attachment/Mon_0905/24_65548_2835f8eaa933ff6.jpg');
const writeable = fs.createWriteStream('./pexels-photo-3599228.jpeg');
readable.pipe(writeable)
readable.on('error', function(err) {
  writeable.close();
});
```
### 中止一个请求
可以使用控制器对象 AbortController 或 EventEmitter 中止一个客户端请求。要在 v15.x 之前的版本使用 AbortController 的需要先安装并导入该模块。最新的 v15.x 版本是不需要的，已默认支持。
```javascript
// npm i abort-controller
import AbortController from "abort-controller"

const abortController = new AbortController();
client.request({
  path: '/api',
  method: 'GET',
  signal: abortController.signal,
}, function (err, data) {
  console.log(err.name) // RequestAbortedError
  client.close();
});
abortController.abort();
```
除此之外，任何发出 'abort' 事件的 EventEmitter 实例，都可用作中止控制器。
```javascript
import { EventEmitter } from 'events';
const ee = new EventEmitter();
client.request({
  path: '/api',
  method: 'GET',
  signal: ee,
}, function (err, data) {
  console.log(err.name) // RequestAbortedError
  client.close();
});
ee.emit('abort');
```

## undici-fetch

这是一个构建在 undici 之上的 WHATWG fetch 实现，就像你之前使用 node-fetch 一样，你可以选择使用 [undici-fetch](https://github.com/Ethan-Arrowood/undici-fetch) 简单的处理一些请求。

```javascript
// npm i undici-fetch
import fetch from 'undici-fetch';
const res = await fetch('http://localhost:3000');
try {
  const json = await res.json();
  console.log(json);
} catch (err) {
  console.log(err);
}
```

## Reference

* [探索异步迭代器在 Node.js 中的使用](https://mp.weixin.qq.com/s/PDCZ5FreFJDJDqpvOe3xKQ)
* https://github.com/Ethan-Arrowood/undici-fetch
* https://github.com/nodejs/undici
