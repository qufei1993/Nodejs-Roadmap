# Redis

- **Redis特性** [[more]](/docs/database/redis-base.md)
- **应用场景**
- **五种数据结构** 
    - `[Type]` [字符串](/docs/database/redis-base.md#字符串)
    - `[Type]` [哈希](/docs/database/redis-base.md#哈希)
    - `[Type]` [列表](/docs/database/redis-base.md#列表)
    - `[Type]` [集合](/docs/database/redis-base.md#集合)
    - `[Type]` [有序集合](/docs/database/redis-base.md#有序集合)
- **Redis高级特性** 
- **数据持久化**
- **主从复制**


## Redis特性

- **速度快 10W OPS[每秒10万次读写]**

Redis将数据存在于内存中，基于C语言(距操作系统最近的语言)50000行代码（单机版的23000行）编写，单线程模型。

- **单线程**
    * 为什么在单线程模型下如此快呢？取决于以下几点：
        * 基于内存
        * 非阻塞IO
        * 避免线程切换
    * 需要注意的问题：
        * 一次只运行一条命令
        * 拒绝长（慢）命令：keys、flushall、flushdb、slow lua script、mutil/exec

- **持久化**

内存数据断电后会丢失的，`Redis`将所有数据保持在内存中，对数据的更新将异步的保存到磁盘（是有数据持久化的）上。

- **多数据结构**
    * ```String```：字符串，是`Redis`里最基本的数据类型
    * `HashTable`：键值对集合
    * `List`：底层是一个链表
    * `Set`：无序集合
    * `Zset`：有序集合
    * `新衍生的几个`：`BitMaps`（位图）、`HyperLogLog`（超小内存唯一计数）、`GEO`（地理信息定位）

- **多语言**
基于`TCP`的通信方式，支持`Node.js`、`Python`、`Java`、`Ruby`、`Lua`等

- **多功能**
发布订阅、简单的事务功能、Lua脚本（实现自定义命令）、pipeline提高客户端并发效率。




## 命令

#### 通用命令

* keys * ：会遍历出所有的key，生产环境不建议使用时间复杂度O(n)
* dbsize：计算key的总数，Redis内置了这个计数器，会实时更新key的总数，时间复杂度为O(1)
* exists：```exists key``` 检查key是否存在，时间复杂度为O(1)
* expire：```expire key seconds```key在seconds秒后过期，时间复杂度为O(1)
* ttl：```ttl key```key剩余的过期时间（单位：秒），时间复杂度为O(1)
* persist：```persist key```去掉key的过期时间，时间复杂度为O(1)
* type：```type key```查看key的类型，时间复杂度为O(1)

## 五种数据结构

#### 字符串

最大限制512MB，适用于缓存、计算器、分布式锁等。

命令 |   含义  | 时间复杂度
:-----:|:------:|:-------:
 set、get、del  | 对key进行设置、读取、删除 | O(1)
 incr、decr     | 计数 | O(1)
 incrby、decrby     | 对计数设置增量 | O(1)
 setnx     | key 存在，不做任何操作 | O(1)
 getset     | 设置新值返回旧值 ``` getset key newValue```|  O(1)
 mset、mget     | 多个key进行设置、读取   | O(n) 

例如，对城市列表数据进行缓存，伪代码如下：

 ```js
function cityList() {
    const redisKey = 'city';
    let cities = redis.get(redis.Key);

    if (!cities) {
        cities = mongo.getCityList();

        redis.set(redisKey, JSON.stringify(cities)); // 存储的时候进行序列化
    }

    return cities;
}
 ```

#### 哈希

> 所有哈希的命令都是以H开头

- **注意**：在使用hgetall的时候要注意，如果集合很大，将会浪费性能。
- **优点**：节省空间，可以部分更新。
- **缺点**：不支持TTL设置。

命令 |   含义  | 时间复杂度
:-----:|:------:|:-------:
 hset  | 对key进行设置：```hset user:1 name zs age 20``` | O(1)
 hget  | 获取指定属性name：```hget user:1 name``` | O(1)
 hdel  | 删除key指定属性name：```hdel user:1 name``` | O(1)
 hincrby  | ```hincrby user:1 count 1``` | O(1)
 hmset、hmget     | 多个key进行设置、读取   | O(n) 
 hgetall  | 获取key的所有属性：```hgetall user:1``` | O(n)
 hvals  | 获取key的所有value：```hvals user:1``` | O(n)
 hkeys  | 获取key的所有fields：```hkeys user:1``` | O(n)

#### 列表

> 列表的命令都是以L开头

* `Stack（栈）`：后进先出，实现命令`lpush + lpop`
* `Queue（队列）`：先进先出，实现命令`lpush + rpop`
* `Capped Collection（有限集合）`：lpush + ltrim
* `Message Queue（消息队列）`：lpush + brpop


命令 |   含义  | 时间复杂度
:-----:|:------:|:-------:
 rpush  | 列表右端插入一个值: ```rpush arr 1 2 3``` | O(1~n)
 lpush  | 列表左端插入一个值: ```lpush arr 1 2 3``` | O(1~n)
 linsert  | 列表指定的值前后插入新值: ```linsert key before|after value newValue``` ```linsert arr before 2 b``` | O(n)
lpop、rpop  | 列表左侧或者右侧弹出一个值: ```lpop arr | rpop arr``` | O(1)
ltrim  | 按照索引范围修剪列表: ```ltrim key start end``` | O(n)
lrange  | 获取列表指定索引范围所有item: ```lrange key start end（包含end）``` | O(n)
llen  | 获取列表长度: ```llen key``` | O(1)
lset  | 设置列表指定索引值为newValue: ```lset key index newValue``` | O(n)

#### 集合

> 以S开头的命令

* `sadd key element`：集合key中添加元素element，如果element存在则添加失败，O(1)。
* `srem key element`：删除集合中的元素，O(1)。
* `smembers key`：获取集合中所有元素，次命令谨慎使用，O(n)。

#### 有序集合

> 以Z开头的命令

有序集合元素由两部分组成其中score代表分数（排序），具体可以看以命令介绍：

* zadd key score element：集合key中添加元素element，如果element存在则添加失败，O(logN)。
* zrem key element：删除集合中的元素，O(1)。
* zscore key element：返回元素的分数，O(1)。
* zincrby key increScore element：增加或减少元素的分数，O(1)。
* zcard key ：返回元素的个数，O(1)。
* smembers key：获取集合中所有元素，次命令谨慎使用，O(n)。

## Redis高级特性

#### 慢查询

> Redis整个生命周期：发送命令->排队->执行命令->返回结果，慢查询通常发生在执行命令阶段，可以通过满日志查询系统slowlog进行问题定位跟踪。

**在配置文件```redis.conf```中设置：**

* slowlog-max-len：表示满查询最大的条数，默认128，保存在内存中，当超过预先设置的值后会将最早的slowlog删除，是个先进先出队列。
* slowlog-log-slower-than：慢查询阀值，默认10000微秒，只有命令执行时间大于该阀值才会被slowlog记录，如果记录所有命令将阀值设置为0。

**两种设置方式：**
> Redis是一个每秒万级别的，所以在设置阀值的时候，默认为10000微妙（10毫秒），不要设置太大，建议1毫秒之下，这样才有意义。定期将慢查询持久化到其他数据库，便于排查。

* 配置文件```redis.conf```中设置，以下为默认设置：
    * `slowlog-log-slower-than 10000`
    * `slowlog-max-len 128`
* config动态设置slowlog：
    * `slowlog-max-len 1000`
    * `slowlog-log-slower-than 1000`

**慢查询命令：**
* `slowlog get [n]`：获取慢查询队列
* `slowlog len`：获取慢查询队列长度
* `slowlog reset`：清空慢查询队列

#### pipeline

核心：1次网络请求处理n条命令，Redis本身命令处理时间是微妙级别，pipeline主要解决就是减少网络传输的请求。

#### 发布订阅

角色：发布者（publisher）、订阅者（subscriber）、频道（channel）
API：
* 发布消息```publish channel message```
* 订阅消息```subscribe [channe] # 可以订阅多个频道```
* 取消订阅```unsubscribe [channel]```

#### BitMaps（位图）
#### HyperLogLog（超小内存唯一计数
#### GEO
Redis3.2+支持，用于地理信息定位，基于zset实现。

API：
* ```geoadd key longitude latitude member```增加地理位置信息，示例：```geoadd cities: 116.31 39.99 beijing```

* ```geopos key member [member...]```获取地理位置信息，示例：```geopos cities: beijing```

* ```geodist key member1 member2 [unit]```获取两地理位置距离，unit为单位(m，米；km，千米；mi，英里；ft，尺)，示例：```geodist cities: beijing shanghai km```

## 数据持久化

Redis数据存储都是在内存里，对数据的更新异步的存储在磁盘里。

#### RDB

RDB是Redis持久化的一种方式，把当前内存中的数据集快照写入磁盘。恢复时将快照文件直接读到内存里。

触发机制：
* save同步：会阻塞，时间复杂度为O(n)
* bgsave异步：异步，Redis会fork一个子进程创建到RDB文件，成功之后进行通知，时间复杂度为O(n)
* 自动：提供一些配置，例如60秒中改变1000条数据，自动触发，内部执行策略还是使用的bgsave

RDB的一些问题：
* 耗时：在进行save的时候数据会有多条，是一个O(n)的操作
* 耗性能：在bgsave机制下会进行fork操作，也是需要耗内存的，在fork的过程中也会造成阻塞

#### AOF

以写日志的方式在执行redis命令之后，将数据写入到AOF日志文件。

三种策略：
* always：redis在写命令过程，是先写入硬盘的缓冲区中，缓冲区根据策略写入系统中，always指写的每条命令都会写入到AOF中，保证数据不会丢失。但是I／O开销会很大。
* everysec：每秒把缓冲区中的数据写入到硬盘，如果出现故障可能会丢失1秒的数据。
* no：这个策略根据操作系统定义的进行写入，虽然不需要我们操作，但同时也是不可控的。

AOF重写：

> AOF重写是将那些过期的、重复的命令进行压缩减少，从而达到减少硬盘占用量，提高数据恢复速度。

AOF重写实现方式：

* bgrewriteaof：类似于RDB中的bgsave
* 重写配置：
    * auto-aof-rewrite-min-size：AOF重写需要的最小尺寸
    * auto-aof-rewrite-percentage：AOF文件增长率

```// todo:```

## 主从复制

单机带来的问题：机器故障、容量限制、QPS瓶颈，主从复制提供了一种一主多从的模式解决了单机带来的机器故障问题。也是高可用、分布式的基础。

#### 实现方式

* 命令实现
    * slaveof ip port：开启一个主从复制，ip为主节点ip地址，port为主节点端口号，例如在6380机器上开启一个主从复制：```slaveof 127.0.0.1 6379```
    * slaveof no one：取消主从复制，取消之前的数据不会清除。

* 配置实现
    * ```slaveof ip port```：
    * ```slave-read-only yes```：设置为只读模式

## 应用场景
1. 缓存设计
2. 任务队列
3. 排行榜
4. 计数器
5. Session存储
6. 网站PV、UV统计
7. Publish/Subscribe

