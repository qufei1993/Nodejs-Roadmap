# Generator

> Generator是一种异步编程的解决方案，异步编程早期使用回调之后Promise也可以解决这个问题，而Generator也是用来解决这个问题的，但是相对于Promise会更高级一点。Generator返回的就是一个Iterator接口。

**```提示：```** ```index.js:126 Uncaught ReferenceError: regeneratorRuntime is not defined```
**```需要：```** ```import 'babel-polyfill'```
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

> Generator就是一个遍历器生成函数，所以我们直接可以把它赋值Symbol.iterator,从而使这个对象也具备这个iterator接口
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

> Generator最好是用在状态机，是JS编程中比较高级的用法，比如我们需要有a b c三种状态去描述一个事物，也就是这个事务只存在3种状态a-b b-c c-a 总之就是三种循环，永远跑不出第四种状态，用Generator函数去处理这种状态机是特别适用的
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
