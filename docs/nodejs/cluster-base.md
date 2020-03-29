# 解答 Nodejs Cluster 使用中的几点疑问

之前使用 PM2 管理进程还是挺多的，它是怎么实现的呢？在 PM2 的配置文件中可以设置 exec_model:'cluster' 和 instances 两个属性来设置开启多个进程，PM2 其实主要也是利用 Nodejs Cluster 这个模块来实现了，还有 Egg.js 中的 egg-cluster 模块在启动 Worker 进程时也是使用的 Nodejs Cluster 模块。下面来了解下 Nodejs Cluster 这个模块做了什么？

下面参考了 Nodejs 官网提供的一个 Cluster 代码示例，命名为 app.js 下文会用到这个 Demo。

```javascript
// app.js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	console.log(`Master 进程 ${process.pid} 正在运行`);
	
  for (let i = 0; i < numCPUs; i++) { // 衍生工作进程。
    cluster.fork();
	}
	
  cluster.on('exit', (worker, code, signal) => { console.log(`Worker ${worker.process.pid} 已退出`) });
} else {
  http.createServer((req, res) => res.end(`你好世界 ${process.pid}`)).listen(8000);
  console.log(`Worker 进程 ${process.pid} 已启动`);
}
```

上面看似简简单单几行代码，就创建了一个多进程架构且支持负载均衡技术，产生下面几个疑问。
<a name="jTjsC"></a>
## 关于 Node Cluster 的几个疑问

- Nodejs 的 Cluster 模块采用了哪种集群模式？
- 多个进程为什么可以监听同一个端口？
- 多个进程之间如何通信？
- 如何对多个 Worker 进行请求分发？（负载均衡策略）

带着这些问题，下面一一进行解答。
<a name="5CGBc"></a>
## Nodejs 的 Cluster 模块采用了哪种集群模式？
集群模式实现通常有两种方案：<br />

- 方案一：1 个 Node 实例开启多个端口，通过反向代理服务器向各端口服务进行转发
- 方案二：1 个 Node 实例开启多个进程监听同一个端口，通过负载均衡技术分配请求（Master->Worker）

首先第一种方案存在的一个问题是占用多个端口，造成资源浪费，由于多个实例是独立运行的，进程间通信不太好做，好处是稳定性高，各实例之间无影响。

第二个方案多个 Node 进程去监听同一个端口，好处是进程间通信相对简单、减少了端口的资源浪费，但是这个时候就要保证服务进程的稳定性了，特别是对 Master 进程稳定性要求会更高，编码也会复杂。

在 Nodejs 中自带的 Cluster 模块正是采用的第二种方案。
<a name="fCOZ7"></a>
## 多个进程为什么可以监听同一个端口？


先运行下上面命名为 app.js 的 Demo，成功的开启了 1 个 Master 进程、4 个 Worker 进程。

```javascript
node app.js
Master 进程 45016 正在运行
Worker 进程 45018 已启动
Worker 进程 45019 已启动
Worker 进程 45017 已启动
Worker 进程 45020 已启动
```

因为端口只有一个 8000，所以我们要来看下它是由哪些进程所监听的。

```javascript
lsof -i -P -n | grep 8000
node      45016 qufei   40u  IPv6 0x7a7b5a0f7e0fbb4f      0t0  TCP *:8000 (LISTEN)
```

理论上说如果多个进程监听同一个端口是会报端口冲突的，现在我们知道了，8000 端口它并**不是被所有的进程全部的监听，仅受到 Master 进程的监听**，下面让我们在看一个信息。

```javascript
ps -ef | grep 45016

502 45016 44110   0  9:49上午 ttys001    0:00.10 node test
502 45017 45016   0  9:49上午 ttys001    0:00.11 /Users/.nvm/versions/node/v12.13.0/bin/node /Users/study/test/test
502 45018 45016   0  9:49上午 ttys001    0:00.11 /Users/.nvm/versions/node/v12.13.0/bin/node /Users/study/test/test
502 45019 45016   0  9:49上午 ttys001    0:00.11 /Users/.nvm/versions/node/v12.13.0/bin/node /Users/study/test/test
502 45020 45016   0  9:49上午 ttys001    0:00.11 /Users/.nvm/versions/node/v12.13.0/bin/node /Users/study/test/test
```

这个清楚展示了 Worker 与 Master 的关系，Master 通过 cluster.fork() 这个方法创建的，本质上还是使用的 child_process.fork() 这个方法，怎么实现进程间端口共享呢？

总结起来一句话：“**Master 进程创建一个 Socket 并绑定监听到该目标端口，通过与子进程之间建立 IPC 通道之后，通过调用子进程的 send 方法，将 Socket（链接句柄）传递过去**”。

下面展示一个使用 child_process.fork() 创建的子进程，进行 Socket 传递的示例：

```javascript
// master.js
const fork = require('child_process').fork;
const cpus = require('os').cpus();
const server = require('net').createServer().listen(3000);

for (let i=0; i<cpus.length; i++) {
    const worker = fork('worker.js');
  	// 将 Master 的 server 传递给子进程
    worker.send('server', server);
    console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
}

// worker.js 
const http = require('http');
const server = http.createServer((req, res) => {
    res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid);
});

let worker;
// 第二个参数 sendHandle 就是句柄，可以是 TCP套接字、TCP服务器、UDP套接字等
process.on('message', function (message, sendHandle) {
    if (message === 'server') {
        worker = sendHandle;
        worker.on('connection', function(socket) {
            server.emit('connection', socket);
        });
    }
});
```

**总结下：** 端口只会被主进程绑定监听一次，但是主进程和子进程在建立 IPC 通信之后，发送 Socket 到子进程实现端口共享，在之后 Master 接收到新的客户端链接之后，通过负载均衡技术再转发到各 Worker 进程，这个下文会讲。
<a name="iGAYr"></a>
## 多个进程之间如何通信？

还是上面提到的，cluster.fork() 本质上还是使用的 child_process.fork() 这个方法来创建的子进程，进程间通信无非几种：pipe（管道）、消息队列、信号量、Domain Socket。<br />在 Nodejs 中是通过 pipe（管道）实现的，pipe 作用于之间有血缘关系的进程，通过 fork 传递，其本身也是一个进程，将一个进程的输出做为另外一个进程的输入，常见的 Linux 所提供的管道符 “|” 就是将两个命令隔开,管道符左边命令的输出就会作为管道符右边命令的输入。

推荐看下 [10 个 Nodejs 进程相关的问题解答](https://mp.weixin.qq.com/s/dKN95zcRI7qkwGYKhPXrcg) 也是笔者之前写的文章，有提到进程的通信、还有上面讲解的多个进程监听同一个端口问题，还提供了些例子，可以看看。
<a name="Cb2kP"></a>
## 如何对多个 Worker 进行请求分发


Nodejs 是如何对多个 Worker 进程进行请求分发呢？在 Nodejs 中使用了 RoundRobin 负载均衡策略，简称 RR，它的实现原理是一种无状态的轮询策略，假定每台服务器的硬件资源、处理性能都是相同的，根据进程数量，依次分配，直到所有进程都处理完了，在开始重新计算分配，优点是实现起来简洁也易用。缺点是，如果出现某个请求占用的时间较长，就会导致负载不会太均衡。

RR 这种负载均衡技术适合于在同一组服务器中各服务器拥有相同的软硬件配置且平均的服务请求响应。

RR 是一种常见的复杂均衡技术，在 Nginx 中也有使用，另外在 RR 的基础之上还衍生了一个 Weighted Round-Robin 权重负载均衡轮询算法，简称 SSR，同样也是使用轮询的技术，但是它在这基础上考虑了服务器的处理能力，实现时为服务器加上权重，这种均衡算法能确保高性能的服务器得到更多的使用率，避免低性能的服务器负载过重。

在 Nodejs 中我们是在同一台机器上开启的多进程模式，其实也不存在服务器的配置存在较大的差异，RR 这种已经可以满足我们的需求了，在除了 windows 系统以外的所有系统中 RR 是默认的轮询策略，在 Nodejs 中另外还有一个是 Shared Socket 的轮询策略，它由操作系统的内核来调度由哪个进程处理请求。

<a name="w4AQ6"></a>
### Nodejs 负载均衡策略设置
下面介绍下怎么在 Nodejs 中分别设置这两种策略，两种策略的名称再次做个介绍，因为叫法太多以免弄混了。

- RoundRobin，简称 RR，下文中设置时要用 cluster.SCHED_RR，如果通过环境变量设置要用 rr，如果用 cluster 对象获取 schedulingPolicy 数字表示为 2。
- Shared Socket：简称 SS，下文中设置时要用 cluster.SCHED_NONE，如果通过环境变量设置要用 none，如果用 cluster 对象获取 schedulingPolicy 数字表示为 1。



cluster 对象的 schedulingPolicy 属性设置

```javascript
const cluster = require('cluster');

// 策略一：一种轮询的策略，默认值
cluster.schedulingPolicy = cluster.SCHED_RR;

// 策略二：由操作系统调度的策略
cluster.schedulingPolicy = cluster.SCHED_NONE;

cluster.fork();
```

或者通过环境变量 NODE_CLUSTER_SCHED_POLICY 设置：

```javascript
env NODE_CLUSTER_SCHED_POLICY="none" node app.js // 有效值包括 rr、node
```
<a name="YEGX6"></a>
## Eggjs Cluster 模块的实现
项目中还有使用 Egg 框架，用的进程管理模块为 egg-cluster，以下为 Egg 进程启动的时序。

```javascript
+---------+           +---------+          +---------+
|  Master |           |  Agent  |          |  Worker |
+---------+           +----+----+          +----+----+
     |      fork agent     |                    |
     +-------------------->|                    |
     |      agent ready    |                    |
     |<--------------------+                    |
     |                     |     fork worker    |
     +----------------------------------------->|
     |     worker ready    |                    |
     |<-----------------------------------------+
     |      Egg ready      |                    |
     +-------------------->|                    |
     |      Egg ready      |                    |
     +----------------------------------------->|
```

Egg 在启动 Agent 进程时使用的是 child_process.fork() 做为 Master 进程秘书这样一个角色存在，不对外提供 HTTP 服务，当 Agent 进程创建成功与 Master 进程建立 IPC 通道之后，Master 进程利用 Nodejs Cluster 模块默认情况下根据 CPU 核心数来启动 Worker 进程，Worker 进程启动成功之后通过 IPC 通道通知 Master 进程，当这两类进程启动就绪之后，Master 进程通知 Agent、Worker 进程开始提供服务。

由上面知道，Egg 中进程的创建分为两类，一类是 child_process.fork() 创建的，另一类是 Nodejs Cluster 模块的 fork 方法创建，有两个疑问：

- Master 进程意外退出，Agent 进程会退出吗？
- Master 进程意外退出，Worker 进程会退出吗？

****Master 进程意外退出，Worker 进程会退出吗？**<br />Master 进程退出之后，Worker 进程会自动退出，因为 Cluster 模块自己内部有处理。

**Master 进程意外退出，Agent 进程会退出吗？**<br />因为 Agent 进程使用的 child_process.fork() 启动的，Master 进程退出之后，如果不做处理，Agent 进程不会退出，会被系统的 init 进程收养，此时就会变成孤儿进程，当然 Egg 没有这么弱，不会考虑不到这一点的，所以在 Master 退出之后也会做一些处理让 Agent 进程优雅退出。

推荐一篇对 egg-cluster 源码解析的文章 [Egg 源码解析之 egg-cluster【进程的进一步深刻理解】](https://mp.weixin.qq.com/s/8tSKiiczyyaAB04V7Z87kQ) 
<a name="ul8kU"></a>
## 站在巨人的肩膀上

推荐下面几篇文章，有些从理论上介绍了实现 Nodejs Cluster 的实现原理，有些则从源码的角度进行了深入分析。

- [https://juejin.im/post/5c87760fe51d4507534c88e5](https://juejin.im/post/5c87760fe51d4507534c88e5)
- [https://juejin.im/entry/5ad3eb536fb9a028d375db4e](https://juejin.im/entry/5ad3eb536fb9a028d375db4e)
- [https://yq.aliyun.com/articles/717323](https://yq.aliyun.com/articles/717323)
- [https://segmentfault.com/a/1190000010260600](https://segmentfault.com/a/1190000010260600)
