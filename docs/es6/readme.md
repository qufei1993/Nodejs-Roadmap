# ECMAScript6扩展

## 快速导航
- **变量声明** [[more]](/es6/readme.md#新增声明变量)
    - ```[Variable]``` [新增let&const变量声明](/es6/readme.md#新增声明变量)
- **解构赋值** [[more]](/es6/readme.md#解构赋值)
    - ```[Deconstruction]``` [数组解构赋值](/es6/readme.md#数组解构赋值)
    - ```[Deconstruction]``` [对象解构赋值](/es6/readme.md#对象解构赋值)
- **扩展系列** [[more]](/es6/readme.md#解构赋值)
    - ```[Extension]``` [正则表达式扩展](/es6/readme.md#正则表达式扩展)
    - ```[Extension]``` [字符串扩展](/es6/readme.md#字符串扩展)
    - ```[Extension]``` [数值扩展](/es6/readme.md#数值扩展)
    - ```[Extension]``` [数组扩展](/es6/readme.md#数组扩展)
    - ```[Extension]``` [函数扩展](/es6/readme.md#函数扩展)
    - ```[Extension]``` [对象扩展](/es6/readme.md#对象扩展)
- **集合系列** [[more]](/es6/set-map.md#解构赋值)
    - ```[Set]``` [集合Set](/es6/set-map.md#set)、[WeakSet](/es6/set-map.md#weakset)
    - ```[Map]``` [集合Map](/es6/set-map.md#map)、[WeakMap](/es6/set-map.md#weakmap)
    - ```[Map-Array]``` [Map与Array横向对比增、查、改、删](/es6/set-map.md#map与array对比)
    - ```[Set-Array]``` [Set与Array增、查、改、删对比](/es6/set-map.md#set与array)
    - ```[Map-Set-Array]``` [Map、Set、Object三者增、查、改、删对比](/es6/set-map.md#集合map集合set对象三者对比)
- **Promise** [[more]](/es6/promise.md)
    - ```[Promise]``` [Promise的基本使用和原理](/es6/promise.md#promise的基本使用和原理)
    - ```[Promise]``` [Callback方式书写](/es6/promise.md#callback方式书写)
    - ```[Promise]``` [Promise方式书写](/es6/promise.md#promise方式书写)
    - ```[Promise]``` [Promise.finally()](/es6/promise.md#finally)
    - ```[Promise]``` [Promise并行执行 Promise.all()](/es6/promise.md#promise并行执行)
    - ```[Promise]``` [Promise率先执行 Promise.race()](/es6/promise.md#promise率先执行)
    - ```[Promise]``` [错误捕获](/es6/promise.md#错误捕获) 
    - ```[面试]``` ```Promise 中 .then 的第二参数与 .catch 有什么区别?```，参考：[错误捕获](/es6/promise.md#错误捕获)
    - ```[面试]``` ```怎么让一个函数无论promise对象成功和失败都能被调用？```，参考：[finally](/es6/promise.md#finally)
- **Decorators** [[more]](/es6/decorators.md)
- **Symbol** [[more]](/es6/symbol.md)
- **Generator** [[more]](/es6/generator.md)

## 新增声明变量

- **let**

> ```let```声明的变量只在自己的块作用域内有效，即大括号```{}```括起来的。不能重复声明。

- **const**
> const声明的数值类型不能被修改，但引用类型除外，注意下面的k是对象，对象是引用类型，引用类型最后返回的是对象中存储的那个指针，也就是说下面的k指向的是存储中的指针，而指针是不变的，变的是对象的值。

```js
function last(){
  const PI=3.1415926;

  PI = 33 //报错

  const k={
    a:1
  }

  k.b=3; //正确

  console.log(PI,k);
}
```

## 解构赋值

> 适用于变量交换  

#### 数组解构赋值
```javascript
{
  let a,b,reset;
  [a,b] = [1,2];
  console.log(a,b); //1 2
}
{
  let a,b,reset;
  [a,b,...reset] = [1,2,4,5,6,7];
  console.log(a,b,reset); //1 2 [4,5,6,7]
}
```

#### 对象解构赋值

- **一般的对象解构赋值**
```js
{
  let a,b;
  ({a,b} = {a:1,b:2})
  console.log(a,b); // 1 2
}
```
- **带有默认值的对象解构赋值**
```js
{
  let {a=10,b=5} = {a:3}
  console.log(a,b); // 3 5
}
```
- **嵌套的对象解构赋值**
```js
{
  let metaData = {
    title:'abc',
    test:[{
      title:'标题',
      des:'description'
    }]
  }
  let {title:enTitle,test:[{title:cnTitle}]} = metaData;
  console.log(enTitle,cnTitle);//abc 标题
}
```

## 扩展系列

#### 正则表达式扩展

- **构造函数 ES5声明对象 情况一**

> 第一个参数是字符; 第二个是修饰符

```js
let regex = new RegExp('xyz', 'i');

console.log(regex.test('xyz123'), regex.test('xyZ123')); // true true
```

- **构造函数 ES5声明对象 情况二**

> 第一个参数是正则表达式; 但是此时不接受第二个参数是一个修饰符，否则会报错

```js
let regex2 = new RegExp(/xyz/i); // 正确
let regex3 = new RegExp(/xyz/i, 'i'); // 错误；Uncaught TypeError: Cannot supply flags when constructing one RegExp 

console.log(regex2.test('xyz123'), regex2.test('xyZ123')); // true true
```

- **构造函数 ES6中的声明对象**

> ES6改变了此行为，第一个参数是正则表达式，第二个参数也可以在指定修饰符。

```javascript
let regex3 = new RegExp(/abc/ig, 'i');

console.log(regex3.flags); // i
```

以上示例中，原有正则对象的修饰符是ig，它会被第二个参数i覆盖。

#### 字符串扩展

- **Unicode表示法**

```javascript
{
  console.log('a',`\u0061`); //a a
  //乱码，因为\u20bb7转换成二进制以大于0xFFFF，会当做两个字符处理
  console.log('s',`\u20BB7`); //s ₻7

  //ES6中处理大于0xFFFF这种情况，用大括号{}把这种Unicode编码包括起来
  console.log('s',`\u{20BB7}`); //s 𠮷
}
```
```javascript
{
  let s='𠮷';
  //取长度，四个字节为两个字符
  console.log('length',s.length); //2

  //ES5中charAt()取字符，charCodeAt()取码值
  console.log('0',s.charAt(0)); //0 �
  console.log('1',s.charAt(1)); //1 �
  console.log('at0',s.charCodeAt(0)); //at0 55362
  console.log('at1',s.charCodeAt(1)); //at1 57271

  //ES6中codePointAt()取码值，toString(16)转换成16进制
  let s1='𠮷a';
  console.log('length',s1.length);
  console.log('code0',s1.codePointAt(0)); //code0 134071
  console.log('code0',s1.codePointAt(0).toString(16)); //code0 20bb7
  console.log('code1',s1.codePointAt(1)); //code1 57271
  console.log('code2',s1.codePointAt(2)); //code2 97
}
```
```js
{
  //ES5中fromCharCode()处理大于两个字节，会乱码
  console.log(String.fromCharCode("0x20bb7")); //ஷ
  //ES6中fromCodePoint()处理大于两个字节，正常显示
  console.log(String.fromCodePoint("0x20bb7")); //𠮷
}
```
- **遍历接口**
```javascript
  //字符串遍历器接口
  let str='\u{20bb7}abc';
  //ES5处理会将{20bb7}按照两个字节处理，造成前一个字符乱码
  for(let i=0;i<str.length;i++){
    console.log('es5',str[i]);
  }
  //输出结果:� � a b c

  //ES6使用for of遍历处理，可以自动处理大于0xFFFF这种情况
  for(let code of str){
    console.log('es6',code);
  }
  //输出结果:𠮷 a b c
```

- **模板字符串**

```javascript
{
  let name = "张三";
  let info = "我来自China";
  let str = `I am ${name} , ${info}`;
  console.log(str);
}
{
  //row对所有的斜杠进行了转义，原样输出
  console.log(String.raw`Hi\n${1+2}`);//Hi\n3
  console.log(`Hi\n${1+2}`);
}
```

- **标签模板**

> 标签模板其实不是模板，而是函数调用的一种特殊形式。“标签”指的是函数，紧跟在后面的模板字符串就是它的参数。

**两个作用：** 第一在过滤 html 字符串的时候防止 xss 攻击用这个处理，第二可以用于多语言转换

```javascript
{
  let user = {
    name:'zhangsan',
    info:'hello world'
  }
  console.log(abc`I am ${user.name},${user.info}`);
  function abc(s,v1,v2){
    console.log(s,v1,v2);
    return s+v1+v2;
  }
}
```

- **新增方法(10种)**

padStart()、padEnd() 这两个方法是 ES7 的草案中提案的，在 ES6 中使用，需要安装库 ```npm install babel-polyfill --save-dev``` 打补丁，处理兼容性，在项目中引入 babel-polyfill

```
import 'babel-polyfill'
```

```javascript
{
  let str="string";
  //includes()判断是否包含某个字符
  console.log('includes',str.includes("c"));
  //startsWith()判断是否以某个字符为起始
  console.log('start',str.startsWith('str'));
  //endsWith()判断是否以某个字符为结束
  console.log('end',str.endsWith('ng'));
}
```
```javascript
{
  let str="abc";
  //repeat()使字符串重复多少次
  console.log(str.repeat(3));
}
```
```javascript
{
  //第一个参数指定要显示的长度，第二个参数表示如果长度不够要添加的字符
  console.log('1'.padStart(2,'0')); //01
  console.log('1'.padEnd(2,'0')); //10
}
```

#### 数值扩展

- **Number.isInteger()**

> 判断是否为整数

```js
console.log('25',Number.isInteger(25)); //true
console.log('25.0',Number.isInteger(25.0)); //true
console.log('25.1',Number.isInteger(25.1)); //false
console.log('25.1',Number.isInteger('25')); //false
```

- **Number.isFinite()**

> 函数用于检查其参数是否是无穷大
```js
console.log('15',Number.isFinite(15)); //true
console.log('NaN',Number.isFinite(NaN)); //false
console.log('1/0',Number.isFinite('true'/0)); //false
console.log('NaN',Number.isNaN(NaN)); //true
console.log('0',Number.isNaN(0)); //false
```
- **Number.isNaN()**
> 判断一个值是否为NaN
```js
console.log('NaN',Number.isNaN(NaN)); //true
console.log('0',Number.isNaN(0)); //false
```

- **Number.MAX_SAFE_INTEGER**
> 数的最大上限 

- **Number.MIN_SAFE_INTEGER**
> 数的最小下限  

- **Number.isSafeInteger()**
> 判断给的这个数是否在有效范围内

***注意：*** ES6中如果一个数不在-2的53方和2的53次方之间就会不准确 
```javascript
{
  console.log(Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER);
  console.log('10',Number.isSafeInteger(10));//10 true
  console.log('a',Number.isSafeInteger('a'));//a false
}
```

- **Math.trunc()**
> 取整
```javascript
{
  console.log(4.1,Math.trunc(4.1)); // 4
  console.log(4.9,Math.trunc(4.9)); // 4
}
```

- **Math.sign()**
> 返回-1,0,1 小于0返回-1，等于0返回0，大于0返回1,注意参数为数值
```javascript
  console.log('-5',Math.sign(-5)); //-1
  console.log('0',Math.sign(0)); //0
  console.log('5',Math.sign(5)); //1
```

- **Math.cbrt()**
> 返回一个数的立方根
```javascript
{
  console.log('-1',Math.cbrt(-1)); //-1
  console.log('8',Math.cbrt(8)); //2
}
```

#### 数组扩展

- **Array.of()**

> 把一组```数组变量```转换成数组类型

```javascript
{
  let arr = Array.of(3,4,7,9,11);
  console.log('arr=',arr); //arr= [3, 4, 7, 9, 11]

  //返回空数组
  let empty=Array.of();
  console.log('empty',empty); //empty []
}
```

- **Array.from()**
```javascript
{
  //第一种用法，传入一个参数
  <div id="doc3" class="syy">
      <p>p1</p>
      <p>p2</p>
      <p>p3</p>
  </div>
  //获取所有的p标签
  let p=document.querySelectorAll('p');
  let pArr=Array.from(p);
  pArr.forEach(function(item){
    //textContent是ES5的一个原生方法，获取文本
    console.log(item.textContent);
  });
  //输出 p1 p2 p3

  //第二种用法传入两个参数,第二个参数类似于map映射
  console.log(Array.from([1,3,5],function(item){return item*2})); //[2, 6, 10]
}
```

- **fill()**

> 填充,只写一个参数全部替换，三个参数情况下：第一个参数是替换内容，第二个参数是起始位置，第三个参数是结束位置
```javascript
{
  console.log('fill-7',[1,'a',undefined].fill(7)); //[7, 7, 7]
  console.log('fill,pos',['a','b','c'].fill(7,1,3));//["a", 7, 7]
}
```

- **keys()** 
> 获取索引
- **values()**
> 获取值，是ES7中的一个提案，存在浏览器兼容性需要加载 ```import 'babel-polyfill';```  
- **entries()**
>既获取索引又获取值
```javascript
{
  for(let index of ['1','c','ks'].keys()){
    console.log('keys',index); // 0 1 2
  }
  for(let value of ['1','c','ks'].values()){
    console.log('values',value); //1 c ks
  }
  for(let [index,value] of ['1','c','ks'].entries()){
    console.log('values',index,value); //0 1 1 c 2 ks
  }
}
```

- **copyWithin(target,start,end)** 
    * ```target(必须)```：从该位置开始替换数据  
    * ```start(可选)```：从该位置开始读取数据，默认为0  
    * ```end(可选)```：到该位置前停止读取数据，默认等于数组长度  

```js
{
  console.log([1,2,3,4,5].copyWithin(0,3,4)); //[4, 2, 3, 4, 5]
}
```

- **find(fn)**
> 查找符合条件的第一个元素,查找不到时返回undefined 

- **findIndex(fn)**
> 查找符合条件的第一个元素的下标值，查找不到时返回-1

```js
{
  console.log([1,2,3,4,5,6].find(function(item){return item>3})); //4
  console.log([1,2,3,4,5,6].findIndex(function(item){return item>3})); //3
}
```

- **展开运算符...**
> 数组拼接使用展开运算符可以取代concat的位置

```javascript
const a = ['a', 'b'];
const b = ['c', 'd']
const c = [...a, ...b];

console.log(c); //["a", "b", "c", "d"]

//使用concat
const d = a.concat(b)
console.log(d); //["a", "b", "c", "d"]

```

#### 函数扩展

- **参数默认值**

> ***注意：*** 默认值后面不能跟没有默认值得变量，如(x, y = 'world',c)c没有默认值错误

```js
{
  function test(x, y = 'world'){
    console.log('默认值',x,y);
  }
  test('hello'); //默认值 hello world
  test('hello','China'); //默认值 hello China
}
```

- **作用域问题**
```js
{
  let x='test';
  function test2(x,y=x){
    console.log('作用域',x,y);
  }
  //参数中第一个x没有值
  test2(); //作用域 undefined undefined
  test2('kill'); //作用域 kill kill

  //x为上面let定义的x
  function test3(z,y=x){
    console.log('作用域',z,y);
  }
  test3('kill'); //作用域 kill test
}
```

- **rest参数**  
> rest参数就是在你不确定有多少个参数的时候，把你输入的一系列参数转换成了数组
```js
{
  function test3(...arg){
    for(let v of arg){
      console.log(v);
    }
  }
  test3(1,2,3,4,'a'); // 1 3 4 5 a
}
```

- **扩展运算符**  
> ES6的扩展运算符则可以看作是rest参数的逆运算。可以将数组转化为参数列表
```js
{
  // 把一个数组拆分成离散的值
  console.log(...[1,2,4]); //1 2 4
  console.log('a',...[1,2,4]); //a 1 2 4
}
```

- **箭头函数**
```js
{
  let arrow = v => v*2;
  let arrow2 = () => 5;
  console.log('arrow',arrow(3)); //6
  console.log(arrow2()); //5
}
```
- **this绑定**

- **尾调用**
> 尾调用存在于函数式编程概念里，函数的最后是不是是一个函数，可以用来提升性能，如果在性能优化过程中，是不断的嵌套其他函数，或者说这个函数依赖于另一个函数的操作，建议用尾调用的形式。

```js
{
  function tail(x){
    console.log('tail',x);
  }
  function fx(x){
    return tail(x)
  }
  fx(123) //tail 123
}
```

#### 对象扩展

- **简洁表示法**

```js
{
  let o=1;
  let k=2;
  //es5属性定义
  let es5={
    o:o,
    k:k
  };
  //es6属性定义
  let es6={
    o,
    k
  };
  console.log(es5,es6);

  //es5定义方法
  let es5_method={
    hello:function(){
      console.log('hello');
    }
  };
  //es6定义方法，更简洁
  let es6_method={
    hello(){
      console.log('hello');
    }
  };
  console.log(es5_method.hello(),es6_method.hello());
}
```

- **属性表达式**

```js
{
  // 属性表达式
  let a='b';
  //es5中key是固定的
  let es5_obj={
    a:'c',
    b:'c'
  };
  //es6中可以使用变量，这块相当于b
  let es6_obj={
    [a]:'c'
  }
  console.log(es5_obj,es6_obj);
  //输出 Object {a: "c", b: "c"} Object {b: "c"}

}
```
- **新增API**

- **Object.is()**

> 在功能上与===一样
```js
{
  console.log('字符串',Object.is('abc','abc'),'abc'==='abc'); //字符串 true true
  // 数组是引用类型，虽然以下是两个空数组，在值上都是空，但这两个数组引用的是不同的地址，因此在严格意义上来讲，他两个不是完全相等的
  console.log('数组',Object.is([],[]),[]===[]); //数组 false false
}
```

- **Object.assign()**
> 拷贝函数
```js
console.log('拷贝',Object.assign({a:'a'},{b:'b'}));
//拷贝 Object {a: "a", b: "b"}
```

- **Object.entries()**
> 遍历
```js
let test={k:123,o:456};
for(let [key,value] of Object.entries(test)){
  console.log([key,value]);
}
```

- **Object.keys()**
> 对数组排序
```javascript
var anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(anObj).sort( (x,y) => x > y));
```

- **对象扩展拷贝**
> node v8.5.0版本支持
```javascript
const a = {"name": "zhangsan"}
const b = {"age": 8, "email": "XXX@qq.com"}
console.log({...a, ...b, "type": "儿童"});
// {name: "zhangsan", age: 18, email: "XXX@qq.com", type: "成人"}
```
