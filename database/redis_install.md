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

```r
src/redis-server
```

看到以下界面，启动成功

![图片](img/redis_start.png)