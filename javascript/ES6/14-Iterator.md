### Symbol.iterator
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

