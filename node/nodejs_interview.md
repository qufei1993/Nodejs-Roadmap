## 简单介绍下NodeJs？

NodeJS是一个基于V8引擎的Javascript运行环境，使用事件驱动模型而不是复杂的多线程，在服务器环境中，处理二进制数据通常是必不可少的，但javascript对此支持不足，因此V8.Node增加了Buffer类，方便并且高效地处理二进制数据。

## NodeJS四个特点：
	1.单线程
	2.非组塞式IO
	3.V8
	4.事件驱动

## 单线程与多线程
	单线程：多个请求占用一个线程
	多线程：一个请求占用多个线程
	Nginx：单线程
	Apache：多线程

## npm包安装在哪里
	node_modules

## Nodejs中间件有哪些
	logger: 用户请求日志中间件 express.logger 中间件已经独立 使用morgan var logger = require('morgan');
	body-parser：请求内容解析中间件，将表单提交的数据格式化。
	urlencoded: application/x-www-form-urlencode请求解析中间件
	cookieParser: cookie解析中间件
	cookieSession: 基于cookies的会话中间件
	session: 会话管理中间件

## require的理解

## Express框架与Koa框架的区别
	Koa是一个基于ES6规范的开发框架。  
	最明显的差别就是handel处理方法，一个是普通的回调函数，一个是利用生成器函数作为相应器  
	Express 的优点是线性逻辑：路由和中间件完美融合，通过中间件形式把业务逻辑细分，简化，一个请求进来经过一系列中间件处理后再响应给用户，再复杂的业务也是线性了，清晰明了。
	KOA借助 promise 和 generator 的能力，丢掉了 callback，完美解决异步组合问题和异步异常捕获问题。   

## NodeJS是单线程还是多线程
	Nodejs同Nginx服务器一样都是单线程，但是Node.js在底层访问I/O还是多线程  
	我们都知道 Node.js 是以单线程的模式运行的，但它使用的是事件驱动来处理并发，这样有助于我们在多核 cpu 的系统上创建多个子进程，从	而提高性能。

## 进程
	是计算机中的程序关于某数据集合上的一次运行活动, 是系统进行资源分配和调度的基本单位。

## 多进程
  启动多个进程, 多个进程可以一块执行多个任务

数据库篇：
1.mongodb如何关联查询：通过populate实现关联查询。
```javascript
//通过ObjectId在模式中定义主键，
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
from:{type:ObjectId,ref:'user'}, //ref指向要关联的信息
```

## Require加载机制原理
```todo:// ```

## MongoDB优化
```todo:// ```

## MongoDB内部存储原理
```todo:// ```

## 域名DNS解析过程
```todo:// ```

## NodeJs多进程之间数据通信
```todo:// ```

## 可读流与可写流
```todo:// ```

## https协议加密算法
```todo:// ```

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

#### 5.js继承

* 通过原型链实现, 示例：

```javascript
	function Box(){ //被继承的函数叫作超类型(父类 或 基类)
		this.name="lee";
	}
	function Desk(){//继承的函数叫作子类型(子类 或 派生类)
		this.age=20;
	}
	function Table(){
		this.run=function(){
			return this.name+this.age+"运行中。。。";
		};
	}

	//通过原型链继承。超类型实例化的对象实例，赋值给子类型的原型属性。
	//new Box()会将Box构造里的信息和原型里的信息都交给Desk
	//Desk的原型得到的是Box的构造+原型里的信息
	//同样table会继承到上面两个信息
	Desk.prototype=new Box();
	Table.prototype=new Desk();
	var table=new Table();
	//alert(table.name);
	//alert(table.age);
	//alert(table.run());

	//子类从属与自己和继承的超类型
	alert(table instanceof Table);
	alert(table instanceof Desk);
	alert(table instanceof Box);
```

* 对象继承, 示例：

```javascript

	function Box(name,age){
		this.name=name;
		this.age=age;
		this.family=['zs','ls'];
	}
	function Desk(name,age){//对象冒充,只能继承构造函数里的，无法继承原型里面的
		Box.call(this,name,age);
	}
	var desk=new Desk('lee',20);
	desk.family.push('ww');
	alert(desk.family);	//zs ls ww
	var desk2=new Desk('lee',20);
	alert(desk2.family);//zs ls
```

* 组合继承=原型链模式+构造函数模式, 示例：

```javascript
	function Box(name,age){
		this.name=name;
		this.age=age;
		this.family=['zs','ls'];
	}
	//构造函数里的方法，放在构造函数里，每次实例化，都会分配一个内存地址，浪费，所以做好放在原型里
	Box.prototype.run=function(){
		return this.name+this.age+"运行中。。。";
	}
	function Desk(name,age){//对象冒充,只能继承构造函数里的，无法继承原型里面的
		Box.call(this,name,age);
	}
	Desk.prototype=new Box();//原型链继承
	var desk=new Desk('lee',20);
	alert(desk.run());
```


## js的回调实例：

```javascript
	var async=function(callback){
	    //read data
	    setTimeout(function(){
	        callback('data');
	    },3000);//3秒后回调
	};
	//使用
	async(function(data){
	    alert(data);
	});
```

## 异步

* 什么是单线程，和异步之间的关系
单线程，同一时间只能做一件事，是为了避免DOM渲染的冲突，解决方案就是异步处理，异步的实现方式是Event Loop。但是异步也有几点不好之处，一方面是可读性差代码并不是按照书写的方式执行，另一方面异步回调callback回调地狱的问题，同样伴随这异步的这些问题，又有了新的解决方案Promise、Async／Await。

* 什么是event-loop

事件轮询是JS实现异步的具体解决方案，同步代码直接执行，异步函数先放在异步队列中，待同步函数执行完毕，轮循执行异步队列的函数。

* Jquery的Deferred解决方案

> Jquery1.5之后出现了Deferred，Promise也是从Deferred演变过来的，最后逐渐一套标准，独立出来了。

> 重点还是回归到问题本身，Deferred是Jquery1.5版本对Ajax的改变衍生出来的一个东西，其遵循对扩展开发修改封闭的一个原则，看下以下封装示例：

> Deferred与promise的区别

Deferred这种对象有主动触发resolve、reject这种函数，也有done、fail、then这种被动监听函数，这些函数混在一块很容易被外部篡改，通过生成promise对象进行隔离，promise只有被动监听，没有主动修改。

* Promise的基本使用和原理
* 介绍以下async/await（和Promise的区别、联系）
* 总结一下当前JS解决异步的方案


学习23种设计模式之前先学习5种设计原则
