# 线程和进程

**线程**是操作系统能够进行运算调度的最小单位，被包含于**进程**之中。一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。

## 多线程

多线程面临锁、状态同步问题，首先我们要清楚线程是隶属于进程的，同一块代码，根据系统CPU核心数启动多个进程，每个进程都有属于自己的独立空间，进程之间是不相互影响的。但是同一进程中的多条线程将共享该进程中的全部系统资源，如虚拟地址空间，文件描述符和信号处理等等。但同一进程中的多个线程有各自的调用栈（call stack），自己的寄存器环境（register context），自己的线程本地存储（thread-local storage)

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

运行结果，每次执行都会修改count值，所以，多线程中任何一个变量都可以被被任何一个线程所修改。

```shell
1 # 第一次执行
2 # 第二次执行
3 # 第三次执行
```

另外多线程的代价还在于创建新的线程和执行期上下文线程的切换开销。

[进程与线程的一个简单解释](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)

