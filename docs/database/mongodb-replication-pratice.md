# MongoDB 复制集 —— 实践篇

## 环境准备

机器              |  模式  | 节点 | 安装目录
:----------------|:------|:-------|:---
 192.168.6.131    | Master | 27017 | /data/soft/mongodb-4.2.2
 192.168.6.131    | Slave1 | 27018 | /data/soft/mongodb-4.2.2
 192.168.6.131    | Slave2 | 27019 | /data/soft/mongodb-4.2.2

## MongoDB 安装


## 配置文件编写

重点配置项介绍：

* logappend：以追加的方式来写入日志，否则是以复制的形式
* fork：启动守护进程
* oplogSize：单位（MB）默认占用机器 5% 可用磁盘空间，MongoDB 复制过程中，主节点将操作放于 oplog 中，从节点来复制这个 oplog
* replSet：复制集名称，这个很重要，一个复制集中的所有节点要保证都一样

**conf/27017.conf**

```conf
port=27017
bind_ip=192.168.6.131
logpath=/data/soft/mongodb-4.2.2/log/27017.log
dbpath=/data/soft/mongodb-4.2.2/data/db/27017/
logappend=true
pidfilepath=/data/soft/mongodb-4.2.2/data/pid/27017.pid
fork=true
oplogSize=1024
replSet=May
```

**conf/27018.conf**

通过 27017.conf 快速生成 27018.conf

```
$ sed 's/27017/27018/g' 27017.conf > 27018.conf
```

**conf/27019.conf**

```
$ sed 's/27017/27019/g' 27017.conf > 27019.conf
```

## 启动 mongod 实例

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
$ mongod -f /data/soft/mongodb-4.2.2/conf/27018.conf
$ mongod -f /data/soft/mongodb-4.2.2/conf/27019.conf
```

启动了其中一个实例，出错啦...

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
about to fork child process, waiting until server is ready for connections.
forked process: 7435
ERROR: child process failed, exited with error number 1
To see additional information in this output, start without the "--fork" option.
```

**排错**

排查问题将日志写入到一个可写的文件目录，查看原因

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf -logpath=/tmp/mongod.log

$  cat /tmp/mongod.log
2019-12-31T19:25:25.037-0800 I  CONTROL  [main] Automatically disabling TLS 1.0, to force-enable TLS 1.0 specify --sslDisabledProtocols 'none'
2019-12-31T19:25:25.083-0800 I  CONTROL  [main] ERROR: Cannot write pid file to /data/soft/mongodb-4.2.2/data/pid/27017.pid: No such file or directory
```

原来是目录 /data/soft/mongodb-4.2.2/ 不存在导致的，现在让我们创建它

```
$  mkdir -p /data/soft/mongodb-4.2.2/data/pid/
```

另外让我们检查配置文件中的其它几个文件目录是否创建

```
$ mkdir -p /data/soft/mongodb-4.2.2/data/db/27017/
$ mkdir -p /data/soft/mongodb-4.2.2/data/db/27018/
$ mkdir -p /data/soft/mongodb-4.2.2/data/db/27019/
$ mkdir -p /data/soft/mongodb-4.2.2/log/
```

再次启动，现在看来一切都正常了

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
about to fork child process, waiting until server is ready for connections.
forked process: 8055
child process started successfully, parent exiting
```

**查看 mongod 进程**

```
$ ps -ef | grep mongod
root       8127      1  4 19:59 ?        00:00:01 mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
root       8169      1  3 19:59 ?        00:00:00 mongod -f /data/soft/mongodb-4.2.2/conf/27018.conf
root       8207      1  4 19:59 ?        00:00:00 mongod -f /data/soft/mongodb-4.2.2/conf/27019.conf
```

## 初始化复制集

### 链接 Mongo

现在我们是一个全新的复制集，可以在安装 mongod 实例的任一台机器上执行 mongo 192.168.6.131:27017 命令，链接到 MongoDB shell。

```js

$ mongo 192.168.6.131:27017
MongoDB shell version v4.2.2
connecting to: mongodb://192.168.6.131:27017/test?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("6a025671-029b-450d-8ffa-f4fa3d16f068") }
MongoDB server version: 4.2.2
Welcome to the MongoDB shell.

......

> 
```

### 定义 config

[https://docs.mongodb.com/manual/administration/replica-set-member-configuration/](https://docs.mongodb.com/manual/administration/replica-set-member-configuration/)

* _id：复制集名称
* members：复制集成员
* members[]._id：服务器唯一 ID
* members[].host：服务器主机
* members[].arbiterOnly：仲裁节点
* members[].priority：复制集成员被选举为 Primary 节点的优先级，取值范围 [0, 100]
* members[].votes：votes = 0 | 1，参与 Primary 选举投票的成员节点
* members[].hidden：hidden = 0 | 1，隐藏节点
* members[].slaveDelay：= slaveDelay | s（秒），延迟节点

```sh
> config = {
    "_id": "May",
    "members": [
        {
            "_id": 0,
            "host": "192.168.6.131:27017"
        },
        {
            "_id": 1,
            "host": "192.168.6.131:27018"
        },
        {
            "_id": 2,
            "host": "192.168.6.131:27019"
        }
    ]
}
```

### 初始化

通过 mongo shell 的 rs.initiate() 命令进行初始化

```
> rs.initiate(config)
{
        "ok" : 1,
        "$clusterTime" : {
                "clusterTime" : Timestamp(1577951857, 1),
                "signature" : {
                        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
                        "keyId" : NumberLong(0)
                }
        },
        "operationTime" : Timestamp(1577951857, 1)
}
```

## 复制集增加节点

分别增加一个 Secondary 和 Arbiter（投票）节点

### 新增节点环境分配

机器              |  模式  | 节点 | 安装目录
:----------------|:------|:-------|:---
 192.168.6.131    | Slave3   | 27020 | /data/soft/mongodb-4.2.2
 192.168.6.131    | Arbiter1 | 27021 | /data/soft/mongodb-4.2.2

### 添加配置文件

**conf/27020.conf**

```
$ sed 's/27017/27020/g' 27017.conf > 27020.conf
```

**conf/27021.conf**

```
$ sed 's/27017/27021/g' 27017.conf > 27021.conf
```

## 启动新增节点 mongod 实例

在启动之前先检查相应的文件目录是否已创建

```
$ mkdir -p /data/soft/mongodb-4.2.2/data/db/27020/
$ mkdir -p /data/soft/mongodb-4.2.2/data/db/27021/
```

终端执行以下命令，进行启动

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27020.conf
$ mongod -f /data/soft/mongodb-4.2.2/conf/27021.conf
```

不要忘记检查下 mongod 实例是否已经启动成功

```
$ ps -ef | grep mongod
root       8127      1  0 Jan06 ?        00:15:57 mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
root       8169      1  0 Jan06 ?        00:16:09 mongod -f /data/soft/mongodb-4.2.2/conf/27018.conf
root       8207      1  0 Jan06 ?        00:15:57 mongod -f /data/soft/mongodb-4.2.2/conf/27019.conf
root      26037      1  0 00:19 ?        00:00:08 mongod -f /data/soft/mongodb-4.2.2/conf/27020.conf
root      26134      1  5 00:38 ?        00:00:01 mongod -f /data/soft/mongodb-4.2.2/conf/27021.conf
```

### 定义新增节点 config

在 Arbiter（投票）节点上，还要再设置 arbiterOnly=true

```sh
> config = rs.conf()
> config.members[3] = {
    "_id": 3,
    "host": "192.168.6.131:27020"
}

> config.members[4] = {
    "_id": 4,
    "host": "192.168.6.131:27021",
    "arbiterOnly": true
}
```

### 添加节点的两种方式

可以使用 rs.reconfig() 使配置重新加载生效，也可以使用 rs.add() 命令添加节点。

**方法一：**

```
rs.reconfig(config)
```

**方法二：**

推荐以下方式

```sh
# 增加从节点
> rs.add({
    "_id": 3,
    "host": "192.168.6.131:27020"
})

# 增加投票节点
> rs.add({
    "_id": 4,
    "host": "192.168.6.131:27021",
    "arbiterOnly": true
})

# 增加投票节点或者以下方式
> rs.addArb("192.168.6.131:27021")
```

## 复制集的一些其它命令操作

```sh
> rs.status() # 查看进群状态
> rs.conf() # 集群配置
> rs.stepDown() # 指定时间内将主节点降级为从节点，例如 rs.stepDown(10) 指定 10 秒内
> rs.reconfig() # 重新加载配置，有个缺点，会有一个短暂的离线时间，如果当时主节点正在写入，就可能会报错
> rs.freeze(secs) # 冻结节点，在指定时间内该节点不会被晋升为 Primary 节点，解冻直接 rs.freeze() 即可
> rs.remove(hostportstr) # 删除节点
> rs.slaveOk() # 允许在从节点上查询
```