# 使用 Chrome Devtools 来调试你的 Node.js 程序

![image.png](./img/debug-nodejs-with-chrome-devtools.png)

俗话说：“工欲善其事，必先利其器”，调试是每一个开发人员都要遇到的问题，选择一个合适的调试工具也尤为重要。 在 Node.js 开发过程中除了万能的 console.log 之外，本节介绍一个 Node.js 与 Chrome Devtools 结合的调试工具，以后你可以选择使用浏览器来调试 Node.js 应用程序了。

## 启动调试器

### 创建测试代码

```shell
const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'hello.txt')

console.log('filePath: ', filePath);

fs.readFile(filePath, (err, res) => {
  console.log(err, res.toString());
});
```

### 运行带有 --inspect-brk 标志的 node

启动时在 node 后面加上 **```--inspect-brk```**  标志，Node.js 将监听调试客户端，默认情况下监听在 127.0.0.1:9229 地址，也可以显示指定地址 **```--inspect-brk=_host:port_```**

```shell
$ node --inspect-brk app.js
Debugger listening on ws://127.0.0.1:9229/c7a51e5a-d9be-4506-83fb-0a9340d2b9ba
For help, see: https://nodejs.org/en/docs/inspector
```

注意 node --inspect 与 node --inspect-brk 的区别：--inspect 不会终断，--inspect-brk 在用户代码启动之前会终断，也就是代码在第一行就会暂停执行。

### 在 Chrome 中打开

浏览器地址栏输入 **chrome://inspect/** 按回车键，如下所示：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607831872118-56dc17cd-84ac-461f-98a5-8bc4348ef5a7.png#align=left&display=inline&height=327&margin=%5Bobject%20Object%5D&name=image.png&originHeight=654&originWidth=1746&size=104503&status=done&style=none&width=873)

Remote Target 下展示了当前运行的 Node.js 版本号，打开 **inspect** 或 **Open dedicated Devtools for Node** 链接，如下所示：

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607832112524-f54b4b30-f6bf-493b-89b1-0bb41d59b562.png#align=left&display=inline&height=509&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1018&originWidth=2876&size=296192&status=done&style=none&width=1438)

## 断点调试

### 调试工具窗口介绍

上方展示与服务器端调试需要的 5 个面板，和 Chrome 开发工具中的是基本相同的，可以理解为 “服务端的定制版”

- Connection：链接
- Console：控制台
- Sources：源代码调试（本节主要讲的）
- Memory：内存，查找影响性能的内存问题，包括内存泄漏、内存膨胀和频繁的垃圾回收
- Profiler：性能

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607832194599-ce077597-8ec2-4ba9-ab4b-7198d3d25229.png#align=left&display=inline&height=76&margin=%5Bobject%20Object%5D&name=image.png&originHeight=152&originWidth=2628&size=42319&status=done&style=none&width=1314)

右上角的五个图表，从左至右依次分别表示：

- Resume script execution(F8): 恢复脚本执行，每一次都会自动执行到断点处。
- Step over next function call(F10)：跳过下一个函数调用，执行当前代码行，在当前代码行的下一行处停止，是一步一步的操作。
- Step into next function call(F11)：单步进入下一个函数调用。
- Step out next function call(F11)：单步退出下一个函数调用。
- Step(F9)：执行当前代码行并在下一行处停止。

### 设置断点

在 Source 选项卡下，找到 app.js 这是我们测试脚本的入口文件，如果是执行的 --inspect-brk 标志，默认会停留在代码第一行处。

第一种设置断点的方式，是在程序里加入 ```debugger``` 命令。

第二种设置断点的方式是在编辑器窗口中单击要设置的代码行，此时编辑器窗口中该行会处于被选中状态，还有一个右侧的小箭头。另外右下方 Breakpoints 面板中也展示出了我们设置的断点。

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607833381395-e5e65157-78ad-4e94-b89e-8e4bc11896a1.png#align=left&display=inline&height=809&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1618&originWidth=2878&size=485033&status=done&style=none&width=1439)

取消断点，再次单击选中的代码行左侧，起到切换作用，或者右键选择   ```Remove breakpoint```

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607833448803-026e974c-a8e4-4244-9130-940807f09cd7.png#align=left&display=inline&height=205&margin=%5Bobject%20Object%5D&name=image.png&originHeight=410&originWidth=1446&size=220209&status=done&style=none&width=723)

欲了解更多断点调试相关内容，参考了解 Chrome DevTools 更多信息，参考 [使用断点暂停代码](developers.google.com/web/tools/chrome-devtools/javascript/breakpoints#conditional-loc)

## 对已启动 Node.js 进程做调试

如果一个 Node.js 进程启动时没有加 --inspect-brk 标志，但是我们又不想重启进程来调试，这个时候怎么办？以下两种方式任何一种都可以：

### 方式一：process._debugProcess(PID)

找到当前启动的 Node 进程 ID，之后使用 ```node -e 'process._debugProcess(26853)'``` 会建立进程 26853 与调试工具的链接。 

```shell
$ ps ax | grep app.js 
26864 s001  S+     0:00.01 grep app.js
26853 s002  S+     0:00.09 node app.js

$ node -e 'process._debugProcess(26853)'
SIGUSR1
```

### 方式二：SIGUSR1 信号

向 Node 进程发送 SIGUSR1 信号，也可以建立与调试工具的链接。在 Windows 上不可用，还需要注意版本，在 Node.js Version 8 或更高版本中将激活 Inspect API。

```shell
$ kill -SIGUSR1 26853
```

### 测试

以下对 Demo 做了修改，创建一个 HTTP Server 每收到一个请求读取文件，如果按照以上方式开启调试工具后，在浏览器输入 **```http://localhost:3000```** 回车后，会自动跳转到调试界面，现在你可以设置断点，向上面的方式一样进行调试。 

**Tips：**当前程序运行在断点第 6 行，鼠标移动到 req.url 上之后会看到该属性对应的值。

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607861310599-d3c0a739-fac0-4d59-84ed-8744289f972c.png#align=left&display=inline&height=410&margin=%5Bobject%20Object%5D&name=image.png&originHeight=820&originWidth=2878&size=297481&status=done&style=none&width=1439)

## 远程调试

如果是在服务器上调试，建议不要让调试器监听公共 IP 地址，这可能会引起远程访问的安全风险，但我们又想用本地的方式调试该怎么办呢？

如果要允许远程调试链接，建议是使用 SSL 隧道的方式，假设我们的服务运行在服务器 debug.nodejs.red 上，首先启动服务，和上面的方式一样。

```shell
$ node --inspect-brk app.js
```

### 设置 SSH 隧道

在本地计算机上设置 SSH 隧道，这将使本地计算机上端口为 9221 接收的链接转换到服务器 debug.nodejs.red 上的 9229 端口。

```shell
$ ssh -L 9221:localhost:9229 user@debug.nodejs.red
```

### Chrome DevTools 调试器的 Connection 中增加链接

默认情况下，Connection 下只有一个 localhost:9229，在添加 1 个 localhost:9221 之后我们就可以向在本地运行 Node.js 程序一样进行调试。

![image.png](https://cdn.nlark.com/yuque/0/2020/png/335268/1607865647436-ff4cdac0-b3ef-40d1-b6eb-a890d346c8a9.png#align=left&display=inline&height=757&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1514&originWidth=2874&size=231793&status=done&style=none&width=1437)

## Reference

- [chrome-devtools](https://developers.google.com/web/tools/chrome-devtools/)
- [debugging-getting-started](https://nodejs.org/en/docs/guides/debugging-getting-started/)
