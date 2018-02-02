# JavaScript基础问题

### 变量与作用域

* JavaScript七种内置类型: number、string、boolean、undefined、null、object、symbol(ES6新增加)
* 变量没有类型, 变量持有的值有类型
* 已在作用域中声明但还没有赋值的变量是undefined，还没有在作用域中声明过的变量是undeclared，对于undeclared这种情况typeof处理的时候返回的是undefined
* typeof null === 'object' //true 正确的返回值应该是null，但是这个bug由来已久。 undefined == null //true


### 定时器
* setTimeout(callback, 100) //setTimeout只接受一个函数或者变量做为参数不接受闭包，因为闭包会自执行
