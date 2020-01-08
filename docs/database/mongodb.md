# MongoDB

## MongoDB 安装

[https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community) 这是 MongoDB 的下载中心，选择需要下载的版本和操作系统。注意，MongoDB 的稳定版本都是偶数的。

### Mac 系统下安装

Mac 系统可通过 Homebrew 安装 MongoDB 还是相对较简单的

```
$ brew update # 更新 Homebrew 数据包
$ brew install mongodb # 安装 MongoDB
```

### Linux 系统安装

```
$ wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1604-4.2.2.tgz 
$ tar -xvf mongodb-linux-x86_64-ubuntu1604-4.2.2.tgz
$ mv mongodb-linux-x86_64-ubuntu1604-4.2.2 mongodb-4.2.2
$ export PATH=$PATH:/data/soft/mongodb-4.2.2/bin
```

### 安装校验

查看 MongoDB 版本，校验是否安装成功，出现以下信息则安装成功

```
$ mongo --version
MongoDB shell version v4.2.2
```

## 开启 MongoDB 实例

**启动 MongoDB**

通过 ```--dbpath``` 参数自定义目录路径，若省略 ```--dbpath``` 参数，将会使用系统默认的数据目录 (```/data/db```) 

```
$ mongod --dbpath <自定义的目录路径>
```

**检查是否成功启动**

> 出现以下信息链接成功，默认端口为 27017

```r
2018-01-28T21:20:50.190+0800 I CONTROL  [initandlisten] MongoDB starting : pid=10488 port=27017 dbpath=/Users/may/documents/mongodb/data 64-bit host=XXXX.local
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] db version v3.6.22018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] git version: 489d177dbd0f0420a8ca04d39fd78d0a2c539420
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
2018-01-28T21:20:50.979+0800 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/Users/may/documents/mongodb/data/diagnostic.data'
2018-01-28T21:20:50.980+0800 I NETWORK  [initandlisten] waiting for connections on port 27017
```

**打开 mongodb 客户端**

打开本地控制台输入命令 mongo 连接到 mongodb 服务器

```
$ mongo
```

看到以下信息链接成功，会显示 mongodb 的版本号、链接地址，默认端口号为 27017

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

**展示所有数据库**

```r
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

**查看当前所连接的数据库**

```r
> db
test
```

**查看当前数据库下的所有集合(数据表)**

```r
> show collections
demo_admin
```

**切换/创建数据库**

切换数据库，使用use之前我们不需要对数据库进行额外的创建，在mongo中会在需要的时候自己创建。

```
> use demo
switched to db demo
```

## MongoDB Nodejs 客户端驱动

官方提供的 Node.js 客户端驱动支持 Callback 和 Promise 两种方式与 MongoDB 交互，API 文档参考 [https://mongodb.github.io/node-mongodb-native/](https://mongodb.github.io/node-mongodb-native/)

### 安装驱动程序依赖

下载 MongoDB 驱动程序，并将在 package.json 文件里添加一个依赖

```
npm install mongodb --save
```

### 初始化 MongoDB 链接

```js
const MongoClient = require('mongodb').MongoClient;
const mongodbUrl = "mongodb://localhost:27017/demo";
const DB = {};
const userCollName = 'user'; //指定集合名

//封装初始化数据库方法
const init = () => {
    if(DB.db){
        return Promise.reject('mongodb has already initialized');
    }

    return MongoClient.connect(mongodbUrl)
        .then(db => {
            DB.db  = db;
            DB.userColl = db.collection(userCollName);

            //退出关闭mongodb数据库连接
            process.on('exit', () => db.close());

            console.log('mongodb initialized');
        });
}
```

### 问题汇总

1. **db.collection is not a function**

是因为 mongodb 版本是 3.0 以上版本，将 mongodb 客户端驱动版本指定安装为 2.2.34 即可解决，npm 安装 

```
npm install mongodb@^2.2.34 --save
```
