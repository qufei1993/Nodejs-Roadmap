# 关于this

* 错误认识

* this绑定规则

## 错误认识

#### 指向自身

> 人们很容易把this理解成指向函数自身，其实this的指向在函数定义阶段是无法确定的，只有函数执行时才能确定this到底指向谁，实际上this的最终指向是调用它的那个对象。

下面示例，声明函数foo，执行foo.count=0时，的确向函数对象foo添加了一个属性count。但是函数foo内部代码this.count中的this并不是指向那个函数对象，for循环中的foo(i)掉用它的对象是window，等价于window.foo(i)，因此函数foo里面的this指向的是window。

```js
{
	function foo(num){
		console.log("foo: " + num);
		
		//记录foo被调用次数
		this.count++;
	}

	foo.count = 0;

	for(let i=0; i<10; i++){
		if(i > 5){
			foo(i);
		}
	}

	console.log(foo.count); // 0
}
```

#### 指向函数的作用域

> 对this的第二种误解就是this指向函数的作用域，

以下这段代码，在foo中试图调用bar函数，是否成功调用，取决于环境。

* window，在chrome console环境里是没有问题的，全局声明的函数放在了window下，foo函数里面的this代指的是window对象，在全局环境中并没有声明变量a，因此在bar函数中的this.a自然没有定义，输出undefined。

* nodejs，在node环境下，声明的function 不会放在global全局对象下，因此在foo函数里调用this.bar函数会报 ``` TypeError: this.bar is not a function ``` 错误，调用bar函数，要省去前面的this。

```js
{
	function foo(){
		var a = 2;
		this.bar();
	}

	function bar(){
		console.log(this.a);
	}

	foo();
}
```

## this绑定规则

#### 默认绑定

当函数调用属于独立调用（不带函数引用的调用），无法调用其他的绑定规则，我们给它一个称呼“默认绑定”，在非严格模式下绑定到全局对象，在使用了严格模式(use strict)下绑定到undefined。

严格模式下调用

```js
'use strict'

function demo(){
	console.log(this.a); // TypeError: Cannot read property 'a' of undefined
}

const a = 1;

demo();
```

非严格模式下，在浏览器window全局对象下会将a绑定到window.a

```js
function demo(){
	console.log(this.a); // 1
}

let a = 1;

demo();
```

非严格模式下，在node环境中，不会将a绑定到global，因此下面输出undefined

```js
function demo(){
	console.log(this.a); // undefined
}

let a = 1;

demo();
```

注意：项目代码中，要么使用严格模式要么使用非严格模式，不要混合使用，也许会给你造成一些意外的bug。