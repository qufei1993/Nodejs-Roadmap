# Nginx映射

#### 删除apache2

* sudo service apache2 stop

* sudo service aoache stop

* update-rc.d -f apache2 remove #删除apache2

* sudo apt-get remove apache2 #移出apache2

#### 更新包列表

``` sudo apt-get update ```

#### 安装nginx

```sudo apt-get install nginx```

进入 etc/nginx/conf.d 创建配置文件
sudo vim yuming-com-8081.conf
```javascript
upstream yuming {
  server 127.0.0.1:8081;
}

server {
  listen 80;
  server_name 服务器IP地址;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward $proxy_add_x_forwarded_for;

    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    //配置指令实现代理 把域名代理到集群（这个应用的名字上面）
    proxy_pass http://yuming;
    proxy_redirect off; //关闭
  }
}
```
进入 etc/nginx/ 找到 nginx.conf 这个配置文件查看以下两个配置是否打开

```
include /etc/nginx/conf.d/*.conf;  //加载conf.d下面的所有.conf文件
include /etc/nginx/sites-enabled/*
```

我们可以通过 sudo nginx -t 查看我们写的配置文件是否正确

重启nginx sudo nginx -s reload

在浏览器中会显示我们的nginx服务器版本信息 如果不想显示 进入etc/nginx/nginx.conf 将
```server_tokens off``` 注释打开
