# ES6语法扩展

## 快速导航

* [`[ES6语法扩展系列一]` let、const声明变量](#新增声明变量)
* [`[ES6语法扩展系列二]` 数组、对象解构赋值](#解构赋值) 
* [`[ES6语法扩展系列三]` 正则表达式的扩展](#正则表达式的扩展)
* [`[ES6语法扩展系列四]` 字符串扩展](#字符串扩展) 
* [`[ES6语法扩展系列五]` 数值扩展](#数值扩展) 
* [`[ES6语法扩展系列六]` 数组扩展](#数组扩展)  
* [`[ES6语法扩展系列七]` 函数扩展](#函数扩展) 
* [`[ES6语法扩展系列八]` 对象扩展](#对象扩展) 
* [`[ES6语法扩展系列九]` Symbol用法](#symbol) 
* [`[ES6语法扩展系列十]` Set Map用法](#set_map数据结构) 
* [`[ES6语法扩展系列十一]` Proxy和Reflect](#proxy) 
* [`[ES6语法扩展系列十二]` Promise](#promise) 
* [`[ES6语法扩展系列十三]` Symbol.iterator](#iterator) 
* [`[ES6语法扩展系列十四]` Generator](#generator) 
* [`[ES6语法扩展系列十五]` Decorators修饰器](#decorators修饰器)

## 新增声明变量

#### let注意两点：
* let 有块作用域，即大括号{}括起来的,声明的变量只在自己的块作用域内有效
* 不能重复声明

#### const
> const声明的数值类型不能被修改，但引用类型除外,注意下面的k是对象，对象是引用类型，引用类型最后返回的是对象中存储的那个指针，也就是说下面的k指向的是存储中的指针，而指针是不变的，变的是对象的值。

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

适用于变量交换  

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
```javascript
//一般的对象解构赋值
{
  let a,b;
  ({a,b} = {a:1,b:2})
  console.log(a,b); // 1 2
}
//带有默认值的对象解构赋值
{
  let {a=10,b=5} = {a:3}
  console.log(a,b); // 3 5
}
//嵌套的对象解构赋值
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

## 正则表达式的扩展

```javascript
{
    // 构造函数 ES5中的声明对象
    let regex = new RegExp('xyz', 'i'); //第一个参数是字符串，第二个是修饰符
    let regex2 = new RegExp(/xyz/i); //第一个参数是正则表达式，不接受第二个参数，否则会报错
    console.log(regex.test('xyz123'), regex2.test('xyz123'));
    console.log(regex.test('xyZ123'), regex2.test('xyZ123'));

    let regex3 = new RegExp(/abc/ig, 'i');
    console.log(regex3.flags); //原有正则对象的修饰符是ig，它会被第二个参数i覆盖

}
```

## 字符串扩展

#### Unicode表示法

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
```javascript
{
  //ES5中fromCharCode()处理大于两个字节，会乱码
  console.log(String.fromCharCode("0x20bb7")); //ஷ
  //ES6中fromCodePoint()处理大于两个字节，正常显示
  console.log(String.fromCodePoint("0x20bb7")); //𠮷
}
```
#### 遍历接口
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

#### 模板字符串
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
#### 标签模板  
两个作用第一，在过滤html字符串的时候防止xss攻击用这个处理，第二，可以用于多语言转换
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
#### 新增方法(10种)  
padStart()、padEnd()这两个方法是ES7的草案中提案的，在ES6中使用，需要安装库 ```npm install babel-polyfill --save-dev``` 打补丁，处理兼容性,在项目中引入 ```import 'babel-polyfill'```
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

## 数值扩展

* Number.isInteger()判断是否为整数

```javascript
{
  console.log('25',Number.isInteger(25)); //true
  console.log('25.0',Number.isInteger(25.0)); //true
  console.log('25.1',Number.isInteger(25.1)); //false
  console.log('25.1',Number.isInteger('25')); //false
}
```

* Number.isFinite() 函数用于检查其参数是否是无穷大
```javascript
{
  console.log('15',Number.isFinite(15)); //true
  console.log('NaN',Number.isFinite(NaN)); //false
  console.log('1/0',Number.isFinite('true'/0)); //false
  console.log('NaN',Number.isNaN(NaN)); //true
  console.log('0',Number.isNaN(0)); //false
}
```
* Number.isNaN()判断是否为一个数
```javascript
{
  console.log('NaN',Number.isNaN(NaN)); //true
  console.log('0',Number.isNaN(0)); //false
}
```
* ES6中如果一个数不在-2的53方和2的53次方之间就会不准确  
* Number.MAX_SAFE_INTEGER一个数的最大上限  
* Number.MIN_SAFE_INTEGER一个数的最小下限  
* Number.isSafeInteger()判断给的这个数是否在有效范围内
```javascript
{
  console.log(Number.MAX_SAFE_INTEGER,Number.MIN_SAFE_INTEGER);
  console.log('10',Number.isSafeInteger(10));//10 true
  console.log('a',Number.isSafeInteger('a'));//a false
}
```

* Math.trunc()取整
```javascript
{
  console.log(4.1,Math.trunc(4.1)); //4
  console.log(4.9,Math.trunc(4.9)); //4
}
```

* Math.sign()返回-1,0,1 小于0返回-1，等于0返回0，大于0返回1,注意参数为数值
```javascript
  console.log('-5',Math.sign(-5)); //-1
  console.log('0',Math.sign(0)); //0
  console.log('5',Math.sign(5)); //1
```

* Math.cbrt()返回一个数的立方根
```javascript
{
  console.log('-1',Math.cbrt(-1)); //-1
  console.log('8',Math.cbrt(8)); //2
}
```

## 数组扩展

* Array.of()把一组数组变量转换成数组类型
```javascript
{
  let arr = Array.of(3,4,7,9,11);
  console.log('arr=',arr); //arr= [3, 4, 7, 9, 11]

  //返回空数组
  let empty=Array.of();
  console.log('empty',empty); //empty []
}
```

* Array.from()
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

* fill()填充,只写一个参数全部替换，三个参数情况下：第一个参数是替换内容，第二个参数是起始位置，第三个参数是结束位置
```javascript
{
  console.log('fill-7',[1,'a',undefined].fill(7)); //[7, 7, 7]
  console.log('fill,pos',['a','b','c'].fill(7,1,3));//["a", 7, 7]
}
```

* keys()获取索引  
* values()获取值，是ES7中的一个提案，存在浏览器兼容性需要加载 ```import 'babel-polyfill';```  
* entries()既获取索引又获取值
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

* copyWithin(target,start,end)  
* target(必须) 从该位置开始替换数据  
* start(可选) 从该位置开始读取数据，默认为0  
* end(可选) 到该位置前停止读取数据，默认等于数组长度  
```javascript
{
  console.log([1,2,3,4,5].copyWithin(0,3,4)); //[4, 2, 3, 4, 5]
}
```

* find()查找符合的元素，直返会一个  
* findIndex()查找符合元素的下标
```javascript
{
  console.log([1,2,3,4,5,6].find(function(item){return item>3})); //4
  console.log([1,2,3,4,5,6].findIndex(function(item){return item>3})); //3
}
```
* 数组拼接使用展开运算符可以取代concat的位置

```javascript
const a = ['a', 'b'];
const b = ['c', 'd']
const c = [...a, ...b];

console.log(c); //["a", "b", "c", "d"]

//使用concat
const d = a.concat(b)
console.log(d); //["a", "b", "c", "d"]

```

## 函数扩展

* 参数默认值  
注意：默认值后面不能跟没有默认值得变量，如(x, y = 'world',c)c没有默认值错误
```javascript
{
  function test(x, y = 'world'){
    console.log('默认值',x,y);
  }
  test('hello'); //默认值 hello world
  test('hello','China'); //默认值 hello China
}
```

* 作用域问题
```javascript
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
* rest参数  
rest参数就是在你不确定有多少个参数的时候，把你输入的一系列参数转换成了数组
```javascript
{
  function test3(...arg){
    for(let v of arg){
      console.log(v);
    }
  }
  test3(1,2,3,4,'a'); // 1 3 4 5 a
}
```
* 扩展运算符  
ES6的扩展运算符则可以看作是rest参数的逆运算。可以将数组转化为参数列表
```javascript
{
  //把一个数组拆分成离散的值
  console.log(...[1,2,4]); //1 2 4
  console.log('a',...[1,2,4]); //a 1 2 4
}
```
* 箭头函数
```javascript
{
  let arrow = v => v*2;
  let arrow2 = () => 5;
  console.log('arrow',arrow(3)); //6
  console.log(arrow2()); //5
}
```
* this绑定

* 尾调用
尾调用存在于函数式编程这样一个概念，函数的最后是不是一个函数，可以用来提升性能，如果在你在性能优化过程中，是不断的嵌套其他函数，或者说这个函数依赖于另一个函数的操作，建议用尾调用的形式。
```javascript
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

## 对象扩展
* 简洁表示法
```javascript
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
* 属性表达式
```javascript
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
* 新增API

Object.is()在功能上与===一样
```javascript
{
  console.log('字符串',Object.is('abc','abc'),'abc'==='abc'); //字符串 true true
  //数组是引用类型，虽然以下是两个空数组，在值上都是空，但这两个数组引用的是不同的地址，因此在严格意义上来讲，他两个不是完全相等的
  console.log('数组',Object.is([],[]),[]===[]); //数组 false false
}
```
Object.assign()拷贝
```javascript
console.log('拷贝',Object.assign({a:'a'},{b:'b'}));
//拷贝 Object {a: "a", b: "b"}
```
Object.entries()遍历
```javascript
let test={k:123,o:456};
for(let [key,value] of Object.entries(test)){
  console.log([key,value]);
}
```
Object.keys()对数组排序
```javascript
var anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(anObj).sort( (x,y) => x > y));
```

对象扩展拷贝 node v8.5.0版本支持
```javascript
const a = {"name": "zhangsan"}
const b = {"age": 18, "email": "XXX@qq.com"}
console.log({...a, ...b, "type": "成人"});
// {name: "zhangsan", age: 18, email: "XXX@qq.com", type: "成人"}
```

## symbol
```javascript
{
  // Symbol声明的变量都是唯一的
  let a1=Symbol();
  let a2=Symbol();
  console.log(a1===a2); //false
  let a3=Symbol.for('a3');
  let a4=Symbol.for('a3');
  console.log(a3===a4); //true
}

{
  let a1=Symbol.for('abc');
  let obj={
    [a1]:'123',
    'abc':345,
    'c':456
  };
  console.log('obj',obj); //obj Object {abc: 345, c: 456, Symbol(abc): "123"}

  //使用for of 不能遍历出Symbol定义的变量
  for(let [key,value] of Object.entries(obj)){
    console.log('let of',key,value);
  }
  //输出：let of abc 345 let of c 456

  //getOwnPropertySymbols()只获取Symbol定义的值
  Object.getOwnPropertySymbols(obj).forEach(function(item){
    console.log(obj[item]); //123
  })

  //遍历出所有的值
  Reflect.ownKeys(obj).forEach(function(item){
    console.log('ownkeys',item,obj[item]);
  })
  //输出：
  //ownkeys abc 345
  //ownkeys c 456
  //ownkeys Symbol(abc) 123
}

```

## set_map数据结构

> 在整个的数据开发过程中，涉及到数据结构，能使用map不使用数组，尤其是复杂的数据结构，如果对数据结构要求存储的数据有唯一性考虑使用set

* set  
集合中的数据是唯一的
```javascript
{
  let list = new Set();
  list.add(5);
  list.add(7);
  //size 相当于数组中的length
  console.log('size',list.size); //2
}

{
  let arr = [1,2,3,4,5];
  let list = new Set(arr);
  console.log('size',list.size); //5
}

{
  //会自己去重
  let list = new Set();
  list.add(1);
  list.add(2);
  list.add(1);
  console.log('list',list); //list Set {1, 2}

  //数字2 与 字符串'2'严格意义上是不相等的
  let arr=[1,2,3,1,'2'];
  let list2=new Set(arr);
  console.log('unique',list2); //unique Set {1, 2, 3, "2"}
  
  //以数组的形式输出
  console.log([...list2]);   // (4) [1, 2, 3, "2"]

}
```
四个方法add delete clear has  
add 添加一个元素  
delete 删除一个元素  
clear 清空所有元素  
has 查看集合中是否包含指定元素  
```javascript
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);
  list.add('add1');
  console.log('has',list.has('add')); //has true
  console.log('delete',list.delete('add'),list); //delete true Set {"delete", "clear", "has", "add1"}
  list.clear();
  console.log('list',list); //list Set {}
}
```
集合遍历  
```javascript
{
  let arr=['add','delete','clear','has'];
  let list=new Set(arr);

  for(let key of list.keys()){
    console.log('keys',key);
  }
  //keys add keys delete 5 keys clear  keys has

  for(let value of list.values()){
    console.log('value',value);
  }
  //value add  value delete  value clear  value has

  for(let [key,value] of list.entries()){
    console.log('entries',key,value);
  }
  //entries add add  entries delete delete  entries clear clear  entries has has

  list.forEach(function(item){console.log(item);})
  //add  delete  clear  has
}
```
* WeakSet  
weakset的元素只能是对象，WeakSet中的对象是弱引用，只是把地址拿过来，没有clear属性，不能遍历
```javascript
{
  let weakList=new WeakSet();
  let arg={a:'1'};
  weakList.add(arg);
  weakList.add({b:'2'});
  console.log('weakList',weakList);
  //weakList WeakSet {Object {b: "2"}, Object {a: "1"}}
}
```
* map  
map中的key可以是任意数据类型：字符串、数组、对象等
要注意set添加元素用add(),而map添加元素用set()
```javascript
{
  //第一种定义方式
  let map = new Map();
  let arr=['123'];
  map.set(arr,456);
  console.log('map',map,map.get(arr));
  //map Map {["123"] => 456} 456
}
{
  //第二种定义方式
  let map = new Map([['a',123],['b',456]]);
  console.log('map args',map);
  //map args Map {"a" => 123, "b" => 456}

  //size delete clear方法 与 遍历同set一样
  console.log('size',map.size); //size 2
  console.log('delete',map.delete('a'),map); //delete true Map {"b" => 456}
  map.clear();
  console.log('clear',map); //clear Map {}
}
```
* WeakMap  
同WeakSet一样接收的key值必须是对象，没有size属性，clear方法，也是不能遍历
```javascript
{
  let weakmap=new WeakMap();
  let o={};
  weakmap.set(o,123);
  console.log(weakmap.get(o)); //123
}
```
map与array增，查，改，删对比
```javascript
{
  // 数据结构横向对比，增，查，改，删
  let map=new Map();
  let array=[];
  // 增
  map.set('t',1);
  array.push({t:1});
  console.info('map-array',map,array);
  //map-array Map {"t" => 1} [Object]

  // 查
  let map_exist=map.has('t');
  let array_exist=array.find(item=>item.a);
  console.info('map-array',map_exist,!!array_exist);
  //map-array true false

  // 改
  map.set('t',2);
  array.forEach(item=>item.t?item.t=2:'');
  console.info('map-array-modify',map,array);
  //map-array-modify Map {"t" => 2} [Object]

  // 删
  map.delete('t');
  let index=array.findIndex(item=>item.t);
  array.splice(index,1);
  console.info('map-array-empty',map,array);
  //map-array-empty Map {} []
}
```
set与array增，查，改，删对比
```javascript
{
  // set和array的对比
  let set=new Set();
  let array=[];

  // 增
  set.add({t:1});
  array.push({t:1});
  console.info('set-array',set,array);
  //set-array Set {Object {t: 1}} [Object]

  // 查
  let set_exist=set.has({t:1}); //没有对象引用，将一直为false
  let array_exist=array.find(item=>item.t);
  console.info('set-array',set_exist,array_exist);
  //set-array false Object {t: 1}

  // 改
  set.forEach(item=>item.t?item.t=2:'');
  array.forEach(item=>item.t?item.t=2:'');
  console.info('set-array-modify',set,array);
  //set-array-modify Set {Object {t: 2}} [Object]

  // 删
  set.forEach(item=>item.t?set.delete(item):'');
  let index=array.findIndex(item=>item.t);
  array.splice(index,1);
  console.info('set-array-empty',set,array);
  //set-array-empty Set {} []
}
```
map,set,object对比
```javascript
{
  let item={t:1};
  let map=new Map();
  let set=new Set();
  let obj={};

  // 增
  map.set('t',1);
  set.add(item);
  obj['t']=1;
  console.info('map-set-obj',obj,map,set);
  //map-set-obj Object {t: 1} Map {"t" => 1} Set {Object {t: 1}}

  // 查
  console.info({
    map_exist:map.has('t'),
    set_exist:set.has(item),
    obj_exist:'t' in obj
  })
  //Object {map_exist: true, set_exist: true, obj_exist: true}

  // 改
  map.set('t',2);
  item.t=2;
  obj['t']=2;
  console.info('map-set-obj-modify',obj,map,set);
  //map-set-obj-modify Object {t: 2} Map {"t" => 2} Set {Object {t: 2}}

  // 删除
  map.delete('t');
  set.delete(item);
  delete obj['t'];
  console.info('map-set-obj-empty',obj,map,set);
  //map-set-obj-empty Object {} Map {} Set {}
}
```

## promise

Promise/A+规范参考[http://www.ituring.com.cn/article/66566](http://www.ituring.com.cn/article/66566)

#### 回调函数方式书写，如果异步请求多了，将会很难维护，程序看着很乱

```javascript
{
  let ajax = function(callback){
    console.log('执行');
    setTimeout(function(){
      callback && callback()
    });
  }
  ajax(function(){
    console.log('执行 ajax方法');
  })
}
```

### 使用Promise方式来写

* resove执行下一步操作
* reject中断当前操作
* then就是promise返回的对象，执行下一个,如果有两个函数，第一个表示resolved(已成功),第二个表示rejected(已失败)

```javascript
{
  let ajax = function(){
    console.log('promise','执行');
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve()
      },1000);
    });
  }
  ajax().then(function(){
    console.log('promise','执行ajax方法');
  });
}
```

### 执行两个promise的效果

```javascript
{
  let ajax = function(){
    console.log('promise','执行');
    return new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve()
      },1000);
    });
  }
  ajax()
    .then(function(){
      return new Promise(function(resolve,reject){
        setTimeout(function(){
          resolve();
        },1000);
      });
    })
    .then(function(){
      console.log('promise3','执行3');
    })
}
```

### 实现串行操作，执行a b c d 如果中间出了错误使用catch来捕获

```javascript
{
  let ajax = function(num){
    console.log('执行4');
    return new Promise(function(resolve,reject){
      if (num > 5) {
        resolve();
      }else{
        throw new Error('出错了')
      }
    });
  }
  ajax(6).then(function(){
    console.log('log','6');
  }).catch(function(err){
    console.log('catch',err);
  });
  ajax(3).then(function(){
    console.log('log','3');
  }).catch(function(err){
    console.log('catch','err');
  });
  // 输出：
  // 执行4
  // 执行4
  // log 6
  // catch err
}
```

### Promise.all

Promise.all是将多个Promise实例当成一个Promise实例  
all下面就是一个数组，数组传进来多个Promise实例，当多个Promise实例状态发生改变的时候，这个新的Promise实例才会发生变化
```javascript
{
  //所有图片加载完在添加到页面上
  function loadImg(src){
    return new Promise((resolve,reject) => {
      let img = document.createElement('img');
      img.src = src;
      img.onload = () => {
        resolve(img);
      }
      img.onerror = (err) => {
        reject(err)
      }
    })
  }
  function showImgs(imgs){
    imgs.forEach(function(img){
      document.body.appendChild(img)
    })
  }
  //每个loadImg()方法都是一个Promise实例只有当三个都发生该变化，才会执行新的Promise实例既Promise.all()
  Promise.all([
    loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
    loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
    loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
  ]).then(showImgs)
}
```

### Promise.race

Promise.race只要其中一个实例率先发生改变，Promise.race实例也将发生改变，其他的将不在响应
```javascript
{
  //有一个图片加载完就添加到页面上
  function loadImg(src){
    return new Promise((resolve,reject) => {
      let img = document.createElement('img');
      img.src = src;
      img.onload = () => {
        resolve(img);
      }
      img.onerror = (err) => {
        reject(err)
      }
    })
  }
  function showImgs(img){
    let p = document.createElement('p');
    p.appendChild(img);
    document.body.appendChild(p);
  }
  //每个loadImg()方法都是一个Promise实例只有当三个都发生该变化，才会执行新的Promise实例既Promise.all()
  Promise.race([
    loadImg('http://www.qzfweb.com/uploads/20170512190539489.jpeg'),
    loadImg('http://www.qzfweb.com/uploads/20170225143135972.jpg'),
    loadImg('http://www.qzfweb.com/uploads/20170217225453679.jpg')
  ]).then(showImgs)
}

```

### Promise种 .then第二个参数与catch捕获错误的区别?

* .then第二参数捕获错误

.then第二个回调参数捕获错误具有就近的原则，不会影响后续then的进行。

```javascript
{
  const ajax = function(){
    console.log('promise开始执行');
    return new Promise(function(resolve,reject){
      setTimeout(function(){
		    reject(`There's a mistake`);
      },1000);
    });
  }

  ajax()
    .then(function(){
      console.log('then1');

      return Promise.resolve();
    })
    .then(function(){
      console.log('then2');

      return Promise.reject(`There's a then mistake`);
    }, err => {
	    console.log('then1里面捕获的err: ', err);
	  })
	  .catch(err => {
      console.log('catch里面捕获的err: ', err);
    })

  // 输出
  // promise开始执行
  // then1里面捕获的err:  There's a mistake
  // then2
  // catch里面捕获的err:  There's a then mistake
}
```

* catch捕获错误

Promise抛错具有冒泡机制，能够不断传递，可以使用catch统一处理，下面代码中不会输出then1 then2会跳过，直接执行catch处理错误

```javascript
{
  const ajax = function(){
    console.log('promise开始执行');
    return new Promise(function(resolve,reject){
      setTimeout(function(){
		    reject(`There's a mistake`);
      },1000);
    });
  }

  ajax()
    .then(function(){
      console.log('then1');

      return Promise.resolve();
    })
    .then(function(){
      console.log('then2');

      return Promise.reject(`There's a then mistake`);
    })
	  .catch(err => {
      console.log('catch里面捕获的err: ', err);
    })

  // 输出
  // promise开始执行
  // catch里面捕获的err:  There's a then mistake
}
```

## iterator

> for-of 语句，它首先调用被遍历集合对象的 \[Symbol.iterator\]() 方法，该方法返回一个迭代器对象，迭代器对象可以是拥有 .next 方法的任何对象；然后，在 for-of 的每次循环中，都将调用该迭代器对象上的 .next 方法。

```javascript
{
  let arr=['hello','world'];
  //下面这种写法 数组直接调用Symbol.iterator这个接口，这个接口是数组内部已经帮我们实现了的，我们直接调用即可。
  let map=arr[Symbol.iterator]();
  console.log(map.next());
  console.log(map.next());
  console.log(map.next());
  //输出结果：done是ture表示没有下一步了，如果是false说明循环并没有结束
  //Object {value: "hello", done: false}
  //Object {value: "world", done: false}
  //Object {value: undefined, done: true}
}

{
  //数组索引是从0开始，内置了iterator接口，但是Object并没有帮我们部署Iterator接口。
  //对对象 自定义iterator接口，使其可以实现for of循环
  let obj={
    start:[1,3,2],
    end:[7,9,8],
    [Symbol.iterator](){
      let self=this;
      let index=0;
      //start 和 end 合并成一个数组
      let arr=self.start.concat(self.end);
      let len=arr.length;
      return {
        next(){
          if(index<len){
            return {
              value:arr[index++],
              done:false
            }
          }else{
            return {
              value:arr[index++],
              done:true
            }
          }
        }
      }
    }
  }
  for(let key of obj){
    console.log(key);
  }
}

{
  let arr=['hello','world'];
  for(let value of arr){
    console.log('value',value);
  }
}

```

## generator

> Generator是一种异步编程的解决方案，异步编程早期使用回调之后Promise也可以解决这个问题，而Generator也是用来解决这个问个的，但是相对于Promise会更高级一点。Generator返回的就是一个Iterator接口

提示 ```index.js:126 Uncaught ReferenceError: regeneratorRuntime is not defined``` 需要 ```import 'babel-polyfill'```

```javascript
{
  let tell = function* (){
    yield 'a';
    yield 'b';
    return 'c';
  }
  let t = tell();
  console.log(t.next());
  console.log(t.next());
  console.log(t.next());
  //Object {value: "a", done: false}
  //Object {value: "b", done: false}
  //Object {value: "c", done: true}
}
```
Generator就是一个遍历器生成函数，所以我们直接可以把它赋值Symbol.iterator,从而使这个对象也具备这个iterator接口
```javascript
 //Generator一种新的应用
 {
   let obj = {};
   obj[Symbol.iterator] = function* (){
     yield 1;
     yield 2
     yield 3;
   }
   for(let value of obj){
     console.log('value',value);
   }
   //运行结果:
   //value 1
   //value 2
   //value 3
 }
```
Generator最好是用在状态机，是JS编程中比较高级的用法，比如我们需要有a b c三种状态去描述一个事物，也就是这个事务只存在3种状态a-b b-c c-a 总之就是三种循环，永远跑不出第四种状态，用Generator函数去处理这种状态机是特别适用的
```javascript

{
  let state = function* (){
    while(1){
      yield 'A';
      yield 'B';
      yield 'C';
    }
  }
  let status = state();
  /*
    console.log(status.next()); //A
    console.log(status.next()); //B
    console.log(status.next()); //C
    console.log(status.next()); //A
    console.log(status.next()); //B  
  */
  setInterval(function(){
    console.log(status.next());
  },1000);
}
```
```javascript
{
  //async await这种写法并不是一种新的写法，只是Generator的一种语法糖
  let state = async function(){
    while(1){
      await 'A';
      await 'B';
      await 'C';
    }
  }
  let status = state();
  console.log(status.next());
  console.log(status.next());
  console.log(status.next());
  console.log(status.next());
  console.log(status.next());
}
```
通过Generator实现抽奖
```javascript
{
  let draw = function(count){
    //具体抽奖逻辑
    console.log(`剩余${count}次`);
  }
  let residue = function* (count){
    while(count > 0){
      count--;
      yield draw(count);
    }
  }
  let start = residue(5);
  let btn = document.createElement('button');
  btn.id = 'start';
  btn.textContent = '抽奖';
  document.body.appendChild(btn);
  document.getElementById('start').addEventListener('click',function(){
    start.next();
  },false);
}
```
如果服务端的某个数据状态定期的去变化，那么前端需要定时的去服务端取这个状态，因为http是无状态的链接，如果要实时的去取服务端的这种变化有两种方法，一个是长轮询，一个是通过websocket，websocket浏览器兼容性不好，因此长轮询还是一个普遍的用法
一种做法是通过定时器，不断的去访问接口
第二种是使用Generator
```javascript
{
  //长轮询
  let ajax = function* (){
    yield new Promise(function(resolve,reject){
      //这里模拟api成功执行后 执行resolve,比如下面的{code:0}，意思是返回接口成功执行后的数据
      setTimeout(function(){
        resolve({code:1})
      },200);
    });
  }

  let pull = function(){
    let generator = ajax();
    let step = generator.next(); //会返回一个promise对象实例，会对服务器端接口进行一次查询链接，上面采用setTimeout200毫秒来模拟
    //这个value就是代表了 promise实例，then是异步操作
    step.value.then(function(d){ //这个d是后端通讯的数据，这里就是上面的{code:0}
      if (d.code != 0) {
        //如果不等于 不是最新的数据，我们让每1秒钟执行一次
        setTimeout(function(){
          console.info('wait');
          pull();
        },1000)
      }else{
        //如果拿到最新数据，这里就打印出来
        console.log(d);
      }
    })
  }
  pull()
}
```

ES6中默认开启严格模式，要在ES5中使用需要有这句命令 ```use strict``` 强制开启严格模式。

## decorators修饰器

修饰器是一个函数  
通过修饰器能修改类的行为，也可理解为扩展类的功能  
只在类这个范围内有效  
使用修饰器还需要安装一个插件 ```import babel-plugin-transform-decorators-legacy```在.babelrc文件中引入如下文件：
```javascript
{
  "plugins":["transform-decorators-legacy"]
}
```
```javascript
//下面这个例子，限制某个属性是只读的
{
  //修饰器的第三方js库:core-decorators; npm install core-decorators，import引入后，直接在项目中写@readonly就可以了，不用向下面在定义readonly
  let readonly = function(target,name,descriptor){
    descriptor.writable = false;
    return descriptor;
  }

  class Test{
    @readonly
    time(){
      return '2017-06-14';
    }
  }
  let t1 = new Test();
  console.log(t1.time()); //2017-06-14

  let t2 = new Test();
  //此时 time为只读 再次设置将会报下面错误
  t2.time = function(){
    console.log('reset time');
  }
  console.log(t2.time());
  //Uncaught TypeError: Cannot assign to read only property 'time' of object '#<Test>'
}
```
案例：日志系统，比如广告我们会为其做展示、点击统计
```javascript
{
  //先写一个修饰器，type表示的是show 还是 click
  let log = (type) => {
    return function(target,name,descriptor){
      //保存一下原始的函数体
      let src_method = descriptor.value;
      //重新进行赋值
      descriptor.value = (...arg) => {
        src_method.apply(target,arg);
        //如果将来发送买点接口变了，只需要改log对应的这个方法就可以了
        console.info(`log ${type} `);
      }
    }
  }

  class AD{
    @log('show')
    show(){
      console.info('ad is show');
    }

    @log('click')
    click(){
      console.info('ad is click');
    }
  }

  let ad = new AD();
  ad.show();
  ad.click();
}
```
