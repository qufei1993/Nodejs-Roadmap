# 爬虫

## 目录

* [抓取目标数据](#抓取目标数据)

  * [采用http模块](#采用http模块)

  * [chromeless中间件](#chromeless中间件)

* [使用cheerio解析](#使用cheerio解析)


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

  //每次抓取到数据之后如果需要关闭浏览器，在.html()之后加上一个.end()即可

  //打印数据
  html.then( data => {
      console.log(data);
  }).catch( err => {
      console.log(err);
  })
```

## 使用cheerio解析

> cheerio 是一个运行于后台,操作dom节点的插件，可以认为是一个nodejs版的jquery

安装cheerio ``` npm install cheerio --save ```

首先你需要加载html

```javascript
//假设html为以下结构
let html = `
<!doctype html>
<html>
    <body>
        <!-- header -->
        <div class="header-bg">
            <header class="container">
                <ul class="nav-ul">
                    <li><a href="http://www.qzfweb.com/">首页</a></li>
                    <li><a href="http://www.qzfweb.com/cate/1">前端开发</a></li>
                    <li><a href="http://www.qzfweb.com/cate/2">后端开发</a></li>
                    <li><a href="http://www.qzfweb.com/cate/20">环境搭建</a></li>
                </ul>
            </header>
        </div>
    </body>
</html>
`;

const cheerio = require('cheerio');
let $ = cheerio.load(html);

```

之后你可以通过css selector 来筛选元素

```javascript

const cheerio = require('cheerio');
let $ = cheerio.load(html);
let lis = $('.header-bg .container .nav-ul li'); //拿到每一个li

```

如果html文档中有多个li 此时你拿到的将是每一个对象，需要使用each来遍历

```javascript

const cheerio = require('cheerio');
let $ = cheerio.load(html);
let lis = $('.header-bg .container .nav-ul li');
let data = [];

lis.each(function(item){
    let element = $(this);
    let text = element.find('a').text();

    data.push(text);
});

//打印爬取的数据
console.log(data); // [ '首页', '前端开发', '后端开发', '环境搭建' ]
```
