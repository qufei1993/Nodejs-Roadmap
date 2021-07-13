# 如何在 Node.js 中流式处理大 JSON 文件

![](https://cdn.nlark.com/yuque/0/2021/png/335268/1621122471129-9a787beb-1e54-4980-a3e4-d42e35af2bd8.png#clientId=u403307b8-3ba7-4&from=ui&id=uf2df5b6f&margin=%5Bobject%20Object%5D&name=%E9%BB%98%E8%AE%A4%E6%96%87%E4%BB%B61621122451619.png&originHeight=383&originWidth=900&originalType=binary&size=160186&status=done&style=none&taskId=uff274156-62bb-4216-896f-0191fd83b58)

解决一个问题不只要搜寻最终的答案，寻找答案的过程同样也是重要的，善于思考与总结总归是好的。

本文介绍一个概念 SAX 的设计模式，这个概念虽然不是来源于 Node.js，但它解决问题的一些思想当我们在使用 Node.js 或一些其它的编程语言中遇到类似问题时也会受到一些启发，本文后面会介绍如何流式处理一个大 JSON 文件，下面先给出了两个问题，可以先思考下如果是你会怎么做？

## 场景描述

问题一：假设现在有一个场景，有一个大的 JSON 文件，需要读取每一条数据经过处理之后输出到一个文件或生成报表数据，怎么能够流式的每次读取一条记录？

```json
[
  {"id": 1},
  {"id": 2},
  ...
]
```

问题二：同样一个大的 JSON 文件，我只读取其中的某一块数据，想只取 list 这个对象数组怎么办？

```json
{
	"list": [],
  "otherList": []
}
```

在 Node.js 中我们可以基于以下两种方式读取数据，也是通常首先能够想到的：
- fs.readFile()：这个是一次性读取数据到内存，数据量大了都占用到内存也不是好办法，很容易造成内存溢出。
- fs.createReadStream()：创建一个可读流，能解决避免大量数据占用内存的问题，这是一个系统提供的基础 API 读取到的是一个个的数据块，因为我们的 JSON 对象是结构化的，也不能直接解决上面提的两个问题。
- 还有一个 require() 也可以加载 JSON 文件，但是稍微熟悉点 Node.js CommonJS 规范的应该知道 require 加载之后是会缓存的，会一直占用在服务的内存里。

## 了解下什么是 SAX

SAX 是 Simple API for XML 的简称，目前没有一个标准的 SAX 参考标准，最早是在 Java 编程语言里被实现和流行开的，以 Java 对 SAX 的实现后来也被认为是一种规范。其它语言的实现也是遵循着该规则，尽管每门语言实现都有区别，但是这里有一个重要的概念 “事件驱动” 是相同的。

实现了 SAX 的解析器拥有事件驱动那样的 API，像 Stream 的方式来工作，边读取边解析，用户可以定义回调函数获取数据，无论 XML 内容多大，内存占用始终都会很小。

这对我们本节有什么帮助？我们读取解析一个大 JSON 文件的时候，也不能把所有数据都加载到内存里，我们也需要一个类似 SAX 这样的工具帮助我们实现。

## 基于 SAX 的流式 JSON 解析器

这是一个流式 JSON 解析器 [https://github1s.com/creationix/jsonparse](https://github1s.com/creationix/jsonparse) 周下载量在 600 多万，但是这个源码看起来很难梳理。如果是学习，推荐一个基于 SAX 的更简单版本 [https://gist.github.com/creationix/1821394](https://gist.github.com/creationix/1821394) 感兴趣的可以看看。

JSON 是有自己的标准的，有规定的数据类型、格式。这个 JSON 解析器也是在解析到特定的格式或类型后触发相应的事件，我们在使用时也要注册相应的回调函数。

下面示例，创建一个可读流对象，在流的 data 事件里注册 SaxParser 实例对象的 parse 方法，也就是将读取到的原始数据（默认是 Buffer 类型）传递到 parse() 函数做解析，当解析到数据之后触发相应事件。

对应的 Node.js 代码如下：

```json
const SaxParser = require('./jsonparse').SaxParser;
const p = new SaxParser({
  onNull: function () { console.log("onNull") },
  onBoolean: function (value) { console.log("onBoolean", value) },
  onNumber: function (value) { console.log("onNumber", value) },
  onString: function (value) { console.log("onString", value) },
  onStartObject: function () { console.log("onStartObject") },
  onColon: function () { console.log("onColon") },
  onComma: function () { console.log("onComma") },
  onEndObject: function () { console.log("onEndObject") },
  onStartArray: function () { console.log("onEndObject") },
  onEndArray: function () { console.log("onEndArray") }
});

const stream = require('fs').createReadStream("./example.json");
const parse = p.parse.bind(p);
stream.on('data', parse);
```

怎么去解析一个 JSON 文件的数据已经解决了，但是如果直接这样使用还是需要在做一些处理工作的。

## JSONStream 处理大文件

这里推荐一个 NPM 模块 [JSONStream](https://github.com/dominictarr/JSONStream)，在它的实现中就是依赖的 [jsonparse](https://github1s.com/creationix/jsonparse) 这个模块来解析原始的数据，在这基础之上做了一些处理，根据一些匹配模式返回用户想要的数据，简单易用。

下面我们用 [JSONStream](https://github.com/dominictarr/JSONStream) 解决上面提到的两个问题。

### 问题一：

> 假设现在有一个场景，有一个大的 JSON 文件，需要读取每一条数据经过处理之后输出到一个文件或生成报表数据，怎么能够流式的每次读取一条记录？

因为测试，所以我将 highWaterMark 这个值调整了下，现在我们的数据是下面这样的。

```json
[
  { "id": 1 },
  { "id": 2 }
]
```

重点是 JSONStream 的 parse 方法，我们传入了一个 `'.'`，这个 data 事件也是该模块自己处理过的，每次会为我们返回一个对象：
- 第一次返回 `{ id: 1 }`
- 第二次返回 `{ id: 2 }`

```js
const fs = require('fs');
const JSONStream = require('JSONStream');

(async () => {
  const readable = fs.createReadStream('./list.json', {
    encoding: 'utf8',
    highWaterMark: 10
  })
  const parser = JSONStream.parse('.');
  readable.pipe(parser);
  parser.on('data', console.log);
})()
```

### 问题二：

> 同样一个大的 JSON 文件，我只读取其中的某一块数据，想只取 list 这个数组对象怎么办?

解决第二个问题，现在我们的 JSON 文件是下面这样的。

```js
{
  "list": [
    { "name": "1" },
    { "name": "2" }
  ],
  "other": [
    { "key": "val" }
  ]
}
```

与第一个解决方案不同的是改变了 `parse('list.*')` 方法，现在只会返回 list 数组，other 是不会返回的，其实在 list 读取完成之后这个工作就结束了。
- 第一次返回 `{ name: '1' }`
- 第二次返回 `{ name: '2' }`

```js
(async () => {
  const readable = fs.createReadStream('./list.json', {
    encoding: 'utf8',
    highWaterMark: 10
  })
  const parser = JSONStream.parse('list.*');
  readable.pipe(parser);
  parser.on('data', console.log);
})();
```

## 总结

当我们遇到类似的大文件需要处理时，尽可能避免将所有的数据存放于内存操作，应用服务的内存都是有限制的，这也不是最好的处理方式。

文中主要介绍如何流式处理类似的大文件，更重要的是掌握编程中的一些思想，例如 SAX 一个核心点就是实现了 “事件驱动” 的设计模式，同时结合 Stream 做到边读取边解析。

处理问题的方式是多样的，还可以在生成 JSON 文件时做拆分，将一个大文件拆分为不同的小文件。

学会寻找答案，NPM 生态发展的还是不错的，基本上你能遇到的问题大多已有一些解决方案了，例如本次问题，不知道如何使用 Stream 来读取一个 JSON 文件时，可以在 NPM 上搜索关键词尝试着找下。

![](https://cdn.nlark.com/yuque/0/2021/png/335268/1621087703521-d551a807-1115-43b5-9e7d-aa9c1c8873a7.png#clientId=u551845cc-9af5-4&from=paste&height=742&id=ufbbb9e2a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1484&originWidth=2846&originalType=binary&size=294012&status=done&style=none&taskId=u1ac6918b-c6cc-4f8d-919d-2719d01bf98&width=1423)

当然你也可以添加下五月君微信 “codingMay” 备注 “Node” 邀请加入 Node.js 开发者交流群，抛出你遇到的问题，也欢迎解决一些其它小伙伴的问题，共同学习、共同成长。

![](https://cdn.nlark.com/yuque/0/2021/png/335268/1621087885456-17c88e68-732e-4eb2-bd9a-136f7eec3ad1.png#clientId=u551845cc-9af5-4&from=paste&height=215&id=ua3ce9d65&margin=%5Bobject%20Object%5D&name=image.png&originHeight=430&originWidth=430&originalType=binary&size=80854&status=done&style=none&taskId=u7fe798de-a781-4e90-af0b-38aa54a54e6&width=215) 

