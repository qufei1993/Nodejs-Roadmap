# Node.js 工具模块 promisify 实现原理解析

Nodejs util 模块提供了很多工具函数。为了解决回调地狱问题，Nodejs v8.0.0 提供了 promisify 方法可以将 Callback 转为 Promise 对象。

工作中对于一些老项目，有 callback 的通常也会使用 util.promisify 进行转换，之前更多是知其然不知其所以然，本文会从基本使用和对源码的理解实现一个类似的函数功能。

## 1. Promisify 简单版本实现

在介绍 util.promisify 的基础使用之后，实现一个自定义的 util.promisify 函数的简单版本。

### 1.1 util promisify 基本使用

将 callback 转为 promise 对象，首先要确保这个 callback 为一个错误优先的回调函数，即 (err, value) => ... err 指定一个错误参数，value 为返回值。

以下将以 fs.readFile 为例进行介绍。

**创建一个 text.txt 文件**

创建一个 text.txt 文件，写入一些自定义内容，下面的 Demo 中我们会使用 fs.readFile 来读取这个文件进行测试。

```txt
// text.txt
Nodejs Callback 转 Promise 对象测试
```

**传统的 Callback 写法**

```js
const util = require('util');

fs.readFile('text.txt', 'utf8', function(err, result) {
  console.error('Error: ', err); 
  console.log('Result: ', result); // Nodejs Callback 转 Promise 对象测试
});
```

**Promise 写法**

这里我们使用 util.promisify 将 fs.readFile 转为 Promise 对象，之后我们可以进行 .then、.catch 获取相应结果

```js
const { promisify } = require('util');
const readFilePromisify = util.promisify(fs.readFile); // 转化为 promise

readFilePromisify('text.txt', 'utf8')
  .then(result => console.log(result)) // Nodejs Callback 转 Promise 对象测试
  .catch(err => console.log(err));
```

### 1.2 自定义 mayJunPromisify 函数实现

自定义 mayJunPromisify 函数实现 callback 转换为 promise，核心实现如下：

* 行 {1} 校验传入的参数 original 是否为 Function，不是则抛错
* promisify(fs.readFile) 执行之后会返回一个函数 fn，行 {2} 定义待返回的 fn 函数，行 {3} 处返回
* fn 返回的是一个 Promise 对象，在返回的 Promise 对象里执行 callback 函数

```js
function mayJunPromisify(original) {
  if (typeof original !== 'function') { // {1} 校验
    throw new Error('The "original" argument must be of type Function. Received type undefined')
  }

  function fn(...args) { // {2} 
    return new Promise((resolve, reject) => {
      try {
        // original 例如，fs.readFile.call(this, 'filename', 'utf8', (err, result) => ...)
        original.call(this, ...args, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch(err) {
        reject(err);
      }
    });
  }

  return fn; // {3}
}
```

现在使用我们自定义的 mayJunPromisify 函数做一个测试 

```js
const readFilePromisify = mayJunPromisify(fs.readFile);

readFilePromisify('text.txt', 'utf8')
  .then(result => console.log(result)) // Nodejs Callback 转 Promise 对象测试
  .catch(err => console.log(err));
```

## 2. Promisify 自定义 Promise 函数版本实现

另一个功能是可以使用 util.promisify.custom 符号重写 util.promisify 返回值。

### 2.1 util.promisify.custom 基本使用

在 fs.readFile 上定义 util.promisify.custom 符号，其功能为禁止读取文件。

注意顺序要在 util.promisify 之前。

```js
fs.readFile[util.promisify.custom] = () => {
  return Promise.reject('该文件暂时禁止读取');
}

const readFilePromisify = util.promisify(fs.readFile);

readFilePromisify('text.txt', 'utf8')
  .then(result => console.log(result))
  .catch(err => console.log(err)); // 该文件暂时禁止读取
```

### 2.2 自定义 mayJunPromisify.custom 实现

* 定义一个 Symbol 变量 kCustomPromisifiedSymbol 赋予 mayJunPromisify.custom 
* 行 {1} 校验是否有自定义的 promise 化函数
* 行 {2} 自定义的 mayJunPromisify.custom 也要保证是一个函数，否则抛错
* 行 {3} 直接返回自定义的 mayJunPromisify.custom 函数，后续的 fn 函数就不会执行了，因此在这块也就重写了 util.promisify 返回值

```js
// 所以说 util.promisify.custom 是一个符号
const kCustomPromisifiedSymbol = Symbol('util.promisify.custom');
mayJunPromisify.custom = kCustomPromisifiedSymbol;

function mayJunPromisify(original) {
  if (typeof original !== 'function') {
    throw new Error('The "original" argument must be of type Function. Received type undefined')
  }

  // 变动之处 -> start
  if (original[kCustomPromisifiedSymbol]) { // {1}
    const fn = original[kCustomPromisifiedSymbol];
    if (typeof fn !== 'function') { // {2}
      throw new Error('The "mayJunPromisify.custom" property must be of type Function. Received type number');
    }
    
    // {3}
    return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
  }
  // end <- 变动之处
  
  function fn(...args) {
    ...
  }

  return fn;
}
```

同样测试下我们自定义的 mayJunPromisify.custom 函数。

```js
fs.readFile[mayJunPromisify.custom] = () => {
  return Promise.reject('该文件暂时禁止读取');
}

const readFilePromisify = mayJunPromisify(fs.readFile);

readFilePromisify('text.txt', 'utf8')
  .then(result => console.log(result))
  .catch(err => console.log(err)); // 该文件暂时禁止读取
```

## 3. Promisify 回调函数的多参转换

通常情况下我们是 (err, value) => ... 这种方式实现的，结果只有 value 一个参数，但是呢有些例外情况，例如 dns.lookup 它的回调形式是 (err, address, family) => ... 拥有三个参数，同样我们也要对这种情况做兼容。

### 3.1 util.promisify 中的基本使用

和上面区别的地方在于 .then 接收到的是一个对象 { address, family } 先明白它的基本使用，下面会展开具体是怎么实现的

```js
const dns = require('dns');
const lookupPromisify = util.promisify(dns.lookup);

lookupPromisify('nodejs.red')
  .then(({ address, family }) => {
    console.log('地址: %j 地址族: IPv%s', address, family);
  })
  .catch(err => console.log(err));
```

### 3.2 util.promisify 实现解析

类似 dns.lookup 这样的函数在回调（Callback）时提供了多个参数列表。

为了支持 util.promisify 也都会在函数上定义一个 customPromisifyArgs 参数，value 为回调时的多个参数名称，类型为数组，例如 dns.lookup 绑定的 customPromisifyArgs 的 value 则为 ['address', 'family']，其主要目的也是为了适配 util.promisify。

**dns.lookup 支持 util.promisify 核心实现**

```js
// https://github.com/nodejs/node/blob/v12.x/lib/dns.js#L33
const { customPromisifyArgs } = require('internal/util');

// https://github.com/nodejs/node/blob/v12.x/lib/dns.js#L159
ObjectDefineProperty(lookup, customPromisifyArgs,
                     { value: ['address', 'family'], enumerable: false });
```

**customPromisifyArgs**

customPromisifyArgs 这个参数是从 internal/util 模块导出的，仅内部调用，因此我们在外部 util.promisify 上是没有这个参数的。

也意味着只有 Nodejs 模块中例如 dns.klookup()、fs.read() 等方法在多参数的时候可以使用 util.promisify 转为 Promise，如果我们自定义的 callback 存在多参数的情况，使用 util.promisify 则不行，当然，如果你有需要也可以基于 util.promisify 自己封装一个。

```js
// https://github.com/nodejs/node/blob/v12.x/lib/internal/util.js#L429
module.exports = {
  ...
  // Symbol used to customize promisify conversion
  customPromisifyArgs: kCustomPromisifyArgsSymbol,
};
```

**util.promisify 核心实现解析**

参见源码 [internal/util.js#L277](https://github.com/nodejs/node/blob/v12.x/lib/internal/util.js#L277)

* 行 {1} 定义 Symbol 变量 kCustomPromisifyArgsSymbol
* 行 {2} 获取参数名称列表
* 行 {3} (err, result) 改为 (err, ...values)，原先 result 仅接收一个参数，改为 ...values 接收多个参数
* 行 {4} argumentNames 存在且 values > 1，则回调会存在多个参数名称，进行遍历，返回一个 obj
* 行 {5} 否则 values 最多仅有一个参数名称，即数组 values 有且仅有一个元素

```js
// https://github.com/nodejs/node/blob/v12.x/lib/internal/util.js#L277
const kCustomPromisifyArgsSymbol = Symbol('customPromisifyArgs'); // {1}

function promisify(original) {
  ...

  // 获取多个回调函数的参数名称列表
  const argumentNames = original[kCustomPromisifyArgsSymbol]; // {2}

  function fn(...args) {
    return new Promise((resolve, reject) => {
      try {
        // (err, result) 改为 (err, ...values) {3}
        original.call(this, ...args, (err, ...values) => {
          if (err) {
            reject(err);
          } else {
            // 变动之处 -> start
            // argumentNames 存在且 values > 1，则回调会存在多个参数名称，进行遍历，返回一个 obj
            if (argumentNames !== undefined && values.length > 1) { // {4}
              const obj = {};
              for (let i = 0; i < argumentNames.length; i++)
                obj[argumentNames[i]] = values[i];
              resolve(obj);
            } else { // {5} 否则 values 最多仅有一个参数名称，即数组 values 有且仅有一个元素
              resolve(values[0]);
            }
            // end <- 变动之处
          }
        });
      } catch(err) {
        reject(err);
      }
    });
  }

  return fn;
}
```

## 4. 实现一个完整的 promisify

上面第一、第二节我们自定义实现的 mayJumPromisify 分别实现了含有 (err, result) => ... 和自定义 Promise 函数功能。

第三节中介绍的回调函数多参数转换，由于 kCustomPromisifyArgsSymbol 使用 Symbol 声明（每次重新定义都会不一样），且没有对外提供，如果要实现第三个功能，需要我们每次在 callback 函数上重新定义 kCustomPromisifyArgsSymbol 属性。

例如，以下定义了一个 callback 函数用来获取用户信息，返回值是多个参数 name、age，通过定义 kCustomPromisifyArgsSymbol 属性，即可使用我们自己写的 mayJunPromisify 来转换为 Promise 形式。

```js
function getUserById(id, cb) {
  const name = '张三', age = 20;

  cb(null, name, age);
}

Object.defineProperty(getUserById, kCustomPromisifyArgsSymbol, {
  value: ['name', 'age'], enumerable: false 
})

const getUserByIdPromisify = mayJunPromisify(getUserById);

getUserByIdPromisify(1)
  .then(({ name, age }) => {
    console.log(name, age);
  })
  .catch(err => console.log(err));
  
```

**自定义 mayJunPromisify 实现源码**

```
https://github.com/Q-Angelo/project-training/tree/master/nodejs/module/promisify
```

## 总结

util.promisify 是 Nodejs 提供的一个实用工具函数用于将 callback 转为 promise，本节从**基本使用 (err, result) => ... 转 Promise**、**自定义 Promise 函数重写 util.promisify 返回值**、**Promisify 回调函数的多参转换**三个方面进行了讲解，在理解了其实现之后自己也可以实现一个类似的函数。