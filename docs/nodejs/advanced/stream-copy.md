# 结合异步迭代器实现 Node.js 流式数据复制
![默认文件1627910902075.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1627910935410-3d77976b-d864-4db1-a9f3-599ef8bd65dc.png#clientId=u0401d18d-e8ab-4&from=ui&id=u045d8d8f&margin=%5Bobject%20Object%5D&name=%E9%BB%98%E8%AE%A4%E6%96%87%E4%BB%B61627910902075.png&originHeight=383&originWidth=900&originalType=binary&ratio=1&size=89574&status=done&style=none&taskId=u486fb5f5-6c80-48ac-bf33-b8b37f01389)

实现可读流到可写流数据复制，就是不断的读取->写入这个过程，那么你首先想到的是不是下面这样呢？代码看似很简单，结果却是很糟糕的，没有任何的数据积压处理。**如果读取的文件很大了，造成的后果就是缓冲区数据溢出，程序会占用过多的系统内存，拖垮服务器上的其它应用**，如果不明白的回顾下这篇文章 [Node.js Stream 背压 — 消费端数据积压来不及处理会怎么样？](https://mp.weixin.qq.com/s/KlHH2vimOaohTYrPX3ThfQ)。

```javascript
// 糟糕的示例，没有数据积压处理
readable.on('data', data => {
  writable.write(data)
});
```

类似以上的需求，**推荐你用 pipe() 方法以流的形式完成数据的复制**。

作为学习，结合异步迭代器以一种简单的方式实现一个类似于 pipe 一样的方法完成数据源到目标源的数据复制。

## 数据写入方法实现

_write 方法目的是控制可写流的数据写入，它返回一个 Promise 对象，如果可写流的 dest.write() 方法返回 true，表示内部缓冲区未满，继续写入。

当 dest.write() 方法返回 false 表示向流中写入数据超过了它所能处理的最大能力限制，此时暂停向流中写入数据，直到 `drain` 事件触发，表示缓冲区中的数据已排空了可以继续写入，再将 Promise 对象变为解决。

```javascript
function _write(dest, chunk) {
  return new Promise(resolve => {
    if (dest.write(chunk)) {
      return resolve(null);
    }

    dest.once('drain', resolve);
  })  
}
```

## 结合异步迭代器实现

异步迭代器使从可读流对象读取数据变得更简单，异步的读取数据并调用我们封装的 _write(chunk) 方法写入数据，如果缓冲区空间已满，这里 `await _write(dest, chunk)` 也会等待，当缓冲区有空间可以继续写入了，再次进行读取 -> 写入。

```javascript
function myCopy(src, dest) {
  return new Promise(async (resolve, reject) => {
    dest.on('error', reject);

    try {
      for await (const chunk of src) {
        await _write(dest, chunk);
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
```

使用如下所示：

```javascript
const readable = fs.createReadStream('text.txt');
const writable = fs.createWriteStream('dest-text.txt');
await myCopy(readable, writable);
```