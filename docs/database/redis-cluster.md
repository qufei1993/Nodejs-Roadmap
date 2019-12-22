# Redis Cluster

对于大数据高并发应用场景，不论是 QPS 还是对内存、CPU 的使用率，单机已经不能满足需求了，这时候我们需要多个 Redis 实例来应对，在 Redis 3.0 之后官方推出了 Redis Cluster 功能，将众多的 Redis 实例进行整合分布于各机器上，实现了高并发场景下的读写操作。

## Redis Cluster 你需要掌握什么？

* Redis Cluster 的哈希槽是什么？如何进行数据划分？
* 什么情况下会导致整个 Redis Cluster 不可用？

## Redis Cluster 特性

* 高可用
* 主从复制
* 分片

## 三主三从集群实践

要让集群正常运作至少需要三个主节点，不过在刚开始试用集群功能时， 强烈建议使用六个节点： 其中三个为主节点， 而其余三个则是各个主节点的从节点。

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

### Redis Cluster 配置参数

介绍一些 Redis Cluster 在 redis.conf 中的一些配置参数

```conf
cluster-enabled <yes/no> # 开启集群模式
cluster-config-file <filename> # 集群节点的配置文件，该配置文件内容无需认为修改，它由 Redis 集群在启动时创建，并在有需要时自动进行更新
cluster-node-timeout <milliseconds> # 集群节点不可用的最长时间
cluster-require-full-coverage <yes/no> # 默认设置为 yes 集群只要有一个节点不可用 整个集群将停止写入，通常设置为 no
```

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

**剩余节点**

在余下的 192.168.6.129、192.168.6.130 两台服务器按照上面的方式进行相应配置，注意 bind 地址要修改，也可以将 192.168.6.128（192.168.6.128 为当前虚拟机的内网 IP 通过 ifconfig 查看）上的 redis-7000.conf 传至其余两台修改即可

```sh
$ scp redis-7000.conf root@192.168.6.129:/data/soft/redis-5.0.5
$ scp redis-7000.conf root@192.168.6.130:/data/soft/redis-5.0.5
```

### 启动 Redis Server

分别在三台服务器上执行以下操作开启 Redis Server

```sh
$ src/redis-server redis-7000.conf
$ src/redis-server redis-7001.conf
```

## 原生方式搭建 Redis Cluster

Redis 官方提供了 redis-trib 命令行工具，可实现集群的快速创建，本节通过原生的方式搭建，目的是为了能够对 Redis Cluster 搭建有个更深层次的认知，例如节点 meet、主从复制、槽分配这些都需要我们一步一步去做，但是如果使用 redis-trib 提供的 create --replicas 则可以一步就完成，对于新手学习来说虽省略了很多步骤，但是同时理解可能就没有这么深刻了。另外，生产环境不建议原生方式来做，如果是学习还是提倡的。

### 节点 meet（握手）

任意一台虚拟机上执行如下操作：

```
$ src/redis-cli -h 192.168.6.128 -p 7000 cluster meet 192.168.6.128 7001
$ src/redis-cli -h 192.168.6.128 -p 7000 cluster meet 192.168.6.129 7000
$ src/redis-cli -h 192.168.6.128 -p 7000 cluster meet 192.168.6.129 7001
$ src/redis-cli -h 192.168.6.128 -p 7000 cluster meet 192.168.6.130 7000
$ src/redis-cli -h 192.168.6.128 -p 7000 cluster meet 192.168.6.130 7001
```

完成上述操作之后，任意一台虚拟机上执行如下 cluster info 命令，将会看到一个 cluster_known_nodes 字段为 6，这就说明当前集群已经 meet 成功，可以互通了，且存在 6 个节点。

```
$ src/redis-cli -h 192.168.6.128 -p 7000 cluster info
cluster_state:fail
cluster_slots_assigned:0
cluster_slots_ok:0
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
```

### 主从分配

Redis Cluster 的主从复制是为了保证在部分节点失败或无法通信时，整个集群仍可用，因此建议主节点要有至少 1 个从节点，假设集群中的一个主节点挂掉，集群会选举其从节点晋升为主节点，假设集群中的一个主节点失败了其从节点也没正常完成晋升，就会导致整个集群因为找不到槽而不可用。

**查找节点 ID**

通过 cluster replicate 查找节点 ID，例如第一行的 479df3e13771edf0f314957c318bfd06a6df0e94 就为 192.168.6.130:7001 节点的 ID

```
$ src/redis-cli -h 192.168.6.128 -p 7001 cluster nodes
479df3e13771edf0f314957c318bfd06a6df0e94 192.168.6.130:7001@17001 master - 0 1576307652314 5 connected
f7b0bbf589c847cb2ae58977d1e0023c25ed0132 192.168.6.130:7000@17000 master - 0 1576307651299 0 connected
c59fb0d79c4c98d032e8215b3e5ba8faa5edaa2a 192.168.6.128:7001@17001 myself,master - 0 1576307648000 4 connected
34982b0f6267dd2a431242f3247698766b0e1ff0 192.168.6.129:7000@17000 master - 0 1576307649000 2 connected
90579b8cbddcf89015fe9daa1f676193cb0e3fa9 192.168.6.128:7000@17000 master - 0 1576307650284 1 connected
960b935901f8c4b2805c5a4771955c6ca207f5f2 192.168.6.129:7001@17001 master - 0 1576307649272 3 connected
```

**cluster replicate 分配主从**

src/redis-cli 从节点信息 cluster replicate 主节点 ID

```
$ src/redis-cli -h 192.168.6.128 -p 7001 cluster replicate f7b0bbf589c847cb2ae58977d1e0023c25ed0132
$ src/redis-cli -h 192.168.6.129 -p 7001 cluster replicate 90579b8cbddcf89015fe9daa1f676193cb0e3fa9
$ src/redis-cli -h 192.168.6.130 -p 7001 cluster replicate 34982b0f6267dd2a431242f3247698766b0e1ff0
```

### Redis Cluster 数据分区

Redis 集群中存在多个 Master 节点，如何保证多个 Master 节点之间能够均衡的保存数据呢？

Redis Cluster 采用 Hash Slot 算法实现数据划分，其固定为 16384 个槽，每个节点负责其中一部分槽，例如，我们有三个 Master 节点那么平均每个节点所占有的槽位为 16384/3 个（**槽只应用于主节点**）。

假设我们现在拥有 3 个主节点的集群，节点和槽位对应情况如下所示：

```
节点 A 哈希槽范围为 0 to 5500.
节点 B 哈希槽范围为 5501 to 11000.
节点 C 哈希槽范围为 11001 to 16383.
```

那么客户端链接集群时，通过 “槽位定位算法” 可找到该 Key 对应的目标节点。

**槽位定位算法**

由于 Redis 集群采用的虚拟哈希槽方式，共有 16384 个哈希槽，每个节点会划分一部分的槽位，当 Redis 集群客户端查询某个 Key 的信息时，首先会计算这个 Key 的 hash 值（CRC16 算法），通过对 16384 取余得到槽位，从而得到对应的信息。

```js
HASH_SLOT = crc16(key) % 16384
```

**槽位划分**

|  模式  | 槽位 |  节点信息
|:------|:-------|:----|
| Master1 | 0 ~ 5461 | 192.168.6.128:7000
| Master2 | 5462 ~ 10922 | 192.168.6.129:7000
| Master3 | 10923 ~ 16383 | 192.168.6.130:7000

**分配槽脚本**

原生安装就是相对麻烦，例如槽位分配是需要一个一个进行的，所以这里定义一个 shell 脚本，遍历节点进行分配。

```sh
# addslots.sh
start=$1 # 定义执行 shell 传递的第 1 个参数
end=$2 # 定义执行 shell 传递的第 2 个参数
h=$3 # 定义执行 shell 传递的第 3 个参数
p=$4 # 定义执行 shell 传递的第 4 个参数

# for 循环，此处 slot 为变量
for slot in `seq ${start} ${end}`
do
    # 打印
    echo "cluster addslots ${slot}"

    # 执行 redis 命令，分配槽位
    redis-cli -h ${h} -p ${p} cluster addslots ${slot}
done
```

**执行槽位分配**

执行以下命令分别对 3 个 Master 节点分配槽位

```
$ sh addslots.sh 0 5461 192.168.6.128 7000
$ sh addslots.sh 5462 10922 192.168.6.129 7000
$ sh addslots.sh 10923 16383 192.168.6.130 7000
```

**集群验证**

看到以下结果，代表集群已经安装成功

```sh
$ redis-cli -h 192.168.6.130 -p 7000 cluster info
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
```

## Cluster Node.js 客户端基本使用

ioredis 客户端支持 Cluster 模式，使用之前需要预先安装该包。

```
npm i ioredis -S
```

以下是一个简单的使用，参考 [github.com/luin/ioredis#cluster](https://github.com/luin/ioredis#cluster)

```js
const Redis = require("ioredis");
const cluster = new Redis.Cluster([
  { port: 7000, host: "192.168.6.128" },
  { port: 7000, host: "192.168.6.129" },
  { port: 7000, host: "192.168.6.130" },
  { port: 7001, host: "192.168.6.128" },
  { port: 7001, host: "192.168.6.129" },
  { port: 7001, host: "192.168.6.130" },
]);

cluster.set("ts", 'TypeScript');

cluster.get('ts', function(err, res) {
    console.log(res); // TypeScript
});

// 得到一个 key 对应的槽位
cluster.cluster("keyslot", 'ts', function(err, res) {
    console.log(res); // 2665
});
```

Redis Cluster 是去中心化的，new Redis.Cluster 构造 Redis 实例时可以只传一个节点地址，其它地址可以通过这个节点来发现，但是这个节点因为意外情况挂掉了，客户端就要重新更换地址实例化，还是建议传人多个节点，可以提高安全性。