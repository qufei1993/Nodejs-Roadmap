# Javascript运行机制

> Nodejs的单线程是指Javascript运行在单线程中，而不是Nodejs是单线程

### js工作机制:

* 当线程中没有执行任何同步代码的前提下才会执行异步代码

* 一个浏览器环境只能有一个事件循环，一个事件循环可以有多个任务队列

* 事件优先级顺序 ``` process.nextTick > promise.then > setTimeout > setImmediate ```

* Event Loop(时间循环)处理异步任务，分为两种 宏任务（MacroTask）和微任务（MicroTask），在执行宏任务之前会先清空微任务。

术语:

macrotask queue 宏任务队列

```javascript
setImmediate  
setTimeout //有一个最小延迟4ms
setInterval  
I/O  
```
microtask queue 微任务队列

```
process.nextTick  
Promise（new Promise是同步任务，被放到主线程里，then里的函数是异步任务，会被放入任务队列）  
MutaionObserver（H5新特性）  
Object.observe (已废弃)  
```

### 例1： 

该程序会陷入一个死循环，setTimeout属于异步操作，只有当js空闲才会执行，但死循环是不会空闲的，因此setTimeout也将永远不会执行

```javascript
var t = true;

setTimeout(function (){
    t = false;
    console.log('setTimeout', t);

},1000);

while (t){
}

console.log('end');
```

### 例2: 

> javascript是单线程，只有同步代码执行完毕后，才会去执行异步代码，下面的例子中每次for循环javascript都会挂起这个异步操作，
setTimeout会进入一个任务队列，继续执行下面的代码，等到同步代码执行完毕后，系统开始读取挂起来的异步操作(异步的任务队列),
也就是这些异步任务指定的回调函数

[知乎讨论](https://www.zhihu.com/question/266410249/answer/307932313)

```javascript

//如果是var声明会输出5个5，解决这个问题，在代码块中使用闭包或者let或const声明都可以

for (let i = 0; i < 5; i++) {
    console.log(i);

    setTimeout(function() {
        console.log('setTimeout: ', i);
    },1000 * i);
}

/**
 * 输出结果:
 * 0
 * 1
 * 2
 * 3
 * 4
 * setTimeout:  0
 * setTimeout:  1
 * setTimeout:  2
 * setTimeout:  3
 * setTimeout:  4
 */
```

### 例3
### process.nextTick与setTimeout递归调用区别

问题出自 [ElemeFE](https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md#processnexttick)

> process.nextTick属于微任务，是在当前执行栈的尾部，EventLoop之前触发，下面两个都是递归调用，test1中process.nextTick，是在当前执行栈调用，是一次性执行完，相当于 while(true){}，主线程陷入了死循环，阻断IO操作。

> test2方法中，setTimeout属于宏任务，在任务队列中，同样也是递归不是一次性的执行而是在多次Loop，不会阻断IO操作，另外注意setTimeout有一个最小的时间4ms。

```javascript
function test1() {
    process.nextTick(() => test());
}

function test2() {
    setTimeout(() => test(), 0);
}
```

process.nextTick将会阻塞IO，setImmediate不会输出

```javascript
{
    function test() {
        return process.nextTick(() => test());
    }

    test();

    setImmediate(() => {
        console.log('setImmediate');
    })
}
```

下面使用setTimeout不会造成IO阻塞，会输出 setImmediate

```javascript
function test() { 
    setTimeout(() => test(), 0);
}

test()

setImmediate(() => {
    console.log('setImmediate');
})

// setImmediate
```

### 例4 setImmediate与setTimeout

```javascript
setImmediate(
    function(){ console.log(1); }
,0);
setTimeout(
    function(){ console.log(2); }
,0);

// 浏览器环境运行结果
// 1
// 2

// Nodejs环境运行结果
// 2
// 1

```

```javascript
setImmediate(function A() {
    console.log(1);
    setImmediate(function B(){console.log(2);});
});

setTimeout(function timeout() {
    console.log('TIMEOUT FIRED');
}, 0);

// 浏览器环境运行结果
// 1
// 2
// TIMEOUT FIRED

// Nodejs环境运行结果两种情况
// 1
// TIMEOUT FIRED
// 2

// TIMEOUT FIRED
// 1
// 2
```

### 相关资料

[初探javascript事件环EventLoop](https://zhuanlan.zhihu.com/p/33127885)

[javascript的运行机制](https://www.jianshu.com/p/1ec915675ba7)

[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)