# JavaScript基础问题

- [变量与作用域](#变量与作用域)
- [类型检测](#类型检测)
- [定时器](#定时器)
- [函数](#函数)
    - [`[函数]` push()数组添加新值后的返回值](#push()数组添加新值后的返回值)
    - [`[函数]` arguments.callee递归调用实现一个阶乘函数](#arguments.callee递归调用实现一个阶乘函数)
    - [`[函数]` call和apply的使用与区别?](#call和apply的使用与区别?)
    - [`[函数]` javascript没有引用传递都是按值传递的](#javascript没有引用传递都是按值传递的)
- [匿名函数与闭包](#匿名函数与闭包)
    - [`[匿名函数与闭包]` 匿名函数的自我执行](#匿名函数的自我执行)
    - [`[匿名函数与闭包]` 函数里放一个匿名函数将会产生闭包](#函数里放一个匿名函数将会产生闭包)
    - [`[匿名函数与闭包]` 闭包中使用this对象将会导致的一些问题](#闭包中使用this对象将会导致的一些问题)

## 变量与作用域

* JavaScript七种内置类型: number、string、boolean、undefined、null、object、symbol(ES6新增加)
* 基本类型指保存在栈内存中的数据，引用类型([对象引用](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/object_reference.md))指保存在堆内存中的对象,传递的是引用的地址。
* 变量没有类型, 变量持有的值有类型
* 已在作用域中声明但还没有赋值的变量是undefined，还没有在作用域中声明过的变量是undeclared，对于undeclared这种情况typeof处理的时候返回的是undefined
* typeof null === 'object' //true 正确的返回值应该是null，但是这个bug由来已久。 undefined == null //true

## 类型检测

* typeof 基本类型用typeof来检测

* instanceof 用来检测是否为数组、对象、正则

```js
let box = [1,2,3];
console.log(box instanceof Array); //true

let box1={};
console.log(box1 instanceof Object); //true

let box2=/g/;
console.log(box2 instanceof RegExp); //true
```

## 定时器

* setTimeout(callback, 100) //setTimeout只接受一个函数或者变量做为参数不接受闭包，因为闭包会自执行，有一个最小延迟4ms

## 函数

#### push()数组添加新值后的返回值

let a = [].push('test'); //输出a的值为1 而不是['test']，因为push()返回的是数组的长度， 如果要输出['test'], 采用以下写法:

```javascript
let a  = [];
a.push('test');
console.log(a); //['test']
```

#### arguments.callee递归调用实现一个阶乘函数

下面程序最终输出结果为6，实现了一个3 * 2 * 1的阶乘函数，不明白之处，参考知乎有关讨论 [知乎讨论](https://www.zhihu.com/question/268265380/answer/335099064)

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

###### call和apply的使用与区别?

call的使用示例

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

apply使用情况

```javascript
function box(num1,num2){
    return num1+num2;
}

function sum2(num1,num2){
    return box.call(this,num1,num2);
}

console.log(sum(10,10)); //输出结果: 20
```

总结两种情况区别: call传递参数是按照数组传递，apply是一个一个传递

#### javascript没有引用传递都是按值传递的

js代码示例:  

如果按引用传递，那么函数里面的num会变成类似全局变量，最后输出60

```js
function box(num){ //按值传递
    num+=10;
    return num;
}
var num=50;

console.log(box(num));  //60
console.log(num);	  //50
```

php代码示例: 

php中的引用传递，会改变外部的num值，最后num也会输出60。

```js
function box(&$num){ 
    //加上&符号将num变成全局变量
    $num+=10;
    return $num;
}
$num = 50;
echo box($num);	//60
echo $num;	//60
```

## 匿名函数与闭包

匿名函数就是没有名字的函数，闭包是可访问一个函数作用域里变量的函数，由于闭包作用域返回的局部变量资源不会被立刻销毁回收，所以可能会占用更多的内存。过度使用闭包会导致性能下降，建议在非常有必要的时候才使用闭包。

#### 匿名函数的自我执行

```js
(function(num){
        return num;
    })(1) //1
```

#### 函数里放一个匿名函数将会产生闭包

1. 使用局部变量实现累加功能。
2. 定义函数test1，返回一个匿名函数形成一个闭包
3. 将tes1赋给test2，此时test2会初始化变量a，值为test1返回的匿名函数
4. 执行test2()

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

返回object

```js
var box={
    getThis:function(){
        return this;
    }
}

console.log(box.getThis()); // { getThis: [Function: getThis] }
```

闭包中的this将返回全局对象，浏览器中window对象，node中global对象，可以使用对象冒充或者赋值来解决闭包中this全局对象问题。

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

对象冒充

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

赋值

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
