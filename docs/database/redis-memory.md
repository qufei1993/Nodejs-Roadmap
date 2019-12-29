# Redis 内存管理


## Redis 内存使用分析

使用 info memory 命令可以查看内存相关信息

```sh
127.0.0.1:6379> info memory
# Memory
used_memory:853448 # Redis 分配器分配的内存总量（单位：字节）
used_memory_human:833.45K # 以可读格式返回，可能是 K、M、G 等
used_memory_rss:5509120 # Redis 进程占用操作系统总的物理内存（单位：字节）
used_memory_rss_human:5.25M
used_memory_peak:854400 # 内存分配器分配的最大内存历史峰值
used_memory_peak_human:834.38K
used_memory_peak_perc:99.89%
used_memory_overhead:842254
used_memory_startup:792456
used_memory_dataset:11194
used_memory_dataset_perc:18.35%
allocator_allocated:1391856
allocator_active:1691648
allocator_resident:8421376
total_system_memory:1021444096
total_system_memory_human:974.12M
used_memory_lua:37888 # Lua 引擎所消耗的内存
used_memory_lua_human:37.00K
used_memory_scripts:0
used_memory_scripts_human:0B
mem_fragmentation_ratio:6.78 # 内存碎片比率 = used_memory_rss / used_memory
mem_allocator:jemalloc-5.1.0 # Redis 所使用的内存分配器
```

## 内存消耗划分

* used_memory：自身内存、对象内存、缓冲内存、Lua 内存
* mem_fragmentation_ratio：内存碎片

### 自身内存

### 缓冲内存

缓冲内存包含客户端缓冲区内存、复制积压缓冲区、AOF 缓冲区。

* 客户端缓冲区：存储客户端链接的输入输出缓冲，例如客户端发送 GET、SET 等操作命令。
* 复制积压缓冲区：主要用于部分复制，避免全量复制。
* AOF 缓冲区：用于 AOF 重写时保存最近的写入命令。

### 对象内存

### 内存碎片

申请内存比使用内存多，可能会产生内存碎片

## 内存回收

Redis 的内存回收主要分为过期键删除和触发内存的 maxmemory 最大值之后进行内存溢出数据淘汰策略。

### Redis 过期键删除策略？

Redis 采用惰性删除、定时删除两种策略实现对过期 Key 进行内存回收。

#### 1. 惰性删除

当客户端操作带有设置过期键的 Key 时，如果 Key 已过期执行删除，返回空，另一种情况如果该 Key 一直没有访问就会造成无法及时删除，存在内存泄漏的风险，下面定时任务删除正是对 **惰性删除** 的补充。

#### 2. 定时删除

Redis 内部会维护一个定时任务检查、删除过期的键，默认情况下设置为每秒 10 次，通过配置文件中的 hz 参数控制。Redis 定时扫描不会遍历过期字典中的所有键，采用了一种贪心算法实现，其过程如下：

1. 过期字典中随机检查 20 个键
2. 20 个键中已过期的进行删除
3. 如果过期的键超过检查的 25%，回到上面的步骤 1 循环执行，直到过期的键不足检查的 25% 或者超过最大过期时间限制 25 毫秒。

**Redis 中如果所有的 Key 同一时间过期会发生什么？**

了解了 Redis 的定时删除策略，这个问题已经很明显了，此时 Redis 会持续的对过期字典扫描进行内存回收，如果这个时间持续了 25 毫秒，来自于客户端的命令将无法得到执行，只能等待内存回收完成或者超过 25 毫秒，才能执行完成响应，客户端也可能因此发生链接超时现象，并且期间发生的错误在 showlog 的慢查询记录中还无法查询到。

因此我们要避免业务中出现大量的 Key 在同一时间出现过期。

**查看定时任务 hz 配置**
```sh
$ cat redis.conf | grep -v "#" | grep -v "^$" | grep hz
hz 10
```

### Redis 内存溢出有哪几种数据淘汰策略？

当触发 Redis 内存的 maxmemory 最大设置之后会触发内存溢出数据淘汰策略，共支持 6 种策略，默认值为 maxmemory-policy noeviction，6 种策略如下所示：

1. noeviction：默认淘汰机制，不会删除任何数据，会拒绝所有的写入命令，读取是正常的
2. volatile-lru：使用 LRU 算法删除设置了 Expire 属性且最少使用的键，直到新添加的数据能够有空间可以存放，否则退回 noeviction 规则
3. allkeys-lru：使用 LRU 算法删除键，不论有没有设置 Expire 属性，直到新添加数据能够有空间存放
4. volatile-random：随机删除设置了 Expire 属性的键，直到腾出空间
5. allkeys-random：随机删除所有键，直到腾出空间
6. volatile-ttl：根据键值对象的 ttl 属性优先回收存活时间短的键，否则退回 noeviction 规则

如果你想使用 Redis 的持久化功能，就不要选择 allkeys-lru、allkeys-random 策略，因为它们会对所有的 Key 进行淘汰，不管你是否设置了过期时间。

### 查看 Maxmemory 相关配置

```sh
$ cat redis.conf | grep maxmemory 
# according to the eviction policy selected (see maxmemory-policy).
# WARNING: If you have slaves attached to an instance with maxmemory on,
# limit for maxmemory so that there is some free RAM on the system for slave
# maxmemory <bytes>
# MAXMEMORY POLICY: how Redis will select what to remove when maxmemory
# maxmemory-policy noeviction
```

## 实现一个 LRU 算法？

```
//todo:
```