
## 版本下载

这里使用的是node v8.11.1版本[http://nodejs.org/dist/](http://nodejs.org/dist/)

## nodejs模块类型

#### 系统模块

> 系统模块也是原生模块，NodeJs采用了延迟加载的策略，只有在用到的情况下，系统模块才会被加载，加载完成后会放到binding_cache中，可分为以下几类:

* C/C++模块，也叫built-in内建模块，一般用于native模块调用，在require出去

* native模块，在开发中使用的Nodejs的http、buffer、fs等，底层也是调用的内建模块(C/C++)。

#### 第三方模块

> 非nodejs自带的模块称为第三方模块，比如express、koa框架、moment.js等

* javaScript模块 

* json模块

* C/C++模块，编译之后扩展名为.node的模块

## 目录结构

<pre>
├── benchmark                         一些nodejs性能测试代码
├── deps                              nodejs依赖
├── doc                               文档
├── lib                               nodejs对外暴露的js模块源码
├── src                               nodejs的c/c++源码文件，内建模块
├── test                              单元测试
├── tools                             编译时用到的工具
├── doc                               api文档
├── vcbuild.bat                       win平台makefile文件
├── node.gyp                          node-gyp构建编译任务的配置文件                           
</pre>