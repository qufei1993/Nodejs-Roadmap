# Symbol

> ES6引入了一种新的数据类型Symbol，表示独一无二的值。

## 变量定义

- **Symbol()**

> Symbol声明的变量都是唯一的

```js
let a1=Symbol();
let a2=Symbol();

console.log(a1===a2); //false
```

- **Symbol.for()**

> Symbol.for(str)首先会在全局中搜索有没有以该参数作为名称的Symbol值，如果有直接返回；如果没有，新建并返回一个以该字符串为名称的Symbol值。

```js
let a3=Symbol.for('a3');
let a4=Symbol.for('a3');

console.log(a3===a4); // true
```

## 遍历

```js
let a1=Symbol.for('abc');
let obj={
    [a1]:'123',
    'abc':345,
    'c':456
};

console.log('obj',obj); / /obj Object {abc: 345, c: 456, Symbol(abc): "123"}
```

- **for of**

> 使用for of不能遍历出Symbol定义的变量

```js
for(let [key,value] of Object.entries(obj)){
  console.log('let of',key,value);
}

// 输出：let of abc 345 let of c 456
```

- **getOwnPropertySymbols()**

> getOwnPropertySymbols()只获取Symbol定义的值

```js
Object.getOwnPropertySymbols(obj).forEach(function(item){
  console.log(obj[item]); //123
})
```

- **ownKeys**

> 遍历出所有的值

```js
Reflect.ownKeys(obj).forEach(function(item){
  console.log('ownkeys',item,obj[item]);
})

// 输出：
// ownkeys abc 345
// ownkeys c 456
// ownkeys Symbol(abc) 123
```

## iterator

> for-of 语句，它首先调用被遍历集合对象的Symbol.iterator() 方法，该方法返回一个迭代器对象，迭代器对象可以是拥有 .next 方法的任何对象；然后，在 for-of 的每次循环中，都将调用该迭代器对象上的 .next 方法。

```javascript
{
  let arr=['hello','world'];
  // 下面这种写法 数组直接调用Symbol.iterator这个接口，这个接口是数组内部已经帮我们实现了的，我们直接调用即可。
  let map=arr[Symbol.iterator]();
  
  console.log(map.next());
  console.log(map.next());
  console.log(map.next());
  // 输出结果：done是ture表示没有下一步了，如果是false说明循环并没有结束
  // Object {value: "hello", done: false}
  // Object {value: "world", done: false}
  // Object {value: undefined, done: true}
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