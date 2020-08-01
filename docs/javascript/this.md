# 详解 JavaScript 中的 this

相信 Javascript 中的 this 会使很多同学在工作学习中产生困惑，笔者也同样是，经过阅读各种资料及实际工作中的应用，做了以下梳理，主要内容包括长期以来大家对 this 的错误认识及 this 的绑定规则，箭头函数、实际工作场景中遇到的问题，希望对于有此困惑的你能有所帮助。

## 两种错误认识

### 指向自身

**this 的第一个错误认识是，很容易把 this 理解成指向函数自身**，其实this 的指向在函数定义阶段是无法确定的，只有函数执行时才能确定 this 到底指向谁，实际 this 的最终指向是调用它的那个对象。

下面示例，声明函数 foo()，执行 foo.count=0 时，像函数对象 foo 添加一个属性 count。但是函数 foo 内部代码 this.count 中的 this 并不是指向那个函数对象，for 循环中的 foo(i) 掉用它的对象是 window，等价于 window.foo(i)，因此函数 foo 里面的 this 指向的是 window。

```js
function foo(num){
  this.count++; // 记录 foo 被调用次数
}
foo.count = 0;
window.count = 0;
for(let i=0; i<10; i++){
  if(i > 5){
    foo(i);
  }
}
console.log(foo.count, window.count); // 0 4
```

### 指向函数的作用域

**对 this 的第二种误解就是 this 指向函数的作用域**

以下这段代码，在 foo 中试图调用 bar 函数，是否成功调用，取决于环境。

* **浏览器**：在浏览器环境里是没有问题的，全局声明的函数放在了 window 对象下，foo 函数里面的 this 代指的是 window 对象，在全局环境中并没有声明变量 a，因此在 bar 函数中的 this.a 自然没有定义，输出 undefined。

* **Node.js**：在 Node.js 环境下，声明的 function 不会放在 global 全局对象下，因此在 foo 函数里调用 this.bar 函数会报 ``` TypeError: this.bar is not a function ``` 错误。要想运行不报错，调用 bar 函数时省去前面的 this。

```js
function foo(){
  var a = 2;
  this.bar();
}
function bar(){
  console.log(this.a);
}
foo();
```

## This 四种绑定规则

### 默认绑定

当函数调用属于**独立调用**（不带函数引用的调用），无法调用其他的绑定规则，我们给它一个称呼 “默认绑定”，在非严格模式下绑定到全局对象，在使用了严格模式 (use strict) 下绑定到 undefined。

**严格模式下调用**

```js
'use strict'
function demo(){
  // TypeError: Cannot read property 'a' of undefined
  console.log(this.a);
}
const a = 1;
demo();
```

**非严格模式下调用**

在浏览器环境下会将 a 绑定到 window.a，以下代码使用 var 声明的变量 a 会输出 1。

```js
function demo(){
  console.log(this.a); // 1
}
var a = 1;
demo();
```

以下代码使用 let 或 const 声明变量 a 结果会输出 undefined

```js
function demo(){
  console.log(this.a); // undefined
}
let a = 1;
demo();
```

在举例子的时候其实想要重点说明 this 的默认绑定关系的，但是你会发现上面两种代码因为分别使用了 var、let 进行声明导致的结果也是不一样的，归其原因涉及到 **顶层对象的概念**

在 [Issue: Nodejs-Roadmap/issues/11](https://github.com/Q-Angelo/Nodejs-Roadmap/issues/11) 里有童鞋提到这个疑问，也是之前的疏忽，再简单聊下顶层对象的概念，**顶层对象（浏览器环境指 window、Node.js 环境指 Global）的属性和全局变量属性的赋值是相等价的**，使用 var 和 function 声明的是顶层对象的属性，而 let 就属于 ES6 规范了，但是 ES6 规范中 let、const、class 这些声明的全局变量，不再属于顶层对象的属性。

### 隐式绑定

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

函数在调用时会使用 parent 对象上下文来引用函数 child，可以理解为child 函数被调用时 parent 对象拥有或包含它。

**隐式绑定的隐患**

被隐式绑定的函数，因为一些不小心的操作会丢失绑定对象，此时就会应用最开始讲的绑定规则中的默认绑定，看下面代码:

```js
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
```

将 parent.child 函数本身赋给 parent2，调用 parent2() 其实是一个不带任何修饰的函数调用，因此会应用默认绑定。

### 显示绑定

显示绑定和隐式绑定从字面意思理解，有一个相反的对比，一个表现的更直接，一个表现的更委婉，下面在看下两个规则各自的含义:

* **隐式绑定**：在一个对象的内部通过属性间接引用函数，从而把 this 隐式绑定到对象内部属性所指向的函数（例如上例中的对象 parent 的 child 属性引用函数 function child(){}）。

* **显示绑定**：需要引用一个对象时进行强制绑定调用，js 有提供 call()、apply() 方法，ES5 中也提供了内置的方法 ```Function.prototype.bind```。

call()、apply() 这两个函数的第一个参数都是设置 this 对象，区别是 apply 传递参数是按照数组传递，call 是一个一个传递。

```js
function fruit(...args){
  console.log(this.name, args);
}
var apple = {
  name: '苹果'
}
var banana = {
  name: '香蕉'
}
fruit.call(banana, 'a', 'b')  // [ 'a', 'b' ]
fruit.apply(apple, ['a', 'b']) // [ 'a', 'b' ]
```

下面是 bind 绑定的示例，只是将一个值绑定到函数的 this 上，并将绑定好的函数返回，只有在执行 fruit 函数时才会输出信息，例：

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

除了以上 call、apply、bind 还可以通过上下文 context，例:

```js
function fruit(name){
  console.log(`${this.name}: ${name}`);
}
const obj = {
  name: '这是水果',
}
const arr = ['苹果', '香蕉'];
arr.forEach(fruit, obj);
// 这是水果: 苹果
// 这是水果: 香蕉
```

### new 绑定

new 绑定也可以影响 this 调用，它是一个构造函数，每一次 new 绑定都会创建一个新对象。

```js
function Fruit(name){
  this.name = name;
}

const f1 = new Fruit('apple');
const f2 = new Fruit('banana');
console.log(f1.name, f2.name); // apple banana
```

## 优先级

如果 this 的调用位置同时应用了多种绑定规则，它是有优先级的：new 绑定 -> 显示绑定 -> 隐式绑定 -> 默认绑定。

## 箭头函数

箭头函数并非使用 function 关键字进行定义，也不会使用上面所讲解的 this 四种标准规范，箭头函数会继承自外层函数调用的 this 绑定。

执行 ``` fruit.call(apple)``` 时，箭头函数 this 已被绑定，无法再次被修改。

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

## This 使用常见问题

### 通过函数和原型链模拟类

以下示例，定义函数 Fruit，之后在原型链上定义 info 方法，实例化对象 f1 和定义对象 f2 分别调用 info 方法。

```js
function Fruit(name) {
  this.name = name;
}
Fruit.prototype.info = function() {
  console.log(this.name);
}
const f1 = new Fruit('Apple');
f1.info();
const f2 = { name: 'Banana' };
f2.info = f1.info;
f2.info()
```

输出之后，两次结果是不一样的，原因是 info 方法里的 this 对应的不是定义时的上下文，而是调用时的上下文，根据我们上面讲的几种绑定规则，对应的是隐式绑定规则。

```
Apple
Banana
```

### 原型链上使用箭头函数

如果使用构造函数和原型链模拟类，不能在原型链上定义箭头函数，因为箭头函数的里的 this 会继承外层函数调用的 this 绑定。

```js
function Fruit(name) {
  this.name = name;
}
Fruit.prototype.info = () => {
  console.log(this.name);
}
var name = 'Banana'
const f1 = new Fruit('Apple');
f1.info();
```

### 在事件中的使用

举一个 Node.js 示例，在事件中使用时，当我们的监听器被调用时，如果声明的是普通函数，this 会被指向监听器所绑定的 EventEmitter 实例，如果使用的箭头函数方式 this 不会指向 EventEmitter 实例。

```js
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    this.name = 'myEmitter';
  }
}
const func1 = () => console.log(this.name);
const func2 = function () { console.log(this.name); };
const myEmitter = new MyEmitter();
myEmitter.on('event', func1); // undefined
myEmitter.on('event', func2); // myEmitter
myEmitter.emit('event');
```

this 的问题可能不止于上面列举的这些，如果有其它问题也欢迎在留言区说出。

## Reference

* 你不知道的JavaScript（上卷）