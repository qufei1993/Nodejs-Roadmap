# Promise

在 JavaScript 的世界中，所有代码都是单线程执行的。为了使程序不阻塞执行有了异步（I/O操作、事件操作），但是异步也有其不好之处，例如：异步回调callback 回调地狱的问题，伴随着这些问题有了解决方案 Promise。
## Callback 方式书写

回调函数方式书写，如果异步请求多了，将会很难维护，程序看着很乱，也很容易导致回调地狱。

```js
const ajax = function(callback){
  console.log('执行');
  setTimeout(function(){
    callback && callback()
  });
}

ajax(function(){
  console.log('执行 ajax方法');
})
```

## Promise 方式书写

Promise 标准-状态变化（Pending —— Fulfilled/Rejected），then 函数不明文指定返回实例，返回本身的 Promise 实例，否则返回指定的 Promise 实例。

- **resove**：执行下一步操作
- **reject**：中断当前操作
- **then**：是 ```Promise``` 返回的对象，执行下一个，如果有两个函数，第一个表示成功 ```resolved```，第二个表示失败 ```rejected```。

```javascript
const ajax = function(){
  console.log('promise','执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve()
    },1000);
  });
}

ajax().then(function(){
  console.log('promise','执行ajax方法');
});
```

- **执行两个 Promise 的效果**

```javascript
const ajax = function(){
  console.log('promise','执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve()
    },1000);
  });
};
ajax()
  .then(function(){
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve();
      },1000);
    });
  })
  .then(function(){
    console.log('promise3','执行3');
  })
```

- **多个 Promise 实例实现串行操作**

执行 a b c d 如果中间出了错误使用 catch 来捕获

```javascript
let ajax = function(num){
  console.log('执行4');
  return new Promise(function(resolve,reject){
    if (num > 5) {
      resolve();
    }else{
      throw new Error('出错了')
    }
  });
}
ajax(6).then(function(){
  console.log('log','6');
}).catch(function(err){
  console.log('catch',err);
});
ajax(3).then(function(){
  console.log('log','3');
}).catch(function(err){
  console.log('catch','err');
});
// 输出：
// 执行4
// 执行4
// log 6
// catch err
```

## finally

Promise 执行结束后无论结果是 fulfilled 或 rejected 都会触发 finally 指定的回调函数。避免了同样的代码在 then()、catch() 重复书写。

```js
Promise.resolve('success').then(result => {
  console.log('then: ', result)

  return Promise.resolve(result);
}).catch(err => {
  console.error('catch: ', err);

  return Promise.reject(err);
}).finally(result => {
  console.info('finally: ', result);
})

// then:  success
// finally:  undefined
// Promise {<resolved>: "success"}
```

## Promise.all() 并行执行

**Promise.all** 以数组的形式接收多个 Promise 实例，内部好比一个 for 循环同步的执行传入的多个 Promise 实例，一旦其中某个 Promise 实例发生 reject 就会触发 Promise.all() 的 catch() 函数。

```javascript
// 所有图片加载完在添加到页面上
function loadImg(src){
  return new Promise((resolve,reject) => {
    let img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      resolve(img);
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}

function showImgs(imgs){
  imgs.forEach(function(img){
    document.body.appendChild(img)
  })
}

Promise.all([
  loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
  loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
  loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
]).then(showImgs)
```

## Promise.race() 率先执行

**Promise.race()** 只要其中一个 Promise 实例率先发生改变，`Promise.race()` 实例也将发生改变，其他的将不在响应。

```js
// 有一个图片加载完就添加到页面上
function loadImg(src){
  return new Promise((resolve,reject) => {
    let img = document.createElement('img');
    img.src = src;
    img.onload = () => {
      resolve(img);
    }
    img.onerror = (err) => {
      reject(err)
    }
  })
}

function showImgs(img){
  let p = document.createElement('p');
  p.appendChild(img);
  document.body.appendChild(p);
}

Promise.race([
  loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
  loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
  loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
]).then(showImgs)
```

## 错误捕获

Promise 实例提供了两种错误捕获的方式，一种是 Promise.then() 方法的第二个参数，另一种是 Promise 实例的 catch() 函数。

### **.then 第二参数捕获错误**

`.then()` 第二个回调参数捕获错误具有就近的原则，不会影响后续 then 的进行。

```js
const ajax = function(){
  console.log('promise开始执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      reject(`There's a mistake`);
    },1000);
  });
}

ajax()
  .then(function(){
    console.log('then1');
    return Promise.resolve();
  }, err => {
    console.log('then1里面捕获的err: ', err);
  })
  .then(function(){
    console.log('then2');
    return Promise.reject(`There's a then mistake`);
  })
  .catch(err => {
    console.log('catch里面捕获的err: ', err);
  });

// 输出
// promise开始执行
// then1里面捕获的err:  There's a mistake
// then2
// catch里面捕获的err:  There's a then mistake
```

### **catch() 捕获错误**

Promise 抛错具有冒泡机制，能够不断传递，可以使用 catch() 统一处理，下面代码中不会输出 then1、then2，直接执行 catch() 处理错误。

```javascript
const ajax = function(){
  console.log('promise开始执行');
  return new Promise(function(resolve,reject){
    setTimeout(function(){
      reject(`There's a mistake`);
    },1000);
  });
}

ajax()
  .then(function(){
    console.log('then1');
    return Promise.resolve();
  })
  .then(function(){
    console.log('then2');
    return Promise.reject(`There's a then mistake`);
  })
  .catch(err => {
    console.log('catch里面捕获的err: ', err);
  })

// 输出
// promise开始执行
// catch里面捕获的err:  There's a mistake
```

不论是 Promise 还是 async/await 在写法上解决了异步回调 Callback 的问题，但是任何写法都不会改变 JavaScript 单线程、异步的本质，除非 JavaScript 执行引擎发生变化。

## 手写 Promise 代码

这是一个经典的面试问题了，我将它放了最后，理清了 Promise 的实现原理，很多问题自然就迎刃而解了，不废话直接上代码，共分为 5 部份完成，实现思路如下：

1. 声明 MayJunPromise 类
2. Then 方法
3. Promise 解决过程
4. 验证你的 Promise 是否正确
5. catch、resolve、reject、all、race 方法实现
6. 并发请求控制

### 1. 声明 MayJunPromise 类

主要在构造函数里做一些初始化操作

- 行 {1} 初始化一些默认值，Promise 的状态、成功时的 value、失败时的原因
- 行 {2} onResolvedCallbacks 用于一些异步处理 const p = new Promise(resolve => { setTimeout(function(){ resolve(1) }, 5000) })，当 resolve 在 setTimeout 里时，我们调用 p.then() 此时的状态为 pending，因此我们需要一个地方来保存，此处就是用于保存 Promise resolve 时的回调函数集合
- 行 {3} onRejectedCallbacks 与行 {2} 同理，保存 Promise reject 回调函数集合
- 行 {4} 成功时回调，先进行状态判断是不可逆的，如果 status = pending 修改状态和成功时的 value
- 行 {5} 失败时回调，与上面行 {4} 同理，例如 resolve(1); reject('err'); 第二个 reject 就无法覆盖
- 行 {6} 自执行
- 行 {7} 运行失败错误捕获

```javascript
/**
 * 封装一个自己的 Promise
 */
class MayJunPromise {
  constructor(fn) {
    // {1} 初始化一些默认值
    this.status = 'pending'; // 一个 promise 有且只有一个状态 (pending | fulfilled | rejected)
    this.value = undefined; // 一个 JavaScript 合法值（包括 undefined，thenable，promise）
    this.reason = undefined; // 是一个表明 promise 失败的原因的值
    this.onResolvedCallbacks = []; // {2}
    this.onRejectedCallbacks = []; // {3}

    // {4} 成功回调
    let resolve = value => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'; // 终态
        this.value = value; // 终值
        this.onResolvedCallbacks.forEach(itemFn => {
          itemFn()
        });
      }
    }

    // {5} 失败回调
    let reject = reason => {
      if (this.status === 'pending') { // 状态不可逆，例如 resolve(1);reject('err'); 第二个 reject 就无法覆盖
        this.status = 'rejected'; // 终态
        this.reason = reason; // 终值
        this.onRejectedCallbacks.forEach(itemFn => itemFn());
      }
    }
    
    try {
      // {6} 自执行
      fn(resolve, reject);
    } catch(err) {
      reject(err); // {7} 失败时捕获
    }
  }
}
```

### 2. Then 方法

- 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因
- 行 {8} onFulfilled、onRejected 这两个参数可选，由于 Promise .then 是可以链式调用的，对于值穿透的场景要做判断，如果不传，则返回一个函数，也就是将上个结果进行传递
- 行 {9} then 方法必须返回一个 promise 对象
- 行 {10}、{11} 、{12} 也是 then 方法内实现的三种情况，相类似，次数只拿状态等于 fulfilled 进行说明
- 行 {10.1}  Promise/A+ 规范定义：要确保 onFulfilled、onRejected 在下一轮事件循环中被调用，你可以使用 setTimeout 来实现，因为我这里是在 Node.js 环境下，因此推荐使用了 setImmediate 来注册事件（因为可以避免掉 setTimeout 的延迟）
- 行  {10.2} Promise/A+ 标准规定：如果 onFulfilled 或 onRejected 返回的是一个 x，那么它会以 [[Resolve]](promise2, x) 处理解析，我们定义解析的函数 resolveMayJunPromise，也是一个核心函数，下面进行讲解
```javascript
/**
 * 封装一个自己的 Promise
 */
class MayJunPromise {
  ...
  
  /**
   * 一个 promise 必须提供一个 then 方法以访问其当前值、终值和据因
   * @param { Function } onFulfilled 可选，如果是一个函数一定是在状态为 fulfilled 后调用，并接受一个参数 value
   * @param { Function } onRejected 可选，如果是一个函数一定是在状态为 rejected 后调用，并接受一个参数 reason
   * @returns { Promise } 返回值必须为 Promise
   */
  then(onFulfilled, onRejected) {
    // {8} 值穿透，把 then 的默认值向后传递，因为标准规定 onFulfilled、onRejected 是可选参数
    // 场景：new Promise(resolve => resolve(1)).then().then(value => console.log(value));
    onFulfilled = Object.prototype.toString.call(onFulfilled) === '[object Function]' ? onFulfilled : function(value) {return value};
    onRejected = Object.prototype.toString.call(onRejected) === '[object Function]' ? onRejected : function(reason) {throw reason};

    // {9} then 方法必须返回一个 promise 对象
    const promise2 = new MayJunPromise((resolve, reject) => {
      // {10}
      if (this.status === 'fulfilled') { // 这里的 this 会继承外层上下文绑定的 this
        // {10.1} Promise/A+ 规定：确保 onFulfilled、onRejected 在下一轮事件循环中被调用
        // 可以使用宏任务 (setTimeout、setImmediate) 或微任务（MutationObsever、process.nextTick）
        setImmediate(() => {
          try {
            // {10.2} Promise/A+ 标准规定：如果 onFulfilled 或 onRejected 返回的是一个 x，那么它会以 [[Resolve]](promise2, x) 处理解析
            const x = onFulfilled(this.value);
            // 这里定义解析 x 的函数为 resolveMayJunPromise
            resolveMayJunPromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
  
      // {11}
      if (this.status === 'rejected') {
        setImmediate(() => {
          try {
            const x = onRejected(this.reason)
            resolveMayJunPromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      // {12}
      // 有些情况无法及时获取到状态，初始值仍是 pending，例如：
      // return new Promise(resolve => { setTimeout(function() { resolve(1) }, 5000) })
      //	.then(result => { console.log(result) })
      if (this.status === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setImmediate(() => {
            try {
              const x = onFulfilled(this.value);
              resolveMayJunPromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
  
        this.onRejectedCallbacks.push(() => {
          setImmediate(() => {
            try {
              const x = onRejected(this.reason)
              resolveMayJunPromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }
}
```

### 3. Promise 解决过程

声明函数 resolveMayJunPromise()，**Promise 解决过程**是一个抽象的操作，在这里可以做到与系统的 Promise 或一些遵循 Promise/A+ 规范的 Promise 实现相互交互，以下代码建议跟随 Promise/A+ 规范进行阅读，规范上面也写的很清楚。<br />
<br />注意：在实际编码测试过程中规范 [2.3.2] 样写还是有点问题，你要根据其它的 Promise 的状态值进行判断，此处注释掉了，建议使用  [2.3.3] 也是可以兼容的 。<br />

```javascript
/**
 * Promise 解决过程
 * @param { Promise } promise2 
 * @param { any } x 
 * @param { Function } resolve 
 * @param { Function } reject 
 */
function resolveMayJunPromise(promise2, x, resolve, reject){
  // [2.3.1] promise 和 x 不能指向同一对象，以 TypeError 为据因拒绝执行 promise，例如：
  // let p = new MayJunPromise(resolve => resolve(1))
  // let p2 = p.then(() => p2); // 如果不做判断，这样将会陷入死循环
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  
  // [2.3.2] 判断 x 是一个 Promise 实例，可以能使来自系统的 Promise 实例，要兼容，例如：
  // new MayJunPromise(resolve => resolve(1))
  //		.then(() => new Promise( resolve => resolve(2)))
  // 这一块发现也无需，因为 [2.3.3] 已经包含了
  // if (x instanceof Promise) {
  // 	// [2.3.2.1] 如果 x 是 pending 状态，那么保留它（递归执行这个 resolveMayJunPromise 处理程序）
  // 	// 直到 pending 状态转为 fulfilled 或 rejected 状态
  // 	if (x.status === 'pending') {
  // 		x.then(y => {
  // 			resolveMayJunPromise(promise2, y, resolve, reject);
  // 		}, reject)
  // 	} else if (x.status === 'fulfilled') { // [2.3.2.2] 如果 x 处于执行态，resolve 它
  // 		x.then(resolve); 
  // 	} else if (x.status === 'rejected') { // [2.3.2.3] 如果 x 处于拒绝态，reject 它
  // 		x.then(reject);
  // 	}
  // 	return;
  // }

  // [2.3.3] x 为对象或函数，这里可以兼容系统的 Promise
  // new MayJunPromise(resolve => resolve(1))
  //		.then(() => new Promise( resolve => resolve(2)))
  if (x != null && (x instanceof Promise || typeof x === 'object' || typeof x === 'function')) {
    let called = false;
    try {
      // [2.3.3.1] 把 x.then 赋值给 then
      // 存储了一个指向 x.then 的引用，以避免多次访问 x.then 属性，这种预防措施确保了该属性的一致性，因为其值可能在检索调用时被改变。
      const then = x.then;

      // [2.3.3.3] 如果 then 是函数（默认为是一个 promise），将 x 作为函数的作用域 this 调用之。
      // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise (成功回调) ，第二个参数叫做 rejectPromise（失败回调）
      if (typeof then === 'function') {

        // then.call(x, resolvePromise, rejectPromise) 等价于 x.then(resolvePromise, rejectPromise)，笔者理解此时会调用到 x 即 MayJunPromise 我们自己封装的 then 方法上
        then.call(x, y => { // [2.3.3.3.1] 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
            if (called) return;
            called = true;
            resolveMayJunPromise(promise2, y, resolve, reject);
        }, e => { // [2.3.3.3.2] 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          if (called) return;
          called = true;

          reject(e);
        });
      } else {
        // [2.3.3.4 ] 如果 then 不是函数，以 x 为参数执行 promise
        resolve(x)
      }
    } catch(e) { // [2.3.3.2] 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      if (called) return;
      called = true;

      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

### 4. 验证你的 Promise 是否正确
Promise 提供了一个测试脚本，进行正确性验证。<br />

```javascript
npm i -g promises-aplus-tests
promises-aplus-tests mayjun-promise.js
```

<br />同时需要暴露出一个 deferred 方法。<br />

```javascript
MayJunPromise.defer = MayJunPromise.deferred = function () {
  let dfd = {}
  dfd.promise = new MayJunPromise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = MayJunPromise;
```

### 5. catch、resolve、reject、all、race 方法实现
Promise/A+ 规范中只提供了 then 方法，但是我们使用的 catch、Promise.all、Promise.race 等都可以在 then 方法的基础上进行实现

```javascript
class MayJunPromise {
   constructor(fn){...}
  then(){...},
  /**
   * 捕获错误
   * @param { Function } onRejected 
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}

/**
 * 仅返回成功态，即 status = fulfilled
 */
MayJunPromise.resolve = function(value) {
  return (value instanceof Promise || value instanceof MayJunPromise) ? value // 如果是 Promise 实例直接返回
    : new MayJunPromise(resolve => resolve(value));
}

/**
 * 仅返回失败态，即 status = rejected
 */
MayJunPromise.reject = function(value) {
  return (value instanceof Promise || value instanceof MayJunPromise) ? value : new MayJunPromise(reject => reject(value));
}

/**
 * MayJunPromise.all() 并行执行
 * @param { Array } arr
 * @returns { Array }
 */
MayJunPromise.all = function(arr) {
  return new MayJunPromise((resolve, reject) => {
    const length = arr.length;
    let results = []; // 保存执行结果
    let count = 0; // 计数器

    for (let i=0; i<length; i++) {
      MayJunPromise.resolve(arr[i]).then(res => {
        results[i] = res;
        count++;

        if (count === length) { // 全部都变为 fulfilled 之后结束
          resolve(results);
        }
      }, err => reject(err)); // 只要有一个失败，就将失败结果返回
    }
  });
}

/**
 * MayJunPromise.race() 率先执行，只要一个执行完毕就返回结果;
 */
MayJunPromise.race = function(arr) {
  return new MayJunPromise((resolve, reject) => {
    for (let i=0; i<arr.length; i++) {
      MayJunPromise.resolve(arr[i])
        .then(result => resolve(result), err => reject(err));
    }
  })
}
```

### 6. 并发请求控制

Promise.all 同时将请求发出，假设我现在有上万条请求，势必会造成服务器的压力，如果我想限制在最大并发 100 该怎么做？例如，在 Chrome 浏览器中就有这样的限制，Chrome 中每次最大并发链接为 6 个，其余的链接需要等待其中任一个完成，才能得到执行，下面定义 allByLimit 方法实现类似功能。

```javascript
/**
 * 并发请求限制
 * @param { Array } arr 并发请求的数组
 * @param { Number } limit 并发限制数
 */
MayJunPromise.allByLimit = function(arr, limit) {
  const length = arr.length;
  const requestQueue = [];
  const results = [];
  let index = 0;

  return new MayJunPromise((resolve, reject) => {
    const requestHandler = function() {	
      console.log('Request start ', index);
      const request = arr[index]().then(res => res, err => {
        console.log('Error', err);

        return err;
      }).then(res => {
        console.log('Number of concurrent requests', requestQueue.length)
        const count = results.push(res); // 保存所有的结果

        requestQueue.shift(); // 每完成一个就从请求队列里剔除一个

        if (count === length) { // 所有请求结束，返回结果
          resolve(results);
        } else if (count < length && index < length - 1) {
          ++index;
          requestHandler(); // 继续下一个请求
        }
      });

      if (requestQueue.push(request) < limit) {
        ++index;
        requestHandler();
      }
    };

    requestHandler()
  });
}
```

测试，定义一个 sleep 睡眠函数，模拟延迟执行

```javascript
/**
 * 睡眠函数
 * @param { Number } ms 延迟时间|毫秒
 * @param { Boolean } flag 默认 false，若为 true 返回 reject 测试失败情况
 */
const sleep = (ms=0, flag=false) => new Promise((resolve, reject) => setTimeout(() => {
  if (flag) {
    reject('Reject ' + ms);
  } else {
    resolve(ms);
  }
}, ms));

MayJunPromise.allByLimit([
  () => sleep(5000, true),
  () => sleep(1000),
  () => sleep(1000),
  () => sleep(4000),
  () => sleep(10000),
], 3).then(res => {
  console.log(res);
});

// 以下为运行结果
Request start  0
Request start  1
Request start  2
Number of concurrent requests 3
Request start  3
Number of concurrent requests 3
Request start  4
Error Reject 5000
Number of concurrent requests 3
Number of concurrent requests 2
Number of concurrent requests 1
[ 1000, 1000, 'Reject 5000', 4000, 10000 ]
```

### 7. Promise reference

- [https://zhuanlan.zhihu.com/p/21834559](https://zhuanlan.zhihu.com/p/21834559)
- [https://juejin.im/post/5b2f02cd5188252b937548ab](https://juejin.im/post/5b2f02cd5188252b937548ab)
- [https://promisesaplus.com/](https://promisesaplus.com/)
- [https://www.ituring.com.cn/article/66566](https://www.ituring.com.cn/article/66566)