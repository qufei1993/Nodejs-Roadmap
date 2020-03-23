# 多维度分析 Express、Koa 之间的区别

Express 历史悠久相比 Koa 学习资料多一些，其自带 Router、路由规则、View 等功能，更接近于 Web FrameWork 的概念。Koa 则相对轻量级，更像是对 HTTP 的封装，自由度更多一些，官方 [koajs/koa/wiki](http://github.com/koajs/koa/wiki) 提供了一些 Koa 的中间件，可以自行组合。

本文重点从 **Handler 处理方式**、**中间件执行机制**、**响应机制**多个维度来看待 Express、Koa 的区别。
<a name="ydfYE"></a>
## Handler 处理方式
这个是 Express、Koa（koa1、koa2）的重点区别：
<a name="uFKNM"></a>
### Express
**Express 使用普通的回调函数，一种线性的逻辑，在同一个线程上完成所有的 HTTP 请求**，Express 中一种不能容忍的是 Callback，特别是对错捕获处理起来很不友好，每一个回调都拥有一个新的调用栈，因此你没法对一个 callback 做 try catch 捕获，你需要在 Callback 里做错误捕获，然后一层一层向外传递。
<a name="T84eo"></a>
### Koa1
目前我们使用的是 Koa2，**Koa1 是一个过度版，因此也有必要了解下，它是利用 generator 函数生成器 + co 来实现的 “协程响应”**。

先说下 Generator 和协程，协程是处于线程的环境下，同一时刻一个线程只能执行一个协程，相比线程它更加轻量级，没有了线程的创建、销毁，上下文切换等消耗，它不受操作系统管理，由具体的应用程序所控制，Generator 也是在 ES6 中所实现，它由函数的调用者给予授权执行，因此也称为 “半协程/像协程”，完全的协程是所有的函数都可控制。

在说下 co，Generator 加上 co 这个必杀器，完全干掉了回调函数这种写法，**co** 是什么呢？**它是一种基于 Promise 对象的 Generator 函数流程自动管理**，可以像写同步代码一样来管理我们的异步代码。
<a name="Neyeo"></a>
### Koa2（现在 Koa 默认的）

Koa2 这个现在是 Koa 的默认版本，与 Koa1 最大的区别是**使用 ES7 的 Async/Await 替换了原来的 Generator + co 的模式，也无需引入第三方库，底层原生支持，Async/Await 现在也称为 JS 异步的终极解决方案**。

Koa 使用的是一个洋葱模型，它的一个特点是级联，通过 await next() 控制调用 “下游” 中间件，直到 “下游” 没有中间件且堆栈执行完毕，最终在流回 “上游” 中间件。这种方式有个优点特别是对于日志记录（请求->响应耗时统计）、错误处理支持都很完美。

因为其背靠 Promise，Async/Await 只是一个语法糖，因为 Promise 是一种链式调用，当多个 then 链式调用中你无法提前中断，要么继续像下传递，要么 catch 抛出一个错误。对应到 Koa 这个框架也是你只能通过 await next() 来控制是否像下流转，或者抛出一个错误，无法提前终止。

上面说到无法提前终止，后来有看过 Teambiton 严清老师自己实现的一个框架 Toa，基于 Koa 进行开发，它的其中一个特点是可以通过 context.end() 提前终止，感兴趣的可以去看看 [toajs/toa](https://github.com/toajs/toa)
<a name="ZOjp7"></a>
## 中间件实现机制
<a name="O3Rb0"></a>
### Koa 中间件机制
Koa （>=v7.6）默认支持 Async/Await，在 Koa 中多个异步中间件进行组合，其中一个最核心的实现是 [koa-compse](github.com/koajs/compose) 这个组件，下面一步一步的进行实现。

从三个函数开始做为例子开始封装一个类似于 koa-compse 的组合函数：

```javascript
async function f1(ctx, next) {
  console.log('f1 start ->');
  await next();
  console.log('f1 end <-');
}

async function f2(ctx, next) {
  console.log('f2 start ->');
  await next();
  console.log('f2 end <-');
}

async function f3(ctx) {
  console.log('f3 service...');
}
```

如果是按照 Koa 的执行顺序，就是先让 f1 先执行、f1 的 next 参数是 f2、f2 的 next 参数是 f3，可以看到 f3 是最后一个函数，处理完逻辑就结束，模拟实现：

- 行 {1} 定义一个中间件的集合
- 行 {2} 定义 use 方法，像中间件集合里 push 中间件，可以看成类似于 app.use()
- 行 {3} 依次挂载我们需要的执行的函数 f1、f2、f3
- 行 {5} 执行 next1()，也即先从 f1 函数开始执行
- 行 {4.3} 定义 next1 执行函数，middlewares[0] 即 f1 函数，其函数内部调用 f2，我们在行 {4.2} 定义 next2 执行函数
- 行 {4.2} 定义 next2 执行函数，middlewares[1] 即 f2 函数，其函数内部要调用 f3，我们再次定义 next3 执行函数
- 行 {4.1} 定义 next1 执行函数，middlewares[2] 即 f3 函数，因为其是最后一步，到这里也就结束了

```javascript
const ctx = {}
const middlewares = []; // {1} 定义一个中间件的集合
const use = fn => middlewares.push(fn); // {2} 定义 use 方法

// {3}
use(f1);
use(f2);
use(f3);

// {4}
const next3 = () => middlewares[2](ctx); // {4.1}
const next2 = () => middlewares[1](ctx, next3); // {4.2}
const next1 = () => middlewares[0](ctx, next2); // {4.3}

// {5}
next1()

// 输出结果
// f1 start ->
// f2 start ->
// f3 service...
// f2 end <-
// f1 end <-
```

上面输出结果是我们所期望的，但是如果我们在新增一个 f4 呢，是不是还得定义呢？显然这样不是很合理，我们需要一个更通用的方法来组合我们这些函数，通过上面例子，可以看出是由规律性的，可以通过递归遍历来实现，实现如下：

- 行 {1} {2} 为边界处理，首先 middlewares 是一个数组，其次数组中的每个元素必须为函数
- 行 {4} 定义 dispatch 函数这里是我们实现的关键
- 行 {5} i 为当前执行到中间件集合 middlewares 的哪个位置了，如果等于 middlewares 的长度，也就执行完毕直接返回；
- 行 {6} 取出当前遍历到的函数定义为 fn
- 行 {7} 执行函数 fn，传入 dispatch 函数且 i+1，但是注意一定要 bind 下，因为 bind 会返回一个函数，并不会立即执行，什么时候执行呢？也就是当前 fn 函数里的 await next() 执行时，此时这个 next 也就是现在 fn 函数传入的 dispatch.bind(null, (i + 1))
- 行 {8} 中间的任一个中间件出现错误，就直接返回

```javascript
/**
 * 中间件组合函数，可以参考 https://github.com/koajs/compose/blob/master/index.js
 * @param { Array } middlewares 
 */
function compose(ctx, middlewares) {
  // {1}
  if (!Array.isArray(middlewares)) throw new TypeError('Middlewares stack must be an array!')
  
  // {2}
  for (const fn of middlewares) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }
  
  return function() {
    const len = middlewares.length; // {3} 获取数组长度
    const dispatch = function(i) { // {4} 这里是我们实现的关键
      if (len === i) { // {5} 中间件执行完毕
        return Promise.resolve();
      } else {
        const fn = middlewares[i]; // {6}
        
        try {
          // {7} 这里一定要 bind 下，不要立即执行
          return Promise.resolve(fn(ctx, dispatch.bind(null, (i + 1))));
        } catch (err) {
          // {8} 返回错误
          return Promise.reject(err);
        }
      }
    }

    return dispatch(0);
  }
}

const fn = compose(ctx, middlewares);

fn();
```

进行测试，是我们期望的结果，它的执流程为 f1 -> f2 -> f3 -> f2 -> f1，刚开始从 f1 往下游执行，直到 f3 最后一个中间件执行完毕，在流回到 f1，这种模式另外一个名字就是最著名的 “洋葱模型”；

```javascript
f1 start ->
f2 start ->
f3 service...
f2 end <-
f1 end <-
```

以上就是 Koa 中间件 Compose 的核心实现，关于 Koa 的更多内容可参见 [Github](https://github.com/koajs/koa) 源码。

<a name="pjBPL"></a>
### Express 中间件机制

笔者这里看到是 Express 4.x 版本，其中一个重大改变是移除了内置中间件 Connect，详情参考 [迁移到 Express 4.x](https://www.expressjs.com.cn/guide/migrating-4.html)。

我们通常说 Express 是线性的，那么请看下面代码：

```javascript
const Express = require('express')
const app = new Express();
const sleep = () => new Promise(resolve => setTimeout(function(){resolve(1)}, 2000))
const port = 3000

function f1(req, res, next) {
  console.log('f1 start ->');
  next();
  console.log('f1 end <-');
}

function f2(req, res, next) {
  console.log('f2 start ->');
  next();
  console.log('f2 end <-');
}

async function f3(req, res) {
  //await sleep();
  console.log('f3 service...');
  res.send('Hello World!')
}

app.use(f1);
app.use(f2);
app.use(f3);
app.get('/', f3)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

控制台执行 curl localhost:3000 输出如下，有点迷惑了，不是线性吗？为什么和我们上面讲 Koa 的输出顺序是一致呢？不也是洋葱模型吗？

```javascript
f1 start ->
f2 start ->
f3 service...
f2 end <-
f1 end <-
```

少年，先莫及，再看一段代码。<br />上面我们的 f3 函数其中注释了一条代码 await sleep() 延迟执行，现在让我们打开这个注释。

```javascript
async function f3(req, res) {
  await sleep(); // 改变之处
  console.log('f3 service...');
  res.send('Hello World!')
}
```

控制台再次执行 curl localhost:3000，发现顺序发生了改变，上游中间件并没有等待 f3 函数执行完毕，就直接执行了。

```javascript
f1 start ->
f2 start ->
f2 end <-
f1 end <-
f3 service...
```

下面试图复现其执行过程，可以看到 f1、f2 为同步代码，而 f3 为异步，说了这么多，答案终于出来了。<br />**Express 中间件实现是基于 Callback 回调函数同步的，它不会去等待异步（Promise）完成**，这也解释了为什么上面的 Demo 我加上异步操作，顺序就被改变了。<br />在 Koa 的中间件机制中使用 Async/Await（背后全是 Promise）以同步的方式来管理异步代码，它则可以等待异步操作。

```javascript
f1 (req, res) {
  console.log('f1 start ->');
  f2 (req, res) { // 第一个 next() 地方
    console.log('f2 start ->');
    async f3 (req, res) { // 第二个 next() 地方
      await sleep(); // 改变之处
      console.log('f3 service...');
      res.send('Hello World!')
    }
    console.log('f2 end <-');
  }
  console.log('f1 end <-');
}
```

<a name="nKe0Y"></a>
##### Express 中间件源码解析
看过 Express 的源码，再去看 Koa 的源码，你会发现 Koa 是真的简洁精炼，Express 的源码看起来还是有点绕，需要时间去梳理，下面贴两个重点实现的地方，详情可参考 [Express 4.x 源码](https://github.com/expressjs/express/tree/4.x)，感兴趣的可以看下。

1. **中间件挂载**

初始化时主要通过 proto.use 方法将中间件挂载到自身的 stack 数组中
```javascript
// https://github.com/expressjs/express/blob/4.x/lib/router/index.js#L428
proto.use = function use(fn) {
  var offset = 0;
  var path = '/';

  ...

  var callbacks = flatten(slice.call(arguments, offset));

  if (callbacks.length === 0) {
    throw new TypeError('Router.use() requires a middleware function')
  }

  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i];

    if (typeof fn !== 'function') {
      throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
    }

    // add the middleware
    debug('use %o %s', path, fn.name || '<anonymous>')

    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);

    layer.route = undefined;

    this.stack.push(layer); // 中间件 route 的 layer 对象的 route 为 undefined，区别于路由的 router 对象
  }

  return this;
};
```

2. **中间件的执行**

Express 中间件的执行其中一个核心的方法为 proto.handle 下面省略了很多代码。详情参见源码 [Express 4.x](https://github.com/expressjs/express/blob/dc538f6e810bd462c98ee7e6aae24c64d4b1da93/lib/router/index.js#L136)，如何进行多个中间件的调用呢？proto.handle 方法的核心实现定义了 next 函数递归调用取出需要执行的中间件。
```javascript
// https://github.com/expressjs/express/blob/dc538f6e810bd462c98ee7e6aae24c64d4b1da93/lib/router/index.js#L136
proto.handle = function handle(req, res, out) {
  var self = this;
  ...
  next();

  function next(err) {
    ...
    // find next matching layer
    var layer;
    var match;
    var route;

    while (match !== true && idx < stack.length) {
      layer = stack[idx++]; // 取出中间件函数
      match = matchLayer(layer, path);
      route = layer.route;

      if (typeof match !== 'boolean') {
        // hold on to layerError
        layerError = layerError || match;
      }

      if (match !== true) {
        continue;
      }

      if (!route) {
        // process non-route handlers normally
        continue;
      }

      ...
    }
    
    ...
    // this should be done for the layer
    self.process_params(layer, paramcalled, req, res, function (err) {
      if (err) {
        return next(layerError || err);
      }

      if (route) {
        return layer.handle_request(req, res, next);
      }
      
      trim_prefix(layer, layerError, layerPath, path);
    });
  }
  
  function trim_prefix(layer, layerError, layerPath, path) {
    ...
    if (layerError) {
      layer.handle_error(layerError, req, res, next);
    } else {
      // 这里进行函数调用，且递归
      layer.handle_request(req, res, next);
    }
  }
};
```

<a name="awRfV"></a>
## 响应机制
<a name="OmEuj"></a>
### Koa 响应机制
在 Koa 中数据的响应是通过 ctx.body 进行设置，注意这里仅是设置并没有立即响应，而是在所有的中间件结束之后做了响应，源码中是如下方式写的：
```javascript
const handleResponse = () => respond(ctx);
fnMiddleware(ctx).then(handleResponse)

function respond(ctx) {
  ...
  res.end(body);
}
```

这样做一个好处是我们在响应之前是有一些预留操作空间的，例如：

```javascript
async function f1(ctx, next) {
  console.log('f1 start ->');
  await next();
  ctx.body += 'f1';
  console.log('f1 end <-');
}
async function f2(ctx, next) {
  console.log('f2 start ->');
  await next();
  ctx.body += 'f2 ';
  console.log('f2 end <-');
}
async function f3(ctx) {
  ctx.body = 'f3 '
  console.log('f3 service...');
}
fn().then(() => {
  console.log(ctx); // { body: 'f3 f2 f1' }
});
```
<a name="h1LnN"></a>
### Express 响应机制

在 Express 中我们直接操作的是 res 对象，在 Koa 中是 ctx，直接 res.send() 之后就立即响应了，这样如果还想在上层中间件做一些操作是有点难的。

```javascript
function f2(req, res, next) {
  console.log('f2 start ->');
  next();
  res.send('f2 Hello World!') // 第二次执行
  console.log('f2 end <-');
}

async function f3(req, res) {
  console.log('f3 service...');
  res.send('f3 Hello World!') // 第一次执行
}

app.use(f2);
app.use(f3);
app.get('/', f3)
```

注意：向上面这样如果执行多次 send 是会报 ERR_HTTP_HEADERS_SENT 错误的。
<a name="aJAzQ"></a>
## 总结
本文从 Handler 处理方式、中间件执行机制的实现、响应机制三个维度来对 Express、Koa 做了比较，通常都会说 Koa 是洋葱模型，这重点在于中间件的设计。但是按照上面的分析，会发现 Express 也是类似的，不同的是Express 中间件机制使用了 Callback 实现，这样如果出现异步则可能会使你在执行顺序上感到困惑，因此如果我们想做接口耗时统计、错误处理 Koa 的这种中间件模式处理起来更方便些。最后一点响应机制也很重要，Koa 不是立即响应，是整个中间件处理完成在最外层进行了响应，而 Express 则是立即响应。
