# MongoDB 复制集 —— 理论篇

MongoDB 的复制集是从传统的 Master-Slave 架构演变而来，由一组相同数据集的 Mongod 实例构成，这一组 Mongod 实例分为 1 个 Primary（主）节点和多个 Secondary（副）节点构成，与传统主从模式不同的是，其还有故障自动转移过程，一旦集群内主节点发生故障，内部会进行选举将其中一个从节点晋升为主节点，例如，Redis 中主从模式需要借助 Sentinel 功能实现自动切换。

## 复制集成员组成

复制集成员包含主节点（Primary）、从节点（Secondaries）、仲裁节点（Arbiter）

### 1. Primary

Primary 是 MongoDB 复制集中**唯一一个具有数据写入能力的节点**，是其它从节点进行数据复制的源节点。默认情况下，客户端也会将读请求转发到 Primary 节点，但是也可以通过读写设置将读请求设置到从节点。

### 2. Secondaries

一个 Secondary 节点是做为 Primary 的数据集副本，在整个复制集中可以有一个或多个 secondaries，从节点通过复制主节点的 oplog 来保证数据的一致性。

例如，以下为包含 1 个 Primary 节点和 2 个 Secondary 节点的复制集

![包含 1 个 Primary 节点和 2 个 Secondary 节点的复制集](https://docs.mongodb.com/manual/_images/replica-set-read-write-operations-primary.bakedsvg.svg)

一个从节点的不同属性设置可以在复制集中起到不同的功能作用，以下进行讲解：

* **priority**：复制集成员被选举为 Primary 节点的优先级，取值范围 [0, 100] 默认值 1，其中 0 表示该成员不能设置为 Primary 节点。（注意：从节点可以为 0，主节点至少为 1）
* **votes**：参与 Primary 选举投票的成员节点，**最多为 7 个**，与 priority 不同，注意这里的 votes 属性与下面讲解的 Arbiter（仲裁节点）是有区别的。（设置：votes = 0 | 1）
* **hidden**：隐藏节点，对 Drive 不可见，不能被选为主，因为 isMaster() 将发现不了。（设置：hidden = 0 | 1）
* **slaveDelay**：延迟节点，延迟复制的节点，必须是 hidden 节点且 priority = 0，在机器充裕的情况下可以设置一个延迟节点做为数据备份。（设置：slaveDelay = s（秒））

### 3. Arbiter

Arbiter 为仲裁节点，该节点不保存数据、不对客户端提供服务，只参与选举，因此也称为投票节点。

为什么需要这样一个节点呢？假设我们一个复制集中有 4 个节点，其中两个节点发生故障，因为 MongoDB 在选举时遵循 **大多数原则** 造成投票数未超过 1/2 无法进行选举。

这种情况下如果有一个仲裁节点出现，则可以打破这种局面，另外仲裁节点本身不持有数据，仅参与投票，因此也不会占用太多资源。

### MongoDB 复制集的最大节点数为多少？为什么有此限制？

每个节点会向其它节点发送心跳请求，间隔时间为每 2 秒请求 1 次，默认 10 秒为超时，就认为此节点为不健康的，可能出现了故障，当复制集中节点增加时心跳请求的数量将会以平方级的数量增加，单单是心跳请求对资源的占用也很大，因此在 MongoDB 中复制集的限制为最大 50 个。

### MongoDB 选举大多数原则

复制集中的健康节点大于集群节点的 1/2 时，集群才可正常选举，否则集群将不可写，只能读。例如，复制集中 3 个节点，两个从节点因为异常挂掉了，那么集群检测之后主节点也将会降级为从节点，只接受读，不再接受写入。

## MongoDB 复制集工作原理

MongoDB 的客户端驱动，接收到 Write 命令之后，根据 isMaster() 命令判断将数据写入主库 oplog 中，从库复制主库的 oplog 维护到自己本机，进行应用。

因此，oplog 做为从节点的复制源在整个复制过程中起到了重要的作用，先对 oplog 进行了解

### 复制源 oplog 

**查看 oplog**

```sh
May:PRIMARY> use local # 在主节点位置进入 local 库

# oplog.rs 为 oplog 记录存放地方
# $natural：插入顺序，-1 倒序；1 正序
May:PRIMARY> db.oplog.rs.find().sort({ $natural: -1 }).limit(1).pretty()
{
        "ts" : Timestamp(1578300227, 1),
        "t" : NumberLong(7),
        "h" : NumberLong(0),
        "v" : 2,
        "op" : "n",
        "ns" : "",
        "wall" : ISODate("2020-01-06T08:43:47.757Z"),
        "o" : {
                "msg" : "periodic noop"
        }
}
```

**oplog 字段结构含义：**

* ts：时间戳
* h：唯一 ID
* v：oplog 版本
* op：操作命令类型（insert 简写 i；update 简写 u；delete 简写 d；db cmd 简写 c；null 简写 n）
* ns：命名空间：数据库名.集合名（dbName.dbCollection），因为此处操作命令为 null 所以为空
* o：操作对应的文档，更新时的字段和值
* o2：update 操作命令时的更新条件

### 同步机制

为了维护共享数据集的最新副本，复制集的 Secondary 节点会同步或复制其它节点的数据（从节点线程发起，通过监听主节点 oplog 表变化，把 oplog 新产生的条目拉取到从节点回放），MongoDB 数据同步分两种方式：**初始全量复制**、**增量复制**。

**MongoDB 复制集同步机制阅读推荐**

* [www.mongoing.com/archives/3076](http://www.mongoing.com/archives/3076)
* [www.mongoing.com/archives/5200](http://www.mongoing.com/archives/5200)
* [docs.mongodb.com/manual/core/replica-set-sync/](https://docs.mongodb.com/manual/core/replica-set-sync/)

## MongoDB 主从与 MySql 主从的区别？

**1. 从节点读写模式**

MySql 中将主从同步的从库设置为只读状态，即 set global read_only=1 只能限制普通用户进行写的操作，但限制不了 super 权限用户（例如 root）对数据进行修改操作（容易造成主键冲突）。

MongoDB 中只有主节点才可进行写操作，从节点是决不允许的。对数据的一致性有着更高的保证。

**2. 主节点唯一性**

MongoDB 中主节点是唯一的，其余均为从节点，另外主节点不是唯一的，集群内部有其容灾机制。

MySql 提供了双主架构方案，MasterA 和 MasterB，Master A 可以做为 Master B 的主库，而 MasterB 可以做为 MasterA 的主库，两者互为主从。

**3. 复制过程中是同步还是异步**

MySql 5.5 之后提供了半同步复制模式，是介于异步复制和全同步复制之间，主库在执行完客户端提交的事务后不是立刻返回给客户端，而是等待至少一个从库接收到并写到 relay log 中才返回给客户端。相对于异步复制，半同步复制提高了数据的安全性，同时它也造成了一定程度的延迟，这个延迟最少是一个 TCP/IP 往返的时间。所以，半同步复制最好在低延时的网络中使用。

参考：[www.cnblogs.com/ivictor/p/5735580.html](https://www.cnblogs.com/ivictor/p/5735580.html)

MongoDB 的同步模式是完全异步的。

