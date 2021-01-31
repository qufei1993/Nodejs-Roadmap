# 在 Node.js 中使用 Async Hooks 处理 HTTP 请求上下文

![](./img/async-local-storage.png)

**作者简介**：五月君，Software Designer，公众号「Nodejs技术栈」作者。

Async Hooks 一个实际的使用场景是存储请求上下文，在异步调用之间共享数据。上节对基础使用做了介绍，还没看的参见之前的分享 [**使用 Node.js 的 Async Hooks 模块追踪异步资源**](https://mp.weixin.qq.com/s/DIDQaJgQcVwsdnbjx7LN_w)。

本节将会介绍如何基于 Async hooks 提供的 API 从零开始实现一个 AsyncLocalStorage 类（异步本地存储）及在 HTTP 请求中关联日志的 traceId 实现链路追踪，这也是 Async Hooks 的一个实际应用场景了。

## 何为异步本地存储？

我们所说的异步本地存储类似于多线程编程语言中的线程本地存储。拿之前笔者写过的 Java 做个举例，例如 Java 中的 ThreadLocal 类，可以为使用相同变量的不同线程创建一个各自的副本，避免共享资源产生的冲突，在一个线程请求之内通过 get()/set() 方法获取或设置这个变量在当前线程中对应的副本值，在多线程并发访问时线程之间各自创建的副本互不影响。

在 Node.js 中我们的业务通常都工作在主线程（使用 work_threads 除外），是没有 ThreadLocal 类的。并且以事件驱动的方式来处理所有的 HTTP 请求，每个请求过来之后又都是异步的，异步之间还很难去追踪上下文信息，我们想做的是在这个异步事件开始，例如从接收 HTTP 请求到响应，能够有一种机可以让我们随时随地去获取在这期间的一些共享数据，也就是我们本节所提的异步本地存储技术。

在接下来我会讲解实现 AsyncLocalStorage 的四种方式，从最开始的手动实现到官方 v14.x 支持的 AsyncLocalStorage 类，你也可以从中学习到其实现原理。

## 现有业务问题

假设，现在有一个需求对现有日志系统做改造，所有记录日志的地方增加 traceId 实现全链路日志追踪。

一种情况是假设你使用一些类似 Egg.js 这样的企业级框架，可以依赖于框架提供的中间件能力在请求上挂载 traceId，可以看看之前的一篇文章 [基于 Egg.js 框架的日志链路追踪实践](https://www.nodejs.red/#/nodejs/logger) 也是可以实现的，不过当时是基于 egg 的一个插件自己做了继承实现，现在已经不需要这么麻烦，可以通过配置自定义日志格式来实现 [https://eggjs.org/zh-cn/core/logger.html#自定义日志格式](https://eggjs.org/zh-cn/core/logger.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97%E6%A0%BC%E5%BC%8F)。

另一种情况假设你是用的 Express、Koa 这些基础框架，所有业务都是模块加载函数式调用，如果每次把请求的 traceId 手动在 Controller -> Service -> Model 之间传递，这样对业务代码的侵入太大了，日志与业务的耦合度就太高了。

如下代码，是我精简后的一个例子，现在有一个需求，在不更改业务代码的情况下每次日志打印都输出当前 HTTP 请求处理 Headers 中携带的 traceId 字段，如果是你会怎么做呢？

```javascript
// logger.js
const logger = {
  info: (...args) => {
    console.log(...args);
  }
}
module.exports = { logger }

// app.js
const express = require('express');
const app = express();
const PORT = 3000;
const { logger } = require('./logger');
global.logger = contextLogger;

app.use((req, res, next) => contextLogger.run(req, next));

app.get('/logger', async (req, res, next) => {
  try {
  	const users = await getUsersController();
  	res.json({ code: 'SUCCESS', message: '', data: users });
  } catch (error) {
    res.json({ code: 'ERROR', message: error.message })
  }
});

app.listen(PORT, () => console.log(`server is listening on ${PORT}`));

async function getUsersController() {
  logger.info('Get user list at controller layer.');
  return getUsersService();
}

async function getUsersService() {
  logger.info('Get user list at service layer.');
  setTimeout(function() { logger.info('setTimeout 2s at service layer.') }, 3000);
  return getUsersModel();
}

async function getUsersModel() {
  logger.info('Get user list at model layer.');
  return [];
}
```

## 方式一：动手实现异步本地存储

解决方案是实现请求上下文本地存储，在当前作用域代码中能够获取上下文信息，待处理完毕清除保存的上下文信息，这些需求可以通过 Async Hooks 提供的 API 实现。

### 创建 AsyncLocalStorage 类

- 行 {1} 创建一个 Map 集合存储上下文信息。
- 行 {2} 里面的 init 回调是重点，当一个异步事件被触发前会先收到 init 回调，其中 **triggerAsyncId 是当前异步资源的触发者**，我们则可以在这里**获取上个异步资源的信息存储至当前异步资源中**。当 asyncId 对应的异步资源被销毁时会收到 destroy 回调，所以**最后要记得在 destroy 回调里清除当前 asyncId 里存储的信息**。
- 行 {3} 拿到当前请求上下文的 asyncId 做为 Map 集合的 Key 存入传入的上下文信息。
- 行 {4} 拿到 asyncId 获取当前代码的上下文信息。

```javascript
// AsyncLocalStorage.js
const asyncHooks = require('async_hooks');
const { executionAsyncId } = asyncHooks;
class AsyncLocalStorage {
  constructor() {
    this.storeMap = new Map(); // {1}
    this.createHook(); // {2}
  }
  createHook() {
    const ctx = this;
    const hooks = asyncHooks.createHook({
      init(asyncId, type, triggerAsyncId) {
        if (ctx.storeMap.has(triggerAsyncId)) {
          ctx.storeMap.set(asyncId, ctx.storeMap.get(triggerAsyncId));
        }
      },
      destroy(asyncId) {
        ctx.storeMap.delete(asyncId);
      }
    });
    hooks.enable();
  }
  run(store, callback) { // {3}
    this.storeMap.set(executionAsyncId(), store);
    callback();
  }
  getStore() { // {4}
    return this.storeMap.get(executionAsyncId());
  }
}
module.exports = AsyncLocalStorage;
```

注意，在我们定义的 createHook() 方法里有 `hooks.enable();` 这样一段代码，这是因为 Promise 默认是没有开启的，通过显示的调用可以开启 Promise 的异步追踪。

### 改造 logger.js 文件

在我们需要打印日志的地方拿到当前代码所对应的上下文信息，取出我们存储的 traceId， 这种方式只需要改造我们日志中间即可，不需要去更改我们的业务代码。

```javascript
const { v4: uuidV4 } = require('uuid');
const AsyncLocalStorage = require('./AsyncLocalStorage');
const asyncLocalStorage = new AsyncLocalStorage();

const logger = {
  info: (...args) => {
    const traceId = asyncLocalStorage.getStore();
    console.log(traceId, ...args);
  },
  run: (req, callback) => {
    asyncLocalStorage.run(req.headers.requestId || uuidV4(), callback);
  }
}

module.exports = {
  logger,
}
```

### 改造 app.js 文件

注册一个中间件，传递请求信息。

```javascript
app.use((req, res, next) => logger.run(req, next));
```

### 运行后输出结果

```javascript
e82d1a1f-5038-4ac9-a9c8-2aa5abb0f96a Get user list at router layer.
e82d1a1f-5038-4ac9-a9c8-2aa5abb0f96a Get user list at controller layer.
e82d1a1f-5038-4ac9-a9c8-2aa5abb0f96a Get user list at service layer.
e82d1a1f-5038-4ac9-a9c8-2aa5abb0f96a Get user list at model layer.
e82d1a1f-5038-4ac9-a9c8-2aa5abb0f96a setTimeout 2s at service layer.
```

这种方式就是完全基于 Async Hooks 提供的 API 来实现，不理解其实现原理的可以在动手实践下，这种方式需要我们额外维护维护一个 Map 对象，还要处理销毁操作。

## 方式二：利用 executionAsyncResource() 返回当前执行的异步资源

executionAsyncResource() 返回当前执行的异步资源，这对于实现连续的本地存储很有帮助，无需像 “方式一” 再创建一个 Map 对象来存储元数据。

```javascript
const asyncHooks = require('async_hooks');
const { executionAsyncId, executionAsyncResource } = asyncHooks;

class AsyncLocalStorage {
  constructor() {
    this.createHook();
  }
  createHook() {
    const hooks = asyncHooks.createHook({
      init(asyncId, type, triggerAsyncId, resource) {
        const cr = executionAsyncResource();
        if (cr) {
          resource[asyncId] = cr[triggerAsyncId];
        }
      }
    });
    hooks.enable();
  }
  run(store, callback) {
    executionAsyncResource()[executionAsyncId()] = store;
    callback();
  }
  getStore() {
    return executionAsyncResource()[executionAsyncId()];
  }
}

module.exports = AsyncLocalStorage;
```

## 方式三：基于 ResourceAsync 创建 AsyncLocalStorage 类

ResourceAysnc 可以用来自定义异步资源，此处的介绍也是参考 Node.js 源码对 AsyncLocalStorage 的实现。

一个显著的改变是 run() 方法，每一次的调用都会创建一个资源，调用其 runInAsyncScope() 方法，这样在这个资源的异步作用域下，所执行的代码（传入的 callback）都是可追踪我们设置的 store。

```javascript
const asyncHooks = require('async_hooks');
const { executionAsyncResource, AsyncResource } = asyncHooks;

class AsyncLocalStorage {
  constructor() {
    this.kResourceStore = Symbol('kResourceStore');
    this.enabled = false;
    const ctx = this;
    this.hooks = asyncHooks.createHook({
      init(asyncId, type, triggerAsyncId, resource) {
        const currentResource = executionAsyncResource();
        ctx._propagate(resource, currentResource)
      }
    });
  }

  // Propagate the context from a parent resource to a child one
  _propagate(resource, triggerResource) {
    const store = triggerResource[this.kResourceStore];
    if (store) {
      resource[this.kResourceStore] = store;
    }
  }

  _enable() {
    if (!this.enabled) {
      this.enabled = true;
      this.hooks.enable();
    }
  }

  enterWith(store) {
    this._enable();
    const resource = executionAsyncResource();
    resource[this.kResourceStore] = store;
  }

  run(store, callback) {
    const resource = new AsyncResource('AsyncLocalStorage', {
      requireManualDestroy: true,
    });
    return resource.emitDestroy().runInAsyncScope(() => {
      this.enterWith(store);
      return callback();
    });
  }

  getStore() {
    return executionAsyncResource()[this.kResourceStore];
  }
}

module.exports = AsyncLocalStorage;
```

## 方式四：Node.js 官方提供的 AsyncLocalStorage 类

Node.js v13.10.0 ```async_hooks``` 模块新加入了 AsyncLocalStorage 类，实例化一个对象调用 run() 方法实现本地存储，也是推荐的方式，不需要自己去再额外维护一个 AsyncLocalStorage 类。

AsyncLocalStorage 类的实现也就是上面讲解的方式三，所以也不需要我们在外部显示的调用 hooks.enable() 来启用 Promise 异步追踪，因为其内部已经实现了。

```javascript
const { AsyncLocalStorage } = require('async_hooks');
```

## Async Hooks 的性能开销

这一点是大家最关心的问题，如果开启了 Async Hooks（Promise 需要调用 Async Hooks 实例的 enable() 方法开启）每一次异步操作或 Promise 类型的操作，包括 console 只要是异步的都会触发 hooks，也必然是有性能开销的。

参考 [Kuzzle](https://github.com/kuzzleio/kuzzle/pull/1604) 的性能基准测试，使用了 AsyncLocalStorage 与未使用之间相差 ～8%。

|  ---- | Log with AsyncLocalStorage | Log classic | difference |
| --- | --- | --- | --- |
| req/s |   2613 | 2842 | 〜8％ |

当然不同的业务也有着不同的差异，如果你担心会有很大的性能开销，可以基于自己的业务做一些基准测试。

## Reference

- [https://nodejs.org/api/async_hooks.html](https://nodejs.org/api/async_hooks.html)
- [Node.js 14 & AsyncLocalStorage: Share a context between asynchronous calls](https://blog.kuzzle.io/nodejs-14-asynclocalstorage-asynchronous-calls)
- [在 Node 中通过 Async Hooks 实现请求作用域](https://mp.weixin.qq.com/s/I22TvmTqCKFClsp0YLDoZw)
- [Async Hooks 性能影响](https://github.com/nodejs/benchmarking/issues/181)
- [kuzzle 基准测试](https://github.com/kuzzleio/kuzzle/pull/1604)
