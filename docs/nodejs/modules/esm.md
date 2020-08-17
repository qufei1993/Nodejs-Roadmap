
# Nodejs ES Modules 入门基础

本周 2020-05-26，Nodejs v12.17.0 LTS 版发布，去掉 --experimental-modules 标志。

虽然已在最新的 LTS v12.17.0 中支持，但是目前仍处于  **Stability: 1 - Experimental** 实验阶段，如果是在生产环境使用该功能，还应保持谨慎，如果在测试环境可以安装 **n install v12.17.0** 进行尝试。

删除标志也是将 ESM 变为稳定性而迈出的重要一步，**根据 Nodejs 官方的发布说明，有望在今年下半年（10 月左右）删除 Nodejs 12 中的警告，届时 Node 14 将会成为 LTS**。

## ES Modules 基本使用

通过声明 .mjs 后缀的文件或在 package.json 里指定 type 为 module 两种方式使用 ES Modules，下面分别看下两种的使用方式：

### 使用方式一

构建如下目录结构

```
├── caculator.js
├── index.js
└── package.json
```

**package.json**

重点是将 type 设置为 module 来支持 ES Modules

```json
{
  "name": "esm-project",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  ...
}
```

**caculator.js**

```js
export function add (a, b) {
  return a + b;
};
```

**index.js**

```js
import { add } from './caculator.js';

console.log(add(4, 2)); // 6
```

**运行**

与当前的 v14.3.0 不同的是在 v12.17.0 中使用 ESM 运行时仍然会触发一个 experimental 警告信息。

```
$ n run v12.17.0 index.js     
(node:6827) ExperimentalWarning: The ESM module loader is experimental.
6

$ n run v14.3.0 index.js
6
```

### 使用方式二

通过**指定文件扩展名为 .mjs** 与 CommonJS 模块进行区分，这样是不需要在 package.json 中指定 type 为 module。

在上述例子基础上修改文件扩展名即可。

```
├── caculator.mjs
├── index.mjs
```

运行

```
$ n run v12.17.0 index.mjs     
(node:6827) ExperimentalWarning: The ESM module loader is experimental.
6
```

## 模块导入导出的几种方式

### export 导出

export 用于对外输出模块，可导出常量、函数、文件等，相当于定义了对外的接口，两种导出方式：

* export: 使用 export 方式导出的，导入时要加上 {} 需预先知道要加载的变量名，在一个文件中可以使用多次。
* export default: 为模块指定默认输出，这样加载时就不需要知道所加载的模块变量名，一个文件中仅可使用一次。

```js
// caculator.js
export function add (a, b) {
  return a + b;
};

export function subtract (a, b) {
  return a - b;
}

const caculator = {
  add,
  subtract,
}

export default caculator;
```

### import 导入

import 语句用于导入另一个模块导出的绑定，三种导入方式：

* 导入默认值：导入在 export default 定义的默认接口。
* as 别名导入：在导入时可以重命名在 export 中定义的接口。
* 单个或多个导入：根据需要导入 export 定一个的一个或多个接口。

```js
import { add } from './caculator.js';
import caculator from './caculator.js';
import * as caculatorAs from './caculator.js';

add(4, 2)
caculator.subtract(4, 2);
caculatorAs.subtract(4, 2);
```

### import 的动态导入

可以像调用函数一样动态的导入模块，它将返回一个 Promise，但是这种方式需要 **Top-Level await 支持**，如果你不知道 Top-Level await 是什么可以看下这篇文章 [Nodejs v14.3.0 发布支持顶级 Await 和 REPL 增强功能](https://mp.weixin.qq.com/s/tNjbpD3paVKxHmo5bq5QIw)。

**现在我们有如下导出模块 my-module.js：**

```js
const sleep = (value, ms) => new Promise(resolve => setTimeout(() => resolve(value), ms));

export const hello = await sleep('Hello', 1000);
export const node = await sleep('Nodejs', 2000);
export default function() {
  return 'this is a module';
}
```

**在 index.js 中可以像如下形式进行动态导入：**

```js
console.log('Start loading module...')
const myModule = await import('./my-module.js');
console.log('Output after 3000 ms.')
console.log(myModule.hello);
console.log(myModule.node);
console.log(myModule.default());
```

**运行**



```
$ n run v14.3.0 --experimental_top_level_await index.js
Start loading module...
Output after 3000 ms.
Hello
Nodejs
this is a module
```

本周 Nodejs v12.17.0 LTS 版发布，在这之前如果我们使用 ES Modules 还需要加上标志 --experimental-modules，而在本次版本发布取消了这个标志，本文也是对在 Nodejs 中使用 ES Modules 进行了入门讲解，后续也会进行更深入的研究分享，希望看完你能有所收获。

## Reference

* [nodejs.org/en/blog/release/v12.17.0/](https://nodejs.org/en/blog/release/v12.17.0/)
* [nodejs.org/dist/latest-v14.x/docs/api/esm.html](https://nodejs.org/dist/latest-v14.x/docs/api/esm.html)