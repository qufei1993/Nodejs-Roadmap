### forever发布Nodejs项目
---
#### 部署要点：    
* 腾讯云ECS服务器  
* Nginx编译安装  
* node安装  
* mongodb安装  
* server部署  

#### Nginx安装
```sudo apt-get install nginx```
成功后 ```nginx -V``` 查看版本信息

#### Mongodb安装
```javascript
sudo apt-get install mongodb
```
#### 添加开机自动重启
```
sudo update-rc.d -f mongodb defaults
```
#### 启动
```
sudo /etc/init.d/mongodb start
```
#### node安装
从官网下载已经编译好的node  
```wget https://nodejs.org/dist/v4.6.0/node-v4.6.0-linux-x64.tar.xz```
#### 解压
```
tar -xvf node-v4.6.0-linux-x64.tar.xz
cd node-v4.6.0-linux-x64.tar.xz
```
#### 拷贝安装
```
sudo cp -r bin include lib share /usr/local/
```
#### node 命令测试
```
node -v
```
#### Server部署
* 创建目录  
```sudo mkdir -p /data/www/```
* 创建用户  
```sudo groupadd www```
* nginx也使用此用户运行  
```sudo useradd www -g www -d /data/www```
* /data目录权限  
```sudo chown www:www /data```
* 安装forever  
```sudo npm install -g forever```
* 在www加载项目  
此处为movies项目github地址：```https://github.com/Q-Angelo/Movies/tree/master```

* 启动服务
  ```cd /data/www/movies```
  * 安装依赖
```npm install```
  * forever 启动app
```forever start app.js```
