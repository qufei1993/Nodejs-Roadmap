# Dcoker 容器环境下构建平滑的 Node.js 应用程序

构建平滑的 Node.js 应用程序，也就是在程序意外退出之后服务进程要接收到 SIGTERM 信号，待当前链接处理完成之后在退出，这样是比较优雅的，但是在 Docker 容器中实践时却发现容器停掉时却发生了一些异常现象，服务进程并没有接收到 SIGTERM 信号，然后随着容器的销毁服务进程也被强制 kill 了，显然当前正在处理的链接也就无法正常完成了。



## Refenrce

* [https://zhuanlan.zhihu.com/p/54151728](https://zhuanlan.zhihu.com/p/54151728)
* [https://juejin.im/entry/5b28d9aa51882574a36fa93f](https://juejin.im/entry/5b28d9aa51882574a36fa93f)
* [https://docs.docker.com/engine/reference/commandline/stop/#options](https://docs.docker.com/engine/reference/commandline/stop/#options)
* [https://docs.docker.com/engine/reference/builder/#cmd](https://docs.docker.com/engine/reference/builder/#cmd)