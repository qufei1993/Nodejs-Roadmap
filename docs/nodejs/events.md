# Node.js 知名框架 Express Koa 都在使用的  Events 模块你了解吗？

在 Node.js 中一个很重要的模块 Events（EventEmitter 事件触发器），也称为发布/订阅模式，为什么说它重要，因为在 Node.js 中绝大多数模块都依赖于此，例如 Net、HTTP、FS、Stream 等，除了这些系统模块比较知名的 Express、Koa 框架中也能看到 EventEmitter 的踪迹。

谈起事件前端的同学可能会联想到浏览器中的事件，与浏览器中的事件不同的是它不存在事件冒泡、preventDefault()、stopPropagation() 等方法，EventEmitter 提供了 on()、once()、removeListener() 等方法来对事件进行监听移除。

## 通过本文你能学到什么

* 了解 EventEmitter 是什么？一些基础 API 的使用
* 在 Node.js 的一些核心模块（Stream、Net）中是如何使用 EventEmitter 的?
* 主流的 Express/Koa 框架也是基于此实现，我们如何实现一个基于 EventEmitter 的自定义对象？        
* 高并发场景下雪崩问题如何利用 EventEmitter 特性解决？
* 事件是否等价于异步？

## 先从一个简单的例子开始

事件驱动是 Node.js 的核心，怎么体现事件驱动呢？通常一种最常见的形式就是回调，触发一次事件，然后通过回调来接收一些处理，关于这种形式在 JavaScript 编程中屡见不鲜，例如 fs.readFile(path, callback)、TCP 中的 server.on('data', callback) 等。

### 一个简单的实现

主要用到以下两个 API，触发、注册一个监听函数。

* emit：触发一个监听函数
* on：注册一个监听函数

```js
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

emitter.on("起床", function(time) {
    console.log(`早上 ${time} 开始起床，新的一天加油！`)
    //console.log(`关注公众号Nodejs技术栈，早上 ${time} 点开始起床阅读，从 Node.js 技术栈`);
});

emitter.emit("起床", "6:00");
```

运行程序之后效果如下所示：

```bash
早上 6:00 开始起床，新的一天加油！
```

除了上面使用 emit、on 方法外还有一些很有用的 API，你也许需要先去 Node.js 官网（[http://nodejs.cn/api/events.html](http://nodejs.cn/api/events.html)）做一个了解，那里介绍的很全，在接来的学习中，我会在一些示例中演示一部分的核心 API 如何应用。

## 自定义 EventEmitter 类

当你了解了 EventEmitter，你会发现它在 Node.js 中无所不在，Node.js 的核心模块、Express/Koa 等知名框架中，你都会发现它的踪迹，例如，下面在 Koa 中 new 一个 app 对象，通过 app.emit() 触发一个事件，实现在整个系统中进行传递。

```js
const Koa = require('koa');
const app = new Koa();

app.on("koa", function() {
    console.log("在 Koa 中使用 EventEmitter");
});

app.emit("koa");
```

### 系统模块自定义 EventEmitter 类的实现

在这开始之前让我们先看下 Node.js 中的 Stream、Net 模块是怎么实现的？

在 Stream 模块中的实现

```js
// https://github.com/nodejs/node/blob/v10.x/lib/internal/streams/legacy.js#L6

const EE = require('events');
const util = require('util');

function Stream() {
  EE.call(this);
}
util.inherits(Stream, EE);
```

在 Net 模块中的实现

```js
// https://github.com/nodejs/node/blob/v10.x/lib/net.js#L1121
const EventEmitter = require('events');
const util = require('util');

function Server(options, connectionListener) {
  if (!(this instanceof Server))
    return new Server(options, connectionListener);

  EventEmitter.call(this);

  ...
}
util.inherits(Server, EventEmitter);
```

观察上面两个 Node.js 模块的自定义 EventEmitter 实现，都有一个共同点使用了 util.inherits(constructor, superConstructor) 方法，这个是 Node.js 中的工具类，这让我想起来了之前在看 JavaScript 权威指南（第 6 章 122 页）中的一个方法 function inherit(p)，意思为**通过原型继承创建一个新对象**，而 util.inherits 是**通过原型复制来实现的对象间的继承**。

例如上面的 util.inherits(Server, EventEmitter) 函数，也就是 **Server 对象继承了 EventEmitter 在原型中定义的函数**，也就拥有了 EventEmitter 事件触发器中的 on、emit 等方法。但是现在 Node.js 官网不建议使用 util.inherits() 方法，而是使用 ES6 中的 class 和 extends 关键词获得语言层面的继承支持，那么在原声 JS 中还是使用 Object.setPrototypeOf() 来实现的继承，因此在 Node.js 12x 版本中你会看到如下代码实现。

```js
// https://github.com/nodejs/node/blob/v12.x/lib/net.js#L1142
function Server(options, connectionListener) {
  if (!(this instanceof Server))
    return new Server(options, connectionListener);

  EventEmitter.call(this);

  ...
}

// https://github.com/nodejs/node/blob/v12.x/lib/net.js#L1188
Object.setPrototypeOf(Server.prototype, EventEmitter.prototype);
Object.setPrototypeOf(Server, EventEmitter);
```

### 实现一个基于 EventEmitter 的自定义类

这里用一个例子一天的计划来展示如何基于 EventEmitter 自定义类，在不同的时间触发相应的事件，通过监听事件来做一些事情。

下面展示了我们自定义的 OneDayPlan 是如何继承于 EventEmitter

```js
const EventEmitter = require('events');
const oneDayPlanRun = {
    "6:00": function() {
        console.log(`现在是早上 6:00，起床，开始新的一天加油！`);
    },
    "7:00": function() {
        console.log(`现在是早上 7:00，吃早饭！`);
    }
}

function OneDayPlan() {
    EventEmitter.call(this);
}

Object.setPrototypeOf(OneDayPlan.prototype, EventEmitter.prototype);
Object.setPrototypeOf(OneDayPlan, EventEmitter);
```

现在让我们实例化上面自定义的 OneDayPlan 类，实现事件的触发/监听

```js
const oneDayPlan = new OneDayPlan();

oneDayPlan.on("6:00", function() {
    oneDayPlanRun["6:00"]();
});

oneDayPlan.on("7:00", function() {
    oneDayPlanRun["7:00"]();
});

async function doMain() {
    oneDayPlan.emit("6:00");

    await sleep(2000); // 间隔 2 秒钟输出

    oneDayPlan.emit("7:00");
}

doMain();

async function sleep(s) {
    return new Promise(function(reslve) {
        setTimeout(function() {
            reslve(1);
        }, s);
    });
}
```

## EventEmitter 解决高并发下雪崩问题

对于需要查询 DB 的数据，我们一般称之为热点数据，这类数据通常是要在 DB 之上增加一层缓存，但是在高并发场景下，如果这个缓存正好失效，此时就会有大量的请求直接涌入数据库，对数据库造成一定的压力，对于缓存雪崩的解决方案，网上也不乏有更好的解决方案，但是在 Node.js 中我们可以利用 events 模块提供的 once() 方法来解决。

### once 方法介绍

当触发多次相同名称事件，通过 once 添加的侦听器只会执行一次，并且在执行之后会接触与它关联的事件，相当于 on 方法和 removeListener 方法的组合，

```js
proxy.once('我很帅', function() {
    console.log('once: 我很帅！');
});

proxy.on('我很帅', function() {
    console.log('on: 我很帅！');
});


proxy.emit('我很帅');
proxy.emit('我很帅');
proxy.emit('我很帅');
```

上面触发了三次 “我很帅” 事件，on 方法乖乖的重复了三次，但是 once 方法说我知道我很帅我只说一次就够了。

```bash
once: 我很帅！
on: 我很帅！
on: 我很帅！
on: 我很帅！
```

上面说的 once 方法是 on 和 removeListener 的结合体，在源码中也可看到 [https://github.com/nodejs/node/blob/v10.x/lib/events.js#L282](https://github.com/nodejs/node/blob/v10.x/lib/events.js#L282) once 方法接收到信息之后使用 on 方法监听，在 onceWrapper 方法中通过 removeListener 删掉监听函数自身。

```js
function onceWrapper(...args) {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    return Reflect.apply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target, type, listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);

  this.on(type, _onceWrap(this, type, listener));
  return this;
};
```

### 编码实现

利用 once 方法将所有请求的回调都压入事件队列中，对于相同的文件名称查询保证在同一个查询开始到结束的过程中永远只有一次，如果是 DB 查询也避免了重复数据带来的数据库查询开销。代码编写参考了深入浅出 Nodejs Events 模块一书，这里使用 fs 进行文件查询，如果是 DB 也同理，另外注意使用 status 键值对形式保存了触发/监听的事件名称和状态，最后建议进行清除，避免引起大对象导致内存泄露问题。

```js
const events = require('events');
const emitter = new events.EventEmitter();
const fs = require('fs');
const status = {};

const select = function(file, filename, cb) {
    emitter.once(file, cb);
    
    if (status[file] === undefined) {
        status[file] = 'ready'; // 不存在设置默认值
    }
    if (status[file] === 'ready') {
        status[file] = 'pending';
        fs.readFile(file, function(err, result) {
            console.log(filename);
            emitter.emit(file, err, result.toString());
            status[file] = 'ready';
            
            setTimeout(function() {
                delete status[file];
            }, 1000);
        });
    }
}

for (let i=1; i<=11; i++) {
    if (i % 2 === 0) {
        select(`/tmp/a.txt`, 'a 文件', function(err, result) {
            console.log('err: ', err, 'result: ', result);
        });
    } else {
        select(`/tmp/b.txt`, 'b 文件', function(err, result) {
            console.log('err: ', err, 'result: ', result);
        });
    }
}
```

控制台运行以上代码进行测试，虽然发起了多次文件查询请求，fs 模块真正只执行了两次，分别查询了 a、b 两个文件，对于相同的请求，通过利用事件监听器 once 的特性避免了相同条件重复查询。

```bash
b 文件
err:  null result:  b
err:  null result:  b
err:  null result:  b
err:  null result:  b
err:  null result:  b
err:  null result:  b
err:  null result:  b
a 文件
err:  null result:  a
err:  null result:  a
err:  null result:  a
err:  null result:  a
err:  null result:  a
```

默认情况下，如果为特定事件添加了超过 10 个监听器，则 EventEmitter 会打印一个警告。 但是，并不是所有的事件都要限制 10 个监听器。 emitter.setMaxListeners() 方法可以为指定的 EventEmitter 实例修改限制。

```
(node:88835) Warning: Possible EventEmitter memory leak detected. 11 /tmp/b.txt listeners added. Use emitter.setMaxListeners() to increase limit
(node:88835) Warning: Possible EventEmitter memory leak detected. 11 /tmp/a.txt listeners added. Use emitter.setMaxListeners() to increase limit
```

## EventEmitter 循环调用问题

如下代码所示，尝试分析以下两种情况的输出结果

```js
const events = require('events');
const emitter = new events.EventEmitter();
const test = () => console.log('test');

/** 例一 */
emitter.on('test', function() {
    test();
    emitter.emit('test');
})

emitter.emit('test');

/** 例二 */
emitter.on('test', function() {
    test();
    emitter.on('test', test);
})

emitter.emit('test');
```

例一因为在监听函数 on 里执行了 emit 事件触发，会陷入死循环导致栈溢出。

例二结果为只输出一次 test，emitter.on('test', test); 这行代码只是在当前的事件回调中添加了一个事件监听器。

```
例一：RangeError: Maximum call stack size exceeded
例二：test
```

## 同步还是异步

换一个问题事件是否等于异步？答案是不等的，看以下代码示例执行顺序，先输出 111 再输出 222，为什么这样？摘自官方 API 的一段话 “**EventEmitter 会按照监听器注册的顺序同步地调用所有监听器。 所以必须确保事件的排序正确，且避免竞态条件。**”

```js
const events = require('events');
const emitter = new events.EventEmitter();

emitter.on('test',function(){
    console.log(111)
});
emitter.emit('test');
console.log(222)

// 输出
// 111
// 222
```

也可以使用 setImmediate() 或 process.nextTick() 切换到异步模式，代码如下所示：

```js
const events = require('events');
const emitter = new events.EventEmitter();

emitter.on('test',function(){
    setImmediate(() => {
        console.log(111);
    });
});
emitter.emit('test');
console.log(222)

// 输出
// 222
// 111
```

## 错误处理

最后一个最重要的错误处理，在 Node.js 中错误处理是一个需要重视的事情，一旦抛出一个错误没有人为处理，可能造成的结果是进程自动退出，如下代码因为事件触发器带有错误信息，而没有相应的错误监听在，会导致进程退出。

```js
const events = require('events');
const emitter = new events.EventEmitter();

emitter.emit('error', new Error('This is a error'));
console.log('test');
```

调用后程序崩溃导致 Node 进程自动退出，因受上一行的影响，之后的 console.log('test'); 也不会得到执行。

```
events.js:167
      throw er; // Unhandled 'error' event
      ^

Error: This is a error
```

作为最佳实践，应该始终为 'error' 事件注册监听器

```js
const events = require('events');
const emitter = new events.EventEmitter();

emitter.on('error', function(err) {
    console.error(err);
})

emitter.emit('error', new Error('This is a error'));

console.log('test');
```

```
Error: This is a error
    at Object.<anonymous> ...
test
```

如上代码所示，第一次调用后错误 error 事件会被监听，Node 进程也不会像之前的程序一样会自动退出，console.log('test'); 也得到了正常运行。

## 总结

许多 Node.js 成功的模块和框架都是基于 EventEmitter 的，学会 EventEmitter 的使用，并且知道该在什么时候去使用是非常有用的。

EventEmitter 本质上就是观察者模式的实现，一个类似的模式是发布/订阅，生产者将消息发布之后无需关心订阅者的实现，关注过**Nodejs技术栈**公众号的同学，也许你会收到过我之前发布的 RabbitMQ 系列文章，RabbitMQ 本身也是基于 AMQP 协议，这在一个分布式集群环境中使用也是非常好的一种方案。
