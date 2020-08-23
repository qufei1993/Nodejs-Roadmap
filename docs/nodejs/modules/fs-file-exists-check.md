# [fs] 如何在 Node.js 中判断一个文件/文件夹是否存在？

![](./img/fs_file_exists_check.png)<br />记录一些 Node.js 应用中的小知识点，如果你 Google/Baidu “Node.js 如何判断文件是否存在” 发现给出的很多<br />答案还是使用的 fs.exists，这里**不推荐使用 fs.exists 你可以选择 fs.stat 或 fs.access。**
<a name="kAV3C"></a>
## 为什么不推荐 fs.exists
我们在设计一个回调函数时，通常会遵循一个原则 “ **错误优先的回调函数**”，也就是返回值的第一个参数为错误信息，用以验证是否出错，其它的参数则用于返回数据。<br />如下所示为 fs.exists 的使用示例，直接返回了一个布尔值，违背了 “错误优先的回调函数” 这一设计原则，这是一方面原因。
```javascript
fs.exists('/etc/passwd', (exists) => {
  console.log(exists ? '存在' : '不存在');
});
```
另外一个是 **不推荐在 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.exists() 判断文件是否存在**，因为这样会引起 **竞态条件**，如果是在多进程下，程序的执行不完全是线性的，当程序的一个进程在执行 fs.exists 和 fs.writeFile() 时，其它进程是有可能在这之间更改文件的状态，这样就会造成一些非预期的结果。<br />**不推荐**
```javascript
(async () => {
  const exists = await util.promisify(fs.exists)('text.txt');
  console.log(exists);
  await sleep(10000);
  if (exists) {
    try {
      const res = await util.promisify(fs.readFile)('text.txt', { encoding: 'utf-8' });
      console.log(res);
    } catch (err) {
      console.error(err.code, err.message);
      throw err;
    }
  }
})();
```
**推荐**
```javascript
(async () => {
  try {
    const data = await util.promisify(fs.readFile)('text.txt', { encoding: 'utf-8' });
    console.log(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('File does not exists');
    } else {
      throw err;
    }
  }
})();
```
目前 **fs.exists 已被废弃**，另外需要清楚， **只有在文件不直接使用时才去检查文件是否存在**，下面推荐几个检查文件是否存在的方法。
<a name="bd8b92dd"></a>
## 使用 fs.stat
fs.stat 返回一个 [fs.Stats](http://nodejs.cn/s/NMuvVx) 对象，该对象提供了关于文件的很多信息，例如文件大小、创建时间等。其中有两个方法 stats.isDirectory()、stats.isFile() 用来判断是否是一个目录、是否是一个文件。
```javascript
const stats = await util.promisify(fs.stat)('text1.txt');
console.log(stats.isDirectory()); // false
console.log(stats.isFile()); // true
```
**若只是检查文件是否存在，推荐使用下面的 fs.access**。
<a name="lRzJb"></a>
## 使用 fs.access
fs.access 接收一个 mode 参数可以判断一个文件是否存在、是否可读、是否可写，返回值为一个 err 参数。
```javascript
const file = 'text.txt';

// 检查文件是否存在于当前目录中。
fs.access(file, fs.constants.F_OK, (err) => {
  console.log(`${file} ${err ? '不存在' : '存在'}`);
});

// 检查文件是否可读。
fs.access(file, fs.constants.R_OK, (err) => {
  console.log(`${file} ${err ? '不可读' : '可读'}`);
});

// 检查文件是否可写。
fs.access(file, fs.constants.W_OK, (err) => {
  console.log(`${file} ${err ? '不可写' : '可写'}`);
});

// 检查文件是否存在于当前目录中、以及是否可写。
fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
  if (err) {
    console.error(
      `${file} ${err.code === 'ENOENT' ? '不存在' : '只可读'}`);
  } else {
    console.log(`${file} 存在，且可写`);
  }
});
```
同样的也**不推荐在 fs.open()、 fs.readFile() 或 fs.writeFile() 之前使用 fs.exists() 判断文件是否存在，会引起竞态条件。**
<a name="ySU0d"></a>
## Reference

- [http://nodejs.cn/api/fs.html](http://nodejs.cn/api/fs.html)