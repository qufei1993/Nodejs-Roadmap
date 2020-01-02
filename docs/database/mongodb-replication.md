# MongoDB 复制集

MongoDB 的复制集是从传统的 Master-Slave 架构演变而来，由一组相同数据集的 Mongod 实例构成，这一组 Mongod 实例分为 1 个 Primary（主）节点和多个 Secondary（副）节点构成，与传统主从模式不同的是，其还有故障自动转移过程，一旦集群内主节点发生故障，内部会进行选举将其中一个从节点晋升为主节点，例如，Redis 中主从模式需要借助 Sentinel 功能实现自动切换。

![包含 1 个 Primary 节点和 2 个 Secondary 节点的复制集](https://docs.mongodb.com/manual/_images/replica-set-read-write-operations-primary.bakedsvg.svg)

## 复制集成员组成

复制集成员包含数据节点与投票节点

## MongoDB 复制集的最大节点数为多少？为什么有次限制？

每个节点会向其它节点发送心跳请求，间隔时间为每 2 秒请求 1 次，默认 10 秒为超时，就认为此节点为不健康的，可能出现了故障，当复制集中节点增加时心跳请求的数量将会以平方级的数量增加，单单是心跳请求对资源的占用也很大，因此在 MongoDB 中复制集的限制为最大 50 个。

## MongoDB 复制集原则

* 大多数原则：复制集中的健康节点大于集群节点的 1/2 时，集群才可正常选举，否则集群将不可写，只能读。例如，复制集中 3 个节点，两个从节点因为异常挂掉了，那么集群检测之后主节点也将会降级为从节点，只接受读，不再接受写入。

## MongoDB 主从与 MySql 主从的区别？

**1. 从节点读写模式**

MySql 中将主从同步的从库设置为只读状态，即 set global read_only=1 只能限制普通用户进行写的操作，但限制不了 super 权限用户（例如 root）对数据进行修改操作（容易造成主键冲突）。

MongoDB 中只有主节点才可进行写操作，从节点是决不允许的。对数据的一致性有着更高的保证。

**2. 主节点唯一性**

MongoDB 中主节点是唯一的，其余均为从节点，另外主节点不是唯一的，集群内部有其容灾机制。

MySql 提供了双主架构方案，MasterA 和 MasterB，Master A 可以做为 Master B 的主库，而 MasterB 可以做为 MasterA 的主库，两者互为主从。

## MongoDB 一主多从复制集搭建

### 环境准备

机器              |  模式  | 节点 | 安装目录
:----------------|:------|:-------|:---
 192.168.6.131    | Master | 27017 | /data/soft/mongodb-4.2.2
 192.168.6.131    | Slave1 | 27018 | /data/soft/mongodb-4.2.2
 192.168.6.131    | Slave2 | 27019 | /data/soft/mongodb-4.2.2

### MongoDB 安装



### 配置文件编写

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

### 启动 mongod 实例

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
$ mongod -f /data/soft/mongodb-4.2.2/conf/27018.conf
$ mongod -f /data/soft/mongodb-4.2.2/conf/27019.conf
```

**排错**

```
$ mongod -f /data/soft/mongodb-4.2.2/conf/27017.conf
about to fork child process, waiting until server is ready for connections.
forked process: 7435
ERROR: child process failed, exited with error number 1
To see additional information in this output, start without the "--fork" option.
```

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