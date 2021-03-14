# Node.js 小知识 — 如何实现线程睡眠？

**![默认标题_公众号封面首图_2021-03-04-0.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1614866793831-b677f444-4c34-44db-b895-6413429f6527.png#align=left&display=inline&height=383&margin=%5Bobject%20Object%5D&name=%E9%BB%98%E8%AE%A4%E6%A0%87%E9%A2%98_%E5%85%AC%E4%BC%97%E5%8F%B7%E5%B0%81%E9%9D%A2%E9%A6%96%E5%9B%BE_2021-03-04-0.png&originHeight=383&originWidth=900&size=154278&status=done&style=none&width=900)**

**作者简介**：五月君，Software Designer，公众号「Nodejs技术栈」作者。

**Node.js 小知识** 记录一些工作中或 “Nodejs技术栈” 交流群中大家遇到的一些问题，有时一个小小的问题背后也能延伸出很多新的知识点，解决问题和总结的过程本身也是一个成长的过程，在这里与大家共同分享成长。

使用 JavaScript/Node.js 的开发者如果遇到需要实现延迟的任务，可能会有疑问🤔️为什么这里没有类似 Java 中 `Thread.sleep()` 这样的方式来实现线程睡眠，本文讲解如何在 Node.js 中实现一个 sleep() 函数。

## 一：糟糕的 “循环空转”

下面这段代码是糟糕的，Node.js 是以单进程的方式启动，所有的业务代码都工作在主线程，这样会造成 CPU 持续占用，主线程阻塞对 CPU 资源也是一种浪费，与真正的线程睡眠相差甚远。

```javascript
const start = new Date();
while (new Date() - start < 2000) {}
```

![](https://cdn.nlark.com/yuque/0/2021/png/335268/1614864189904-aa42ce40-efd0-44d2-bd1a-0946787f9211.png#align=left&display=inline&height=129&margin=%5Bobject%20Object%5D&name=image.png&originHeight=257&originWidth=1492&size=84207&status=done&style=none&width=746)

运行之后如上图所示，CPU 暴涨，同时也会破坏事件循环调度，导致其它任务无法执行。

## 二：定时器 + Promise 实现 sleep

通过定时器延迟执行函数 setTimeout + Promise 的链式依赖实现，本质是创建一个新的 Promise 对象，待定时器延迟时间到了执行 resolve 函数这时 then 才会执行，这里 Node.js 执行线程是没有进行睡眠的，事件循环和 V8 等都是正常运行的。但这也是目前通用的一种解决方案，因为你不能让主线程阻塞，否则程序就无法继续工作了。

```javascript
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
```

在 Node.js 中还可以利用 util 模块提供的 promisify 方法实现，一种快捷方式，感兴趣的可参见笔者这一篇文章 [util.promisify 实现原理解析](https://mp.weixin.qq.com/s/PzXYF591_wIqWcU7nq_OJw)

```javascript
const { promisify } = require('util');
const sleep = promisify(setTimeout);
```

因为是基于定时器与 Promise 所以也自然是异步的方式了，使用时也要注意，如下所示：

```javascript
// async await 的方式
async function test() {
  console.log(1);
  await sleep(3000);
  console.log(2);
}

// Promise 的链式调用方式
async function test() {
  console.log(1);
  sleep(3000).then(() => {
    console.log(2);
  });
}
```

## 三：零 CPU 开销真正的事件循环阻止 sleep 实现

ECMA262 草案提供了 Atomics.wait API 来实现线程睡眠，它会真正的阻塞事件循环，阻塞线程直到超时。

该方法 `Atomics.wait(Int32Array, index, value[, timeout])` 会验证给定的 Int32Array 数组位置中是否仍包含其值，在休眠状态下会等待唤醒或直到超时，返回一个字符串表示超时还是被唤醒。

同样的因为我们的业务是工作在主线程，避免在主线程中使用，在 Node.js 的工作线程中可以根据实际需要使用。

```javascript
/**
 * 真正的阻塞事件循环，阻塞线程直到超时，不要在主线程上使用 
 * @param {Number} ms delay
 * @returns {String} ok|not-equal|timed-out
 */
function sleep(ms) {
  const valid = ms > 0 && ms < Infinity;
  if (valid === false) {
    if (typeof ms !== 'number' && typeof ms !== 'bigint') {
      throw TypeError('ms must be a number');
    }
    throw RangeError('ms must be a number that is greater than 0 but less than Infinity');
  }

  return Atomics.wait(int32, 0, 0, Number(ms))
}

sleep(3000)
```

由于本节我们仅是在讲解 sleep 的实现，所以关于 Atomics.wait 方法睡眠之后如何被其它线程唤醒也不再此处讲了，之后我会写一讲 Node.js 中的工作线程相关文章，到时会再次介绍。

## 四：基于 N-API 扩展使用 C 语言实现 sleep

通过 Addon 的方式使用 N-API 编写 C/C++ 插件，借助其提供的系统 sleep() 函数实现。

```c
// sleep.c
#include <assert.h>
#include <unistd.h>
#include <node_api.h>

napi_value sleepFn(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 1;
  napi_value argv[1];

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  assert(status == napi_ok);
  if (argc < 1) {
    napi_throw_type_error(env, NULL, "ms is required");
    return NULL;
  }

  napi_valuetype valueType;
  napi_typeof(env, argv[0], &valueType);
  if (valueType != napi_number) {
    napi_throw_type_error(env, NULL, "ms must be a number");
    return NULL;
  }

  int64_t s;
  napi_get_value_int64(env, argv[0], &s);
  sleep(s);
  return NULL;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor descriptor = {
    "sleep",
    0,
    sleepFn,
    0,
    0,
    0,
    napi_default,
    0
  };
  status = napi_define_properties(env, exports, 1, &descriptor);
  assert(status == napi_ok);
  return exports;
}

NAPI_MODULE(sleep, init);
```

经过一系列编译之后，引入 .node 文件直接使用。

```javascript
// app.js
const { sleep } = require('./build/Release/sleep.node');
sleep(3);
```

## 五：easy-sleep 模块

这是笔者写的一个小模块 [https://github.com/qufei1993/easy-sleep](https://github.com/qufei1993/easy-sleep)，其实也是对以上几种方法的整合，包含了 C 插件的编写，使用如下：

```javascript
// Install
npm install easy-sleep -S

// Async sleep
const { sleep } = require('easy-sleep');
await sleep(3000);

// Thread sleep
const { Thread } = require('easy-sleep');
Thread.sleep();
```

## 总结

由于 JavaScript 是单线程的语言，通常我们都是工作在主线程，如果真的让线程睡眠了，事件循环也会被阻塞，后续的程序就无法正常工作了，**大多数情况，我们也是简单的对 setTimeout 函数做一些封装实现延迟功能**。在浏览器/Node.js 的工作线程下可以根据实际需要决定是否需要工作线程睡眠。
