# 线程和进程

**线程**是操作系统能够进行运算调度的最小单位，被包含于**进程**之中。一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。

## 多线程

多线程面临锁、状态同步问题，首先我们要清楚线程是隶属于进程的，同一块代码，可以根据系统CPU核心数启动多个进程，每个进程都有属于自己的独立空间，进程之间是不相互影响的。但是同一进程中的多条线程将共享该进程中的全部系统资源，如虚拟地址空间，文件描述符和信号处理等等。但同一进程中的多个线程有各自的调用栈（call stack），自己的寄存器环境（register context），自己的线程本地存储（thread-local storage)

多线程对同一变量的操作

```java
public class TestApplication {
    Integer count = 0;

    @GetMapping("/test")
    public Integer Test() {
        count += 1;
        return count;
    }

    public static void main(String[] args) {
        SpringApplication.run(TestApplication.class, args);
    }
}
```

运行结果，每次执行都会修改count值，所以，多线程中任何一个变量都可以被任何一个线程所修改。

```shell
1 # 第一次执行
2 # 第二次执行
3 # 第三次执行
```

另外多线程的代价还在于创建新的线程和执行期上下文线程的切换开销。


## Nodejs的线程与进程

Node.js 是 Javascript 在服务端的运行环境，构建在 chrome 的 V8 引擎之上，基于事件驱动、非阻塞I/O模型，充分利用操作系统提供的异步 I/O 进行多任务的执行，适合于 I/O 密集型的应用场景，因为异步，程序无需阻塞等待结果返回，而是基于回调通知的机制，原本同步模式等待的时间，则可以用来处理其它任务，在 Web 服务器方面，著名的 Nginx 也是采用此模式，Nginx采用 C 语言进行编写，主要用来做高性能的 Web 服务器，不适合做业务。Web业务开发中，如果你有高并发应用场景那么 Node.js 会是你不错的选择。

在单核 CPU 系统之上我们采用 ```单进程 + 单线程``` 的模式来开发。在多核 CPU 系统之上，可以用过 child_process.fork 开启多个进程 ，即 ```多进程 + 单线程``` 模式。注意：开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能。

- **注**
    * Javascript 是单线程，但是做为宿主环境的 Node.js 并非是单线程的。
    * 由于单线程原故，一些复杂的、消耗 CPU 资源的任务建议不要交给 Node.js 来处理，当你的业务需要一些大量计算、视频编码解码等 CPU 密集型的任务，可以采用 C 语言。


## Nodejs子进程创建

Node.js 提供了 child_process 内置模块，用于创建子进程，更多详细信息可参考 [Node.js 中文网 child_process](http://nodejs.cn/api/child_process.html#child_process_child_process)

#### 四种方式

* ```child_process.spawn()```：适用于返回大量数据，例如图像处理，二进制数据处理。
* ```child_process.exec()```：适用于小量数据，maxBuffer 默认值为 200 * 1024 超出这个默认值将会导致程序崩溃 数据量过大可以采用 spawn。
* ```child_process.execFile()```：类似 child_process.exec()，区别是不能通过shell来执行，不支持像 I/O 重定向和文件查找这样的行为
* ```child_process.fork()```： 衍生新的进程，进程之前是相互独立的，每个进程都有自己的 V8 实例、内存，通长根据系统 CPU 核心数设置，不建议衍生太多的子进程出来

## Example

#### 一个计算耗时造成阻塞的例子

先看一段例子，运行下面程序，浏览器执行 http://127.0.0.1:3000/compute 大约每次需要 15657.310ms，也就意味下次用户请求需要等待15657.310ms，文末将会采用child_process实现多个进程来处理。

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

[进程与线程的一个简单解释](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)

