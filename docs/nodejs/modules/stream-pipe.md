# Node.js Stream 模块 pipe 方法使用与实现原理分析

![](https://imgkr2.cn-bj.ufileos.com/7da04e2f-6127-4686-96e9-295d5e9c4ba5.png?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=KDwx9gUx5WUc8sb1SrSGM3KNTD0%253D&Expires=1614600665)

**作者简介**：五月君，Software Designer，公众号「Nodejs技术栈」作者。

通过流我们可以将一大块数据拆分为一小部分一点一点的流动起来，而无需一次性全部读入，在 Linux 下我们可以通过 `|` 符号实现，类似的在 Nodejs 的 Stream 模块中同样也为我们提供了 `pipe()` 方法来实现。

## 1. Stream pipe 基本示例

选择 Koa 来实现这个简单的 Demo，因为之前有人在 “Nodejs技术栈” 交流群问过一个问题，怎么在 Koa 中返回一个 Stream，顺便在下文借此机会提下。

### 1.1 未使用 Stream pipe 情况

在 Nodejs 中 I/O 操作都是异步的，先用 util 模块的 promisify 方法将 fs.readFile 的 callback 形式转为 Promise 形式，这块代码看似没问题，但是它的体验不是很好，因为它是将数据一次性读入内存再进行的返回，当数据文件很大的时候也是对内存的一种消耗，类似内存泄漏这种问题也很容易出现，因此不推荐它。

```js
const Koa = require('koa');
const fs = require('fs');
const app = new Koa();
const { promisify } = require('util');
const { resolve } = require('path');
const readFile = promisify(fs.readFile);

app.use(async ctx => {
  try {
    ctx.body = await readFile(resolve(__dirname, 'test.json'));
  } catch(err) { ctx.body = err };
});

app.listen(3000);
```

### 1.2 使用 Stream pipe 情况

下面，再看看怎么通过 Stream 的方式在 Koa 框架中响应数据

```js
...
app.use(async ctx => {
  try {
    const readable = fs.createReadStream(resolve(__dirname, 'test.json'));
    ctx.body = readable;
  } catch(err) { ctx.body = err };
});
```

以上在 **Koa 中直接创建一个可读流赋值给 ctx.body 就可以了**，你可能疑惑了为什么没有 pipe 方法，因为框架给你封装好了，不要被表象所迷惑了，看下相关源码：

```js
// https://github.com/koajs/koa/blob/master/lib/application.js#L256
function respond(ctx) {
  ...
  let body = ctx.body;
  if (body instanceof Stream) return body.pipe(res);
  ...
}
```

没有神奇之处，框架在返回的时候做了层判断，因为 res 是一个可写流对象，如果 body 也是一个 Stream 对象（此时的 Body 是一个可读流），则使用 body.pipe(res) 以流的方式进行响应。

### 1.3 使用 Stream VS 不使用 Stream

![](https://images2015.cnblogs.com/blog/561179/201701/561179-20170126170225816-1851442511.gif)

![](https://images2015.cnblogs.com/blog/561179/201701/561179-20170126172845566-1089400487.gif)

看到一个图片，不得不说画的实在太萌了，来源 https://www.cnblogs.com/vajoy/p/6349817.html

## 2. pipe 的调用过程与实现原理

以上最后以流的方式响应数据最核心的实现就是使用 pipe 方法来实现的输入、输出，本节的重点也是研究 pipe 的实现，最好的打开方式通过阅读源码一起来看看吧。

### 2.1 顺藤摸瓜

在应用层我们调用了 fs.createReadStream() 这个方法，顺藤摸瓜找到这个方法创建的可读流对象的 pipe 方法实现，以下仅列举核心代码实现，基于 Nodejs v12.x 源码。

#### 2.1.1 /lib/fs.js

导出一个 createReadStream 方法，在这个方法里面创建了一个 ReadStream 可读流对象，且 ReadStream 来自 internal/fs/streams 文件，继续向下找。

```js
// https://github.com/nodejs/node/blob/v12.x/lib/fs.js
// 懒加载，主要在用到的时候用来实例化 ReadStream、WriteStream ... 等对象
function lazyLoadStreams() {
  if (!ReadStream) {
    ({ ReadStream, WriteStream } = require('internal/fs/streams'));
    [ FileReadStream, FileWriteStream ] = [ ReadStream, WriteStream ];
  }
}

function createReadStream(path, options) {
  lazyLoadStreams();
  return new ReadStream(path, options); // 创建一个可读流
}

module.exports = fs = {
  createReadStream, // 导出 createReadStream 方法
  ...
}
```

#### 2.1.2 **/lib/internal/fs/streams.js**

这个方法里定义了构造函数 ReadStream，且在原型上定义了 open、_read、_destroy 等方法，并没有我们要找的 pipe 方法。

但是呢**通过 ObjectSetPrototypeOf 方法实现了继承，ReadStream 继承了 Readable 在原型中定义的函数，接下来继续查找 Readable 的实现**。

```js
// https://github.com/nodejs/node/blob/v12.x/lib/internal/fs/streams.js
const { Readable, Writable } = require('stream');

function ReadStream(path, options) {
  if (!(this instanceof ReadStream))
    return new ReadStream(path, options);

  ...
  Readable.call(this, options);
  ...
}
ObjectSetPrototypeOf(ReadStream.prototype, Readable.prototype);
ObjectSetPrototypeOf(ReadStream, Readable);

ReadStream.prototype.open = function() { ... };

ReadStream.prototype._read = function(n) { ... };;

ReadStream.prototype._destroy = function(err, cb) { ... };
...

module.exports = {
  ReadStream,
  WriteStream
};
```

#### 2.1.3 /lib/stream.js

在 stream.js 的实现中，有条注释：**在 Readable/Writable/Duplex/... 之前导入 Stream，原因是为了避免 cross-reference(require)**，为什么会这样？

第一步 stream.js 这里将 require('internal/streams/legacy') 导出复制给了 Stream。

在之后的 _stream_readable、Writable、Duplex ... 模块也会反过来引用 stream.js 文件，具体实现下面会看到。

Stream 导入了 internal/streams/legacy

**上面 /lib/internal/fs/streams.js 文件从 stream 模块获取了一个 Readable 对象，就是下面的 Stream.Readable 的定义。**

```js
// https://github.com/nodejs/node/blob/v12.x/lib/stream.js
// Note: export Stream before Readable/Writable/Duplex/...
// to avoid a cross-reference(require) issues
const Stream = module.exports = require('internal/streams/legacy');

Stream.Readable = require('_stream_readable');
Stream.Writable = require('_stream_writable');
Stream.Duplex = require('_stream_duplex');
Stream.Transform = require('_stream_transform');
Stream.PassThrough = require('_stream_passthrough');
...
```

#### 2.1.4 /lib/internal/streams/legacy.js

上面的 Stream 等于 internal/streams/legacy，首先继承了 Events 模块，之后呢在原型上定义了 pipe 方法，刚开始看到这里的时候以为实现是在这里了，但后来看 _stream_readable 的实现之后，发现 _stream_readable 继承了 Stream 之后自己又重新实现了 pipe 方法，那么疑问来了这个模块的 pipe 方法是干嘛的？什么时候会被用？翻译文件名 “legacy=遗留”？有点没太理解，难道是遗留了？有清楚的大佬可以指点下，也欢迎在公众号 “Nodejs技术栈” 后台加我微信一块讨论下！

```js
// https://github.com/nodejs/node/blob/v12.x/lib/internal/streams/legacy.js
const {
  ObjectSetPrototypeOf,
} = primordials;
const EE = require('events');
function Stream(opts) {
  EE.call(this, opts);
}
ObjectSetPrototypeOf(Stream.prototype, EE.prototype);
ObjectSetPrototypeOf(Stream, EE);

Stream.prototype.pipe = function(dest, options) {
  ...
};

module.exports = Stream;
```

#### 2.1.5 /lib/_stream_readable.js

在 _stream_readable.js 的实现里面定义了 Readable 构造函数，且继承于 Stream，这个 Stream 正是我们上面提到的 /lib/stream.js 文件，而在 /lib/stream.js 文件里加载了 internal/streams/legacy 文件且重写了里面定义的 pipe 方法。

经过上面一系列的分析，终于找到可读流的 pipe 在哪里，同时也更进一步的认识到了在创建一个可读流时的执行调用过程，下面将重点来看这个方法的实现。

```js
module.exports = Readable;
Readable.ReadableState = ReadableState;

const EE = require('events');
const Stream = require('stream');

ObjectSetPrototypeOf(Readable.prototype, Stream.prototype);
ObjectSetPrototypeOf(Readable, Stream);

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  ...
  Stream.call(this, options); // 继承自 Stream 构造函数的定义
}
...
```

### 2.2 _stream_readable 实现分析

#### 2.2.1 声明构造函数 Readable

声明构造函数 Readable 继承 Stream 的构造函数和原型。

Stream 是 /lib/stream.js 文件，上面分析了，这个文件继承了 events 事件，此时也就拥有了 events 在原型中定义的属性，例如 on、emit 等方法。

```js
const Stream = require('stream');
ObjectSetPrototypeOf(Readable.prototype, Stream.prototype);
ObjectSetPrototypeOf(Readable, Stream);

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  ...

  Stream.call(this, options);
}
```

#### 2.2.2 声明 pipe 方法，订阅 data 事件

在 Stream 的原型上声明 pipe 方法，订阅 data 事件，src 为可读流对象，dest 为可写流对象。

我们在使用 pipe 方法的时候也是监听的 data 事件，一边读取数据一边写入数据。

看下 ondata() 方法里的几个核心实现：

* **dest.write(chunk)**：接收 chunk 写入数据，如果内部的缓冲小于创建流时配置的 highWaterMark，则返回 true，否则**返回 false 时应该停止向流写入数据，直到 'drain' 事件被触发**。
* **src.pause()**：可读流会停止 data 事件，意味着此时暂停数据写入了。

之所以**调用 src.pause() 是为了防止读入数据过快来不及写入**，什么时候知道来不及写入呢，要看 dest.write(chunk) 什么时候返回 false，是根据创建流时传的 highWaterMark 属性，默认为 16384 (16KB)，对象模式的流默认为 16。

注意：**是 16KB 不是 16Kb**，也是之前犯的一个错误，大写的 B 和小写的 b 在这里是有区别的。计算机中所有数据都以 0 和 1 表示，其中 0 或 1 称作一个位（bit），用小写的 b 表示。大写的 B 表示字节（byte），`1byte = 8bit`，大写 K 表示千，所以是千个位（Kb）和千个字节（KB），**一般都是使用 KB 表示一个文件的大小**。

```js
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

#### 2.2.3 订阅 drain 事件，继续流动数据

上面提到在 data 事件里，如果调用 dest.write(chunk) 返回 false，就会调用 src.pause() 停止数据流动，什么时候再次开启呢？

如果说可以继续写入事件到流时会触发 drain 事件，也是在 dest.write(chunk) 等于 false 时，如果 ondrain 不存在则注册 drain 事件。

```js
Readable.prototype.pipe = function(dest, options) {
  const src = this;
  src.on('data', ondata);
  function ondata(chunk) {
    const ret = dest.write(chunk);
    if (ret === false) {
      ...
      if (!ondrain) {
        // When the dest drains, it reduces the awaitDrain counter
        // on the source.  This would be more elegant with a .once()
        // handler in flow(), but adding and removing repeatedly is
        // too slow.
        ondrain = pipeOnDrain(src);
        dest.on('drain', ondrain);
      }
      src.pause();
    }
  }
  ...
};

// 当可写入流 dest 耗尽时，它将会在可读流对象 source 上减少 awaitDrain 计数器
// 为了确保所有需要缓冲的写入都完成，即 state.awaitDrain === 0 和 src 可读流上的 data 事件存在，切换流到流动模式
function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    const state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

// stream.read() 从内部缓冲拉取并返回数据。如果没有可读的数据，则返回 null。在可读流上 src 还有一个 readable 属性，如果可以安全地调用 readable.read()，则为 true
function flow(stream) {
  const state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null);
}
```

#### 2.2.4 触发 data 事件

调用 readable 的 resume() 方法，触发可读流的 'data' 事件，进入流动模式。

```js
Readable.prototype.pipe = function(dest, options) {
  const src = this;
  // Start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }
  ...
```

然后实例上的 resume（Readable 原型上定义的）会在调用 resume() 方法，在该方法内部又调用了 resume_()，最终执行了 stream.read(0) 读取了一次空数据（size 设置的为 0），将会触发实例上的 _read() 方法，之后会在触发 data 事件。

```js
function resume(stream, state) {
  ...
  process.nextTick(resume_, stream, state);
}

function resume_(stream, state) {
  debug('resume', state.reading);
  if (!state.reading) {
    stream.read(0);
  }

  ...
}
```

#### 2.2.5 订阅 end 事件

end 事件：当可读流中没有数据可供消费时触发，调用 onend 函数，执行 dest.end() 方法，表明已没有数据要被写入可写流，进行关闭（关闭可写流的 fd），之后再调用 stream.write() 会导致错误。

```js
Readable.prototype.pipe = function(dest, options) {
  ...
  const doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  const endFn = doEnd ? onend : unpipe;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  ...

  function onend() {
    debug('onend');
    dest.end();
  }
}
```

#### 2.2.6 触发 pipe 事件

在 pipe 方法里面最后还会触发一个 pipe 事件，传入可读流对象

```js
Readable.prototype.pipe = function(dest, options) {
  ...
  const source = this;
  dest.emit('pipe', src);
  ...
};
```

在应用层使用的时候可以在可写流上订阅 pipe 事件，做一些判断，具体可参考官网给的这个示例 [stream_event_pipe](http://nodejs.cn/api/stream.html#stream_event_pipe)

#### 2.2.7 支持链式调用

最后返回 dest，支持类似 unix 的用法：A.pipe(B).pipe(C)

```js
Stream.prototype.pipe = function(dest, options) {
  return dest;
};
```

## 3. 总结

本文总体分为两部分：

* 第一部分相对较基础，讲解了 Nodejs Stream 的 pipe 方法在 Koa2 中是怎么去应用的。
* 第二部分仍以 Nodejs Stream pipe 方法为题，查找它的实现，以及对源码的一个简单分析，其实 pipe 方法核心还是要去监听 data 事件，向可写流写入数据，如果内部缓冲大于创建流时配置的 highWaterMark，则要停止数据流动，直到 drain 事件触发或者结束，当然还要监听 end、error 等事件做一些处理。

## 4. Reference

* nodejs.cn/api/stream.html
* cnodejs.org/topic/56ba030271204e03637a3870
* github.com/nodejs/node/blob/master/lib/_stream_readable.js