# redis安装

## 单机版

## Redis集群

## Mac系统安装redis

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

## Redis集群



### Redis常用配置

```shell
daemonize yes # 是否是守护进程(no|yes)
port 6380 # Redis对外端口号
dir "/usr/src/redis/data" # 常用工作目录
logfile "6380.log" # Redis系统日志
dbfilename "dump-7000.rdb" # rdb文件
cluster-enabled yes # 集群模式
cluster-config-file nodes-6380.conf # 集群本地配置文件
cluster-require-full-coverange no # 整个集群节点全部在线才提供服务（进行关闭）
```