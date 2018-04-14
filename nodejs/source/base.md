
## nodejs模块类型

#### 系统模块

> 系统模块也是原生模块，NodeJs采用了延迟加载的策略，只有在用到的情况下，系统模块才会被加载，加载完成后会放到binding_cache中，可分为以下几类:

* C/C++模块，也叫built-in内建模块，一般用于native模块调用，在require出去

* native模块，在开发中使用的Nodejs的http、buffer、fs等

#### 第三方模块