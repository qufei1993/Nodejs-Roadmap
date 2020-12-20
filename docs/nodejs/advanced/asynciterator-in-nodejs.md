# 探索异步迭代器在 Node.js 中的使用

![](./img/asynciterator-in-nodejs.png)

上一节讲解了迭代器的使用，如果对迭代器还不够了解的可以在回顾下[《从理解到实现轻松掌握 ES6 中的迭代器》](https://mp.weixin.qq.com/s/UI3r3u50vYkrUTVe2DS86A)，目前在 JavaScript 中还没有被默认设定 ```[Symbol.asyncIterator]``` 属性的内建对象，但是在 Node.js 中已有部分核心模块（Stream、Events）和一些第三方 NPM 模块（mongodb）已支持 Symbol.asyncIterator 属性。本文也是探索异步迭代器在 Node.js 中的都有哪些使用场景，欢迎留言探讨。

## 目录

* 在 Events 中使用 asyncIterator
  * events.on() 示例 1
  * events.on() 示例 2
  * events.on() 开启一个 Node.js 服务器
  * 解析 Node.js 源码对 events.on 异步迭代器的实现
* 在 Stream 中使用 asyncIterator
  * 异步迭代器 与 Readable
  * 从 Node.js 源码看 readable 是如何实现的 asyncIterator
  * 异步迭代器与 Writeable
* 在 MongoDB 中使用 asyncIterator
  * MongoDB 中的 cursor
  * MongoDB 异步迭代器实现源码分析
  * 使用 for await...of 遍历可迭代对象 cursor
  * 传送 cursor 到可写流

## 在 Events 中使用 asyncIterator

Node.js v12.16.0 中新增了 events.on(emitter, eventName) 方法，返回一个迭代 eventName 事件的异步迭代器。

### events.on() 示例 1

如下例所示， ```for await...of``` 循环只会输出 Hello 当触发 error 事件时会被 try catch 所捕获。

```javascript
const { on, EventEmitter } = require('events');

(async () => {
  const ee = new EventEmitter();
  const ite = on(ee, 'foo');

  process.nextTick(() => {
    ee.emit('foo', 'Hello');
    ee.emit('error', new Error('unknown mistake.'))
    ee.emit('foo', 'Node.js');
  });

  try {
    for await (const event of ite) {
      console.log(event); // prints ['Hello']
    }
  } catch (err) {
    console.log(err.message); // unknown mistake.
  }
})();
```

上述示例，如果 EventEmitter 对象实例 ee 触发了 error 事件，错误信息会被抛出并且退出循环，该实例注册的所有事件侦听器也会一并移除。

### events.on() 示例 2

**for await...of 内部块的执行是同步的，每次只能处理一个事件，即使你接下来还有会立即执行的事件，也是如此。如果是需要并发执行的则不建议使用，这个原因会在下面解析 events.on() 源码时给出答案**。

如下所示，虽然事件是按顺序同时触发了两次，但是在内部块模拟了 2s 的延迟，下一次事件的处理也会得到延迟。

```javascript
const ite = on(ee, 'foo');

process.nextTick(() => {
  ee.emit('foo', 'Hello');
  ee.emit('foo', 'Node.js');
  // ite.return(); // 调用后可以结束 for await...of 的遍历
  // ite.throw() // 迭代器对象抛出一个错误
});

try {
  for await (const event of ite) {
    console.log(event); // prints ['Hello'] ['Node.js']
    await sleep(2000);
  }
} catch (err) {
  console.log(err.message);
}

// Unreachable here
console.log('这里将不会被执行');
```

上例中最后一句代码是不会执行的，此时的迭代器会一直处于遍历中，虽然上面两个事件 emit 都触发了，但是迭代器并没有终止，什么时候终止呢？也就是当内部出现一些错误或我们手动调用可迭代对象的 return() 或 throw() 方法时迭代器才会终止。

### events.on() 开启一个 Node.js 服务器

之前一篇文章[《“Hello Node.js” 这一次是你没见过的写法》](https://mp.weixin.qq.com/s/PNr-lQOGRGPHa-k-wXkV1A)写过一段使用 events.on() 开启一个 HTTP 服务器的代码，在留言中当时有小伙伴对此提出疑惑，基于本章对异步迭代器在 events.on() 中使用的学习，可以很好的解释。

相关代码如下所示：

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

以上代码看似新颖，其核心实现就是使用 events.on() 返回 createServer() 对象 request 事件的异步可迭代对象，之后用 ```for await...of``` 语句遍历，客户端每一次请求，就相当于做了一次 ee.emit('request', Req, Res)。

由于内部块的执行是同步的，下一次事件处理需要依赖上次事件完成才可以执行，对于一个 HTTP 服务器需要考虑并发的，请不要使用上面这种方式！

### 解析 Node.js 源码对 events.on 异步迭代器的实现

events 模块直接导出了 on() 方法，这个 on() 方法主要是将异步迭代器与事件的 EventEmitter 类的实例对象做了结合，实现还是很巧妙的，以下对核心源码做下解释，理解之后你完全也可以自己实现一个 events.on()。

- 行 {1} ObjectSetPrototypeOf 是为对象设置一个新的原型，这个对象包含了 next()、return()、throw() 三个方法。
- 行 {2} 根据异步可迭代协议，可迭代对象必须要包含一个 Symbol.asyncIterator 属性，该属性是一个无参数的函数，返回可迭代对象本身，也就是下面代码中 SymbolAsyncIterator。
- 行 {3} 新的原型就是 ObjectSetPrototypeOf 的第二个参数 AsyncIteratorPrototype。
- 行 {4} eventTargetAgnosticAddListener 是对事件注册监听器，里面还是用的事件触发器对象的 on() 方法 emitter.on(name, listener) 。
- 行 {5} addErrorHandlerIfEventEmitter 判断事件名如果不等于 'error' 同时注册一个 error 事件的监听器，具体实现同行 {4}。
- 行 {6} eventHandler() 函数就是上面注册的监听器函数 listener 当有事件触发时执行该监听器函数，**与异步迭代器的结合就在这里**，当有新事件触发时会从 unconsumedPromises 数组里取出第一个元素执行，如果理解异步迭代器实现标准你会发现 PromiseResolve(createIterResult(args, false)) 就是异步迭代器对象 next() 方法返回值的标准定义。
- 下面继续看 unconsumedPromises 从何而来。

```javascript
module.exports = EventEmitter;
module.exports.on = on;

function on(emitter, event) {
  const unconsumedEvents = [];
  const unconsumedPromises = [];
  const iterator = ObjectSetPrototypeOf({ // {1}
    next() { .... },
    return() { ... },
    throw(err) { ... },
    [SymbolAsyncIterator]() { // {2}
      return this;
    }
  }, AsyncIteratorPrototype); // {3}
  eventTargetAgnosticAddListener(emitter, event, eventHandler); // {4}
  if (event !== 'error') {
    addErrorHandlerIfEventEmitter(emitter, errorHandler); // {5}
  }
  return iterator;
              
  function eventHandler(...args) { // {6}
    const promise = unconsumedPromises.shift();
    if (promise) {
      // 以下等价于 promise.resolve({ value: args, done: false });
      PromiseResolve(createIterResult(args, false));
    } else {
      // for await...of 遍历器内部块的执行是同步的，所以每次只能处理 1 个事件，如果同时触发多个事件，上次事件未完成剩下的事件会被保存至 unconsumedEvents 中，待上次事件完成后，遍历器会自动调用 iterator 对象的 next() 方法，消费所有未处理的事件。
      unconsumedEvents.push(args);
    }
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  ...
  emitter.on(name, listener);
}
```

以下是 iterator 对象的 next() 方法实现：

- 行 {1} 首先消费未读消息
- 行 {2} 判断如果是发生错误则抛出错误信息，例如 iterator 对象的 throw() 方法被调用后就会对 error 做赋值待下次遍历器调用 next() 此处代码就会被执行。
- 行 {3} 如果迭代器对象完成，返回的 Promise 对象 done 属性设置为 true，遍历器也就结束了，变量 finished 是由 iterator 对象的 return() 方法被调用之后设置的。
- 行 {4} **这个是上面提到的 unconsumedPromises 数据来源处**，例如当我们执行 ```for await...of``` 语句遍历异步迭代器对象时就会自动触发 iterator 对象的 next() 方法，执行到行 {4} 处会创建一个 Promise 对象但是 resolve 并没有被立即执行，而是先存放在 unconsumedPromises 数组中，所以在上面 ```#events.on() 示例 2#``` 提到一个问题，**```for await...of``` 遍历事件的异步迭代器对象时后面的代码块并不会被执行，** 当我们触发一个事件时才会在监听器函数里执行这个 resolve 函数，此时才会被释放，之后 ```for await...of``` 遍历器会自动再次执行 next() 方法，然后 new 一个新的 Promise 反复循环，直到事件对象抛出 error 事件或执行 iterator 对象的 return() 方法。
```javascript
const iterator = ObjectSetPrototypeOf({
  next() {
    // {1} 首先，我们会消费所有未读消息
    const value = unconsumedEvents.shift();
    if (value) {
      return PromiseResolve(createIterResult(value, false));
    }

    // {2} 如果发生一次 error 就会执行 Promise.reject 抛出一个错误，在这个错误发生后也会停止事件监听。
    if (error) {
      const p = PromiseReject(error);
      // Only the first element errors
      error = null;
      return p;
    }

    // {3} 如果迭代器对象完成，Promise.resolve done 设置为 true
    if (finished) {
      return PromiseResolve(createIterResult(undefined, true));
    }

    // {4} 等待直到一个事件发生
    return new Promise(function(resolve, reject) {
      unconsumedPromises.push({ resolve, reject });
    });
  }
  ...
}
```

## 在 Stream 中使用 asyncIterator

Node.js Stream 模块的可读流对象在 v10.0.0 版本试验性的支持了 ```[Symbol.asyncIterator]``` 属性，可以使用 ```for await...of``` 语句遍历可读流对象，在 v11.14.0 版本以上已 LTS 支持。

### 异步迭代器 与 Readable

借助 fs 模块创建一个可读流对象 readable。

```javascript
const fs = require('fs');
const readable = fs.createReadStream('./hello.txt', {
  encoding: 'utf-8',
  highWaterMark: 1
});
```

以往当我们读取一个文件时，需要监听 data 事件，拼接数据，在 end 事件里判断完成，如下所示：

```javascript
function readText(readable) {
  let data = '';
  return new Promise((resolve, reject) => {
    readable.on('data', chunk => {
      data += chunk;
    })
    readable.on('end', () => {
      resolve(data);
    });
    readable.on('error', err => {
      reject(err);
    });
  })
}
```

现在通过异步迭代器能以一种更简单的方式实现，如下所示：

```typescript
async function readText(readable) {
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}
```

现在我们可以调用 readText 做测试。

```typescript
(async () => {
  try {
    const res = await readText(readable);
    console.log(res); // Hello Node.js
  } catch (err) {
    console.log(err.message);
  }
})();
```

**使用 ```for await...of``` 语句遍历 readable，如果循环中因为 break 或 throw 一个错误而终止，则这个 Stream 也将被销毁**。

上述示例中 chunk 每次接收的值是根据创建可读流时 highWaterMark 这个属性决定的，为了能清晰的看到效果，在创建 readable 对象时我们指定了 highWaterMark 属性为 1 每次只会读取一个字符。

### 从 Node.js 源码看 readable 是如何实现的 asyncIterator
与同步的迭代器遍历语句 ```for...of``` 类似，用于 asyncIterator 异步迭代器遍历的 ```for await...of``` 语句在循环内部会默认调用可迭代对象 readable 的 Symbol.asyncIterator() 方法得到一个异步迭代器对象，之后调用迭代器对象的 next() 方法获取结果。

本文以 Node.js 源码 v14.x 为例来看看源码是如何实现的。
当我们调用 fs.createReadStream() 创建一个可读流对象时，对应的该方法内部会调用 ReadStream 构造函数

```javascript
// https://github.com/nodejs/node/blob/v14.x/lib/fs.js#L2001
function createReadStream(path, options) {
  lazyLoadStreams();
  return new ReadStream(path, options);
}
```

其实在 ReadStream 这个构造函数里没有我们要找的，重点是它通过原型的方式继承了 Stream 模块的 Readable 构造函数。

```javascript
function ReadStream(path, options) {
  ...
  Readable.call(this, options);
}
```

那么现在我们重点来看看 Readable 这个构造函数的实现。

Readable 原型上定义了 SymbolAsyncIterator 属性，该方法返回了一个由生成器函数创建的迭代器对象。

```javascript
// for await...of 循环会调用
Readable.prototype[SymbolAsyncIterator] = function() {
  let stream = this;
  ...
  const iter = createAsyncIterator(stream);
  iter.stream = stream;
  return iter;
};

// 声明一个创建异步迭代器对象的生成器函数
async function* createAsyncIterator(stream) {
  let callback = nop;

  function next(resolve) {
    if (this === stream) {
      callback();
      callback = nop;
    } else {
      callback = resolve;
    }
  }

  const state = stream._readableState;

  let error = state.errored;
  let errorEmitted = state.errorEmitted;
  let endEmitted = state.endEmitted;
  let closeEmitted = state.closeEmitted;
 
  // error、end、close 事件控制了什么时候结束迭代器遍历。
  stream
    .on('readable', next)
    .on('error', function(err) {
      error = err;
      errorEmitted = true;
      next.call(this);
    })
    .on('end', function() {
      endEmitted = true;
      next.call(this);
    })
    .on('close', function() {
      closeEmitted = true;
      next.call(this);
    });

  try {
    while (true) {
      // stream.read() 从内部缓冲拉取并返回数据。如果没有可读的数据，则返回 null
      // readable 的 destroy() 方法被调用后 readable.destroyed 为 true，readable 即为下面的 stream 对象
      const chunk = stream.destroyed ? null : stream.read();
      if (chunk !== null) {
        yield chunk; // 这里是关键，根据迭代器协议定义，迭代器对象要返回一个 next() 方法，使用 yield 返回了每一次的值
      } else if (errorEmitted) {
        throw error;
      } else if (endEmitted) {
        break;
      } else if (closeEmitted) {
        break;
      } else {
        await new Promise(next);
      }
    }
  } catch (err) {
    destroyImpl.destroyer(stream, err);
    throw err;
  } finally {
    if (state.autoDestroy || !endEmitted) {
      // TODO(ronag): ERR_PREMATURE_CLOSE?
      destroyImpl.destroyer(stream, null);
    }
  }
}
```

通过上面源码可以看到可读流的异步迭代器实现使用了生成器函数 Generator yield，那么对于 readable 对象遍历除了 ```for await...of``` 遍历之外，其实也是可以直接使用调用生成器函数的 next() 方法也是可以的。

```javascript
const ret = readable[Symbol.asyncIterator]()
console.log(await ret.next()); // { value: 'H', done: false }
console.log(await ret.next()); // { value: 'e', done: false }
```

### 异步迭代器与 Writeable

通过上面讲解，我们知道了如何遍历异步迭代器从 readable 对象获取数据，但是你有没有想过如何将一个异步迭代器对象传送给可写流？正是此处要讲的。

**从迭代器中创建可读流**

Node.js 流对象提供了一个实用方法 stream.Readable.from()，对于符合 Symbol.asyncIterator 或 Symbol.iterator 协议的可迭代对象（Iterable）会先创建一个可读流对象 readable 之后从迭代器中构建 Node.js 可读流。

以下是 [从理解到实现轻松掌握 ES6 中的迭代器](https://mp.weixin.qq.com/s/UI3r3u50vYkrUTVe2DS86A) 一文中曾讲解过的例子，r1 就是我们创建的可迭代对象。使用 stream.Readable.from() 方法则可以将可迭代对象构造为一个可读流对象 readable。

```javascript
function Range(start, end) {
  this.id = start;
  this.end = end;
}
Range.prototype[Symbol.asyncIterator] = async function* () {
  while (this.id <= this.end) {
    yield this.id++;
  }
}
const r1 = new Range(0, 3);
const readable = stream.Readable.from(r1);
readable.on('data', chunk => {
  console.log(chunk); // 0 1 2 3
});
```

**传送异步迭代器到可写流**

使用 pipeline 可以将一系列的流和生成器函数通过管道一起传送，并在管道完成时获取通知。

使用 util.promisify 将 pipeline 转化为 promise 形式。

```javascript
const util = require('util');
const pipeline = util.promisify(stream.pipeline); // 转为 promise 形式

(async () => {
  try {
    const readable = stream.Readable.from(r1);
    const writeable = fs.createWriteStream('range.txt');
    await pipeline(
      readable,
      async function* (source) {
        for await (const chunk of source) {
          yield chunk.toString();
        }
      },
      writeable
    );
    console.log('Pipeline 成功');
  } catch (err) {
    console.log(err.message);
  }
})()
```
在写入数据时，传入的 chunk 需是 String、Buffer、Uint8Array 类型，否则 writeable 对象在写入数据时会报错。由于我们自定义的可迭代对象 r1 里最终返回的值类型为 Number 在这里需要做次转换，管道中间的生成器函数就是将每次接收到的值转为字符串。

## 在 MongoDB 中使用 asyncIterator

除了上面我们讲解的 Node.js 官方提供的几个模块之外，在 MongoDB 中也是支持异步迭代的，不过介绍这点的点资料很少，MongoDB 是通过一个游标的概念来实现的。

### MongoDB 中的 cursor

本处以 Node.js 驱动 mongodb 模块来介绍，当我们调用 db.collection.find() 这个方法返回的是一个 cursor（游标），如果想要访问文档那么我们需要迭代这个游标对象来完成，但是通常我们会直接使用 toArray() 这个方法来完成。

下面让我们通过一段示例来看，现在我们有一个数据库 example，一个集合 books，表里面有两条记录，如下所示：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1605444357416-6e34f08d-5e62-4ccc-9252-cbcc53a5f5b0.png#align=left&display=inline&height=122&margin=%5Bobject%20Object%5D&name=image.png&originHeight=244&originWidth=1286&size=42422&status=done&style=none&width=643)

查询 books 集合的所有数据，以下代码中定义的 myCursor 变量就是游标对象，它不会自动进行迭代，可以使用游标对象的 hasNext() 方法检测是否还有下一个，如果有则可以使用 next() 方法访问数据。

通过以下日志记录可以看到在第三次调用 hasNext() 时返回了 false，如果此时在调用 next() 就会报错，游标已关闭，也就是已经没有数据可遍历了。

```javascript
const MongoClient = require('mongodb').MongoClient;
const dbConnectionUrl = 'mongodb://127.0.0.1:27017/example';

(async () => {
  const client = await MongoClient.connect(dbConnectionUrl, { useUnifiedTopology: true });
  const bookColl = client.db('example').collection('books');
  const myCursor = await bookColl.find();
 
  console.log(await myCursor.hasNext()); // true
  console.log((await myCursor.next()).name); // 深入浅出Node.js
  console.log(await myCursor.hasNext()); // true
  console.log((await myCursor.next()).name); // Node.js实战
  console.log(await myCursor.hasNext()); // false
  console.log((await myCursor.next()).name); // MongoError: Cursor is closed
})()
```
直接调用 next() 也可检测，如果还有值则返回该条记录，否则 next() 方法返回 null。
```javascript
console.log((await myCursor.next()).name);
console.log((await myCursor.next()).name);
console.log((await myCursor.next()));
```
### MongoDB 异步迭代器实现源码分析

MongoDB 中游标是以 hasNext() 返回 false 或 next() 返回为 null 来判断是否达到游标尾部，与之不同的是在我们的 JavaScript 可迭代协议定义中是要有一个 Symbol.asyncIterator 属性的迭代器对象，且迭代器对象是 { done, value } 的形式。

幸运的是 MongoDB Node.js 驱动已经帮助我们实现了这一功能，通过一段源码来看在 MongoDB 中的实现。

- **find 方法**

find 方法返回的是一个可迭代游标对象。
```javascript
// https://github.com/mongodb/node-mongodb-native/blob/3.6/lib/collection.js#L470

Collection.prototype.find = deprecateOptions(
  {
    name: 'collection.find',
    deprecatedOptions: DEPRECATED_FIND_OPTIONS,
    optionsIndex: 1
  },
  function(query, options, callback) {
    const cursor = this.s.topology.cursor(
      new FindOperation(this, this.s.namespace, findCommand, newOptions),
      newOptions
    );

    return cursor;
  }
);
```

- CoreCursor

核心实现就在这里，这是一个游标的核心类，MongoDB Node.js 驱动程序中所有游标都是基于此，如果当前支持异步迭代器，则在 CoreCursor 的原型上设置 Symbol.asyncIterator 属性，返回基于 Promise 实现的异步迭代器对象，这符合 JavaScript 中关于异步可迭代对象的标准定义。

```javascript
// https://github.com/mongodb/node-mongodb-native/blob/3.6/lib/core/cursor.js#L610

if (SUPPORTS.ASYNC_ITERATOR) {
  CoreCursor.prototype[Symbol.asyncIterator] = require('../async/async_iterator').asyncIterator;
}
```

```javascript
// https://github.com/mongodb/node-mongodb-native/blob/3.6/lib/async/async_iterator.js#L16

// async function* asyncIterator() {
//   while (true) {
//     const value = await this.next();
//     if (!value) {
//       await this.close();
//       return;
//     }

//     yield value;
//   }
// }

// TODO: change this to the async generator function above
function asyncIterator() {
  const cursor = this;

  return {
    next: function() {
      return Promise.resolve()
        .then(() => cursor.next())
        .then(value => {
          if (!value) {
            return cursor.close().then(() => ({ value, done: true }));
          }
          return { value, done: false };
        });
    }
  };
}
```

目前是默认使用的 Promise 的形式实现的，上面代码中有段 ``TODO``， Node.js 驱动关于异步迭代实现这块可能后期会改为基于生成器函数的实现，这对我们使用是没变化的.

### 使用 for await...of 遍历可迭代对象 cursor

还是基于我们上面的示例，如果换成 ```for await...of``` 语句遍历就简单的多了。

```javascript
const myCursor = await bookColl.find();
for await (val of myCursor) {
  console.log(val.name);
}
```

在 MongoDB 中的聚合管道中使用也是如此，就不再做过多分析了，如下所示：

```javascript
const myCursor = await bookColl.aggregate();
for await (val of myCursor) {
  console.log(val.name);
}
```

对于遍历庞大的数据集时，使用游标它会批量加载 MongoDB 中的数据，我们也不必担心一次将所有的数据存在于服务器的内存中，造成内存压力过大。

### 传送 cursor 到可写流

MongoDB 游标对象本身也是一个可迭代对象（Iterable），结合流模块的 Readable.from() 则可转化为可读流对象，是可以通过流的方式进行写入文件。

但是要注意 MongoDB 中的游标每次返回的是单条文档记录，是一个 Object 类型的，如果直接写入，可写流是会报参数类型错误的，因为可写流默认是一个非对象模式（仅接受 String、Buffer、Unit8Array），所以才会看到在 pipeline 传输的中间又使用了生成器函数，将每次接收的数据块处理为可写流 Buffer 类型。

```javascript
const myCursor = await bookColl.find();
const readable = stream.Readable.from(myCursor);
await pipeline(
  readable,
  async function* (source) {
    for await (const chunk of source) {
      yield Buffer.from(JSON.stringify(chunk));
    }
  },
  fs.createWriteStream('books.txt')
);
```

## Reference

- [https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_readable_symbol_asynciterator](https://nodejs.org/dist/latest-v14.x/docs/api/stream.html#stream_readable_symbol_asynciterator)
- [https://nodejs.org/dist/latest-v14.x/docs/api/events.html#events_events_on_emitter_eventname](https://nodejs.org/dist/latest-v14.x/docs/api/events.html#events_events_on_emitter_eventname)
- [https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/index.html](https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/index.html)
