# V8

对于 Node.js 服务端研发的同学来说，关于垃圾回收、内存释放这块不需要向 C/C++ 的同学那样在创建一个对象之后还需要手动创建一个 delete/free 这样的一个操作进行 GC（垃圾回收）， Node.js 与 Java 一样，由虚拟机进行内存自动管理，但是这样并不表示就此可以高枕无忧了，在开发中可能由于疏忽或者程序错误导致的内存泄漏也是一个很严重的问题，所以做为一名合格的服务端研发工程师，还是有必要的去了解下虚拟机是怎样使用内存的，遇到问题才能从容应对。

## Nodejs中的GC

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境，这是来自 Node.js 官网的一段话，所以 V8 就是 Node.js 中使用的虚拟机，在之后讲解的 Node.js 中的 GC 其实就是在讲 V8 的 GC。

Node.js 与 V8 的关系也好比 Java 之于 JVM 的关系，另外 Node.js 之父 Ryan Dahl 在选择 V8 做为 Node.js 的虚拟机时 V8 的性能在当时已经领先了其它所有的 JavaScript 虚拟机，至今仍然是性能最好的，因此我们在做 Node.js 优化时，只要版本升级性能也会伴随着被提升。

## Nodejs垃圾回收内存管理实践

通过一个 Demo 来看看在 Node.js 中进行垃圾回收的过程是怎样的

### 内存泄漏识别

在 Node.js 环境里提供了 process.memoryUsage 方法用来查看当前进程内存使用情况，单位为字节

* rss（resident set size）：所有内存占用，包括指令区和堆栈。
* heapTotal：堆中总共申请到的内存量。
* heapUsed：堆中目前用到的内存量，判断内存泄漏我们主要以这个字段为准。
* external： V8 引擎内部的 C++ 对象占用的内存。

```js
/**
 * 单位为字节格式为 MB 输出
 */
const format = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
};

/**
 * 封装 print 方法输出内存占用信息 
 */
const print = function() {
    const memoryUsage = process.memoryUsage();

    console.log(JSON.stringify({
        rss: format(memoryUsage.rss),
        heapTotal: format(memoryUsage.heapTotal),
        heapUsed: format(memoryUsage.heapUsed),
        external: format(memoryUsage.external),
    }));
}
```

### 内存泄漏例子

堆用来存放对象引用类型，例如字符串、对象。在以下代码中创建一个 Fruit 存放于堆中。

```js
// example.js
function Quantity(num) {
    if (num) {
        return new Array(num * 1024 * 1024);
    }

    return num;
}

function Fruit(name, quantity) {
    this.name = name
    this.quantity = new Quantity(quantity)
}

let apple = new Fruit('apple');
print();
let banana = new Fruit('banana', 20);
print();
```

执行以上代码，内存向下面所展示的，apple 对象 heapUsed 的使用仅有 4.21 MB，而 banana 我们对它的 quantity 属性创建了一个很大的数组空间导致 heapUsed 飙升到 164.24 MB。

```
$ node example.js

{"rss":"19.94 MB","heapTotal":"6.83 MB","heapUsed":"4.21 MB","external":"0.01 MB"}
{"rss":"180.04 MB","heapTotal":"166.84 MB","heapUsed":"164.24 MB","external":"0.01 MB"}
```

我们在来看下内存的使用情况，根节点对每个对象都持有引用，则无法释放任何内容导致无法 GC，正如下图所展示的

![](./img/memory-0190620-002.png)

### 手动执行垃圾回收内存释放

假设 banana 对象我们不在使用了，对它重新赋予一些新的值，例如 banana = null，看下此刻会发生什么？

![](./img/memory-0190621-001.png)

结果如上图所示，无法从根对象在到达到 Banana 对象，那么在下一个垃圾回收器运行时 Banana 将会被释放。

让我们模拟一下垃圾回收，看下实际情况是什么样的？

```js
// example.js
let apple = new Fruit('apple');
print();
let banana = new Fruit('banana', 20);
print();
banana = null;
global.gc();
print();
```

以下代码中 --expose-gc 参数表示允许手动执行垃圾回收机制，将 banana 对象赋为 null 后进行 GC，在第三个 print 打印出的结果可以看到 heapUsed 的使用已经从 164.24 MB 降到了 3.97 MB

```bash
$ node --expose-gc example.js
{"rss":"19.95 MB","heapTotal":"6.83 MB","heapUsed":"4.21 MB","external":"0.01 MB"}
{"rss":"180.05 MB","heapTotal":"166.84 MB","heapUsed":"164.24 MB","external":"0.01 MB"}
{"rss":"52.48 MB","heapTotal":"9.33 MB","heapUsed":"3.97 MB","external":"0.01 MB"}
```

下图所示，右侧的 banana 节点没有了任何内容，经过 GC 之后所占用的内存已经被释放了。

![](./img/memory-0190621-002.png)

## 内存泄漏情况

### 全局变量

未声明的变量或挂在全局 global 下的变量不会自动回收，将会常驻内存直到进程退出才会被释放，除非通过通过 delete 或 重新赋值为 undefined/null 解决之间的引用关系，才会被回收。

### 闭包
