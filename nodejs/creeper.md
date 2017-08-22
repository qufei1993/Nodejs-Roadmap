# 爬虫

## 目录

* 抓取目标数据

  * [采用http模块](#采用http模块)

  * [chromeless中间件](#chromeless中间件)

## 抓取目标数据

#### 采用http模块

> 在 nodejs中 https.get() 或者 http.get() 获取的数据是在js运行之前的数据

```javascript
  //根据抓取目标网站不同来确定是http 还是 https
  const http = require('http');
  const https = require('https');
  const url = 'https://www.baidu.com';
  https.get(url, res => {
      let html = "";

      //加载数据
      res.on("data", data => {
          html += data;
      })

      //打印数据
      res.on("end", () => {
          console.log(result);
      })
  }).on('error', e => {
      console.log('或数数据出错！', e);
  })
```

#### chromeless中间件

> 浏览器中审查元素查看到的信息是js运行之后的结果，如果使用http模块对于js运行之后的数据是抓取不到的，针对这个问题可以使用chromeless中间件模拟chrome浏览器运行来得到js运行之后的数据。关于chromeless模块可参考官方文档来学习 [https://github.com/graphcool/chromeless](https://github.com/graphcool/chromeless)

安装chromeless模块 ``` npm install chromeless --save ```

```javascript
  const { Chromeless } = require('chromeless')
  const cl = new Chromeless();
  const html = cl
      .goto(url)
      .html()
      .end()

  html.then( data => {
      let result = filterChapter(data);
      console.log(result);
  }).catch( err => {
      console.log(err);
  })
```
