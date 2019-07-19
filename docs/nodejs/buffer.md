# Buffer

从前端转入 Node.js 的童鞋对这一部分内容会比较陌生，因为在前端中一些简单的字符串操作已经满足基本的业务需求，有时可能也会觉得 buffer、stream 这些会很神秘。回到服务端，如果你不想只做一名普通的 Node.js 开发工程师，你应该深入去学习一下 Buffer 揭开这一层神秘的面纱，同时也会让你对 Node.js 的理解提高一个水平。

## Buffer是什么？

在引入 TypedArray 之前，JavaScript 语言没有用于读取或操作二进制数据流的机制。 Buffer 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。这是来自 Node.js 官网的一段描述，比较晦涩难懂，总结起来一句话 Node.js 可以用来处理二进制流数据或者与之进行交互。

Buffer 用于读取或操作二进制数据流，做为 Node.js API 的一部分使用时无需 require，用于操作网络协议、数据库、图片和文件 I/O 等一些场景需要大量二进制数据的场景。Buffer 在创建时大小已经被确定且是无法调整的，在内存分配这块 Buffer 是由 C++ 层面提供而不是 V8 具体后面会讲解。

## Buffer基本使用

### 创建Buffer

在 6.0.0 之前的 Node.js 版本中， Buffer 实例是使用 Buffer 构造函数创建的，该函数根据提供的参数以不同方式分配返回的 Buffer ```new Buffer()```。

现在可以通过 Buffer.from()、Buffer.alloc() 与 Buffer.allocUnsafe() 三种方式来创建

**Buffer.from()**

```js
const b1 = Buffer.from('10');
const b2 = Buffer.from('10', 'utf8');
const b3 = Buffer.from([10]);
const b4 = Buffer.from(b3);

console.log(b1, b2, b3, b4); // <Buffer 31 30> <Buffer 31 30> <Buffer 0a> <Buffer 0a>
```

**Buffer.alloc**

返回一个已初始化的 Buffer，可以保证新创建的 Buffer 永远不会包含旧数据。

```js
const bAlloc1 = Buffer.alloc(10);

console.log(bAlloc1); // <Buffer 00 00 00 00 00 00 00 00 00 00>
```

**Buffer.allocUnsafe**

创建一个大小为 size 字节的新的未初始化的 Buffer，由于 Buffer 是未初始化的，因此分配的内存片段可能包含敏感的旧数据。在 Buffer 内容可读情况下，则可能会泄露它的旧数据，这个是不安全的，使用时要谨慎。

```js
const bAllocUnsafe1 = Buffer.allocUnsafe(10);

console.log(bAllocUnsafe1); // <Buffer 49 ae c9 cd 49 1d 00 00 11 4f>
```

### Buffer 字符编码

通过使用字符编码，可实现 Buffer 实例与 JavaScript 字符串之间的相互转换，目前所支持的字符编码如下所示：

* 'ascii' - 仅适用于 7 位 ASCII 数据。此编码速度很快，如果设置则会剥离高位。
* 'utf8' - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8。
* 'utf16le' - 2 或 4 个字节，小端序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。
* 'ucs2' - 'utf16le' 的别名。
* 'base64' - Base64 编码。当从字符串创建 Buffer 时，此编码也会正确地接受 RFC 4648 第 5 节中指定的 “URL 和文件名安全字母”。
* 'latin1' - 一种将 Buffer 编码成单字节编码字符串的方法（由 RFC 1345 中的 IANA 定义，第 63 页，作为 Latin-1 的补充块和 C0/C1 控制码）。
* 'binary' - 'latin1' 的别名。
* 'hex' - 将每个字节编码成两个十六进制的字符。

```js

```

## 什么是二进制数据？

二进制数据使用 0 和 1 两个数码来表示的数据，为了存储或展示一些数据，计算机需要先将这些数据转换为二进制来表示。例如，我想存储 66 这个数字，计算机会先将数字 66 转化为二进制 01000010 表示，转换公式如下所示：

| 128 | 64  | 32  | 16  | 8   | 4   | 2   | 1   |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0   | 1   | 0   | 0   | 0   | 0   | 1   | 0   |

上面用数字举了一个示例，我们知道数字只是数据类型之一，其它的还有字符串、图像、文件等。例如我们对一个英文 M 操作，在 JavaScript 里可以通过 'M'.charCodeAt()，取到对应的 ASCII 码之后在转为二进制表示。

## Buffer内存机制

由于 Buffer 需要处理的是大量的二进制数据，假如用一点就向系统去申请，则会造成频繁的向系统申请内存调用，所以 Buffer 所占用的内存不再由 V8 分配，而是在 Node.js 的 C++ 层面完成申请。因此，这部分内存我们称之为堆外内存。

## Buffer性能测试

```js
const http = require('http');
let str = '';
for (let i=0; i<1024; i++) {
    str+='a'
}

const server = http.createServer((req, res) => {
    console.log(req.url);

    if (req.url === '/buffer') {
        res.end(Buffer.from(str));
    } else if (req.url === '/string') {
        res.end(str);
    }
});

server.listen(3000);
```

在 HTTP 传输中传输的是二进制数据，上面例子中的 /string 接口直接返回的字符串，这时候 HTTP 在传输之前会先将字符串转换为 Buffer 类型，以二进制数据传输，通过流（Stream）的方式一点点返回到客户端。但是直接返回 Buffer 类型，则少了每次的转换操作，对于性能也是有提升的。

在一些 Web 应用中，对于静态数据可以预先转为 Buffer 进行传输，可以有效减少 CPU 的重复使用（重复的字符串转 Buffer 操作）。

## Reference

- [http://nodejs.cn/api/buffer.html](http://nodejs.cn/api/buffer.html)
- [深入浅出 Node.js Buffer 一节](https://book.douban.com/subject/25768396/)
- [Do you want a better understanding of Buffer in Node.js? Check this out.](https://www.freecodecamp.org/news/do-you-want-a-better-understanding-of-buffer-in-node-js-check-this-out-2e29de2968e8/)
- [A cartoon intro to ArrayBuffers and SharedArrayBuffers](https://hacks.mozilla.org/2017/06/a-cartoon-intro-to-arraybuffers-and-sharedarraybuffers/)