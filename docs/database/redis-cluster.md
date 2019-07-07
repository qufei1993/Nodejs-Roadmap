# Redis Cluster

对于大数据高并发应用场景，不论是 QPS 还是对内存、CPU 的使用率，单机已经不能满足需求了，这时候我们需要多个 Redis 实例来应对，在 Redis3.0 之后官方推出了 Redis Cluster 功能，将众多的 Redis 实例进行整合分布于各机器上，实现了高并发场景下的读写操作。

## Redis集群的数据分区

Redis 集群采用的虚拟哈希槽方式，共有 16384 个哈希槽，每个节点会划分一部分的槽位，当 Redis 集群客户端查询某个 Key 的信息时，首先会计算这个 Key 的 hash 值（CRC16 算法），通过对 16384 取余得到槽位，从而得到对应的信息。

假设我们现在拥有 3 个节点的集群，节点和槽位对应情况如下所示：

```
节点 A 哈希槽范围为 0 to 5500.
节点 B 哈希槽范围为 5501 to 11000.
节点 C 哈希槽范围为 11001 to 16383.
```

## Redis集群配置参数

介绍一些 Redis Cluster 在 redis.conf 中的一些配置参数

```conf
cluster-enabled <yes/no> # 开启集群模式
cluster-config-file <filename> # 集群节点的配置文件
cluster-node-timeout <milliseconds> # 集群节点不可用的最长时间
cluster-require-full-coverage <yes/no> # 默认设置为 yes 集群只要有一个节点不可用 整个集群将停止写入，通常设置为 no
```
