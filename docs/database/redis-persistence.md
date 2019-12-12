# Redis 数据持久化

Redis 数据存储都是在内存里，对数据的更新异步的存储在磁盘里。我们都知道对于内存中的数据如果没有持久化备份，一旦断电将会是一场灾难，在 Redis 中的数据持久化实现有两种策略：RDB 快照、AOF 日志。

## RDB

RDB 是 Redis 持久化的一种方式，把当前内存中的数据集快照写入磁盘。恢复时将快照文件直接读到内存里。

### 触发机制

RDB 提供了两种触发机制：save 和 bgsave 生成快照。

**save**：使用 save 会造成客户端阻塞，它使用一种同步的方式生成 RDB 快照文件，因为 Redis 是单线程的，如果 save 过程很长也就会阻塞其它客户端的命令，在生产中是不建议使用的。

**bgsave**：使用 bgsave Redis 会 fork 一个子进程来负责生成 RDB 文件，由于 bgsave 是异步进行的并不会阻塞其它客户端命令。bgsave 模式下阻塞阶段发生在 fork 过程中。

### 持久化配置

以下为 Redis RDB 相关的核心配置，其中 stop-writes-on-bgsave-error 这个配置很重要，意思为如果子进程（也就是备份的进程）在后台生成快照时失败，主进程会停止新的写入操作，也是为了保证数据一致性。

```sh
# 持久化默认时间策略
save 900 1 # 每 900 秒后数据发生 1 次改变
save 300 10 # 每 300 秒后数据发生 10 次改变
save 60 10000 # 每 60 秒数据发生 1000 次改变

# RBD 文件名称，建议 dump-6379.rdb
dbfilename dump.rdb

# 工作目录（上面 dump-6379.rdb 文件保存目录）
dir /data/soft/redis-5.0.5/data/

# 备份进程出错，主进程停止写入
stop-writes-on-bgsave-error yes

# 是否压缩
rdbcompression yes

# 导入时是否检查
rdbchecksum yes
```

默认是开启快照保存功能，如果想要禁用可以注释掉所有的 save 相关配置或者最后一条加上如下命令

```sh
save ""
```

### RDB 实践

执行以下命令复制一份 redis 配置文件，按照上面 “持久化配置” 中的内容进行相应更改

```sh
$ cat redis.conf | grep -v "#" | grep -v "^$" > redis-6379.conf # 去掉了注释和空格
```

**开启 Redis server**

```sh
$ src/redis-server redis-6379.conf
```

**开启 Redis cli 执行 save 命令**

```sh
127.0.0.1:6379> save
OK

# 执行以上命令之后 redis server 端会有以下日志输出

47191:M 09 Dec 2019 19:02:31.787 * DB saved on disk
```

**开启 Redis cli 执行 bgsave 命令**

```sh
127.0.0.1:6379> bgsave
OK

# 执行以上命令之后 redis server 端会有以下日志输出，48232 为新 fork 的子进程 ID

47191:M 09 Dec 2019 18:57:17.293 * Background saving started by pid 48232
48232:C 09 Dec 2019 18:57:17.294 * DB saved on disk
48232:C 09 Dec 2019 18:57:17.297 * RDB: 0 MB of memory used by copy-on-write
47191:M 09 Dec 2019 18:57:17.347 * Background saving terminated with success
```

**触发自动保存机制**

如果是用来测试可以修改持久化保存策略，例如 60 秒内产生超过 2 次的更改就自动触发 save 操作

```sh
save 60 2 # 每 60 秒后数据发生 2 次改变
```

执行三次 set 操作

```sh
127.0.0.1:6379> set a 1
OK
127.0.0.1:6379> set b 2
OK
127.0.0.1:6379> set c 3
OK
```

以下日志输出 3 changes in 60 seconds. Saving...，说明此时已经触发了自动保存机制，可以看到自动保存也还是用的 bgsave

```sh
66906:M 09 Dec 2019 19:33:10.722 * 3 changes in 60 seconds. Saving...
66906:M 09 Dec 2019 19:33:10.723 * Background saving started by pid 67491
67491:C 09 Dec 2019 19:33:10.724 * DB saved on disk
67491:C 09 Dec 2019 19:33:10.727 * RDB: 0 MB of memory used by copy-on-write
66906:M 09 Dec 2019 19:33:10.823 * Background saving terminated with success
```

### RDB 引发的一些问题思考

RDB 方式有两点缺点，一是性能、时间耗时、二是存在不稳定性

**时间、性能耗时**

RDB 生成过程就是将 Redis 内存中的数据 dump 到硬盘中生成一个 RDB 文件，其实也就是生成一个内存快照，在生产环境 save 命令我们是不建议去使用的，本身就会直接造成其它客户端命令阻塞，但是 bgsave 的 fork 也是一个重量级操作，遵循 Copy-On-Write（写入时复制） 策略，新 fork 出的子进程会继续共享父进程的物理空间，使用 COW 技术可以避免不必要的资源分配，父进程的代码段和只读数据段都不被允许修改，所以无需复制，当父进程处理写请求时会把要修改的页创建副本，而子进程在 fork 操作过程中会共享父进程的内存快照。

[Copy On Write 机制](https://juejin.im/post/5bd96bcaf265da396b72f855)

**不稳定性：** 

Redis 会根据如下自定义时间策略或者定时任务手动执行 bgsave 进行快照备份，这样在某个阶段出现宕机就会存在数据丢失。

```sh
save 900 1 # 每 900 秒后数据发生 1 次改变
save 300 10 # 每 300 秒后数据发生 10 次改变
save 60 10000 # 每 60 秒数据发生 1000 次改变
```

## AOF

以写日志的方式执行 redis 命令之后，将数据写入到 AOF 日志文件。

### AOF 可靠性 fsync

redis 命令写入过程，是先写入硬盘的缓冲区中，缓冲区根据选择的策略写入到系统中，**如果 AOF 日志内容还未完全写入到磁盘中突然发生宕机**，该怎么办？

Linux 的 glibc 提供了 **fsync(int fd) 函数可以将指定文件的内容强制从内核写入至磁盘，只要 Redis 进程实时调用了 fsync 函数就可以保证 AOF 日志不丢失**，由于 fsync 是一个磁盘 I/O 操作，所以不能每条 Redis 指令都执行一次 fsync，这样 Redis 高性能就没了保证，那么又该何时执行 fsync 呢？下面给出了三种策略，默认推荐的是 everysec 策略，一个折中的方案。

**三种策略**

* always：每条命令都会写入到 AOF 中，保证数据不会丢失，但是 I／O 开销会很大。
* everysec：以每秒钟为单位将缓冲区中的数据写入到硬盘，如果出现故障可能会丢失 1 秒钟的数据，这个也是 Redis 的**默认值**。
* no：这个策略根据操作系统定义的进行写入，虽然不需要我们操作，但同时也是不可控的。

### AOF 重写

AOF 重写是将那些过期的、重复的命令进行压缩减少，从而达到减少硬盘占用量，提高数据恢复速度（为硬盘瘦身）。


**AOF重写实现方式**

1. bgrewriteaof：类似于 RDB 中的 bgsave
2. auto-aof-rewrite-min-size：配置 AOF 重写需要的最小尺寸
3. auto-aof-rewrite-percentage：配置 AOF 文件增长率 

**AOF 重写配置**

```sh
# 是否开启 aof
appendonly yes

# 文件名称
appendfilename "appendonly-6379.aof"

# 同步方式
appendfsync everysec

# aof 重写期间是否同步
no-appendfsync-on-rewrite no

# 重写触发配置
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb

# 加载 aof 时如果有错如何处理
aof-load-truncated yes

# 文件重写策略
aof-rewrite-incremental-fsync yes
```

### AOF 数据损坏修复

“在过去曾经发现一些很罕见的 BUG 导致使用 AOF 重建的数据跟原数据不一致的问题。” 这句话来自 Redis 实践官方，为了应对这种罕见的 BUG 可以使用 redis-check-aof 命令修复原始的 AOF 文件

```sh
$ redis-check-aof --fix appendonly-6379.aof # appendonly-6379.aof 对应你的 aof 日志文件
```

### AOF 实践

按照上面 “AOF 重写配置” 对配置文件进行相应更改

**开启 Redis server**

```sh
$ src/redis-server redis-6379.conf
```

**开启 Redis cli 执行 set 命令**

```sh
127.0.0.1:6379> set a 1
OK
127.0.0.1:6379> set a 2
OK
127.0.0.1:6379> set a 3
OK
```

大约 1 秒中之后查看 cat appendonly-6379.aof 日志文件

```
*2
$6
SELECT
$1
0
*3
$3
set
$4
name
$1
a
...
```

**AOF 重写测试**

客户端手动执行 bgrewriteaof 命令进行日志重写，也可通过观察日志文件大小看到变化。

```sh
127.0.0.1:6379> bgrewriteaof
Background append only file rewriting started
```

## RDB 与 AOF 的抉择

通过上面的学习，已经进一步的认识了 RDB 与 AOF 分别是什么、如何实践应用，本节最后一个问题在两者之间我们该如何抉择呢？以下从多个角度进行比较说明

- **重放优先级：** 系统重启时优先重放 AOF 备份的数据，随后是 RDB，因为从数据备份的完整性考虑，AOF 相比 RDB 可靠性更高些
- **恢复速度快**：RDB 采用二进制方式存储占用体积小，AOF 是以日志形式存储，体积相比 RDB 要大，相比较来看，RDB 的数据恢复速度要高于 AOF
- **数据安全性**：RDB 采用快照的形式，在一定时间内会丢失数据，AOF 相对更安全些主要有三种策略，也要看怎么选择

如果我们定时按照天、小时等单位来备份数据，RDB 快照这种形式还是可以的，对于 RDB 的操作不建议频繁，因为 RDB bgsave fork 也是一个很重的操作。对于 RDB 的快照文件可以保存在 Redis 当前服务器之外的其它服务器之上（鸡蛋不要放到同一个篮子里）。

一般来说， 如果想达到足以媲美 PostgreSQL 的数据安全性，应该同时使用两种持久化功能。如果你非常关心你的数据，但仍然可以承受数分钟以内的数据丢失，那么你可以只使用 RDB 持久化。有很多用户都只使用 AOF 持久化，但并不推荐这种方式：因为定时生成 RDB 快照（snapshot）非常便于进行数据库备份， 并且 RDB 恢复数据集的速度也要比 AOF 恢复的速度要快，除此之外， 使用 RDB 还可以避免之前提到的 AOF 程序的 bug。

## Reference

* [redis.io/topics/persistence](https://redis.io/topics/persistence)