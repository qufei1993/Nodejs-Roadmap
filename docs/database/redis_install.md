# redis安装

## 单机版

## Redis集群

# Mac系统安装redis

### 下载 

```r
wget http://download.redis.io/releases/redis-4.0.8.tar.gz
```
### 解压文件

```r
tar xzf redis-4.0.8.tar.gz
```

### 进入文件目录 cd redis-4.0.8 执行make命令

```r
cd redis-4.0.8
make
```

### 启动redis

安装好后，在当前目录下有个src目录，控制台输入redis-server，启动redis

```javascript
src/redis-server

//指定端口号启动
src/redis-server --port 6380
```

看到以下界面，启动成功

![图片](img/redis_start.png)

### 打开redis客户端

```javascript
src/redis-cli -p 6380

//指定服务器地址和端口
src/redis-cli -h localhost -p 6380
```

### Redis常用配置

* daemonize：是否是守护进程(no|yes)
* port：Redis对外端口号
* logfile：Redis系统日志
* dir：常用工作目录