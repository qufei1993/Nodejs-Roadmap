# 代码性能优化

## map与forEach
map比forEach功能强大, 但是map会创建一个新的数组, 将会占用内存. 如果不使用map的返回值建议使用forEach

## for in与for of

* for in遍历的是数组的索引（即键名），遍历顺序有可能不是按照实际数组的内部顺序，通常用来遍历对象
* for of遍历的是数组元素值。ES6新增，可以用其遍历数组

## 高并发应对之道

* 增加机器数
* 增加每台机器的CPU数 —— 多核，由于单线程机制，可以利用系统的多核优势开启集群，来实现多线程，关于集群实现方式:
    * 使用PM2的集群模式，设置exec_mode为cluster，instances设置最大实例数，具体参考[PM2官方文档](http://pm2.keymetrics.io/docs/usage/cluster-mode/)

    ```js
    {
        "apps": [
            {
            "name": "project_name",
            "script": "./app.js",
            "exec_mode": "cluster",
            "instances": 4
            }
        ],
        ...
    }
    ```

    * Nodejs的cluster模块 [http://nodejs.cn/api/cluster.html#cluster_cluster](http://nodejs.cn/api/cluster.html#cluster_cluster)

NodeJS性能好主要是好在单个的CPU(一个CPU只开一个进程，一个进程只开一个线程), 在单台机器的时候，在处理Web请求的时候和之前的java和apache是相同的,

## require特性与优化

* module被加载的时候执行，加载后缓存

* 一旦出现某个模块被循环加载, 就只输出已经执行的部分, 还未执行的部分不会输出

在项目中加载外部文件调用其方法时要利用require被加载后缓存这一机制，而非在用到的地方每次去请求

```js
const tool = require('./tool');

//正确的写法
function postData(){
    return tool.post(...);
}

//性能不友好的写法
function postData(){
    return require('./tool').post(...);
}
```
