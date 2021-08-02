# 注释掉 on('data') 请求为什么一直挂着？— 了解 Node.js Stream 的两种模式

这是来自「**Nodejs技术栈**」交流群一位读者朋友提的一个问题，“**如果注释掉 req.on('data') 事件监听，end 事件就收不到了，进而永远也不会执行 res.end()，请求会被一直挂着，为什么？**”。

如果你读到这里，也可以先思考下这个问题！

```javascript
const http = require('http');
http.createServer((req, res) => {
  let data = '';
	// req.on('data', chunk => {
	// 	data += chunk.toString();
	// });
  req.on('end', () => {
    res.end(data);
  });
}).listen(3000);
```

Node.js 的可读流对象提供了两种模式：流动模式（flowing）、暂停模式（paused），如果你使用管道 pipe() 或异步迭代可能不会关注到这个问题，在它们的内部实现中已经处理好了，如果你是基于事件的 API 来处理流，可能会有这些疑问。

## 流动模式（flowing）

流动模式下数据自动从底层系统获取，并通过 EventEmitter 提供的事件接口，尽可能快的提供给应用程序。
​
需要注意的是**所有的可读流一开始都处于暂停模式**，要切换为流动模式，可通过以下几种方式实现：

### 一：注册 'data' 事件

为可读流对象注册一个 'data' 事件，传入事件处理函数，会把流切换为流动模式，在数据可用时会立即把数据块传送给注册的事件处理函数。

这也是上面的疑问，为什么注释掉 'data' 事件，请求就会一直被挂起。

```javascript
req.on('data', chunk => {
 	data += chunk.toString();
});
```

### 二：stream.pipe() 方法

调用 `pipe()` 方法将数据发送到可写流。

```javascript
readable.pipe(writeable)
```

可读流的 pipe() 方法实现中也是注册了 'data' 事件，一边读取数据一边写入数据至可写流。可以参见笔者之前的这篇文章 [Node.js Stream 模块 pipe 方法使用与实现原理分析](https://mp.weixin.qq.com/s/neFMEyB2wQlnJcVrSvD42w)。

```javascript
Readable.prototype.pipe = function(dest, options) {
  const src = this;
  src.on('data', ondata);
  function ondata(chunk) {
    const ret = dest.write(chunk);
    if (ret === false) {
      ...
      src.pause();
    }
  }
  ...
};
```

### 三：stream.resume() 方法

stream.resume() 将处于暂停模式的可读流，恢复触发 'data' 事件，切换为流动模式。

对一开始的示例做一个改造，先调用 stream.resume() 用来耗尽流中的数据，但此时没有做任何的数据处理，之后会收到 end 事件。

```javascript
const http = require('http');
http.createServer((req, res) => {
  req.resume();
  req.on('end', () => {
    res.end('Ok!');
  });
}).listen(3000);
```

### 四：异步迭代

无需注册事件监听函数，使用 for...await of 遍历可读流，写法上也很简单。下例，因为用到**顶级 await 特性，**需要在 ES Modules 规范中使用。

```javascript
// app.mjs
import { createServer as server } from 'http';
import { on } from 'events';
const ee = on(server().listen(3000), 'request');
for await (const [{ url }, res] of ee) {
	res.end('OK!');
}
```

## 暂停模式

暂停模式也是流一开始时所处的模式，该模式下会触发 `'readable'` 事件，表示流中有可读取的数据，我们需要不断调用 read() 方法拉取数据，直到返回 null，表示缓冲区中的数据已被耗尽，在 read() 返回 null 后，会再次触发  `'readable'` 事件，表示仍有可读取的数据，如果此时停止 read() 方法调用，同样的请求也会被挂起。

`stream.read(size)` 方法从流缓冲区拉取数据，每次返回指定 size 大小的数据，如果不指定 size 则返回内部所有缓冲的数据。

```javascript
const http = require('http');
http.createServer((req, res) => {
  let data = '';
  let chunk;
  req.on('readable', () => {
    while (null !== (chunk = req.read())) {
      data += chunk.toString();
    }
  })
  req.on('end', () => {
    res.end(data);
  });
}).listen(3000);
```

## 背压问题思考🤔

以流的形式从可读流拉取数据到可写流，通常**从磁盘读取数据的速度比磁盘写入的速度是快的，如果可写流来不及消费数据造成数据积压（专业术语会称呼这个问题为 “背压”）会怎么样？**也是来自「Nodejs技术栈」交流群读者朋友的疑问，可以思考下，答案可以写在评论区，感兴趣的关注下「Nodejs技术栈」下一次讲解。

## 总结

流刚开始处于暂停模式，所以注释掉 req.on('data') 事件监听，请求才会一直挂起。
​
在基于流的方式读取文件时，之前通常使用注册 'data' 事件处理函数的方式从可读流中拉取数据，现在 Node.js 支持了异步迭代，更推荐你使用 `for...await of` 这种方式来读取数据，代码看起来也会更简洁，同步编码思维让人也能更好的理解。
​