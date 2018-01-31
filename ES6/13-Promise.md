### Promise

Promise/A+规范参考[http://www.ituring.com.cn/article/66566](http://www.ituring.com.cn/article/66566)

```javascript
//回调函数方式书写，如果异步请求多了，将会很难维护，程序看着很乱
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
//使用Promise方式来写
// resove执行下一步操作
// reject中断当前操作
// then就是promise返回的对象，执行下一个,如果有两个函数，第一个表示resolve,第二个表示reject
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
//执行两个promise的效果
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
```javascript
//实现串行操作，执行a b c d 如果中间出了错误使用catch来捕获
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
