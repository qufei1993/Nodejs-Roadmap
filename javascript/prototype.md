# 原型

* [原型概念](#原型概念)
    * [原型模式的执行流程](#原型模式的执行流程)
    * [构造函数实例属性方法](#构造函数实例属性方法)
    * [构建原型属性方法](#构建原型属性方法)
* [原型字面量创建对象](#原型字面量创建对象)
    * [字面量创建对象](#字面量创建对象)
    * [构造函数创建对象](#构造函数创建对象)
    * [原型对象的重写需要注意的问题](#原型对象的重写需要注意的问题)
* [原型的实际应用](#原型的实际应用)
    * [jquery中原型应用](#jquery中原型应用)
    * [zepto中原型的应用](#zepto中原型的应用)
* [原型的扩展](#原型的扩展)

## 原型概念
> 我们所创建的每个原型都有一个(原型)属性，这个属性是一个对象。

#### 原型模式的执行流程

1. 先查找构造函数实例里的属性或方法，如果有，立刻返回
2. 如果构造函数实例里没有，则去它的原型对象里找，如果有，就返回

#### 构造函数实例属性方法

```js
function Box(name,age){
    this.name=name; 	//实例属性
    this.age=age;
    this.run=function(){ //实例方法
        return this.name+this.age+"运行中.....";
    };
}

var box1=new Box('zhangsan',20);
var box2=new Box('lisi',18);
alert(box1.run==box2.run); //false
```

#### 构建原型属性方法

构造函数体内什么都没有，这里如果有，叫作实例属性，实例方法

```js
function Box(){}
```

```js
Box.prototype.name='lee'; //原型属性
Box.prototype.age=23;
Box.prototype.run=function(){//原型方法
    return this.name+this.age+"运行中......";
};
```
如果是实例化方法，不同的实例化，他们的地址是不一样的，是唯一的，如果是原型方法，那么他们地址是共享的，大家都一样，看以下示例```box1.run==box2.run```。

```js
var box1=new Box();
var box2=new Box();
alert(box1.run==box2.run);  // true

// alert(box1.prototype);	// 这个属性是一个对象，访问不到
// alert(box1._proto_); // 这个属性是一个指针指向prototype原型对象

//构造属性可以获取构造函数本身
//作用是被原型指针定位，然后得到构造函数本身
//其实就是对象实例对应的原型对象的作用
alert(box1.constructor);	
```

## 原型字面量创建对象

> 使用构造函数创建原型对象和使用字面量创建对象在使用上基本相同，但还是有一些区别，字面量创建的方式使用constructor属性不会指向实例，而会指向Object，构造函数则相反。

#### 字面量创建对象

```js
function Box(){}

// 使用字面量的方式创建原型对象，这里{}就是对象(Object),new Object就相当于{}
Box.prototype={
    name:'lee',
    age:20,
    run:function(){
        return this.name+this.age+"运行中.......";
    }
};

var box1=new Box();
alert(box1.constructor);//返回function Object(){}对象
```

#### 构造函数创建对象

```js
function Box(name,age){
    this.name=name;
    this.age=age;
    this.run=function(){
        return this.name+this.age+"运行中....";
    };
}

var box1=new Box('zhangsan',20);
alert(box1.constructor); //返回的是function Box(){}
```

#### 原型对象的重写需要注意的问题

1. 重写原型对象之后，不会保存之前原型的任何信息
2. 把原来的原型对象和构造函数对象实例之间的关系切断了

```js
function Box(){}

Box.prototype={
    constructor:Box,//让他强制指向Box
    name:'lee',
    age:20,
    run:function(){
        return this.name+this.age+"运行中.......";
    }
};
```

重写原型

```js
Box.prototype={
    age:21
}
var box1=new Box();
alert(box1.name); // undefined
```

可以使用addstring()方法向原型添加内容，这样可以避免原型重写

```js
String.prototype.addstring=function(){
    return this+'，被添加了！';
};

var box1=new Box();
alert(box1.name.addstring()); // lee，被添加了！
```

## 原型的实际应用

1. 先找到入口函数```window.$```
2. 根据入口函数找到构造函数```new ...```
3. 根据构造函数找到原型的定义```zepto.Z.prototype```

### 实例

以下实例中通过Jquery或Zepto操作dom元素，例如css方法、text方法都是操作的原型上的的方法。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Zepto</title>
    <!--<script src="https://cdn.bootcss.com/zepto/1.1.6/zepto.js"></script>
    <script src="zepto.js"></script>
    <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.js"></script> -->
    <script src="jquery.js"></script>
</head>
<body>
    <div> 这是一个测试 </div>
    <div> 这是一个测试2 </div>
    <script>
        var div = $('div'); // 得到一个实例
        div.css('color', 'red'); // 原型方法css
        alert(div.text()); // 原型方法text
    </script>
</body>
</html>
```

### zepto中原型的应用

Zepto源码地址：https://cdn.bootcss.com/zepto/1.1.6/zepto.js

以下实例也是取了关于原型部分的源码

```js
var Zepto = (function() {
    var $, zepto={}, emptyArray=[], slice=emptyArray.slice, document=window.document;

    // 构造函数
    zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || '';

        return dom
    }

    zepto.init = function(selector) {
        var dom;

        // 如果选择器不存在，返回一个空的Zepto集合
        if (!selector) return zepto.Z();

        // 优化字符串选择器
        if (typeof selector === 'string') {
            selector = selector.trim();

            // 还有一系列的判断此处忽略，进行简化 ...
            dom = slice.call(document.querySelectorAll(selector))
        } else {
            // 更多可以去查看源码 ...
        }

        return zepto.Z(dom, selector)
    }

    $ = function(selector) {
        return zepto.init(selector);
    } 

    $.fn = {
        text: function() {
            return (0 in this ? this[0].textContent : null)
        },
        css: function() {
            alert('css');
        }
    }

    // $.fn赋值给构造函数的原型
    zepto.Z.prototype = $.fn;

    return $;
})()

window.Zepto = Zepto;
window.$ === undefined && (window.$ = Zepto); // 如果window.$不存在，赋予window.$为Zepto;
```

### jquery中原型应用

Jquery源码地址：https://cdn.bootcss.com/jquery/3.3.1/jquery.js

```js
(function(global, factory) {
    // 浏览器环境、Node环境判断
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        // Node环境处理，这里不做阐述，具体参考源码
        // factory(global, true);
    } else {
        // 进入浏览器环境
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    var Jquery = function(selector) {
        return new jQuery.fn.init(selector);
    }

    Jquery.fn = Jquery.prototype = {
        css: function() {
            alert('css');
        },
        text: function() {
            return (0 in this ? this[0].textContent : null);
        }
    };

    // 定义构造函数
    var init = Jquery.fn.init = function(selector) {
        var slice = Array.prototype.slice;
        var dom = slice.call(document.querySelectorAll(selector));

        var i, len=dom ? dom.length : 0;
        for (i=0; i<len; i++) {
            this[i] = dom[i];
        }
        this.length = len;
        this.selector = selector || '';
    }

    // 构造函数原型赋值
    init.prototype = Jquery.fn;

    if ( !noGlobal ) { // 判断是否为浏览器环境
        window.jQuery = window.$ = Jquery;
    }    
})
```

## 原型的扩展

1. 插件扩展在```$.fn```之上，并不是扩展在构造函数的原型
2. 对外开放的只有```$```，构造函数并没有开放

在Zepto中把原型方法放在$.fn上，在Jquery中把原型方法放在Jquery.fn之上，之所以这样做是为了后期插件扩展所需。

实例:

```html
<body>
    <script>
        // 插件扩展：获取tagName
        $.fn.getTagName = function() {
            return (0 in this ? this[0].tagName : '');
        }    
    </script>
    <div> 这是一个测试 </div>
    <div> 这是一个测试2 </div>
    <script>
        var div = $('div'); // 得到一个实例
        alert(div.getTagName()); // 封装的插件
    </script>
</body>
```