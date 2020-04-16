# Nodejs 基于 Stream 实现多文件合并

本文先从一个 Stream 的基本示例开始，有个初步认识，中间会讲在 Stream 中什么时候会出现内存泄漏，及如何避免最后基于 Nodejs 中的 Stream 实现一个多文件合并为一个文件的例子。
<a name="CZjYt"></a>
## 一个简单的 Stream 操作
创建一个可读流 readable 一个可写流 writeable，通过管道 pipe 将可写流绑定到可读流，一个简单的 Stream 操作就完成了。<br />

```javascript
const fs = require('fs');
const readable = fs.createReadStream('./test1.txt');
const writeable = fs.createWriteStream('./test2.txt');

readable.pipe(writeable);
```

看下 pipe 这个方法两个参数：

- destination：是一个可写流对象，也就是一个数据写入的目标对象，例如，上面我们创建的 writeable 就是一个可写流对象
- options：
  - end：读取结束时终止写入流，默认值是 true

```javascript
readable.pipe(destination[, options])
```

**默认情况下我们是不需要手动调用写入流的 end 方法关闭的**。

现在我们改一下，**设置 end 为 false 写入的目标流将会一直处于打开状态，** 此时就需要监听可读流的 end 事件，结束之后手动调用可写流的 end 事件。

```js
// readable.pipe(writeable);

readable.pipe(writeable, {
  end: false,
});
readable.on('end', function() {
  writeable.end('结束');
});
```

还需要注意一点**如果可读流期间发生什么错误，则写入的目标流将不会关闭**，例如：process.stderr 和 process.stdout 可写流在 Nodejs 进程退出前将永远不会关闭，所以**需要监听错误事件，手动关闭可写流，防止内存泄漏**。

Linux 下一切皆文件，为了测试，在创建可读流时，你可以不创建 test1.txt 文件，让可读流自动触发 error 事件并且将 writeable 的 close 方法注释掉，通过 linux 命令 ls -l /proc/${pid}/fd 查看 error 和非 error 前后的文件句柄变化。

```javascript
readable.on('error', function(err) {
  console.log('error', err);
  // writeable.close();
});

console.log(process.pid); // 打印进程 ID
setInterval(function(){}, 5000) // 让程序不中断，进程不退出
```

以下为触发 error 错误下 test2.txt 这个文件 fd 将会一直打开，除非进程退出，所以重要的事情再说一遍，**一定要做好错误监听手动关闭每个写入流**，以防止 “**内存泄漏**”。

```js
...
l-wx------ 1 root root 64 Apr 10 15:47 19 -> /root/study/test2.txt
...
```
<a name="7zStj"></a>
## 多个文件通过 Stream 合并为一个文件
上面讲了 Stream 的基本使用，最后提到一点设置可读流的 **end 为 false 可保持写入流一直处于打开状态。如何将多个文件通过 Stream 合并为一个文件，也是通过这种方式，一开始可写流处于打开状态，直到所有的可读流结束，我们再将可写流给关闭。**

- streamMerge 函数为入口函数
- streamMergeRecursive 函数递归调用合并文件
```javascript
const fs = require('fs');
const path = require('path');

/**
 * Stream 合并
 * @param { String } sourceFiles 源文件目录名
 * @param { String } targetFile 目标文件
 */
function streamMerge(sourceFiles, targetFile) {
  const scripts = fs.readdirSync(path.resolve(__dirname, sourceFiles)); // 获取源文件目录下的所有文件
  const fileWriteStream = fs.createWriteStream(path.resolve(__dirname, targetFile)); // 创建一个可写流

  streamMergeRecursive(scripts, fileWriteStream);
}

/**
 * Stream 合并的递归调用
 * @param { Array } scripts 
 * @param { Stream } fileWriteStream
 */
function streamMergeRecursive(scripts=[], fileWriteStream) {
  // 递归到尾部情况判断
  if (!scripts.length) {
    return fileWriteStream.end("console.log('Stream 合并完成')"); // 最后关闭可写流，防止内存泄漏
  }

  const currentFile = path.resolve(__dirname, 'scripts/', scripts.shift());
  const currentReadStream = fs.createReadStream(currentFile); // 获取当前的可读流

  currentReadStream.pipe(fileWriteStream, { end: false }); 
  currentReadStream.on('end', function() {
    streamMergeRecursive(scripts, fileWriteStream);
  });

  currentReadStream.on('error', function(error) { // 监听错误事件，关闭可写流，防止内存泄漏
    console.error(error);
    fileWriteStream.close();
  });
}

streamMerge('./scripts', './script.js');
```

可以自行实践下，代码放在了 Github 点击 [nodejs/module/stream-merge](https://github.com/Q-Angelo/project-training/tree/master/nodejs/module/stream-merge) 查看
