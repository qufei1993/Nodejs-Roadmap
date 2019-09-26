# Dcoker 容器环境下构建平滑的 Node.js 应用程序

构建平滑的 Node.js 应用程序，也就是在程序意外退出之后服务进程要接收到 SIGTERM 信号，待当前链接处理完成之后在退出，这样是比较优雅的，但是在 Docker 容器中实践时却发现容器停掉时却发生了一些异常现象，服务进程并没有接收到 SIGTERM 信号，然后随着容器的销毁服务进程也被强制 kill 了，显然当前正在处理的链接也就无法正常完成了。

## 一个简单的 Node.js 应用程序

先从一个简单的例子开始，以下 Node.js 示例，通过 http 监听 30010 端口，并提供了一个 /delay 接口，实现延迟 5 秒钟响应请求，这里我将进程 ID 打印出来是为了后续测试进程中断。

```js
// app.js
const http = require('http');
const PORT = 30010;
const server = http.createServer((req, res) => {
    if (req.url == '/delay') {
        setTimeout(function() {
            console.log('延迟 5 秒钟输出');
            res.end('Hello Docker 延迟 5 秒钟');
        }, 5000)
    }
})

server.listen(PORT, () => {
    console.log('Running on http://localhost:',PORT, ' PID: ', process.pid);
});
```

```js
// package.json
{ 
    "name": "hello-docker",
    "main": "app.js",   
    "scripts": { 
      "start": "node index.js"
    }
  }
```

**npm 启动程序**

```
npm start

> hello-docker@1.0.0 start /******/hello-docker
> node index.js

Running on http://localhost: 30010  PID:  68971
```

**查看 npm、node 进程信息**

应用程序启动之后先看下当前进程信息，这里通过搜索 npm、node 分别将相关进程信息给打印出来，如下所示，细心的你可能会发现 我们运行 node 程序的进程 ID(68971) 对应的 PPID(68970) 为 npm 的进程 ID，到这里也需你就知道了 npm start 的启动机制，认为 npm 会将 Node.js 服务做为自己的子进程启动，暂时是没有问题的，继续往下看。

```
$ ps -falx | head -1; ps -falx | grep 'npm\|node'
  UID   PID  PPID   C STIME   TTY           TIME CMD                     F PRI NI       SZ    RSS WCHAN     S             ADDR
  502 68970 68016   0  4:29下午 ttys003    0:00.35 npm                  4006  31  0  2727120  17304 -      S+                  0
  502 68971 68970   0  4:29下午 ttys003    0:00.12 node app.js          4006  31  0  2682628  14608 -      S+                  0
```

**做一个请求测试**

做一个测试，我开始请求接口，控制台执行 curl http://localhost:30010/delay 请求，同时我又新打开另一个控制台立即执行 kill -15 68970 这个时间是在 5 秒中之内，可以看到我的请求得到了一个错误的响应

***kill -15***：是发送一个 SIGTERM 信号，该信号可由应用程序捕获, 故使用 SIGTERM 也让程序有机会在退出之前做好清理工作, 从而优雅地终止。

```bash
# 请求接口
$ curl http://localhost:30010/delay

# kill 杀掉进程
$ kill -15 68970

# 响应报错
curl: (52) Empty reply from server

# 上面启动的程序也会报如下错误 terminated  npm start
> hello-docker@1.0.0 start /******/hello-docker
> node index.js

Running on http://localhost: 30010  PID:  68971
zsh: terminated  npm start
```

这个结果显然不是我们需要的，接下来我们要在增加一些处理，实现优雅退出

## 实现 Node.js 程序优雅退出

优雅退出（Gracefully Shutdown），就是当应用（进程）要被关闭时，首先会被发送一个软终止信号。应用在收到这个信号后，执行清理工作，然后自行退出。如果在指定的时间内没有自行退出，则会被强制关闭——这自然就不优雅了。这个软终止信号一般就是指 SIGTERM。NodeJS 进程默认会对 SIGTERM 信号进行响应，执行进程退出。但是默认的监听程序并不会执行清理工作。我们需要显式监听该信号，并在清理完毕后执行 process.exit(0) 以退出进程。

**改造 app.js**

```js
const http = require('http');
const PORT = 30010;
const server = http.createServer((req, res) => {
    if (req.url == '/delay') {
        setTimeout(function() {
            console.log('延迟 5 秒钟输出');
            res.end('Hello Docker 延迟 5 秒钟');
        }, 5000)
    }
})

/** 改造部分 关于进程结束相关信号可自行搜索查看*/
process.on('SIGTERM', close.bind(this, 'SIGTERM'));
process.on('SIGINT', close.bind(this, 'SIGINT'));

function close(signal) {
    console.log(`收到 ${signal} 信号开始处理`);

    server.close(() => {
        console.log(`服务停止 ${signal} 处理完毕`);
        process.exit(0);
    });
}
/** 改造部分 */

server.listen(PORT, () => {
    console.log('Running on http://localhost:',PORT, ' PID: ', process.pid);
});
```

**再次 npm 开启我们的服务进行测试**

```bash
$ npm start
$ ps -falx | head -1; ps -falx | grep 'npm\|node'
  UID   PID  PPID   C STIME   TTY           TIME CMD                     F PRI NI       SZ    RSS WCHAN     S             ADDR
  502 70990 68016   0  6:51下午 ttys003    0:00.48 npm                  4006  31  0  2727604  38136 -      S+                  0
  502 70991 70990   0  6:51下午 ttys003    0:00.13 node app.js          4006  31  0  2682628  23196 -      S+                  0
$ 
```

**请求测试**

```bash
$ curl http://localhost:30010/delay
$ kill -15 70990 # 中断进程
```

此时服务并不会马上退出，会显示如下日志信息，等待链接处理完毕之后进程退出

```
Running on http://localhost: 30010  PID:  70991
收到 SIGTERM 信号开始处理
延迟 5 秒钟输出
服务停止 SIGTERM 处理完毕
```

## Docker 环境下测试

这里假设你已经了解了 Docker 的基本操作和在 Node.js 中的应用，不清楚的你需要先看下这两篇介绍 [Docker 入门实践]() 与 [Node.js 服务 Docker 容器化应用实践]()

**启动容器**

```
$ docker run -d -p 30010:30010 hello-docker
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                      NAMES
c73389c8340f        hello-docker        "npm start"         6 minutes ago       Up 6 minutes        0.0.0.0:30010->30010/tcp   crazy_archimedes
```

**查看日志**

```
$ docker logs -f c73389c8340f

> hello-docker@1.0.0 start /usr/src/nodejs
> node app.js

Running on http://localhost: 30010  PID:  16
```

**请求测试**

```bash
$ curl http://localhost:30010/delay
$ docker stop c73389c8340f
```

在我请求 http://localhost:30010/delay 之后立即执行停止容器操作，并没有按照我的预期正常退出，而是报出了 curl: (52) Empty reply from server 错误，显然我的 Node.js 应用没有接收到退出信息，随着容器的销魂被强制退出了，什么原因呢？接下来我会分析下产生这个情况的原因

```
$ curl http://localhost:30010/delay
curl: (52) Empty reply from server
```

## Dcoker 容器下应用无法接收退出信号原因分析

这里我从容器内进程的声明周期、NPM 启动机制、信号的传递机制进行分析

#### 容器内进程的生命周期

上面举的 Node.js 例子在非容器环境下是可以实现优雅退出的，但是在 docker 容器环境却不行，那我们先来了解下容器内进程的生命周期是怎么样的。

在 Docker 中多个容器（Container）间的进程是相互隔离的，例如，Container1 我有个 init 进程 PID=1，Container2 中同样也是，因此，容器与其它容器及其主机是隔离的，且拥有自己的独立进程空间、网络配置。

Docker 容器启动的时候，会通过 ENTRYPOINT 或 CMD 指令去创建一个初始化进程 PID=1，这个 PID=1 的进程会根据自己的指令创建自己的子进程，在这个容器内部，进程之间会形成一个层级关系，即进程树的概念，当容器退出时也会通过信号量来通知 PID=1 的进程，然后这个这个会通知自己的子进程等等，这个涉及 Unix 进程相关知识，父进程会等待所有子进程结束，并获取到最终的状态。最终当这个 PID=1 的进程退出之后，Docker 容器也将销毁并发送 SIGKILL 信号量通知容器内其它还存在的进程，此时就是强制退出了。

这样看来似乎并没有发现什么问题，难道 npm 启动 Node 程序有问题？

#### 容器内 NPM 的启动机制

这里我要分析下在容器环境和非容器环境下 NPM 的启动有什么不同，另外我们在启动 Node.js 应用程序的时候通常也会将启动命令写在 package.json 的 scripts 里面，通过 npm run ... 进行启动

**非容器环境下的 npm 启动 Node.js**

非容器环境下，通过 npm 进程直接启动了 node 进程，以下示例也能看到 node 的父进程（PPID=70990）

```bash
$ npm start
$ ps -falx | head -1; ps -falx | grep 'npm\|node'
  UID   PID  PPID   C STIME   TTY           TIME CMD                     F PRI NI       SZ    RSS WCHAN     S             ADDR
  502 70990 68016   0  6:51下午 ttys003    0:00.48 npm                  4006  31  0  2727604  38136 -      S+                  0
  502 70991 70990   0  6:51下午 ttys003    0:00.13 node app.js          4006  31  0  2682628  23196 -      S+                  0
$ 
```

**容器环境下的 npm 启动 Node.js**

Docker 容器环境通过 Dockerfile 文件指定 CMD ["npm", "start"] 指令启动 Node.js，以下打印出了进程列表信息，另外我通过 pstree -p 打印出了进程之间的层级关系，这下很清晰了再容器环境下，npm 做为 INIT 进程启动之后，并没有直接去启动 node 进程，而是先启动了 sh 进程，然后 sh 进程启动了 node 进程，这和上面的在非容器环境下还是有区分的。

执行 docker stop 命令之后，首先 npm 会收到 SIGTERM 信号量，然后转发给 sh，此时我们理解的可能是 sh 在转发给 node 如果真的是这样也就没问题了，问题就出在当 SIGTERM 到达 sh 之后，就断片了，sh 自己退出了，node 进程就只好等待容器销魂被强制退出。

```
$ ps flex
PID   USER     TIME   COMMAND
    1 root       0:00 npm
   15 root       0:00 sh -c node app.js
   16 root       0:00 node app.js

$ pstree -p
npm(1)---sh(15)---node(16)
```

#### 罪魁祸首 sh 进程



## Refenrce

* [https://zhuanlan.zhihu.com/p/54151728](https://zhuanlan.zhihu.com/p/54151728)
* [https://juejin.im/entry/5b28d9aa51882574a36fa93f](https://juejin.im/entry/5b28d9aa51882574a36fa93f)
* [https://docs.docker.com/engine/reference/commandline/stop/#options](https://docs.docker.com/engine/reference/commandline/stop/#options)
* [https://docs.docker.com/engine/reference/builder/#cmd](https://docs.docker.com/engine/reference/builder/#cmd)