# Javascript运行机制

> Nodejs的单线程是指Javascript运行在单线程中，而不是Nodejs是单线程

### js工作机制:

* 当线程中没有执行任何同步代码的前提下才会执行异步代码

* 一个浏览器环境只能有一个事件循环，一个事件循环可以有多个任务队列

* 事件优先级顺序 ``` process.nextTick > promise.then > setTimeout > setImmediate ```

术语:

macrotask queue 宏任务队列
microtask queue 微任务队列

例1： 

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

例2: 

> javascript是单线程，只有同步代码执行完毕后，才会去执行异步代码，下面的例子中每次for循环javascript都会挂起这个异步操作，
setTimeout会进入一个任务队列，继续执行下面的代码，等到同步代码执行完毕后，系统开始读取挂起来的异步操作(异步的任务队列),
也就是这些异步任务指定的回调函数

[知乎讨论](https://www.zhihu.com/question/266410249/answer/307932313)

```javascript
for (let i = 0; i < 5; i++) {
    console.log(i);

    setTimeout(function() {
        console.log('setTimeout: ', i);
    },1000 * i);
}

/**
 * 因此会先输出 0 1 2 3 4 最后输出 
 * setTimeout:  0
 * setTimeout:  1
 * setTimeout:  2
 * setTimeout:  3
 * setTimeout:  4
 */
```

推荐几篇关于javascript运行机制的文章

[初探javascript事件环EventLoop](https://zhuanlan.zhihu.com/p/33127885)

[javascript的运行机制](https://www.jianshu.com/p/1ec915675ba7)