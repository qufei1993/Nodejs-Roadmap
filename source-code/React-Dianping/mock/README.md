安装
```javascript
	npm install koa koa-router koa-body --save
```
运行
```javascript
	npm run mock
	"mock":"node --harmony ./mock/server.js",
```
问题1：
```javascript
	TypeError: Class constructor Application cannot be invoked without 'new'
```
对策1：
	在koa2以后版本中会出现次问题
	将 var app = new koa()();改成以下写法
```javascript
	var koa = require('koa');
	var app = new koa();
```
