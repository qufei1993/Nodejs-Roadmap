# JavaScript基础问题

## 快速导航

- [```[基础]``` 常见问题](#常见问题)
- [```[基础]``` undefined与undeclared的区别？](#undefined与undeclared的区别)
- [```[基础]``` typeof、instanceof 类型检测](#类型检测)
- [```[作用域]``` eval()、with 欺骗词法作用域](#欺骗词法作用域)

- [```[Error]``` 错误类型ReferenceError、TypeError的区别？](#错误)
- [```[数组去重]``` 数组去重的三种实现方式](#数组去重的三种实现方式)
- [```[数组降维]``` 数组降维--扁平化多维数组](#数组降维)

## 常见问题

* ```JavaScript```七种内置类型: ```number、string、boolean、undefined、null、object、symbol```(ES6新增加)

* ```基本类型：```指保存在栈内存中的数据，```引用类型：```([对象引用]())指保存在堆内存中的对象，传递的是引用的地址

* ```弱类型：```变量没有类型, 变量持有的值有类型

* ```(typeof null === 'object') = true```，正确的返回值应该是```null```，但是这个```bug```由来已久。 ```(undefined == null) = true```

* ```indexOf```为```ECMAScript5```新方法，```IE8```及以下不支持

-  ```setTimeout(callback, 100)```，```setTimeout```只接受一个函数或者变量做为参数不接受闭包，因为闭包会自执行，最小延迟```4ms```

## undefined与undeclared的区别

**```undefined：```** 已在作用域中声明但还没有赋值的变量是undefined。

**```undeclared：```** 还没有在作用域中声明过的变量是undeclared，对于undeclared这种情况typeof处理的时候返回的是undefined。

## 欺骗词法作用域

> 词法作用域由写代码期间函数所声明的位置来定义，javascript有两种机制(eval()、with)在运行时来修改词法作用域，这样做通常会导致性能下降，内存泄漏问题。

- **eval函数接收一个字符串为参数，解析字符串生成代码并运行**

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

- **with通常被当作重复引用同一个对象中的多个属性的快捷方式**

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

- **对性能的影响**

javascript引擎在编译阶段会进行性能优化，很多优化依赖于能够根据代码词法进行静态分析，预先确定了变量和函数的定义位置，才能快速找到标识符，但是在词法分析阶段遇到了with或eval无法明确知道它们会接收什么代码，也就无法判断标识符的位置，最简单的做法就是遇到with或eval不做任何优化，使用其中一个都会导致代码运行变慢，因此，请不要使用他们。

## 类型检测

* ```typeof```：基本类型用```typeof```来检测

* ```instanceof```：用来检测是否为数组、对象、正则

```js
let box = [1,2,3];
console.log(box instanceof Array); //true

let box1={};
console.log(box1 instanceof Object); //true

let box2=/g/;
console.log(box2 instanceof RegExp); //true
```

## 错误

- **ReferenceError错误**

> 如果在所有嵌套的作用域中遍寻不到所需的变量，引擎会抛出ReferenceError错误，意味这，这是一个未声明的变量，这个错误是一个非常重要的异常类型。

```js
console.log('a: ', a); // Uncaught ReferenceError: a is not defined
let a = 2;
```

- **TypeError错误**

> 这种错误表示作用域判别成功，但是进行了非法的操作，例如，对一个非函数类型的值进行函数调用，或者引用null、undefined类型的值中的属性，将会抛出TypeError异常错误。

```js
let a = null; // 或者a = undefined
console.log(a.b); // Uncaught TypeError: Cannot read property 'b' of null
```

对一个非函数类型的值进行函数调用

```js
let a = 2;
a(); // Uncaught TypeError: Cannot read property 'b' of null
```

## 数组去重的三种实现方式

- **Set数组去重**

> ES6新的数据结构Set，类似于数组，它的元素都是唯一的。

```js
{
let arr = [1, 22, 33, 44, 22, 44];

console.log([...new Set(arr)]); //[1, 22, 33, 44]
}

```

- **reduce数组对象去重**

> reduce对数组中的每一个元素依次执行回调函数，不含数组中未赋值、被删除的元素，回调函数接收四个参数

* ```callback```：执行数组中每个值的函数，包含四个参数
    * ```previousValue```：上一次调用回调返回的值，或者是提供的初始值```（initialValue）```
    * ```currentValue```：数组中当前被处理的元素
    * ```index```：当前元素在数组中的索引
    * ```array```：调用 ```reduce``` 的数组
* ```initialValue```：可选，作为第一次调用 ```callback``` 的第一个参数。

示例：

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

- **[参考lodash](https://lodash.com/docs/4.17.5#uniqBy)**

```js
_.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');

// => [{ 'x': 1 }, { 'x': 2 }]
```

## 数组降维

- **方法一：将数组字符串化**

> 利用数组与字符串的隐式转换，使用+符号链接一个对象，javascript会默认调用toString方法转为字符串，再使用字符串分割成字符串数组，最后转成数值形数组

```js
let arr = [[222, 333, 444], [55, 66, 77], 11, ]
arr += '';
arr = arr.split(',');
arr = arr.map(item => Number(item));

console.log(arr); // [222, 333, 444, 55, 66, 77, 11]
```

- **方法二：利用apply和concat转换**

> concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。

```js
{
    function reduceDimension(arr) {
        return Array.prototype.concat.apply([], arr);
    }

    console.log(reduceDimension([[123], 4, [7, 8],[9, [111]]]));
    // [123, 4, 7, 8, 9, Array(1)]
}

```
- **方法三 自定义函数实现**

> 推荐使用，经测试这个是执行效率最高的。

```js
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
```