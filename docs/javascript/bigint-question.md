# JavaScript 中由于大数精度丢失引发的问题思考

在 JavaScript 中浮点数运算时经常出现 0.1+0.2=0.30000000000000004 这样的问题，除了这个问题之外还有一个不容忽视的**大数处理丢失精度问题**，也是近期遇到的一些问题，做下梳理同时理解下背后产生的原因和解决方案。

## 先修知识

> 1. 1bit 可以存储多少个整数？8bit 可以存储多少个整数？

N 个 bit 可以存储的整数是 2 的 N 次方个。

> 2. 浮点数是否等价于小数？


[justjavac.com/codepuzzle/2012/11/02/codepuzzle-float-from-surprised-to-ponder.html](https://justjavac.com/codepuzzle/2012/11/02/codepuzzle-float-from-surprised-to-ponder.html)

## JavaScript 浮点数存储

在 JS 中不论小数还是整数统只有一种数据类型表示 Number，其遵循 IEEE 754 标准，使用双精度浮点数（double）64 位（8 字节）来存储一个浮点数，这个 64Bits 分为以下 3 个部分，其中能够真正决定数字精度的是尾部，即 2 的 53 次方减 1（Math.pow(2, 53) - 1）

* sign bit（符号）：用来表示正负号（1 bit）
* exponent（指数）：用来表示次方数（11 bits）
* mantissa（尾数）：用来表示精确度（53 bits）

![](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/IEEE_754_Double_Floating_Point_Format.svg/1236px-IEEE_754_Double_Floating_Point_Format.svg.png)


## 大数处理精度丢失问题复现

**情况一**

当你在 Chrome 的控制台或者 Node.js 运行环境里执行以下代码后会出现以下结果，What？为什么我定义的 200000436035958034 却被转义为了 200000436035958050，在了解上面的 JavaScript 浮点数存储原理之后，应该明白此时已经触发了 JavaScript 的最大安全整数范围。

```js
const num = 200000436035958034;
console.log(num); // 200000436035958050
```

**情况二**

```js
const http = require('http');

http.createServer((req, res) => {
    if (req.method === 'POST') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            console.log('未 JSON 反序列化情况：', data);
            console.log('经过 JSON 反序列化之后：', JSON.parse(data));
        });
    }
    
    res.end('OK');
}).listen(3000)
```

```js
JSON.parse('{"num": 200000436035958034}') // {num: 200000436035958050}
```

## 大数运算的解决方案

### 1. 转字符串

在前端后端交互中这是通常的一种方案，例如，对订单号的存储采用数值类型 Java 中的 long 类型表示的最大值为 2 的 64 次方，而 JS 中为 Number.MAX_SAFE_INTEGER (Math.pow(2, 53) - 1)，显然超过 JS 中能表示的最大安全值之外就要丢失精度了，最好的解法就是将订单号**由数值型转为字符串**返回给前端处理，这是再和一个供应商对接过程中实实在在遇到的一个坑。

### 2. BigInt

[github.com/tc39/proposal-bigint](https://github.com/tc39/proposal-bigint)
[en.wikipedia.org/wiki/Double-precision_floating-point_format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
[JSON Bigint 大数精度丢失的背后](https://cloud.tencent.com/developer/article/1477816)