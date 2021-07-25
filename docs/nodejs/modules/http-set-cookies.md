# HTTP 请求与响应如何设置 Cookie 信息

![默认文件1620658909946.png](https://cdn.nlark.com/yuque/0/2021/png/335268/1620659087113-7acc11d5-f24d-49c4-b4c4-b02df81cd31a.png#clientId=u45404d01-f1d4-4&from=ui&id=u7cdf0a83&margin=%5Bobject%20Object%5D&name=%E9%BB%98%E8%AE%A4%E6%96%87%E4%BB%B61620658909946.png&originHeight=383&originWidth=900&originalType=binary&ratio=1&size=41208&status=done&style=none&taskId=u345fc3da-05c9-43de-ad6f-7cd67c52767)

[HTTP Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies) 是服务器发送到用户浏览器并保存在本地的一小块数据，浏览器下次向同一服务器发起请求时会携带该 cookie 信息到服务器。

本文来自 “Nodejs技术栈” 一位读者的一个问题，“**Node.js 发起 HTTP 请求时，怎么携带上 cookie 信息？**”

通常我们在浏览器向服务器发起一个请求，浏览器会检查是否有相应的 Cookie（浏览器的安装目录下有个 cookie 文件夹用来存放各个域下设置的 cookie 信息），如有则自动添加到 Request headers 的 cookie 字段中发送到服务器。

这是浏览器的行为会自动帮我们做，那么如果一个 Node.js 做为客户端呢？

**根据  定义的 cookie 工作方式，在 HTTP 请求处理中，服务端可以在 Response headers 中为客户端设置 Set-Cookie 字段。另外，客户端在 HTTP 请求的 Request headers 中以字段 Cookie 的形式将 cookie 信息传递给服务端**。

下面我们用 Node.js 提供的系统模块 [HTTP](https://nodejs.org/dist/latest-v14.x/docs/api/http.html) 看看如何实现。

这是客户端的请求方法实现，我们可以在 headers 中直接设置 Cookie 字段，也可通过 http.request 返回的 req 对象调用 setHeader() 方法设置。

```javascript
const http = require('http');
function sendRequest() {
  const req = http.request({
    method: 'GET',
    host: '127.0.0.1',
    port: 3010,
    path: '/api',
    headers: {
      Cookie: ['a=111', 'b=222'] // 方式一设置
    }
  }, res => {
    let data = '';
    res.on('data', chunk => data += chunk.toString());
    res.on('end', () => {
      console.log('response body: ', data);
      console.log('response cookie: ', res.headers['set-cookie']);
    });
  });
  req.setHeader('Cookie', ['b=222', 'c=333']) // 方式二设置
  req.on('error', console.error);
  req.end();
}
sendRequest();
```

服务端代码如下所示，注意响应设置的是 Set-Cookie 字段。

```javascript
const http = require('http');

http.createServer((req, res) => {
  if (req.url === '/api') {
    console.log('received cookie data: ', req.headers.cookie);
    res.setHeader('Set-Cookie', ['c=333', 'd=444'])
    res.end('Cookie set success!');
  } else {
    res.end('ok!');
  }
}).listen(3010);
```

同样的当你使用 request、node-fetch 等这些 HTTP 的请求库，其使用是相通的。
