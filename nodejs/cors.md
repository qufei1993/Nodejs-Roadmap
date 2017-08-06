nodejs 解决跨域问题：

一种办法只需要在Nodejs端设置代码如下即可

```javascript
//设置跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials","true");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
```

如果前端发送了cookie credentials: 'include'
此时上面的Access-Control-Allow-Origin 不能设置为*号要设置为固定域名
