# 子进程child_process

> Node是一个单线程多进程的语言，主要是通过I／O操作来进行异步任务处理，I／O越密集Node的优势越能体现，但是CPU密集的任务就会对程序造成阻塞，影响后续程序执行在Node中我们可以采用child_process模块充分利用CPU资源，完成一些耗时耗资源的操作。

先看一段例子,运行下面程序，浏览器执行 http://127.0.0.1:3000/compute 大约每次需要15657.310ms，也就意味下次用户请求需要等待15657.310ms，文末将会采用child_process实现多个进程来处理。

```js
// compute.js

const http = require('http');
const [url, port] = ['127.0.0.1', 3000];

const computation = () => {
    let sum = 0;

    console.info('计算开始');
    console.time('计算耗时');

    for (let i = 0; i < 1e10; i++) {
        sum += i
    };

    console.info('计算结束');
    console.timeEnd('计算耗时');

    return sum;
};

const server = http.createServer((req, res) => {
    if(req.url == '/compute'){
        const sum = computation();

        res.end(`Sum is ${sum}`);
    }

    res.end(`ok`);
});

server.listen(port, url, () => {
    console.log(`server started at http://${url}:${port}`);
});
```

## 创建进程

#### 四种方式(异步方式)

* child_process.spawn()

* child_process.fork()

* child_process.exec()

* child_process.execFile()

#### spawn

适用于返回大量数据，例如图像处理，二进制数据处理。

请求格式

```
child_process.spawn(command[, args][, options])
```

请求参数

* ```comman <String>``` 运行的命令 例如 lh

* ```args <Array>``` 命令参数，默认为一个空数组

* ```options <Object>```
    * ```cwd <string>``` 子进程的当前工作目录
    * ```env <string>``` 环境变量键值对
    * ```argv0 <string>``` 显式地设置要发给子进程的 argv[0] 的值。 如果未指定，则设为 command
    * ```stdio <array> | <string>``` 子进程的 stdio 配置
    * ```detached <boolean>``` 将子进程独立于父进程运行
    * ```uid <number>```设置该进程用户标识
    * ```gid <number>``` 设置该进程的组标识
    * ```shell <boolean>``` 设置为true，不同的shell可以在comman命令中设置为字符安，例如，'ls -lh' 默认为false


请求示例

```js
const spawn = require('child_process').spawn;
const child = spawn('ls', ['-l'], {
    cwd: '/usr', // 指定子进程的工作目录，默认当前目录
})

console.log(process.pid, child.pid); // 主进程id3243 子进程3244
```

执行以上代码后，会在控制台输出主进程id、子进程id，但是子进程的信息并没有在控制台打印，原因是新创建的子进程有自己的stdio流，创建一个父进程和子进程之间传递消息的IPC通道就可实现输出信息。

方法一 可以让子进程的stdio和当前进程的stdio之间建立管道链接

```js
const spawn = require('child_process').spawn;
const child = spawn('ls', ['-l'], {
    cwd: '/usr', // 指定子进程的工作目录，默认当前目录
})

child.stdout.pipe(process.stdout);
```

方法二 父进程子进程之间共用stdio

``` options.stdio ``` 选项用于配置子进程与父进程之间建立的管道，值是一个数组['pipe', 'pipe', 'pipe']，为了方便期间可以是一个字符串'pipe'

* pipe 等同于 ['pipe', 'pipe', 'pipe'](默认)

* ignore 等同于 ['ignore', 'ignore', 'ignore']

* inherit 等同于 [process.stdin, process.stdout, process.stderr] 或 [0,1,2]

```js
const spawn = require('child_process').spawn;
const child = spawn('ls', ['-l'], {
    cwd: '/usr', // 指定子进程的工作目录，默认当前目录
    stdio: 'inherit'
})
```

方法三 事件监听

```js
const spawn = require('child_process').spawn;
const child = spawn('ls', ['-l'], {
    cwd: '/usr', // 指定子进程的工作目录，默认当前目录
})

child.stdout.on('data', data => {
    console.log(data.toString());
});
```

#### exec

缓存子进程的输出，将子进程的输出以回调函数的形式一次性返回，如果子进程返回的数据过大超过maxBuffer默认值将会导致程序崩溃，也可以设置maxBuffer允许的最大字节数，不建议这样做，exec适合于小量的数据，数据量过大可以采用[spawn](#spawn)

```注意: ``` 不要把未经检查的用户输入传入到该函数。 任何包括 shell 元字符的输入都可被用于触发任何命令的执行

请求格式

```js
child_process.exec(command[, options][, callback])
```

请求参数

* ```command <String>``` 运行的命令，参数使用空格分隔

* ```options <Object>```
    * ```cwd <string>``` 子进程的当前工作目录
    * ```env <Object>``` 环境变量键值对
    * ```encoding <string>``` 默认为 'utf8'
    * ```shell <string>``` 执行命令的 shell。在 UNIX 上默认为 '/bin/sh'，在 Windows 上默认为 process.env.ComSpec
    * ```timeout <number>``` 默认为 0
    * ```maxBuffer <number>``` stdout 或 stderr 允许的最大字节数。默认为 200*1024。如果超过限制，则子进程会被终止
    * ```killSignal <string>``` | <integer> 默认为 'SIGTERM'，如果 timeout 大于 0，当子进程运行超过 timeout 毫秒时，父进程就会发送由 killSignal 属性标识的信号
    * ```uid <number>``` 设置进程的用户标识
    * ```gid <number>``` 设置进程的组标识
    * ```windowsHide <boolean>``` 隐藏子进程的控制台窗口，常用于 Windows 系统。默认为 false
* ```callback <Function>``` 回调函数
    * ```error <Error>``` 错误信息 成功时error是null，当失败时，返回一个Error实例
    * ```stdout <string> | <Buffer>```
    * ```stderr <string> | <Buffer>```


```js
const exec = require('child_process').exec;

exec(`cat ${__dirname}/test.txt`, {
    cwd: __dirname,
    env: {
        NODE_ENV: 'development'
    },
}, (error, stdout, stderr) => {
    console.log({
        error,
        stdout,
        stderr
    })

     /**
     *
     * {
     *  error: null,
     *  stdout: 'test数据test数据test数据test数据test数据test数据test数据test数据test数据test数据test数据test数据',
     *  stderr: ''
     * }
     */
})
```

#### execFile

child_process.execFile() 函数类似 child_process.exec()，区别是不能通过shell来执行，不支持像 I/O 重定向和文件查找这样的行为

请求方法

```js
child_process.execFile(file[, args][, options][, callback])
```

请求参数同child_process.exec

```js
const execFile = require('child_process').execFile;

execFile(`node`, ['-v'], (error, stdout, stderr) => {
    console.log({
        error,
        stdout,
        stderr
    })

    // { error: null, stdout: 'v8.5.0\n', stderr: '' }
})
```

#### fork

child_process.fork() 方法是 child_process.spawn() 的一个特殊情况，专门用于衍生新的 Node.js 进程。衍生的 Node.js 子进程与两者之间建立的 IPC 通信信道的异常是独立于父进程的。 每个进程都有自己的内存，使用自己的 V8 实例。 由于需要额外的资源分配，因此不推荐衍生大量的 Node.js 进程。

请求方法

```
child_process.fork(modulePath[, args][, options])
```

请求参数

* ```modulePath <String>``` 要在子进程中运行的模块
* ```args <Array>``` 字符串参数列表
* ```options <Object>```
    * ```cwd <string>``` 子进程的当前工作目录
    * ```env <Object>``` 环境变量键值对
    * ```execPath <string>``` 用来创建子进程的执行路径
    * ```execArgv <Array>``` 要传给执行路径的字符串参数列表。默认为 process.execArgv
    * ```silent <boolean>``` 如果为 true，则子进程中的 stdin、 stdout 和 stderr 会被导流到父进程中，否则它们会继承自父进程，默认false
    * ```stdio <Array> | <string>``` 详见 child_process.spawn() 的 stdio。 当提供了该选项，则它会覆盖 silent。 如果使用了数组变量，则该数组必须包含一个值为 'ipc' 的子项，否则会抛出错误。 例如 [0, 1, 2, 'ipc']
    * ```windowsVerbatimArguments <boolean>``` 决定在Windows系统下是否使用转义参数。 在Linux平台下会自动忽略。默认值: fals
    * ```uid <number>``` 设置该进程的用户标识
    * ```gid <number>``` 设置该进程的组标识
* 返回 ```<ChildProcess>```


创建parent_process.js

```js
const fork = require('child_process').fork;
const child = fork('./child_fork.js');

console.log('process.pid: ', process.pid, ' child.pid: ', child.pid); // process.pid:  12236  child.pid:  12237

child.on('message', function(msg){
    console.log('parent get message: ' + JSON.stringify(msg)); // parent get message: {"key":"child value "}
});

child.send({key: 'parent value'});
```

创建child_process.js

```js
console.log('child.pid: ' + process.pid); // child.pid: 12237

process.on('message', function(msg){
    console.log('child get message: ' + JSON.stringify(msg)); // child get message: {"key":"parent value"}
});

setTimeout(function() {
    process.send({key: `child value `})
}, 2000)
```
