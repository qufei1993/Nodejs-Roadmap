# 函数

> 函数是由事件驱动的或者当它被调用时执行的可重复使用的代码块。

## 快速导航

- [函数声明与函数表达式](#函数声明与函数表达式)
- [函数表达式实现一个界乘函数](#函数表达式实现一个界乘函数)
- [内置函数](#内置函数)
- [arguments对象](#arguments对象)
- [call和apply的使用与区别?](#call和apply的使用与区别)
- [引用传递](#引用传递)
- [深入理解匿名函数与闭包](#匿名函数与闭包)

## 面试指南

* ``` 递归调用实现一个阶乘函数？  ```，参考：[arguments对象](#arguments对象)
* ```如何理解JavaScript中的引用传递与值传递？JS中是否拥有引用传递？```，参考：[引用传递](#引用传递)
* ```经典面试题：什么是匿名函数和闭包？```，参考：[深入理解匿名函数与闭包](#深入理解匿名函数与闭包)

## 函数声明与函数表达式

> 对于**函数声明**解释器会首先读取，并使其在执行任何代码之前可用；对于**函数表达式**，则必须等到解释器执行到它所在的代码行，才会被真正解析。

例如下面例子，函数表达式test2必须声明在其调用之前才可用

```js
console.log(test1(1, 2)); // 3
console.log(test2(1, 2)); // test2 is not defined

//函数声明
function test1(a, b){
    return a + b;
}

//函数表达式
const test2 = function f(a, b){
    return a + b;
}
```
## 函数表达式实现一个界乘函数

```js
const factorial = (function f(num){
    if(num <= 1){
        return 1;
    }else{
        return num * f(num -1);
    }
});

console.log(factorial(3)); // 6
```
## 内置函数

- **push()**

> 数组添加新值后的返回值，返回当前数组的Length。

```let a = [].push('test'); ``` 输出```a```的值为```1```而不是```['test']```，因为```push()```返回的是数组的长度。

```javascript
let a  = [];
a.push('test');
console.log(a); //['test']
```

## arguments对象

系统内置的arguments对象，可以用于获取函数参数、参数长度等

> 面试：递归调用实现一个阶乘函数

下面程序最终输出结果为```6```，实现了一个```3 * 2 * 1```的阶乘函数，不明白之处，参考知乎有关讨论 [知乎讨论](https://www.zhihu.com/question/268265380/answer/335099064)

```javascript
function sum(num){
    if(num <= 1){

        //获取参数长度
        console.log('arguments.length: ', arguments.length);

        return 1;
    }else{
        return num * arguments.callee(num-1);
    }
}

console.log(sum(3));
```

## call和apply的使用与区别

- **apply使用情况**

```javascript
function box(num1,num2){
    return num1+num2;
}

function sum(num1,num2){
    //this 表示全局作用域，浏览器环境下window，node环境global，[]表示传递的参数
    return box.apply(this,[num1,num2]);

    //或者下面写法arguments可以当数组传递
    //return box.apply(this,arguments);
}

console.log(sum(10,10)); //输出结果: 20
```

- **call的使用示例**

```javascript
function box(num1,num2){
    return num1+num2;
}

function sum2(num1,num2){
    return box.call(this,num1,num2);
}

console.log(sum(10,10)); //输出结果: 20
```

***总结两种情况区别：*** ```call```传递参数是按照数组传递，```apply```是一个一个传递

## 引用传递

> javascript没有引用传递，如果传递的参数一个值，是按值传递；如果传递的是一个对象，则传递的是一个对象的引用。

- **示例一：js代码按值传递**

如果按引用传递，那么函数里面的num会变成类似全局变量，最后输出60

```js
function box(num){ // 按值传递
    num+=10;
    return num;
}
var num=50;

console.log(box(num));  // 60
console.log(num);	    // 50
```

- **示例二：php代码传递一个参数：**

php中的引用传递，会改变外部的num值，最后num也会输出60。

```js
function box(&$num){ 
    //加上&符号将num变成全局变量
    $num+=10;
    return $num;
}
$num = 50;
echo box($num);	// 60
echo $num;	// 60
```

- **示例三：js代码传递一个对象**

```js
function box(obj){ // 按对象传递
    obj.num+=10;

    return obj.num;
}
var obj = { num: 50 };

console.log(box(obj));  // 60
console.log(obj.num);	// 60
```

## 匿名函数与闭包

> 匿名函数就是没有名字的函数，闭包是可访问一个函数作用域里变量的函数，由于闭包作用域返回的局部变量资源不会被立刻销毁回收，所以可能会占用更多的内存。过度使用闭包会导致性能下降，建议在非常有必要的时候才使用闭包。

#### 匿名函数的自我执行

```js
(function(num){
        return num;
    })(1) //1
```

#### 函数里放一个匿名函数将会产生闭包

1. 使用局部变量实现累加功能。
2. 定义函数```test1```，返回一个匿名函数形成一个闭包
3. 将```test1```赋给```test2```，此时```test2```会初始化变量a，值为```test1```返回的匿名函数
4. 执行```test2()```

```js
{
function test1(){
    var a = 1;

    return function(){
        // a++;
        // return a;
        // 或以下写法
        return ++a;
    }
}

var test2 = test1();

console.log(test2()); // 2
console.log(test2()); // 3
console.log(test2()); // 4

//不能这样写,这样外层函数每次也会执行，从而age每次都会初始化
console.log(test1()()); // 2
console.log(test1()()); // 2
console.log(test1()()); // 2
}
```

#### 闭包中使用this对象将会导致的一些问题

> 在闭包中使用this对象也可能会导致一些问题，this对象是在运行时基于函数的执行环境绑定的，如果this在全局范围就是window，如果在对象内部就指向这个对象。而闭包却在运行时指向window的，因为闭包并不属于这个对象的属性或方法

**返回```object```**

```js
var box={
    getThis:function(){
        return this;
    }
}

console.log(box.getThis()); // { getThis: [Function: getThis] }
```

闭包中的```this```将返回全局对象，浏览器中```window```对象，```Node.js```中```global```对象，可以使用对象冒充或者赋值来解决闭包中```this```全局对象问题。

```js
var box={
    user: 'zs',
    getThis:function(){
        return function(){
            return this;   
        };
    }
}

console.log(box.getThis()());
```

**对象冒充**

```js
var box={
    user: 'zs',
    getThis:function(){
        return function(){
            return this;   
        };
    }
}

console.log(box.getThis().call(box)); // { user: 'zs', getThis: [Function: getThis] }
```

**赋值**

```js
var box={
    user: 'zs',
    getThis:function(){
        var that = this; // 此时的this指的是box对象
        return function(){
            return that.user;   
        };
    }
}

console.log(box.getThis()()); 
```

#### 一个例子看懂循环和闭包之间的关系

下例，循环中的每个迭代器在运行时都会给自己捕获一个i的副本，但是根据作用域的工作原理，尽管循环中的五个函数分别是在各个迭代器中分别定义的，但是它们都会被封闭在一个共享的全剧作用域中，实际上只有一个i，结果每次都会输出6

```js
for(var i=1; i <= 5; i++){
	setTimeout(function(){
		console.log(i);
	})
}
```

解决上面的问题，在每个循环迭代中都需要一个闭包作用域，下面示例，循环中的每个迭代器都会生成一个新的作用域。

```js
for(var i=1; i <= 5; i++){
	(function(j){
		setTimeout(function(){
			console.log(j);
		})
	})(i)
}
```

也可以使用let解决，let声明，可以用来劫持块作用域，并且在这个块作用域中生明一个变量。

```js
for(let i=1; i <= 5; i++){
	setTimeout(function(){
		console.log(i);
	})
}
```

