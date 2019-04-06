
# Decorators修饰器
> 修饰器是一个函数，通过修饰器能修改类的行为，也可理解为扩展类的功能，在类这个范围内有效。

## 插件

> 使用修饰器还需要安装一个插件 ```import babel-plugin-transform-decorators-legacy```在.babelrc文件中引入如下文件：

```.babelrc```
```javascript
{
  "plugins":["transform-decorators-legacy"]
}
```

**```注意：```** ES6中默认开启严格模式，要在ES5中使用需要有这句命令 ```use strict``` 强制开启严格模式。

## 案例

- **案例一：限制某个属性为只读**

> 修饰器的第三方js库:core-decorators; npm install core-decorators，import引入后，直接在项目中写@readonly就可以了，不用向下面在定义readonly
```javascript
{
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

- **案例一：点击统计**

> 日志系统，比如广告，我们会为其做展示、点击统计

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