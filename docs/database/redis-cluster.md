# Redis Cluster

对于大数据高并发应用场景，不论是 QPS 还是对内存、CPU 的使用率，单机已经不能满足需求了，这时候我们需要多个 Redis 实例来应对，在 Redis3.0 之后官方推出了 Redis Cluster 功能，将众多的 Redis 实例进行整合分布于各机器上，实现了高并发场景下的读写操作。

## Redis Cluster 特性

* 高可用
* 主从复置
* 分片

## Redis Cluster 数据分区

Redis 集群采用的虚拟哈希槽方式，共有 16384 个哈希槽，每个节点会划分一部分的槽位，当 Redis 集群客户端查询某个 Key 的信息时，首先会计算这个 Key 的 hash 值（CRC16 算法），通过对 16384 取余得到槽位，从而得到对应的信息。

假设我们现在拥有 3 个节点的集群，节点和槽位对应情况如下所示：

```
节点 A 哈希槽范围为 0 to 5500.
节点 B 哈希槽范围为 5501 to 11000.
节点 C 哈希槽范围为 11001 to 16383.
```

## Redis Cluster 配置参数

介绍一些 Redis Cluster 在 redis.conf 中的一些配置参数

```conf
cluster-enabled <yes/no> # 开启集群模式
cluster-config-file <filename> # 集群节点的配置文件
cluster-node-timeout <milliseconds> # 集群节点不可用的最长时间
cluster-require-full-coverage <yes/no> # 默认设置为 yes 集群只要有一个节点不可用 整个集群将停止写入，通常设置为 no
```

## 三主三从集群实践

### 环境准备

Redis 安装目录 /data/soft/redis-5.0.5/

机器              |  模式  | 节点 | 配置文件 | 所属主节点
:----------------|:------|:-------|:---|--
 192.168.6.128    | Master1 | 7000 | redis-7000.conf | 
 192.168.6.129    | Master2 | 7000 | redis-7000.conf | 
 192.168.6.130    | Master3 | 7000 | redis-7000.conf |
 192.168.6.128    | Slave1 | 7001 | redis-7001.conf | Master3
 192.168.6.129    | Slave2 | 7001 | redis-7001.conf | Master1
 192.168.6.130    | Slave3 | 7001 | redis-7001.conf | Master2

### 节点配置

**192.168.6.128 redis-7000.conf**

```bash
$ cat redis.conf | grep -v "#" | grep -v "^$" > redis-7000.conf
```

```conf
bind 192.168.6.128
port 7000
daemonize yes # 开启守护进程
pidfile /var/run/redis_7000.pid
logfile "7000.log"
dbfilename dump-7000.rdb
dir /data/soft/redis-5.0.5/data/
replica-read-only yes # 默认从节点仅是只读模式
cluster-enabled yes # 开启集群模式
cluster-config-file nodes-7000.conf # 集群节点的配置文件
cluster-require-full-coverage no # 默认设置为 yes 集群只要有一个节点不可用 整个集群将停止写入，通常设置为 no
```

**192.168.6.128 redis-7001.conf**

```
$ sed 's/7000/7001/g' redis-7000.conf > redis-7001.conf
```

在余下的 192.168.6.129、192.168.6.130 两台服务器按照上面的方式进行相应配置，注意 bind 地址要修改，也可以将 192.168.6.128 上的 redis-7000.conf 传至其余两台修改即可

```sh
$ scp redis-7000.conf root@192.168.6.129:/data/soft/redis-5.0.5
$ scp redis-7000.conf root@192.168.6.130:/data/soft/redis-5.0.5
```

### 节点 meet（握手）

**启动 Redis Server**

分别在三台服务器上执行以下操作开启 Redis Server

```sh
$ src/redis-server redis-7000.conf
$ src/redis-server redis-7001.conf
```

**节点 meet**

```
$ src/redis-cli -h 192.168.6.128 -p 7001 cluster meet 192.168.6.129 7000
$ src/redis-cli -h 192.168.6.128 -p 7001 cluster meet 192.168.6.129 7001
$ src/redis-cli -h 192.168.6.128 -p 7001 cluster meet 192.168.6.130 7001
$ src/redis-cli -h 192.168.6.128 -p 7001 cluster meet 192.168.6.130 7001
```