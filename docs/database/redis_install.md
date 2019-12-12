#  Redis 安装

Redis 支持 Mac 或者 Linux 系统上安装，对于 Windows 的同学，可以安装一个虚拟机进行学习。

**下载和编译**

```bash
$ wget http://download.redis.io/releases/redis-5.0.5.tar.gz # 下载 
$ tar xzf redis-5.0.5.tar.gz # 解压
$ # ln -s redis-5.0.5 redis
$ cd redis-5.0.5 # 执行了上面一步 此处 cd redis
$ make
```

**启动redis**

安装好后，在当前目录下有个src目录，控制台输入redis-server，启动redis

```bash
$ src/redis-server
$ src/redis-server --port 6380 # 指定端口号启动
```

看到以下界面，启动成功

![图片](img/redis_start.png)

**打开redis客户端**

```javascript
src/redis-cli -p 6380

//指定服务器地址和端口
src/redis-cli -h localhost -p 6380
```

**常用配置**

查看所有配置 ```config get *```，以下列举一些常用配置信息：

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
