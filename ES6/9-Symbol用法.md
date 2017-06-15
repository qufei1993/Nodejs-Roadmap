### Symbol
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
