# JavaScript基础问题

- [常见问题](#常见问题)
- [定时器](#定时器)
- [作用域](#作用域)
    - [`[作用域]` eval()、with欺骗词法作用域](#欺骗词法作用域)
- [类型检测](#类型检测)
    - [`[类型检测]` typeof、instanceof类型检测](#类型检测)
- [数组](#数组)
    - [`[数组去重]` Set数组去重](#set数组去重)
    - [`[数组去重]` reduce数组对象去重](#reduce数组对象去重)
    - [`[数组去重]` lodash uniqBy数组去重](#参考lodash)
    - [`[数组降维]` 数组降维三种方法](#数组降维)
- [函数](#函数)
    - [`[函数]` push()数组添加新值后的返回值](#push()数组添加新值后的返回值)
    - [`[函数]` arguments.callee递归调用实现一个阶乘函数](#arguments.callee递归调用实现一个阶乘函数)
    - [`[函数]` call和apply的使用与区别?](#call和apply的使用与区别?)
    - [`[函数]` javascript没有引用传递都是按值传递的](#javascript没有引用传递都是按值传递的)
    - [`[函数]` 函数声明与函数表达式](#函数声明与函数表达式)
- [匿名函数与闭包](#匿名函数与闭包)
    - [`[匿名函数与闭包]` 匿名函数的自我执行](#匿名函数的自我执行)
    - [`[匿名函数与闭包]` 函数里放一个匿名函数将会产生闭包](#函数里放一个匿名函数将会产生闭包)
    - [`[匿名函数与闭包]` 闭包中使用this对象将会导致的一些问题](#闭包中使用this对象将会导致的一些问题)
- [正则](#正则)
    - [`[正则]` 模式修饰符的可选参数](#模式修饰符的可选参数)
    - [`[正则]` 两个测试方法test、exec](#两个测试方法)
    - [`[正则]` 4个正则表达式方法](#4个正则表达式方法)
    - [`[正则]` 匹配模式](#匹配模式)
    - [`[正则]` 常用正则表达式](#常用正则表达式)

## 常见问题

* JavaScript七种内置类型: number、string、boolean、undefined、null、object、symbol(ES6新增加)
* 基本类型指保存在栈内存中的数据，引用类型([对象引用](https://github.com/Q-Angelo/Summarize/blob/master/nodejs/object_reference.md))指保存在堆内存中的对象,传递的是引用的地址。
* 变量没有类型, 变量持有的值有类型
* 已在作用域中声明但还没有赋值的变量是undefined，还没有在作用域中声明过的变量是undeclared，对于undeclared这种情况typeof处理的时候返回的是undefined
* typeof null === 'object' //true 正确的返回值应该是null，但是这个bug由来已久。 undefined == null //true
* indexOf为ECMAScript5新方法，IE8及以下不支持

## 作用域

#### 欺骗词法作用域

> 词法作用域由写代码期间函数所声明的位置来定义，javascript有两种机制(eval()、with)在运行时来修改词法作用域，这样做通常会导致性能下降，内存泄漏问题。

* eval函数接收一个字符串为参数，解析字符串生成代码并运行

```js
function test(str, b){
	eval(str);

	console.log(a, b);
}

var a = 1;

test("var a = 3", 2); // 3 2

console.log(a); // 1
```

上面这段代码示例，eval调用的str相当于在test函数作用域内部声明了一个新的变量b，当console.log()在打印时会在foo函数内部找到a和b，将无法找到外部的a，因此最终输出结果是3和2，最外层a仍就输出是1，两者比较可以看到效果。

* with通常被当作重复引用同一个对象中的多个属性的快捷方式

```js
{
function withObj(obj){
	with(obj){
		a = 2
	}
}

let o1 = {
	a: 1,
}

let o2 = {
	b: 1,
}

withObj(o1);
console.log(o1.a); // 2

withObj(o2);
console.log(o2.a); // undefined
console.log(a); // 2
}
```

以上示例中withObj(obj)函数接受一个obj参数，该参数是一个对象引用，执行了with，o1传进去，a=2赋值操作找到了o1.a并将2赋值给它，o2传进去，因为o2没有a属性，就不会创建这个属性，o2.a保持undefined，这个时候就会创建一个新的全局变量a。

* 对性能的影响

javascript引擎在编译阶段会进行性能优化，很多优化依赖于能够根据代码词法进行静态分析，预先确定了变量和函数的定义位置，才能快速找到标识符，但是在词法分析阶段遇到了with或eval无法明确知道它们会接收什么代码，也就无法判断标识符的位置，最简单的做法就是遇到with或eval不做任何优化，使用其中一个都会导致代码运行变慢，因此，请不要使用他们。

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

## 数组

#### 数组与数组对象去重

###### Set数组去重

```js
{
    let arr = [1, 22, 33, 44, 22, 44];

    console.log([...new Set(arr)]); //[1, 22, 33, 44]
}

```

###### reduce数组对象去重

> reduce对数组中的每一个元素依次执行回调函数，不含数组中未赋值、被删除的元素，回调函数接收四个参数

* callback （执行数组中每个值的函数，包含四个参数）
    * previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    * currentValue （数组中当前被处理的元素）
    * index （当前元素在数组中的索引）
    * array （调用 reduce 的数组）
* initialValue （可选，作为第一次调用 callback 的第一个参数。）

示例

```js
let hash = {};

function unique(arr, initialValue){
    return arr.reduce(function(previousValue, currentValue, index, array){
        hash[currentValue.name] ? '' : hash[currentValue.name] = true && previousValue.push(currentValue);

        return previousValue
    }, initialValue);
}

const uniqueArr = unique([{name: 'zs', age: 15}, {name: 'lisi'}, {name: 'zs'}], []);

console.log(uniqueArr); // uniqueArr.length == 2
```

###### [参考lodash](https://lodash.com/docs/4.17.5#uniqBy)

```js
_.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');

// => [{ 'x': 1 }, { 'x': 2 }]
```

#### 数组降维

###### 方法一 将数组字符串化

> 利用数组与字符串的隐式转换，使用+符号链接一个对象，javascript会默认调用toString方法转为字符串，再使用字符串分割成字符串数组，最后转成数值形数组

```js
let arr = [[222, 333, 444], [55, 66, 77], 11, ]
arr += '';
arr = arr.split(',');
arr = arr.map(item => Number(item));

console.log(arr);
//[222, 333, 444, 55, 66, 77, 11]

```

###### concat进行转换

> concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。

```js
function reduceDimension(arr){
    let newArr = [];
    for(let key in arr){
        newArr = newArr.concat(arr[key]);
    }

	return newArr;
}

console.log(reduceDimension([[123], 4, [7, 8],[9, 111]]));
// [123, 4, 7, 8, 9, 111]
```

###### 方法二 利用apply和concat转换

```js
{
    function reduceDimension(arr) {
        return Array.prototype.concat.apply([], arr);
    }

    console.log(reduceDimension([[123], 4, [7, 8],[9, [111]]]));
    // [123, 4, 7, 8, 9, Array(1)]
}

{
    function arrayConcat(arr, point){
        return Array.prototype.concat.apply(point || [], arr);
    }

    function reduceDimension(arr) {
        let arrays = arrayConcat(arr);
        let newArray = [];

        for(let key in arrays){
            if(arrays[key] instanceof Array){
                newArray = arrayConcat(arrays[key], newArray);
            }else{
                newArray.push(arrays[key]);
            }
        }

        return newArray;
    }

    let arr = [[12], 4, [333, [4444, 5555]], [9, [111, 222]]];

    for(let i = 0; i < 100000; i++){
        arr.push(i*1);
    }

    let start = new Date().getTime();
    console.log('reduceDimension: ', reduceDimension(arr));
    console.log('耗时: ', new Date().getTime() - start);
}

```
###### 方法三 推荐使用

```js
{
    function reduceDimension(arr){
        let ret = [];
        
        let toArr = function(arr){
            arr.forEach(function(item){
                item instanceof Array ? toArr(item) : ret.push(item);
            });
        }

        toArr(arr);

        return ret;
    }

    let arr = [[12], 4, [333, [4444, 5555]], [9, [111, 222]]];

    for(let i = 0; i < 100000; i++){
        arr.push(i);
    }

    let start = new Date().getTime();

    console.log('reduceDimension: ', reduceDimension(arr));
    console.log('耗时: ', new Date().getTime() - start);
}
```

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

#### call和apply的使用与区别?

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

#### 函数声明与函数表达式

> 对于函数声明解释器会首先读取，并使其在执行任何代码之前可用；对于函数表达式，则必须等到解释器执行到它所在的代码行，才会被真正解析，例如下面例子:

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
###### 使用函数表达式实现一个界乘函数

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

## 正则

#### 模式修饰符的可选参数:  
* i: 忽略大小写  
* g: 全局匹配   
* m: 多行匹配  
* /hello/: 两个反斜杠是正则表达式的字面量表示法  

#### 两个测试方法:

* test

```js
const test = new RegExp('hello world', 'ig');
console.log(test.test('hello world')); // true
```

* exec 返回的是数组，有就返回数组的值，没有返回为null

```js
const test = new RegExp('hello world', 'ig');
console.log(test.exec('hello')); // null
```

#### 4个正则表达式方法

* match(pattern) 将所有匹配的字符串组合成数组返回

```js
const pattern=/Box/ig;
const str="This is a Box! The is a box!";
console.log(str.match(pattern));
```

* search(pattern) 返回字符串中pattern开始位置，忽略全局匹配

```js
const pattern=/Box/i;	//
const str="This is a Box! The is a box!";
console.log(str.search(pattern)); // 10
```

* replace(pattern) 替换匹配到的字符串

```js
const pattern=/Box/ig;
const str="This is a Box! The is a box!";
console.log(str.replace(pattern,'Tom'));
```

* split(pattern) 返回字符串指定pattern拆分数组

```js
const pattern = / /ig;	//空格
const str = "This is a Box! The is a box!";
console.log(str.split(pattern)); //以空格进行分割，返回的是数组
// 输出结果
// [ 'This', 'is', 'a', 'Box!', 'The', 'is', 'a', 'box!' ]
```

#### 匹配模式

* \w表示a-zA-Z_

* 锚元字符匹配(^ $) ^强制收匹配  $强制尾匹配，并且只匹配一个

```js
const pattern=/^[a-z]oogle\d$/;
const str="aoogle2";
console.log(pattern.test(str)); // true
```

```注意：``` ^符号在[]里面表示 非  在外边表示强制首匹配，并且只匹配一个 要想匹配多个值，使用+

* \b表示到达边界

* |表示匹配或选择模式

```js
const pattern=/baidu|google|bing/; //匹配或选择其中某个字符，不是相等，包含的意思
const str = "baidu a google"; 
console.log(pattern.test(str));  //返回true
```

#### 常用正则表达式

* 检查邮政编码

```js
const pattern = /^[1-9]{1}[0-9]{5}$/;
const str = "122534"; //共6位数，第一位不能为0

console.log(pattern.test(str)); // true
```

* 压缩包后缀名

\w等于a-zA-Z0-9_ 使用^限定从首字母匹配 .是特殊符号需要\n进行转义
|选择符必须使用()进行分组

```js
const pattern = /^[\w]+\.(zip|gz|rar)$/;  
const str="a12_.zip"; //文件名 字母_数字.zip,gz,rar
console.log(pattern.test(str)); // true
```

* 删除多余空格

    * 方法一: 使用replace只匹配一个，所以使用+匹配多个

    ```js
        var pattern=/^\s+/; 
        var str="        google       ";
        var result=str.replace(pattern,'');
            pattern=/\s+$/;
            result=result.replace(pattern,'');
            
        console.log('|'+result+'|'); // |google|
    ```

    * 方法二: (.+)贪婪模式，使用惰性模式，后面的空格不让匹配
		
    ```js
        var pattern=/^\s+(.+?)\s+$/;
        var str="     google         ";
        var result=pattern.exec(str,'')[1];

        console.log('|'+result+'|');
    ```
    
    * 方法三: (.+)贪婪模式，改为惰性模式，使用分组模式，只取匹配的内容
		
    ```js
        var pattern=/^\s+(.+?)\s+$/;
        var str="     google         ";
        var result=str.replace(pattern,'$1'); //使用分组模式

        console.log('|'+result+'|'); // |google|
    ```

* 简单邮箱验证

```js
var pattern=/^([\w\.\_]+)@([\w\_]+)\.([a-zA-Z]){2,4}$/;
var str="qzfweb@gmail.com";
console.log(pattern.test(str)); // true
```