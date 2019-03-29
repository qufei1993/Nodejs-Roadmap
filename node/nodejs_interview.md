## NodeJs

NodeJS是一个基于V8引擎的Javascript运行环境，使用事件驱动模型而不是复杂的多线程，在服务器环境中，处理二进制数据通常是必不可少的，但javascript对此支持不足，因此V8.Node增加了Buffer类，方便并且高效地处理二进制数据。

## 前端

* virtualDom是什么？为什么会存在vdom?
* virtualDom如何应用，核心API有哪些？
* diff算法

* 对MVVM的理解
* VUE中如何实现响应式？
* VUE中如何解析模板
* VUE的整个实现流程

* 组件化的理解

<hr>

请求过滤器，

## 设计模式

* 5种设计原则
* 23种设计模式

<hr>

## JavaScript基础

* 原型的实际应用（可以基于Jquery、Zepto进行讲解）
* 原型的扩展
* Jquery的Deferred了解程度

## NodeJs

* Express与Koa框架的区别？
* 都用到哪些中间件
* Require加载机制原理?
* exports与module.exports的区别
缓存，只加载一次（高级，会问到内部原理）
* js回调地狱？及解决方案，期望答案promise，在介绍下promise的状态变化及原理(初级)
* Promise 中 .then 的第二参数与 .catch 有什么区别?
* Nodejs是单线程还是多线程及为什么是单线程？
* 异步的具体实现是什么？
* Event Loop的理解
* Promise.then 与 setTimeout的执行顺序
* process.nextTick与setTimeout递归调用区别
* 事件优先级process.nextTick 与 Promise().then的执行顺序
* 如何实现一个sleep？

* 服务部署是通过什么方式？(是否自动化部署)
* 负载均衡的情况线上日志怎么排查？
* 有没有用过日志打印插件 （log4js、winston）
* 实现console.log思路是什么？(根本还是process.stdout.write)（难）
* 全链路日志追踪有没有实现思路（难）
* 项目的配置信息是怎么做的？期望听到服务注册发现（zk、consul）
* 加解密
	对称加密、非对称、hash（不可逆加密）
* 高并发调优经验？

redis 时间

## NodeJs进程相关问题

* js是单线程，如果利用好多核CPU的并发优势呢？（易）
* 代码中有app.listen(port)，Cluster在fork()的时候为什么没有报端口冲突呢？（难）
	> 总结来说端口只被master进程监听了一次，work进程中最后执行端口监听的方法被已被cluster模块主动hack掉了。 [cnode](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)
* Node.js 的 IPC通信，什么情况下需要 IPC, 以及使用 IPC 处理过什么业务场景等（难）
> 在通过 child_process 建立子进程的时候, 是可以指定子进程的 env (环境变量) 的. 所以 Node.js 在启动子进程的时候, 主进程先建立 IPC 频道, 然后将 IPC 频道的 fd (文件描述符) 通过环境变量 (NODE_CHANNEL_FD) 的方式传递给子进程, 然后子进程通过 fd 连上 IPC 与父进程建立连接.

<hr>

## HTTP

* http协议（跨域、缓存）
* https是否了解？
* https协议加密算法
* http.Agent
* socket hang up
	hang up 有挂断的意思, socket hang up 也可以理解为 socket 被挂断. 在 Node.js 中当你要 response 一个请求的时候, 发现该这个 socket 已经被 "挂断", 就会报 socket hang up 错误.

	典型的情况是用户使用浏览器, 请求的时间有点长, 然后用户简单的按了一下 F5 刷新页面. 这个操作会让浏览器取消之前的请求, 然后导致服务端 throw 了一个 socket hang up.

* 可读流与可写流	
* 域名DNS解析过程

<hr>

## 数据库

* 做过哪些MongoDB的优化
* MongoDB的关联查询是否了解？DBRef
* MongoDB内部存储原理（难-百度）
* 生产环境需要创建索引，该怎么创建？直接通过客户端创建会造成什么影响？

## 其他

* 都有哪些开发标准（按照公司开发标准走）

## JS篇

#### 1.js的基本类型和复杂类型？
	基本类型变量存的是值，复杂类型变量存的是内存地址。  
	js中有5种基本数据类型：Undefined、Null、Boolean、Number和String  
	复杂类型Object  

#### 2.js判断数组类型的方法
	2.1 ```javascript instanceof	console.log(a instanceof Array)```  
	2.2 ```javascript constructor console.log(a.constructor == Array);```  
	2.3
	```javascript
		function isArray(o) {
    			return Object.prototype.toString.call(o) === ‘[object Array]‘;
		}
	```
#### 3.理解js回调地狱
	回调函数式是闭包的  
	有很多层级的回调函数，看起来很凌乱 成为“回调地狱”。  

#### 4.js获取函数参数的个数
	形参个数arguments.callee.length   arguments.callee就是取得函数的名字
	实参个数： arguments.length

## Express框架与Koa框架的区别
	Koa是一个基于ES6规范的开发框架。  
	最明显的差别就是handel处理方法，一个是普通的回调函数，一个是利用生成器函数作为相应器  
	Express 的优点是线性逻辑：路由和中间件完美融合，通过中间件形式把业务逻辑细分，简化，一个请求进来经过一系列中间件处理后再响应给用户，再复杂的业务也是线性了，清晰明了。
	KOA借助 promise 和 generator 的能力，丢掉了 callback，完美解决异步组合问题和异步异常捕获问题。   

## mongoose关联查询
1.mongodb如何关联查询：通过populate实现关联查询。
```javascript
//通过ObjectId在模式中定义主键，
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
from:{type:ObjectId,ref:'user'}, //ref指向要关联的信息
```

## 异步

#### 什么是单线程，和异步之间的关系

单线程，同一时间只能做一件事，是为了避免DOM渲染的冲突，解决方案就是异步处理，异步的实现方式是Event Loop。但是异步也有几点不好之处，一方面是可读性差代码并不是按照书写的方式执行，另一方面异步回调callback回调地狱的问题，同样伴随这异步的这些问题，又有了新的解决方案Promise、Async／Await。

#### 什么是event-loop

事件轮询是JS实现异步的具体解决方案，同步代码直接执行，异步函数先放在异步队列中，待同步函数执行完毕，轮循执行异步队列的函数。

#### Jquery的Deferred解决方案
* Jquery的Deferred是最早提出解决异步的方式

* Jquery1.5之后出现了Deferred，Promise也是从Deferred演变过来的，最后逐渐一套标准，独立出来了。

*  重点还是回归到问题本身，Deferred是Jquery1.5版本对Ajax的改变衍生出来的一个东西，其遵循对扩展开放修改封闭的一个原则，看下以下封装示例：

```html

<script>
	// 异步加载图片示例
	function loadImage(src) {
		var dtd = $.Deferred();
		var img = document.createElement('img');

		img.src = src;
		img.onload = function() {
			dtd.resolve(img);
		}

		img.onerror = function(err) {
			dtd.reject(err);
		}

		return dtd.promise();// 返回promise对象，而不是直接返回deferred对象
	}

	loadImage('https://images.pexels.com/photos/457044/pexels-photo-457044.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500')
		.then(function(result) {
			document.body.appendChild(result);

			console.log(result);
		})
		.catch(function(err) {
			console.error(err);
		})
</script>
```
* Deferred与promise的区别
> Deferred这种对象有主动触发resolve、reject这种函数，也有done、fail、then这种被动监听函数，这些函数混在一块很容易被外部篡改，通过生成promise对象进行隔离，promise只有被动监听，没有主动修改。

#### Promise的基本使用和原理

	1. 如何异常捕获（Error、reject）通过catch捕获
	2. 多个串联-链式执行的好处
	3. Promise.all和Promise.race
	4. Promise标准-状态变化（Pending —— Fulfilled/Rejected）
	5. then函数，不明文指定返回实例，返回本身的promise实例，否则返回指定的promise实例

#### 介绍一下async/await（和Promise的区别、联系）

* await后面必须是一个promise实例，函数外层需要加上async修饰
* 使用了Promise，并没有和Promise冲突，完全是同步的写法，没有了回调函数

#### 总结一下当前JS解决异步的方案
	Jquery的deferred、Promise、Async/Await

#### 总结

不论是Promise还是async/await在写法上解决了异步回调的问题，但是任何写法都不会改变JS单线程、异步的本质，除非js执行引擎发生变化。

入网IP是我们公布在外网供他人来调用的IP
出网IP是我们调用他人，他人进行解析加入白名单