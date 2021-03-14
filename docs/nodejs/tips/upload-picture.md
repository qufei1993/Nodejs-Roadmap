# Node.js 小知识 — 实现图片上传写入磁盘的接口

**![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1609076653070-42c1a0f0-1f1a-40b4-9f44-af96ec8d4cd0.png#align=left&display=inline&height=380&margin=%5Bobject%20Object%5D&name=image.png&originHeight=760&originWidth=1800&size=1018612&status=done&style=none&width=900)**

**Node.js 小知识** 记录一些工作中或 “Nodejs技术栈” 交流群中大家遇到的一些问题，有时一个小小的问题背后也能延伸出很多新的知识点，解决问题和总结的过程本身也是一个成长的过程，在这里与大家共同分享成长。

该问题之前由交流群一位同学提出，当时是遇到一个报错 ```“cross-device link not permitted”``` 正巧之前工作中也曾遇到，于是做下记录希望可以帮助到有需要的小伙伴。

## 一：开启 Node.js 服务

开启一个 Node.js 服务，指定路由 ```/upload/image``` 收到请求后调用 ```uploadImageHandler``` 方法，传入 Request 对象。 

```javascript
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const PORT = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
  if (req.url === '/upload/image' &&  req.method.toLocaleLowerCase() === 'post') {
    uploadImageHandler(req, res);
  } else {
  	res.setHeader('statusCode', 404);
  	res.end('Not found!')
  }
});
server.listen(PORT, () => {
  console.log(`server is listening at ${server.address().port}`);
});
```

## 二：处理图片对象

[formidable](https://github.com/node-formidable/formidable) 是一个用来处理上传文件、图片等数据的 NPM 模块，form.parse 是一个 callback 转化为 Promise 便于处理。

**Tips**：拼接路径时使用 path 模块的 join 方法，它会将我们传入的多个路径参数拼接起来，因为 Linux、Windows 等不同的系统使用的符号是不同的，该方法会根据系统自行转换处理。

```javascript
const uploadImageHandler = async (req, res) => {
  const form = new formidable.IncomingForm({ multiples: true });		
  form.encoding = 'utf-8';		
  form.maxFieldsSize = 1024 * 5;		
  form.keepExtensions = true;

  try {
    const { file } = await new Promise((resolve, reject) => {		
      form.parse(req, (err, fields, file) => {		
        if (err) {		
          return reject(err);		
        }

         return resolve({ fields, file });		
      });		
    });
    const { name: filename, path: sourcePath } = file.img;
    const destPath = path.join(__dirname, filename);
    console.log(`sourcePath: ${sourcePath}. destPath: ${destPath}`);
    await mv(sourcePath, destPath);
    console.log(`File ${filename} write success.`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: 'SUCCESS', message: `Upload success.`}));
  } catch (err) {
    console.error(`Move file failed with message: ${err.message}`);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ code: 'ERROR', message: `${err.message}`}));
  }
}
```

## 三：实现 mv 方法

### fs.rename 重命名文件

将上传的图片写入本地目标路径一种简单的方法是使用 fs 模块的 rename(sourcePath, destPath) 方法，该方法会异步的对 sourcePath 文件做重命名操作，使用如下所示：

```javascript
const mv = async (sourcePath, destPath) => {
	return fsPromises.rename(sourcePath, destPath);
};
```

### cross-device link not permitted

在使用 fs.rename() 时还要注意  ```cross-device link not permitted``` 错误，参考 [rename(2) — Linux manual page](https://man7.org/linux/man-pages/man2/rename.2.html):

> **EXDEV **oldpath and newpath are not on the same mounted filesystem.  (Linux permits a filesystem to be mounted at multiple points, but rename() does not work across different mount points, even if the same filesystem is mounted on both.)

oldPath 和 newPath 不在同一挂载的文件系统上。（Linux 允许一个文件系统挂载到多个点，但是 rename() 无法跨不同的挂载点进行工作，即使相同的文件系统被挂载在两个挂载点上。）

在 Windows 系统同样会遇到此问题，参考 [http://errorco.de/win32/winerror-h/error_not_same_device/0x80070011/](http://errorco.de/win32/winerror-h/error_not_same_device/0x80070011/)

> winerror.h 0x80070011
> #define ERROR_NOT_SAME_DEVICE
> The system cannot move the file to a different disk drive.（系统无法移动文件到不同的磁盘驱动器。）

之前在 “**Nodejs技术栈交流群**” 上一个小伙伴提问过该问题，此处在 Windows 做下复现，因为在使用 formidable 上传文件时默认的目录是操作系统的默认目录 os.tmpdir()，在我的电脑上对应的是 C 盘下，当我使用 fs.rename() 将其重名为 F 盘时，就出现了以下报错：

```javascript
C:\Users\ADMINI~1\AppData\Local\Temp\upload_3cc33e9403930347b89ea47e4045b940 F:\study\test\202366
[Error: EXDEV: cross-device link not permitted, rename 'C:\Users\ADMINI~1\AppData\Local\Temp\upload_3cc33e9403930347b89ea47e4045b940' -> 'F:\study\test\202366'] {
  errno: -4037,
  code: 'EXDEV',
  syscall: 'rename',
  path: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp\\upload_3cc33e9403930347b89ea47e4045b940',
  dest: 'F:\\study\\test\\202366'
}
```

### 设置源路径与目标路径在同一磁盘分区

设置上传文件中间件的临时路径为最终写入文件的磁盘分区，例如我们在 Windows 测试时将图片保存在 F 盘下，所以设置 formidable 的 form 对象的 uploadDir 属性为 F 盘，如下所示：

```javascript
const form = new formidable.IncomingForm({ multiples: true });		
form.uploadDir = 'F:\\'
form.parse(req, (err, fields, file) => {		
  ...
});
```

这种方式有一定局限性，如果写入的位置位于不同的磁盘空间该怎么办呢？

可以看下下面的这种方式。

### 读取-写入-删除临时文件

一种可行的办法是读取临时文件写入到新的位置，最后在删除临时文件。所以下述代码创建了可读流与可写流对象，使用 pipe 以管道的方式将数据写入新的位置，最后调用 fs 模块的 unlink 方法删除临时文件。

```javascript
const mv = async (sourcePath, destPath) => {
  try {
    await fsPromises.rename(sourcePath, destPath);
  } catch (error) {
    if (error.code === 'EXDEV') {
      const readStream = fs.createReadStream(sourcePath);		
      const writeStream = fs.createWriteStream(destPath);
      return new Promise((resolve, reject) => {
        readStream.pipe(writeStream);
        readStream.on('end', onClose);
        readStream.on('error', onError);
        async function onClose() {
          await fsPromises.unlink(sourcePath);
          resolve();
        }
        function onError(err) {
          console.error(`File write failed with message: ${err.message}`);		
          writeStream.close();
          reject(err)
        }
      })
    }

    throw error;
  }
}
```

## 四：测试

### 方式一：终端调用

```javascript
curl --location --request POST 'localhost:3000/upload/image' \
--form 'img=@/Users/Downloads/五月君.jpeg'
```

### 方式二：POSTMAN 调用

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1609075028325-c712b377-0ae8-49ea-a110-dac3ff885457.png#align=left&display=inline&height=394&margin=%5Bobject%20Object%5D&name=image.png&originHeight=788&originWidth=2280&size=139050&status=done&style=none&width=1140)

## Reference

- [https://github.com/andrewrk/node-mv/blob/master/index.js](https://github.com/andrewrk/node-mv/blob/master/index.js)
- [https://stackoverflow.com/questions/43206198/what-does-the-exdev-cross-device-link-not-permitted-error-mean/43206506#43206506](https://stackoverflow.com/questions/43206198/what-does-the-exdev-cross-device-link-not-permitted-error-mean/43206506#43206506)
- [https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback](https://nodejs.org/api/fs.html#fs_fs_rename_oldpath_newpath_callback)
