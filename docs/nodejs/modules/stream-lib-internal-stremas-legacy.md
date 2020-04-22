# /lib/internal/streams/legacy.js 模块实现分析

## 声明构造函数 Stream

声明构造函数 Stream 继承于事件 events，此时也就拥有了 events 在原型中定义的属性，例如 on、emit 等方法。

```js
const {
  ObjectSetPrototypeOf,
} = primordials;

const EE = require('events');

function Stream(opts) {
  EE.call(this, opts);
}
ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
ObjectSetPrototypeOf(Stream, EE);
```

## 声明 pipe 方法，订阅 data 事件

在 Stream 的原型上声明 pipe 方法，订阅 data 事件，source 为可读流对象，dest 为可写流对象。

我们在使用 pipe 方法的时候也是监听的 data 事件，一边读取数据一边写入数据。

看下 ondata() 方法里的几个 API：

* dest.writable：如果调用 writable.write() 是安全的，则为 true
* dest.write(chunk)：接收 chunk 写入数据，如果内部的缓冲小于创建流时配置的 highWaterMark，则返回 true，否则返回 false 时应该停止向流写入数据，直到 'drain' 事件被触发。
* source.pause()：可读流会停止 data 事件，意味着此时暂停数据写入了。

之所以**调用 source.pause() 是为了防止读入数据过快来不及写入**，什么时候知道来不及写入呢，要看 dest.write(chunk) 什么时候返回 false，是根据创建流时传的 highWaterMark 属性，默认为 16384 (16kb)，对象模式的流默认为 16。

```js
Stream.prototype.pipe = function(dest, options) {
  const source = this;
  function ondata(chunk) {
    if (dest.writable && dest.write(chunk) === false && source.pause) {
      source.pause();
    }
  }
  source.on('data', ondata);
  ...
};
```

## 订阅 drain 事件

上面提到在 data 事件里，如果调用 dest.write(chunk) 返回 false，就会调用 source.pause() 停止数据流动，什么时候再次开启呢？

如果说可以继续写入事件到流时会触发 drain 事件，看下 ondrain 方法的几个 API：

* source.readable：如果可以安全地调用 readable.read()，则为 true，例如数据未读到末尾，就会返回 true，表示是可读的。
* source.resume()：将被暂停的可读流恢复触发 'data' 事件，并将流切换到流动模式

```js
Stream.prototype.pipe = function(dest, options) {
  ...
  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);
};
```

## 选项指定 end 属性，订阅 end、close 事件

这个注释：如果 end 选项没有被提供，可读流订阅 end 或 close 事件，后续将会触发该事件，执行 dest.end 方法，仅被调用一次，didOnEnd 变量做了控制。主要是为了关闭可写流的 fd。

在之前的一篇文章中讲过如果将可读流的 end 方法设置为 false，那么我们就要显示的关闭可写流，否则会造成内存泄漏，可以参考文章 [Nodejs 中基于 Stream 的多文件合并实现](https://mp.weixin.qq.com/s/0pgIQLynNOjHMj76yK4IPQ)

**end、close 两个事件：**
* close：当流或其底层资源（比如文件描述符）被关闭时触发 'close' 事件。
* end：当可读流中没有数据可供消费时触发。

**可写流的 end、destroy 方法：**
* dest.end()：表明已没有数据要被写入可写流，进行关闭，之后再调用 stream.write() 会导致错误。
* dest.destroy()：销毁流。

```js
Stream.prototype.pipe = function(dest, options) {
  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  let didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;
    dest.end();
  }
  
  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }
}
```

## 订阅可读流与可写流的 error 事件

可读流、可写流发生错误的时候触发 error 事件，调用 onerror() 方法，首先移除可读流、可写流订阅的所有事件。

```js
Stream.prototype.pipe = function(dest, options) {
  // Don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // Remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }
}
```

## 触发 pipe 事件

在 pipe 方法里面最后还会触发一个 pipe 事件，传入可读流对象

```js
Stream.prototype.pipe = function(dest, options) {
  const source = this;
	dest.emit('pipe', source);
	...
};
```

在应用层使用的时候可以在可写流上订阅 pipe 事件，做一些判断，具体可参考官网给的这个示例 [stream_event_pipe](http://nodejs.cn/api/stream.html#stream_event_pipe)

## 支持链式调用

最后返回 dest，支持类似 unix 的用法：A.pipe(B).pipe(C)

```js
Stream.prototype.pipe = function(dest, options) {
	// Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};
```