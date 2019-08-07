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

#### 资料推荐

Promise/A+规范参考[http://www.ituring.com.cn/article/66566](http://www.ituring.com.cn/article/66566)
