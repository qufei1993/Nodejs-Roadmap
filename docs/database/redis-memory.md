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

## 对象内存

### 内存碎片

申请内存比使用内存多，可能会产生内存碎片