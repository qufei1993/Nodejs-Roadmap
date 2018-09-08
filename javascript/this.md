# 关于this

* 错误认识
	* [指向自身](#指向自身)
	* [指向函数的作用域](#指向函数的作用域)

* this绑定规则
	* [默认绑定](#默认绑定)
	* [隐式绑定](#隐式绑定)
	* [显示绑定](#显示绑定)
	* [new绑定](#new绑定)
* [优先级](#优先级)
* [箭头函数](#箭头函数)
* [项目中使用this的一些场景及需要注意的问题](#this在项目中使用问题总结)

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

#### 隐式绑定

在函数的调用位置处被某个对象包含，拥有上下文，看以下示例：

```js
function child() {
	console.log(this.name);
}

let parent = {
	name: 'zhangsan',
	child,
}

parent.child(); // zhangsan

```

函数在调用时会使用parent对象上下文来引用函数child，可以理解为child函数被调用时parent对象拥有或包含它。

##### 隐式绑定的隐患

被隐式绑定的函数，因为一些不小心的操作会丢失绑定对象，此时就会应用最开始讲的绑定规则中的默认绑定，看下面代码:

```js
{
	function child() {
		console.log(this.name);
	}
	
	let parent = {
		name: 'zhangsan',
		child,
	}
	
	let parent2 = parent.child;

	var name = 'lisi';

	parent2();
}
```

将parent.child函数本身赋给parent2，调用parent2()其实是一个不带任何修饰的函数调用，因此会应用默认绑定。

#### 显示绑定

显示绑定和隐士绑定从字面意思理解，有一个相反的对比，一个表现的更直接，一个表现的更委婉，下面在看下两个规则各自的含义:

* ```隐士绑定``` 在一个对象的内部通过属性间接引用函数，从而把this隐士绑定到对象内部属性所指向的函数（例如上例中的对象parent的child属性引用函数function child(){}）。

* ```显示绑定``` 需要引用一个对象时进行强制绑定调用，js有提供call()、apply()方法，ES5中也提供了内置的方法 ```Function.prototype.bind```。

call、apply这两个函数的第一个参数都是设置this对象，关于两个个函数的区别可以查看 [`[函数]` call和apply的使用与区别?](/javascript/base.md#call和apply的使用与区别?)


```js
// 水果对象
function fruit(){
	console.log(this.name, arguments);
}

var apple = {
	name: '苹果'
}

var banana = {
	name: '香蕉'
}

fruit.call(banana, banana, apple)  // 香蕉 { '0': { name: '香蕉' }, '1': { name: '苹果' } }
fruit.apply(apple, [banana, apple]) 苹果 { '0': { name: '香蕉' }, '1': { name: '苹果' } }
```

下面是bind绑定的示例，只是将一个值绑定到函数的this上，并将绑定好的函数返回，只有在fruit函数才会输出信息，例：

```js
function fruit(){
	console.log(this.name);
}

var apple = {
	name: '苹果'
}

fruit = fruit.bind(apple);
fruit(); // 苹果
```

除了以上call、apply、bind还可以通过上下文context，例:

```js
function fruit(name){
	console.log(name, this.name);
}

const obj = {
	name: '这是水果',
}

const arr = ['apple', 'banana', 'pear'];

arr.forEach(fruit, obj);

// apple 这是水果
// banana 这是水果
// pear 这是水果
```

#### new绑定

也是一种可以影响this调用的方法，需要清楚new绑定，它是一个构造函数，每一次new绑定都会初始化新创建的对象。

```js
function fruit(name){
	console.log(name, this);
}

const f1 = new fruit('apple');  // apple fruit {}
const f2 = new fruit('banana'); // banana fruit {}
console.log(f1, f2, f1 === f2); // fruit {} fruit {} false

```

#### 优先级

* new绑定
* 显示绑定
* 隐式绑定
* 默认绑定(严格模式下会绑定到undefined)

#### 箭头函数

箭头函数并非使用function关键字进行定义，也不会使用上面所讲解的this四种标准规范，箭头函数会继承自外层函数调用的this绑定。

执行 ``` fruit.call(apple) ```时，箭头函数this已被绑定，无法再次被修改。

```js
function fruit(){
	return () => {
		console.log(this.name);
	}
}

var apple = {
	name: '苹果'
}

var banana = {
	name: '香蕉'
}

var fruitCall = fruit.call(apple);
fruitCall.call(banana); // 苹果
```

#### this在项目中使用问题总结

* React中使用this注意的问题

```js
class App extends React.Component{
	componentDidMount(){
		console.log(this);
		//注意this在setTimeout函数外代表的是App这个对象
		setTimeout(function(){
			this.setState({ //这里的this指的是windows对象
				initDone:true
			})			
		},1000);*/
		//两种解决方案：
		//1. var that = this
		setTimeout(() => {
			that.setState({
				initDone:true
			})			
		},1000);		
		//2.使用es6的箭头函数
		setTimeout(() => {
			this.setState({
				initDone:true
			})			
		},1000);			
	}
}
```