# 正则表达式

## 快速导航

- [模式修饰符参数](#模式修饰符参数)
- [两个测试方法](#两个测试方法)
- [4个正则表达式方法](#4个正则表达式方法)
- [匹配模式](#匹配模式)
- [常用正则表达式](#常用正则表达式)

## 模式修饰符参数
* ```i```：忽略大小写  
* ```g```：全局匹配   
* ```m```：多行匹配  
* ```/hello/```：两个反斜杠是正则表达式的字面量表示法  

## 两个测试方法

- **test**

```js
const test = new RegExp('hello world', 'ig');
console.log(test.test('hello world')); // true
```

- **exec**

> 返回的是数组，有就返回数组的值，没有返回为null。

```js
const test = new RegExp('hello world', 'ig');
console.log(test.exec('hello')); // null
```

## 4个正则表达式方法

- **match(pattern)**

> 将所有匹配的字符串组合成数组返回

```js
const pattern=/Box/ig;
const str="This is a Box! The is a box!";

console.log(str.match(pattern));
```

- **search(pattern)**

> 返回字符串中pattern开始位置，忽略全局匹配

```js
const pattern=/Box/i;	//
const str="This is a Box! The is a box!";

console.log(str.search(pattern)); // 10
```

- **replace(pattern)**

>替换匹配到的字符串

```js
const pattern=/Box/ig;
const str="This is a Box! The is a box!";

console.log(str.replace(pattern,'Tom'));
```

- **split(pattern)**

> 返回字符串指定pattern拆分数组

```js
const pattern = / /ig;	//空格
const str = "This is a Box! The is a box!";

console.log(str.split(pattern)); //以空格进行分割，返回的是数组

// 输出结果
// [ 'This', 'is', 'a', 'Box!', 'The', 'is', 'a', 'box!' ]
```

## 匹配模式

* ```\w```表示```a-zA-Z_```

* 锚元字符匹配```(^ $)``` ```^```强制收匹配```$```强制尾匹配，并且只匹配一个

```js
const pattern=/^[a-z]oogle\d$/;
const str="aoogle2";
console.log(pattern.test(str)); // true
```

```注意：``` ```^```符号在```[]```里面表示 非  在外边表示强制首匹配，并且只匹配一个 要想匹配多个值，使用```+```

* ```\b```表示到达边界

* ```|```表示匹配或选择模式

```js
const pattern=/baidu|google|bing/; //匹配或选择其中某个字符，不是相等，包含的意思
const str = "baidu a google"; 
console.log(pattern.test(str));  //返回true
```

## 常用正则表达式

- **检查邮政编码**

```js
const pattern = /^[1-9]{1}[0-9]{5}$/;
const str = "122534"; //共6位数，第一位不能为0

console.log(pattern.test(str)); // true
```

- **压缩包后缀名**

\w等于a-zA-Z0-9_ 使用^限定从首字母匹配 .是特殊符号需要\n进行转义
|选择符必须使用()进行分组

```js
const pattern = /^[\w]+\.(zip|gz|rar)$/;  
const str="a12_.zip"; //文件名 字母_数字.zip,gz,rar
console.log(pattern.test(str)); // true
```

- **删除多余空格**

> ***方法一***：使用replace只匹配一个，所以使用+匹配多个

```js
var pattern=/^\s+/; 
var str="        google       ";
var result=str.replace(pattern,'');
    pattern=/\s+$/;
    result=result.replace(pattern,'');
    
console.log('|'+result+'|'); // |google|
```

> ***方法二***：(.+)贪婪模式，使用惰性模式，后面的空格不让匹配
		
```js
var pattern=/^\s+(.+?)\s+$/;
var str="     google         ";
var result=pattern.exec(str,'')[1];

console.log('|'+result+'|');
```

> ***方法三***：(.+)贪婪模式，改为惰性模式，使用分组模式，只取匹配的内容		
```js
var pattern=/^\s+(.+?)\s+$/;
var str="     google         ";
var result=str.replace(pattern,'$1'); //使用分组模式

console.log('|'+result+'|'); // |google|
```

- **简单邮箱验证**

```js
var pattern=/^([\w\.\_]+)@([\w\_]+)\.([a-zA-Z]){2,4}$/;
var str="qzfweb@gmail.com";
console.log(pattern.test(str)); // true
```