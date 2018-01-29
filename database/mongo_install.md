# Mac系统下安装MongoDB

### 使用Homebrew安装mongodb

### 更新Homebrew数据包

``` brew update ```

### 安装mongodb

``` brew install mongodb ```

### 启动mongodb

通过命令mongod，将会使用系统默认的数据目录(/data/db)  

``` mongod ```

也可以自己指定目录通过--dbpath来指向创建的目录  

``` mongod --dbpath <自定义的目录路径> ```

出现以下信息链接成功  

```r
2018-01-28T21:20:50.190+0800 I CONTROL  [initandlisten] MongoDB starting : pid=10488 port=27017 dbpath=/Users/qufei/documents/mongodb/data 64-bit host=BLM-XXXX-MBP.local
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] db version v3.6.2
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] git version: 489d177dbd0f0420a8ca04d39fd78d0a2c539420
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] OpenSSL version: OpenSSL 1.0.2n  7 Dec 2017
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] allocator: system
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] modules: none
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] build environment:
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten]     distarch: x86_64
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten]     target_arch: x86_64
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] options: { storage: { dbPath: "/Users/test/documents/mongodb/data" } }
2018-01-28T21:20:50.192+0800 I -        [initandlisten] Detected data files in /Users/qufei/documents/mongodb/data created by the 'wiredTiger' storage engine, so setting the active storage engine to 'wiredTiger'.
2018-01-28T21:20:50.193+0800 I STORAGE  [initandlisten] wiredtiger_open config: create,cache_size=3584M,session_max=20000,eviction=(threads_min=4,threads_max=4),config_base=false,statistics=(fast),log=(enabled=true,archive=true,path=journal,compressor=snappy),file_manager=(close_idle_time=100000),statistics_log=(wait=0),verbose=(recovery_progress),
2018-01-28T21:20:50.540+0800 I STORAGE  [initandlisten] WiredTiger message [1517145650:540642][10488:0x7fffd379a3c0], txn-recover: Main recovery loop: starting at 2/13056
2018-01-28T21:20:50.671+0800 I STORAGE  [initandlisten] WiredTiger message [1517145650:671750][10488:0x7fffd379a3c0], txn-recover: Recovering log 2 through 3
2018-01-28T21:20:50.766+0800 I STORAGE  [initandlisten] WiredTiger message [1517145650:766052][10488:0x7fffd379a3c0], txn-recover: Recovering log 3 through 3
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] 
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] 
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] ** WARNING: This server is bound to localhost.
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] **          Remote systems will be unable to connect to this server. 
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] **          Start the server with --bind_ip <address> to specify which IP 
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] **          addresses it should serve responses from, or with --bind_ip_all to
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] **          bind to all interfaces. If this behavior is desired, start the
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] **          server with --bind_ip 127.0.0.1 to disable this warning.
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] 
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] 
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
2018-01-28T21:20:50.979+0800 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/Users/qufei/documents/mongodb/data/diagnostic.data'
2018-01-28T21:20:50.980+0800 I NETWORK  [initandlisten] waiting for connections on port 27017
```

### 打开mongodb客户端

打开本地控制台 输入命令mongo 连接到mongodb服务器

``` mongo ```

看到以下信息链接成功，会显示mongodb的版本号、链接地址，默认端口号为27017
```r
MongoDB shell version v3.6.2
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.2
Server has startup warnings: 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] ** WARNING: This server is bound to localhost.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          Remote systems will be unable to connect to this server. 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          Start the server with --bind_ip <address> to specify which IP 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          addresses it should serve responses from, or with --bind_ip_all to
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          bind to all interfaces. If this behavior is desired, start the
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          server with --bind_ip 127.0.0.1 to disable this warning.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
```

### 显示所有数据库

``` > show dbs ```

```r
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

### 查看当前所连接的数据库

```r
> db
test
```

### 查看当前数据库下的所有集合(数据表)

```r
> show collections
demo_admin
```

### 切换/创建数据库

切换数据库，使用use之前我们不需要对数据库进行额外的创建，在mongo中会在需要的时候自己创建。

```r
> use demo
switched to db demo
```

### 插入数据

向demo_admin表中插入数据，mongo中使用json格式以键值对的方式插入数据，会自动创建一个_id 字段，在全局范围内不会重复

```r
db.demo_admin.insert({name: 'Jack'})
```

### 循环插入数据

```r
> for(i=0;i<10;i++)db.demo_admin.insert({x:i})
```

### 查找数据

* 查找所有

```r
> db.demo_admin.find()
{ "_id" : ObjectId("5a6e82586757472b44d72122"), "name" : "Jack" }
{ "_id" : ObjectId("5a6e83206757472b44d72123"), "x" : 0 }
{ "_id" : ObjectId("5a6e83206757472b44d72124"), "x" : 1 }
{ "_id" : ObjectId("5a6e83206757472b44d72125"), "x" : 2 }
{ "_id" : ObjectId("5a6e83206757472b44d72126"), "x" : 3 }
{ "_id" : ObjectId("5a6e83206757472b44d72127"), "x" : 4 }
{ "_id" : ObjectId("5a6e83206757472b44d72128"), "x" : 5 }
{ "_id" : ObjectId("5a6e83206757472b44d72129"), "x" : 6 }
{ "_id" : ObjectId("5a6e83206757472b44d7212a"), "x" : 7 }
{ "_id" : ObjectId("5a6e83206757472b44d7212b"), "x" : 8 }
{ "_id" : ObjectId("5a6e83206757472b44d7212c"), "x" : 9 }
```

* 指定条件查找

```r
> db.demo_admin.find({x: 0})
{ "_id" : ObjectId("5a6e83206757472b44d72123"), "x" : 0 }
```

* 按条件或查找

```r
> db.demo_admin.find({'$or': [{x: 1}, {name: 'jack'}]})
{ "_id" : ObjectId("5a6e83206757472b44d72124"), "x" : 1 }
```

* 使用count数据统计

```r
> db.demo_admin.find().count()
11
```

* 其他查找方法

skip(3) 表示过滤掉前3条  
limit(2) 显示2条结果  
sort({x:1}) 使用x:1递增排序ASC，-1时递减排序DESC  

```r
> db.demo_admin.find().skip(3).limit(2).sort({x:1});
{ "_id" : ObjectId("5a6e83206757472b44d72125"), "x" : 2 }
{ "_id" : ObjectId("5a6e83206757472b44d72126"), "x" : 3 }
```

### 更新update

``` db.conllections.update(a,b,c,d); ```

* a代表修改条件

* b代表的是新的数据内容

将x=1的更新为x=111

```r
> db.demo_admin.update({"x":1},{"x":111}) 
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```

* c 值，bool，作用是如果这条数据中没有我们修改的这么一条原始数据，是否插入数据库 默认false,表示不插入

```r
> db.demo_admin.update({"y":999},{"y":9999},true)
WriteResult({
	"nMatched" : 0,
	"nUpserted" : 1,
	"nModified" : 0,
	"_id" : ObjectId("5a6e85a36c2de84d2e5a69d6")
})
```

如果设置为c第三个参数设置为false，则不会插入数据，看WriteResult返回结果遇上面不同

```r
> db.demo_admin.update({"y":999},{"y":9999888}, false)
WriteResult({ "nMatched" : 0, "nUpserted" : 0, "nModified" : 0 })
```

* d作用是同样条件的数据，只修改一条还是修改所有 默认false

```r
db.demo_admin.update({"a":2},{$set:{"a":222}},false,true);
db.demo_admin.update({"x":100},{$set:{"y":99}})
```

### 删除

* remove删除一条数据

```r
> db.demo_admin.remove({a:222})
WriteResult({ "nRemoved" : 1 })
```

* drop删除一张表

返回true删除成功, false删除失败

```r
db.demo_admin.drop()
true
```
