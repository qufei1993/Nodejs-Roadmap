# 记一次生产环境Node版本升级经历

> 暮然回首，之前服务器上的Node.js版本已经不能满足今天的业务需求了，玩Node开发的小伙伴不难发现Node.js的版本更新很快，包括它最新稳定版本更新也很频繁，截止目前（2018.10.18）已经是LTSv8.12.0，最新发布版10.12.0，这些版本迭代的背后也给我们带来了很多新的特性，在开发效率、性能上也提高了很多例如很出名的async、await特性，同样伴随的问题也来了，特别是线上服务器很多项目在跑，所以升级之前有必要先做好功课，在开始动工，以下是我的一些经历，希望对于您能有所帮助。

## 目前现状:
* 线上四台服务Node版本: v6.x.x，这个版本不能使用promisify、async、await、koa2等
* 项目基本都为Express框架，有些还是callbak语法，自然而然是没问题，一些诟病就不讲了
* 项目采用pm2进行部署，cluster模式也都用的pm2自带的。

## 升级目的:
> 对于之前的一些callback服务进行了重构，采用koa2框架，async、await语法开发，项目的可维护度提高了很多。

## 升级之前的一些准备工作

* 先关闭当前服务器的流量

## nvm管理node版本

> 可以使用 [nvm](https://github.com/creationix/nvm) https://github.com/creationix/nvm这个工具来安装nodejs 方便后面的升级与管理

nvm安装正确姿势

``` wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash ```

nvm 安装node

```js 
nvm install v8.12.0
```

设定系统的默认版本

```
nvm alias default v8.12.0
```

查看node、npm是否安装成功

```
$ node -v
v8.5.0
```

```
$ npm -v
5.3.0
```

安装完node之后重启所有服务，发现并没有应用到最新的node版本，因为最初项目使用pm2部署的，因此还仍需进行第二步操作更新pm2。

## 更新pm2

注意：在更新之前，先执行pm2 save对当前的服务进行保存

刚开始没注意将pm2升级到了最新版本3.2.X，然后项目只要重启，执行此重启命令 ``` pm2 startOrGracefulReload ecosystem.json ``` 就报类似以下错误端口被占用

```s
Error: listen EADDRINUSE :::8888
    at Object._errnoException (util.js:1022:11)
    at _exceptionWithHostPort (util.js:1044:20)
    at Server.setupListenHandle [as _listen2] (net.js:1367:14)
    at listenInCluster (net.js:1408:12)
    at Server.listen (net.js:1492:7)
    at Application.listen (/yourproject/node_modules/koa/lib/application.js:65:19)
    at Object.<anonymous> (/yourproject/app.js:28:5)
    at Module._compile (module.js:652:30)
    at Object.Module._extensions..js (module.js:663:10)
    at Module.load (module.js:565:32)
    at tryModuleLoad (module.js:505:12)
    at Function.Module._load (module.js:497:3)
    at Object.<anonymous> (/root/.nvm/versions/node/v8.11.1/lib/node_modules/pm2/lib/ProcessContainerFork.js:48:21)
```

经排查原因在于pm2 3.2.X版本对于集群模式做了修改，原来 ``` "exec_mode": "cluster" ```，修改为 ``` "exec_mode": "cluster_mode" ```

后来还是将pm2更新为了当前的稳定版本2.9.1

安装指定版本，线上建议不要最新版本，追求稳定

```npm install pm2@v2.9.1 -g```

更新，将会停止所有的服务进行重新启动

```
pm2 update
```

至此，升级版本所需要的都已经ok啦，在升级为指定版本之前一定要先了解，不要盲目去做升级。