# 子进程child_process

> Node是一个单线程多进程的语言，主要是通过I／O操作来进行异步任务处理，I／O越密集Node的优势越能体现，但是CPU密集的任务就会对程序造成阻塞，影响后续程序执行在Node中我们可以采用child_process模块充分利用CPU资源，完成一些耗时耗资源的操作。



先看一段例子,运行下面程序，浏览器执行 http://127.0.0.1:3000/compute 大约每次需要15657.310ms，也就意味下次用户请求需要等待15657.310ms，文末将会采用child_process实现多个进程来处理。

```js
// compute.js

const http = require('http');
const [url, port] = ['127.0.0.1', 3000];

const computation = () => {
    let sum = 0;

    console.info('计算开始');
    console.time('计算耗时');

    for (let i = 0; i < 1e10; i++) {
        sum += i
    };

    console.info('计算结束');
    console.timeEnd('计算耗时');

    return sum;
};

const server = http.createServer((req, res) => {
    if(req.url == '/compute'){
        const sum = computation();

        res.end(`Sum is ${sum}`);
    }

    res.end(`ok`);
});

server.listen(port, url, () => {
    console.log(`server started at http://${url}:${port}`);
});
```

## 创建进程

#### 四种方式(异步方式)

* child_process.spawn()

* child_process.fork()

* child_process.exec()

* child_process.execFile()

#### spawn

