# 原型

* [原型的实际应用](#原型的实际应用)
    * [jquery中原型应用](#jquery中原型应用)
    * [zepto中原型的应用](#zepto中原型的应用)
* [原型的扩展](#原型的扩展)

## 原型的实际应用

1. 先找到入口函数```window.$```
2. 根据入口函数找到构造函数```new ...```
3. 根据构造函数找到原型的定义```zepto.Z.prototype```

### 实例

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