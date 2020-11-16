# Iterator 迭代器

JavaScript 中除了 Array 之外，ES6 还新增加了 Map、Set 结构，当我们需要操作这些数据时，就需要一种统一的接口来处理这些不同的数据结构。ES6 中新增加的 Iterator（迭代器）就提供了这样一种机制。
## Symbol.iterator 支持的数据结构
ES6 中提供了 Symbol.iterator 方法，该方法返回一个迭代器对象，目前 Array、Set、Map 这些数据结构默认具有 Symbol.iterator 属性，如下所示，可以看到 Object 类型是没有的。
```javascript
console.log([][Symbol.iterator]()); // Object [Array Iterator] {}
console.log((new Map())[Symbol.iterator]()); // [Map Entries] {  }
console.log((new Set())[Symbol.iterator]()); // [Set Iterator] {  }
console.log({}[Symbol.iterator]); // undefined
```
除了上面提到这些数据结构，JavaScript 中一些类似数组的对象也默认具有 Symbol.iterator 属性，例如：字符串、arguments 对象、DOM 的 NodeList 对象。

- 字符串
```javascript
const str = 'nodejs';
console.log(str[Symbol.iterator]()); // Object [String Iterator] {}

for (const val of str) {
  console.log(val); // n o d e j s
}
```

- arguments 对象
```javascript
function print() {
  console.log(arguments[Symbol.iterator]()); // Object [Array Iterator] {}
  for (const val of arguments) {
    console.log(val); // n o d e
  }
}
print('n', 'o', 'd', 'e')
```

- DOM NodeList 对象
```javascript
const divNodeList = document.getElementsByTagName('div')
console.log(divNodeList[Symbol.iterator]()) // Array Iterator {}
for (const div of divNodeList) {
	// 会输出每个 div 标签
	console.log(div);
}
```
## 迭代器对象的 next 方法
调用可迭代对象的 Symbol.iterator 方法会返回一个迭代器对象，它的接口中有一个 next 方法，该方法返回 value 和 done 两个属性，其中 value 属性是当前成员的值，done 属性表示遍历是否结束。
了解生成器函数（Generator）的可能不会陌生，同样的当你执行一个生成器函数也会得到一个迭代器对象，但是要区分 **生成器和迭代器不是一个概念**。
```javascript
const arr = ['N', 'o', 'd', 'e'];
const iterator = arr[Symbol.iterator]();

console.log(iterator.next()); // { value: 'N', done: false }
console.log(iterator.next()); // { value: 'o', done: false }
console.log(iterator.next()); // { value: 'd', done: false }
console.log(iterator.next()); // { value: 'e', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```
上例中声明一个数组 arr，调用 arr 的 Symbol.iterator 方法创建了一个迭代器对象 iterator 之后不断调用 next 方法返回当前数组内容，直到 next 方法返回值 done 为 true 则该数组访问完毕。
## Iterator 接口遍历
### 解构赋值
数组、Set、Map 解构赋值时，会默认调用 Symbol.iterator 方法。注意 Map 调用 Symbol.iterator 方法返回的是一个 entries 方法，该方法返回的是一个新的迭代器对象且按插入顺序包含了 Map 对象中每个元素的 [key, value] 数组，所以调用 Map 实例的 keys 或 values 方法也会返回一个新的迭代器对象。
```javascript
const set = new Set().add('n').add('o');
const map = new Map().set('d').set('e');
const [xSet, ySet] = set;
console.log(xSet, ySet) // n o
const [xMap, yMap] = map.keys();
console.log(xMap, yMap) // d e
```
### 扩展运算符
ES6 中的扩展运算符（...）也会默认调用数组、Set、Map 等结构的 Symbol.iterator 方法。
```javascript
const set = new Set('node');
const [x, y, ...z] = set;
console.log(x, y, z); // n o [ 'd', 'e' ]
```
### for...of 循环
ES6 借鉴了 C++、Python 等语言引入了 for...of 循环，该循环内部也会调用 Symbol.iterator 方法，只要具有 Iterator 接口的数据结构都可以使用。
```javascript
const set = new Set().add('n').add('o');

for (const val of set) {
  console.log(val);
}
```
for...of 循环在执行中还可以使用 break; 中断迭代器的执行。以下示例，修改循环语句在执行第一次 val 等于 n 之后执行 break。
```javascript
for (const val of set) {
  console.log(val); // n
  if (val === 'n') break;
}
```
### 其它方法
数组默认是支持 Iterator 接口，所以任何接收数组做为参数的方法也都会默认调用 Symbol.iterator 方法，如下所示：
```javascript
const set = new Set().add('n').add('o');
console.log(Array.from(set)); // [ 'n', 'o' ]
Promise.all(set).then(val => console.log(val)) // [ 'n', 'o' ]
Promise.race(set).then(val => console.log(val)) // n
```
## 自定义迭代器
### 迭代协议

- 参照可迭代协议，要成为可迭代对象首先要有一个 **@@iterator **即（Symbol.iterator）属性，该属性为一个无参数的函数，返回一个符合迭代器协议的对象。
- 根据迭代器协议定义这个迭代器对象要返回一个 next() 方法，这个 next() 方法返回一个包含 value、done 属性的对象。
```javascript
const  myIterator = {
  // for...of 循环会用到
  [Symbol.iterator]: function() { return this },
  
  // 标准的迭代器接口方法
  next: function() {
  	// ...
  }
}
```
如果用 TypeScript 写法描述如下：
```typescript
// 遍历器接口 Iterable
interface Iterable {
	[Symbol.iterator]: Iterator
}

// 迭代器对象
interface Iterator {
	next(value?: any): IterationResult,
}

// next 方法返回值定义
interface IterationResult {
	value: any,
  done: boolean
}
```
### 基于普通函数的迭代器实现
迭代器的函数实现可以是一个普通函数也可以是一个生成器函数，我们先以普通函数为例，定义一个 Range 构造函数，用来输出两个数值区域的所有值。
```typescript
function Range(start, end) {
  this.id = start;
  this.end = end;
}
Range.prototype[Symbol.iterator] = function() { return this }
Range.prototype.next = function next() {
  if (this.id > this.end) {
    return { value: undefined, done: true }
  }

  return { value: this.id++, done: false }
}
const r1 = new Range(0, 3);
const it = r1[Symbol.iterator]()
for (const id of r1) {
  console.log(id); // 0,1,2,3
}
```
### 基于生成器函数的迭代器实现
使用生成器函数（Generator）实现是最简单的，只要使用 yield 语句返回每一次的值即可。如下所示：
```typescript
Range.prototype[Symbol.iterator] = function* () {
  while (this.id <= this.end) {
    yield this.id++;
  }
}
```
## 异步迭代器
到目前为止我们上面讲解的都是同步模式的迭代器，这个很好理解，因为我们的数据源本身也就是同步的，但是在 Node.js 中一次网络 I/O 请求或者一次文件 I/O 请求，它们都是基于事件是异步的，所以我们就不能像使用 Symbol.iterator 的方式来使用。
ECMAScript 2018 标准中提供了 **Symbol.asyncIterator **属性，这是一个异步迭代器，如果一个对象设置了该属性，它就是异步可迭代对象，相应的我们要使用 for await...of 循环遍历数据。
### 自定义异步迭代器
```typescript
function Range(start, end) {
  this.id = start;
  this.end = end;
}
// 与上面不同，function 前我们增加了 async 关键字
Range.prototype[Symbol.asyncIterator] = async function* () {
  while (this.id <= this.end) {
    yield this.id++;
  }
}
const r1 = new Range(0, 3);
console.log(r1[Symbol.asyncIterator]()); // Object [AsyncGenerator] {}
for await (const id of r1) {
  console.log(id); // 0,1,2,3
}
```
### 与同步迭代器的不同

- 同步迭代器返回的是一个常规的  { value, done } 对象，而异步迭代器返回的是一个包含  { value, done } 的 Promise 对象。
- 同步可迭代协议具有 Symbol.iterator 属性，异步可迭代协议具有 Symbol.asyncIterator 属性。
- 同步迭代器使用 for...of 循环遍历，异步迭代器使用 for await...of 循环遍历。
### 异步迭代器的支持
> 目前没有默认设定了 [Symbol.asyncIterator] 属性的 JavaScript 内建的对象。不过，WHATWG（网页超文本应用技术工作小组）Streams 会被设定为第一批异步可迭代对象，[Symbol.asyncIterator] 最近已在设计规范中落地。



下一节我们将会讲解异步迭代器在 Node.js 中的使用，欢迎关注。
##  Reference

- [你不知道的JavaScript（中卷）](https://book.douban.com/subject/26854244/)
- [可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)
- [Symbol.asyncIterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)
