# Promise

> 在JavaScript的世界中，所有代码都是单线程执行的。为了使程序不阻塞执行有了异步（I/O操作、事件操作），但是异步也有其不好之处，例如：异步回调callback回调地狱的问题，伴随着这些问题有了解决方案Promise。

## 快速导航
- [Promise的基本使用和原理](#promise的基本使用和原理)
- [Callback方式书写](#callback方式书写)
- [Promise方式书写](#promise方式书写)
- [Promise.finally()](#finally)
- [Promise并行执行 Promise.all()](#promise并行执行)
- [Promise率先执行 Promise.race()](#promise率先执行)
- [错误捕获](#错误捕获)

## 面试指南  
- ```Promise 中 .then 的第二参数与 .catch 有什么区别?```，参考：[错误捕获](#错误捕获)
- ```怎么让一个函数无论promise对象成功和失败都能被调用？```，参考：[finally](#finally)

## promise的基本使用和原理

1. 如何异常捕获（Error、reject）通过catch捕获
2. 多个串联-链式执行的好处
3. Promise.all和Promise.race
4. Promise标准-状态变化（Pending —— Fulfilled/Rejected）
5. then函数，不明文指定返回实例，返回本身的promise实例，否则返回指定的promise实例

## callback方式书写

> 回调函数方式书写，如果异步请求多了，将会很难维护，程序看着很乱，最终会导致回调地狱。

```js
{
  let ajax = function(callback){
    console.log('执行');
    setTimeout(function(){
      callback && callback()
    });
  }

  ajax(function(){
    console.log('执行 ajax方法');
  })
}
```

## promise方式书写

- **```resove```**：执行下一步操作
- **```reject```**：中断当前操作
- **```then```**：是```Promise```返回的对象，执行下一个，如果有两个函数，第一个表示```resolved```(已成功),第二个表示```rejected```(已失败)

```javascript
let ajax = function(){
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

- **执行两个Promise的效果**

```javascript
{
  let ajax = function(){
    console.log('promise','执行');
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve()
      },1000);
    });
  }
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
}
```

- **多个Promise实例实现串行操作**

> 执行a b c d 如果中间出了错误使用catch来捕获

```javascript
{
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
}
```


## finally

> finally() 方法返回一个Promise，在promise执行结束时，无论结果是fulfilled或者是rejected，在执行then()和catch()后，都会执行finally指定的回调函数。这为指定执行完promise后，无论结果是fulfilled还是rejected都需要执行的代码提供了一种方式，避免同样的语句需要在then()和catch()中各写一次的情况。

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

## promise并行执行
## Promise.all()

> **Promise.all**是将多个Promise实例当成一个Promise实例，all方法里是一个数组，数组传进来多个Promise实例，当多个Promise实例状态发生改变的时候，这个新的Promise实例才会发生变化。
```javascript
//所有图片加载完在添加到页面上
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

// 每个loadImg()方法都是一个Promise实例只有当三个都发生该变化，才会执行新的Promise实例既Promise.all()
Promise.all([
  loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
  loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
  loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
]).then(showImgs)
```

## promise率先执行
## Promise.race()

> **Promise.race**只要其中一个实例率先发生改变，**Promise.race**实例也将发生改变，其他的将不在响应。

```js
{
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
}

```

## 错误捕获

> **Promise.then第二个参数与catch捕获错误的区别?**

- **.then第二参数捕获错误**

> .then第二个回调参数捕获错误具有就近的原则，不会影响后续then的进行。

```js
{
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
    })

  // 输出
  // promise开始执行
  // then1里面捕获的err:  There's a mistake
  // then2
  // catch里面捕获的err:  There's a then mistake
}
```

- **catch捕获错误**

> Promise抛错具有冒泡机制，能够不断传递，可以使用catch统一处理，下面代码中不会输出then1 then2会跳过，直接执行catch处理错误

```javascript
{
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
  // catch里面捕获的err:  There's a then mistake
}
```

**```总结：```** 不论是Promise还是async/await在写法上解决了异步回调的问题，但是任何写法都不会改变JS单线程、异步的本质，除非js执行引擎发生变化。

```js
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

#### 资料推荐

Promise/A+规范参考[http://www.ituring.com.cn/article/66566](http://www.ituring.com.cn/article/66566)
