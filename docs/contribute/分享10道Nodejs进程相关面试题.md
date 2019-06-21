# 分享 10 道 Nodejs 进程相关面试题

通过对以下 10 个面试题的分享，助您更好的理解 Node.js 的进程和线程相关知识

> 作者简介：五月君，Nodejs Developer，热爱技术、喜欢分享的 90 后青年，公众号 “Nodejs技术栈”，Github 开源项目 [https://www.nodejs.red](https://www.nodejs.red)

## 快速导航

- 什么是进程和线程？之间的区别？参考：[Interview1](#heading-1)
- 什么是孤儿进程？参考：[Interview2](#heading-2)
- 创建多进程时，代码里有 ```app.listen(port)``` 在进行 fork 时，为什么没有报端口被占用？参考：[Interview3](#heading-3)
- 什么是 IPC 通信，如何建立 IPC 通信？什么场景下需要用到 IPC 通信？参考：[Interview4](#heading-4)
- Node.js 是单线程还是多线程？进一步会提问为什么是单线程？参考：[Interview5](#heading-5)
- 关于守护进程，是什么、为什么、怎么编写？参考：[Interview6](#heading-6)
- 实现一个简单的命令行交互程序？参考：[Interview7](#heading-7)
- 如何让一个 js 文件在 Linux 下成为一个可执行命令程序？参考：[Interview8](#heading-8)
- 进程的当前工作目录是什么? 有什么作用？参考：[Interview9](#heading-9)
- 多进程或多个 Web 服务之间的状态共享问题？参考：[Interview10](#heading-10)

> 作者简介：五月君，Nodejs Developer，热爱技术、喜欢分享的 90 后青年，公众号 “Nodejs技术栈”，Github 开源项目 [https://www.nodejs.red](https://www.nodejs.red)

## Interview1

> 什么是进程和线程？之间的区别？

关于线程和进程是服务端一个很基础的概念，在文章 [Node.js进阶之进程与线程](https://www.imooc.com/article/288006) 中介绍了进程与线程的概念之后又给出了在 Node.js 中的进程和线程的实际应用，对于这块不是很理解的建议先看下。

## Interview2

> 什么是孤儿进程？

父进程创建子进程之后，父进程退出了，但是父进程对应的一个或多个子进程还在运行，这些子进程会被系统的 init 进程收养，对应的进程 ppid 为 1，这就是孤儿进程。通过以下代码示例说明。

```js
// master.js
const fork = require('child_process').fork;
const server = require('net').createServer();
server.listen(3000);
const worker = fork('worker.js');

worker.send('server', server);
console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
process.exit(0); // 创建子进程之后，主进程退出，此时创建的 worker 进程会成为孤儿进程
```

```js
// worker.js
const http = require('http');
const server = http.createServer((req, res) => {
	res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid); // 记录当前工作进程 pid 及父进程 ppid
});

let worker;
process.on('message', function (message, sendHandle) {
	if (message === 'server') {
		worker = sendHandle;
		worker.on('connection', function(socket) {
			server.emit('connection', socket);
		});
	}
});
```

[孤儿进程 示例源码](https://github.com/Q-Angelo/project-training/tree/master/nodejs/orphan-process)

控制台进行测试，输出当前工作进程 pid 和 父进程 ppid

```bash
$ node master
worker process created, pid: 32971 ppid: 32970
```

由于在 master.js 里退出了父进程，活动监视器所显示的也就只有工作进程。

![图片描述](https://user-gold-cdn.xitu.io/2019/6/18/16b67c533ab34589?w=1616&h=284&f=png&s=69703)

再次验证，打开控制台调用接口，可以看到工作进程 32971 对应的 ppid 为 1（为 init 进程），此时已经成为了孤儿进程

```bash
$ curl http://127.0.0.1:3000
I am worker, pid: 32971, ppid: 1
```

## Interview3

> 创建多进程时，代码里有 ```app.listen(port)``` 在进行 fork 时，为什么没有报端口被占用？

先看下端口被占用的情况

```js
// master.js
const fork = require('child_process').fork;
const cpus = require('os').cpus();

for (let i=0; i<cpus.length; i++) {
    const worker = fork('worker.js');
    console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
}
```

```js
//worker.js
const http = require('http');
http.createServer((req, res) => {
	res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid);
}).listen(3000);
```

[多进程端口占用冲突 示例源码](https://github.com/Q-Angelo/project-training/tree/master/nodejs/port-conflict)

以上代码示例，控制台执行 ```node master.js``` 只有一个 worker 可以监听到 3000 端口，其余将会抛出 ``` Error: listen EADDRINUSE :::3000 ``` 错误

那么多进程模式下怎么实现多端口监听呢？答案还是有的，通过句柄传递 Node.js v0.5.9 版本之后支持进程间可发送句柄功能，怎么发送？如下所示：

```js
/**
 * http://nodejs.cn/api/child_process.html#child_process_subprocess_send_message_sendhandle_options_callback
 * message
 * sendHandle
 */
subprocess.send(message, sendHandle)
```

当父子进程之间建立 IPC 通道之后，通过子进程对象的 send 方法发送消息，第二个参数 sendHandle 就是句柄，可以是 TCP套接字、TCP服务器、UDP套接字等，为了解决上面多进程端口占用问题，我们将主进程的 socket 传递到子进程，修改代码，如下所示：

```js
//master.js
const fork = require('child_process').fork;
const cpus = require('os').cpus();
const server = require('net').createServer();
server.listen(3000);
process.title = 'node-master'

for (let i=0; i<cpus.length; i++) {
    const worker = fork('worker.js');
    worker.send('server', server);
    console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
}
```

```js
// worker.js
const http = require('http');
http.createServer((req, res) => {
	res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid);
})

let worker;
process.title = 'node-worker'
process.on('message', function (message, sendHandle) {
	if (message === 'server') {
		worker = sendHandle;
		worker.on('connection', function(socket) {
			server.emit('connection', socket);
		});
	}
});
```

[句柄传递解决多进程端口占用冲突问题 示例源码](https://github.com/Q-Angelo/project-training/tree/master/nodejs/handle-pass)

验证一番，控制台执行 ```node master.js``` 以下结果是我们预期的，多进程端口占用问题已经被解决了。

```bash
$ node master.js
worker process created, pid: 34512 ppid: 34511
worker process created, pid: 34513 ppid: 34511
worker process created, pid: 34514 ppid: 34511
worker process created, pid: 34515 ppid: 34511
```

关于多进程端口占用问题，cnode 上有篇文章也可以看下 [通过源码解析 Node.js 中 cluster 模块的主要功能实现](https://cnodejs.org/topic/56e84480833b7c8a0492e20c)

## Interview4

> 什么是 IPC 通信，如何建立 IPC 通信？什么场景下需要用到 IPC 通信？

IPC (Inter-process communication) ，即进程间通信技术，由于每个进程创建之后都有自己的独立地址空间，实现 IPC 的目的就是为了进程之间资源共享访问，实现 IPC 的方式有多种：管道、消息队列、信号量、Domain Socket，Node.js 通过 pipe 来实现。

**看一下 Demo，未使用 IPC 的情况**

```js
// pipe.js
const spawn = require('child_process').spawn;
const child = spawn('node', ['worker.js'])
console.log(process.pid, child.pid); // 主进程id3243 子进程3244
```

```js
// worker.js
console.log('I am worker, PID: ', process.pid);
```

控制台执行 ```node pipe.js```，输出主进程id、子进程id，但是子进程 ```worker.js``` 的信息并没有在控制台打印，原因是新创建的子进程有自己的stdio 流。

```bash
$ node pipe.js
41948 41949
```

**创建一个父进程和子进程之间传递消息的 IPC 通道实现输出信息**

修改 pipe.js 让子进程的 stdio 和当前进程的 stdio 之间建立管道链接，还可以通过 spawn() 方法的 stdio 选项建立 IPC 机制，参考   [options.stdio](http://nodejs.cn/api/child_process.html#child_process_options_stdio)

```js
// pipe.js
const spawn = require('child_process').spawn;
const child = spawn('node', ['worker.js'])
child.stdout.pipe(process.stdout);
console.log(process.pid, child.pid);
```

[父子进程 IPC 通信 源码示例](https://github.com/Q-Angelo/project-training/tree/master/nodejs/master-worker-ipc)

再次验证，控制台执行 ```node pipe.js```，worker.js 的信息也打印了出来

```bash
$ 42473 42474
I am worker, PID:  42474
```

**关于父进程与子进程是如何通信的？**

参考了深入浅出 Node.js 一书，父进程在创建子进程之前会先去创建 IPC 通道并一直监听该通道，之后开始创建子进程并通过环境变量（NODE_CHANNEL_FD）的方式将 IPC 频道的文件描述符传递给子进程，子进程启动时根据传递的文件描述符去链接 IPC 通道，从而建立父子进程之间的通信机制。


![图片描述](https://user-gold-cdn.xitu.io/2019/6/18/16b67c533ae1f101?w=443&h=279&f=jpeg&s=12702)


<p style="text-align:center; padding: 10px;">父子进程 IPC 通信交互图</p>

## Interview5

> Node.js 是单线程还是多线程？进一步会提问为什么是单线程？

第一个问题，Node.js 是单线程还是多线程？这个问题是个基本的问题，在以往面试中偶尔提到还是有不知道的，Javascript 是单线程的，但是做为其在服务端运行环境的 Node.js 并非是单线程的。

第二个问题，Javascript 为什么是单线程？这个问题需要从浏览器说起，在浏览器环境中对于 DOM 的操作，试想如果多个线程来对同一个 DOM 操作是不是就乱了呢，那也就意味着对于DOM的操作只能是单线程，避免 DOM 渲染冲突。在浏览器环境中 UI 渲染线程和 JS 执行引擎是互斥的，一方在执行时都会导致另一方被挂起，这是由 JS 引擎所决定的。

## Interview6


> 关于守护进程，是什么、为什么、怎么编写？

守护进程运行在后台不受终端的影响，什么意思呢？Node.js 开发的同学们可能熟悉，当我们打开终端执行 ```node app.js``` 开启一个服务进程之后，这个终端就会一直被占用，如果关掉终端，服务就会断掉，即前台运行模式。如果采用守护进程进程方式，这个终端我执行 ```node app.js``` 开启一个服务进程之后，我还可以在这个终端上做些别的事情，且不会相互影响。

**创建步骤**
1. 创建子进程
2. 在子进程中创建新会话（调用系统函数 setsid）
3. 改变子进程工作目录（如：“/” 或 “/usr/ 等）
4. 父进程终止

**Node.js 编写守护进程 Demo 展示**

index.js 文件里的处理逻辑使用 spawn 创建子进程完成了上面的第一步操作。设置 options.detached 为 true 可以使子进程在父进程退出后继续运行（系统层会调用 setsid 方法），参考 [options_detached](http://nodejs.cn/api/child_process.html#child_process_options_detached)，这是第二步操作。options.cwd 指定当前子进程工作目录若不做设置默认继承当前工作目录，这是第三步操作。运行 daemon.unref() 退出父进程，参考 [options.stdio](http://nodejs.cn/api/child_process.html#child_process_options_stdio)，这是第四步操作。

```js
// index.js
const spawn = require('child_process').spawn;

function startDaemon() {
    const daemon = spawn('node', ['daemon.js'], {
        cwd: '/usr',
        detached : true,
        stdio: 'ignore',
    });

    console.log('守护进程开启 父进程 pid: %s, 守护进程 pid: %s', process.pid, daemon.pid);
    daemon.unref();
}

startDaemon()
```

daemon.js 文件里处理逻辑开启一个定时器每 10 秒执行一次，使得这个资源不会退出，同时写入日志到子进程当前工作目录下

```js
// /usr/daemon.js
const fs = require('fs');
const { Console } = require('console');

// custom simple logger
const logger = new Console(fs.createWriteStream('./stdout.log'), fs.createWriteStream('./stderr.log'));

setInterval(function() {
	logger.log('daemon pid: ', process.pid, ', ppid: ', process.ppid);
}, 1000 * 10);
```

[守护进程实现 Node.js 版本 源码地址](https://github.com/Q-Angelo/project-training/tree/master/nodejs/simple-daemon)

**运行测试**

```bash
$ node index.js
守护进程开启 父进程 pid: 47608, 守护进程 pid: 47609
```

打开活动监视器查看，目前只有一个进程 47609，这就是我们需要进行守护的进程

![图片描述](https://user-gold-cdn.xitu.io/2019/6/17/16b62b7424aa01e3?w=1594&h=1190&f=png&s=135518)

**守护进程阅读推荐**

- [守护进程实现 (Node.js版本)](https://cnodejs.org/topic/57adfadf476898b472247eac)
- [守护进程实现 (C语言版本)](https://github.com/ElemeFE/node-interview/blob/master/sections/zh-cn/process.md#%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)

**守护进程总结**

在实际工作中对于守护进程并不陌生，例如 PM2、Egg-Cluster 等，以上只是一个简单的 Demo 对守护进程做了一个说明，在实际工作中对守护进程的健壮性要求还是很高的，例如：进程的异常监听、工作进程管理调度、进程挂掉之后重启等等，这些还需要我们去不断思考。

## Interview7

采用子进程 child_process 的 spawn 方法，如下所示：

```js
const spawn = require('child_process').spawn;
const child = spawn('echo', ["简单的命令行交互"]);
child.stdout.pipe(process.stdout); // 将子进程的输出做为当前进程的输入，打印在控制台
```

```
$ node execfile
简单的命令行交互
```

## Interview8

> 如何让一个 js 文件在 Linux 下成为一个可执行命令程序?

1. 新建 hello.js 文件，头部须加上 ```#!/usr/bin/env node```，表示当前脚本使用 Node.js 进行解析
2. 赋予文件可执行权限 chmod +x chmod +x /${dir}/hello.js，目录自定义
3. 在 /usr/local/bin 目录下创建一个软链文件 ```sudo ln -s /${dir}/hello.js /usr/local/bin/hello```，文件名就是我们在终端使用的名字
4. 终端执行 hello 相当于输入 node hello.js

```js
#!/usr/bin/env node

console.log('hello world!');
```

终端测试

```bash
$ hello
hello world!
```

## Interview9

> 进程的当前工作目录是什么? 有什么作用?

进程的当前工作目录可以通过 process.cwd() 命令获取，默认为当前启动的目录，如果是创建子进程则继承于父进程的目录，可通过 process.chdir() 命令重置，例如通过 spawn 命令创建的子进程可以指定 cwd 选项设置子进程的工作目录。

有什么作用？例如，通过 fs 读取文件，如果设置为相对路径则相对于当前进程启动的目录进行查找，所以，启动目录设置有误的情况下将无法得到正确的结果。还有一种情况程序里引用第三方模块也是根据当前进程启动的目录来进行查找的。

```js
// 示例
process.chdir('/Users/may/Documents/test/') // 设置当前进程目录

console.log(process.cwd()); // 获取当前进程目录
```

## Interview10

> 多进程或多个 Web 服务之间的状态共享问题？

多进程模式下各个进程之间是相互独立的，例如用户登陆之后 session 的保存，如果保存在服务进程里，那么如果我有 4 个工作进程，每个进程都要保存一份这是没必要的，假设服务重启了数据也会丢失。多个 Web 服务也是一样的，还会出现我在 A 机器上创建了 Session，当负载均衡分发到 B 机器上之后还需要在创建一份。一般的做法是通过 Redis 或者 数据库来做数据共享。

首发于慕课网，https://www.imooc.com/article/288056