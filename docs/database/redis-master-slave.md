# 主从复制

单机带来的问题：机器故障、容量限制、QPS瓶颈，主从复制提供了一种**一主多从**的模式提供了数据副本，解决了单机带来的机器故障问题，主从分离模式提高了 Redis 读的性能（读写分离）。也是高可用、分布式的基础。

## 什么是主从复制？

所谓主从复制就是一个 Redis 主节点拥有多个从节点，由主节点的数据单向的复制到从节点，在一些读多写少的业务场景是非常受用的。

## 实现方式

提供了两种模式命令和配置，采用配置模式，优势是便于管理但是每次更改之后需要重启，采用命令模式优势是无需重启伴随的缺点是不便于管理。两者也是可以结合使用的。

### 命令实现
- slaveof ip port：开启一个主从复制，ip为主节点ip地址，port为主节点端口号，例如在6380机器上开启一个主从复制：```slaveof 127.0.0.1 6379```
- slaveof no one：取消主从复制，取消之前的数据不会清除。如果取消之后在切换到新的主节点，新的主节点同步数据到从节点之前会把该从节点的**先前数据进行全部清楚**
- **注意**在新的版本中 slaveof 命令改为 replicaof

### 配置实现

```shell
slaveof ip port # 设置主节点的 ip
slave-read-only yes # 设置为只读模式
```

## 一主多从实践

在一台虚拟机上建立一个主节点和多个从节点进行实践，注意，这里只是做为一个简单的测试都放在一台机器上，在实际的工作中是不会都放在一台机器上的，假设当前机器出现故障会导致所有节点都不可用。

### 环境准备

机器              |  模式  | 节点 | 安装目录
:----------------|:------|:-------|:---
 192.168.6.128    | Master | 6379 | /data/soft/redis-5.0.5
 192.168.6.128    | Slave1 | 6380 | /data/soft/redis-5.0.5
 192.168.6.128    | Slave2 | 6381 | /data/soft/redis-5.0.5


### Redis安装

这里采用的为 Redis 最新版本 v5.0.5，下载安装于 /data/soft/ 目录下，关于如何安装参考另一篇文章 [Redis 安装]()。

### 节点配置

**执行以下命令，先复制出 3 个节点的配置文件**

```bash
$ cp redis.conf redis-6379.conf
$ cp redis.conf redis-6380.conf
$ cp redis.conf redis-6381.conf
```

**修改 redis-6379.conf 配置**

```conf
 bind 192.168.6.128
 port 6379
 daemonize yes # 开启守护进程
 pidfile /var/run/redis_6379.pid
 logfile "6379.log"
 # save 900 1
 # save 300 10
 # save 60 10000
 dbfilename dump-6379.rdb
 dir /data/soft/redis-5.0.5/data/
 replica-read-only yes # 默认从节点仅是只读模式
```

**修改 redis-6380.conf 配置**

不同于上面主节点的配置是需要设置 replicaof 属性

```conf
 bind 192.168.6.128
 port 6380
 daemonize yes # 开启守护进程
 pidfile /var/run/redis_6380.pid
 logfile "6380.log"
 # save 900 1
 # save 300 10
 # save 60 10000
 dbfilename dump-6380.rdb
 dir /data/soft/redis-5.0.5/data/
 replicaof 192.168.6.128 6379 # 之前版本为 slaveof 192.168.6.128 6379
```

**修改 redis-6381.conf 配置**

在 edis-6381.conf 配置里并没有设置 replicaof 属性，在启动时会介绍如何通过命令启动

```conf
 bind 192.168.6.128
 port 6381
 daemonize yes # 开启守护进程
 pidfile /var/run/redis_6381.pid
 logfile "6381.log"
 # save 900 1
 # save 300 10
 # save 60 10000
 dbfilename dump-6381.rdb
 dir /data/soft/redis-5.0.5/data/
 replicaof <masterip> <masterport> # 暂不修改为从节点
```

### 启动节点

**启动 Master**

```
$ src/redis-server redis-6379.conf
```

**启动 Slave1**

```
$ src/redis-server redis-6380.conf
```

**启动 Slave2**

与上面不同的是，采用命令的方式开启一个从节点

```bash
$ src/redis-server redis-6380.conf
$ src/redis-cli -h 192.168.6.128 -p 6381 replicaof 192.168.6.128 6379
```

### 查看节点

```bash
$ ps -ef | grep redis-server
root      20122      1  0 01:50 ?        00:00:03 src/redis-server 192.168.6.128:6379
root      20130      1  0 01:50 ?        00:00:02 src/redis-server 192.168.6.128:6380
qufei     20172      1  0 02:02 ?        00:00:00 src/redis-server 192.168.6.128:6381
qufei     20414  19405  0 02:27 pts/1    00:00:00 grep --color=auto redis-server
```

### 查看主从节点

链接上主节点客户端之后通过 ```info replication``` 命令查看，如下所示：

* role: 角色（Master/Slave）
* connected_slaves: 当前连接的从节点数量
* slave0、slave1： 展示了从节点的信息

```
$ redis-cli -h 192.168.6.128 -p 6379 info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.6.128,port=6380,state=online,offset=3150,lag=1
slave1:ip=192.168.6.128,port=6381,state=online,offset=0,lag=2
master_replid:6b11e8d93b219d1c612b3cbd26731d8da1c4a881
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:3150
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:3150
```