# 五种数据结构

以下列举一些常用的操作命令，更多信息可参见官网，Redis 提供了 5 种数据结构，除此之外还有一些通用命令。

## 通用命令

* **keys \*** ：遍历所有 key，生产环境不建议使用，时间复杂度 O(n)
* **dbsize key**：计算 key 的总数，Redis 内置了这个计数器，会实时更新 key 的总数，时间复杂度 O(1)
* **exists key**：检查 key 是否存在，时间复杂度为O(1)
* **expire key seconds**：key 在指定 seconds（单位: 秒）后过期，时间复杂度 O(1)
* **ttl key**：key 剩余的过期时间（单位：秒），时间复杂度O(1)
* **persist key**：去掉 key 的过期时间，时间复杂度 O(1)
* **type key**：查看 key 的类型，时间复杂度 O(1)

## 数据结构之字符串（string）

最大限制 512MB，适用于缓存、计算器、分布式锁等，字符串类型的值可以为简单的字符串、JSON、XML、数组甚至是二进制（音视频）。

### 常用命令

命令 |   含义  | 时间复杂度
:-----|:-------|:-------
 set/get/del   | 对 key 进行设置、读取、删除 | O(1)
 incr/decr     | 计数 | O(1)
 incrby/decrby | 对计数设置增量 | O(1)
 setnx         | key 存在不做任何操作 | O(1)
 setex         | key 存在做操作与 setnx 相反 | O(1)
 getset        | 设置新值返回旧值 getset key newValue |  O(1)
 mset/mget     | 多个 key 进行设置、读取   | O(n) 

### 重点命令介绍

**set**
* seconds：单位（秒）
* milliseconds：单位（毫秒）
* nx：key 存在不做任何操作，等价于 setnx
* xx：key 存在做操作与 nx 相反，等价于 setex

```
set key value [ex seconds] [px milliseconds] [nx|xx]
```

**mget、mset**

mget、mset 可以批量的获取或设置值，如果使用 **get 多次读取数据等价于 n 次网络时间 + n 次命令时间**，这种方式则可以利用 **mget 优化，等价于 1 次网络时间 + n 次命令**时间，但是也要注意这是一个 O(n) 的操作，避免命令过多客户端阻塞。

```sh
# mset 语法
127.0.0.1:6379> mset key value [key value ...]

# mset 演示
127.0.0.1:6379> mset key1 val1 key2 val2 key3 val3
OK

# mget 语法
127.0.0.1:6379> mget key [key ...]

# mget 演示
127.0.0.1:6379> mget key1 key2
1) "val1"
2) "val2"
```

**incr、decr、incrby、decrby**
* incr：自增
* decr：自减
* incrby：指定数字自增
* decrby：指定数字自减
* incrbyfloat：指定浮点数自增

```
incr key
decr key
incrby key increment
decrby key decrement
incrbyfloat key increment
```

### 应用场景

**1. 缓存**

例如，对城市列表数据进行缓存，伪代码如下：

```js
function cityList() {
    const redisKey = 'city';
    let cities = redis.get(redisKey);

    if (!cities) {
        cities = mongo.getCityList();

        redis.set(redisKey, JSON.stringify(cities)); // 存储的时候进行序列化
    }

    return cities;
}
```

**2. 分布式锁**

Redis 官方 2.8 版本之后支持 set 命令传入 setnx、expire 扩展参数，这样就可以一条命令一口气执行，实现了原子性操作，如果在 Sentinel、Redis Cluster 模式，可以参考 Redlock 算法 [https://redis.io/topics/distlock](https://redis.io/topics/distlock)

```
set key value [EX seconds] [PX milliseconds] [NX|XX]
```

**3. 计数器**

这个场景也还是比较多的，例如网站 PV/UV 统计、文章点赞/阅读量、视频网站的播放量。Redis 提供的 incr 命令可实现计数器功能，且性能非常好复杂度为 O(1)。

```js
const incrPageViewsCounter = pageId => {
    const key = `page:views:${pageId}`;

    return redis.incr(key);
}
```

**4. Session存储**

这在用户登陆注册管理系统中是很常见的，相较于 Memcache 存储 Session 信息，Redis 不会因为服务重启而导致 Session 数据丢失，因为其有数据持久化功能，不会因为 Session 而导致的用户体验问题。之前用过公司内部一个产品发现每当他们发版之后（大概已经知道用户信息是怎么做了）都要去重新登录，真的会影响用户体验。

**5. 限流**

例如，短信发送为了避免接口被频繁调用，通常要在指定时间内避免重复发送

```js
const SMSLimit = async phone => {
    const key = `sms:limit:${phone}`;
    const result = await redis.set(key, 1, 'EX', 60, 'NX');

    if (result === null) {
        console.log('60 秒之内无法再次发送验证码');
        return false;
    }

    console.log('可以发送');
    return true;
}

SMSLimit(18800000000);
```

## 数据结构之哈希（hash）

哈希结构有一个特点，所有的命令都是以 H 开头，hash 类型其值本身是由一个或多个 filed-value 构成，如下所示：

```js
hashKey = {
    field1: value1,
    filed2: value2
}
```

- **优点**：节省空间，可以部分更新。
- **缺点**：不支持 TTL 设置，Redis 中过期时间只针对顶级 Key，无法对 Hash Key 中的 field 设置过期时间，只能对整个 Key 通过 expire 设置。
- **注意**：在使用 hgetall 的时候要注意，如果集合很大，将会浪费性能。

### 常用命令

命令 |   含义  | 时间复杂度
:-----------------------:|:------:|:-------:
 hset                    | 对 key 的 field 进行设置 | O(1)
 hget                    | 获取 key 指定的 field    | O(1)
 hdel                    | 删除 key 指定的 field        | O(1)
 hincrby/hincrbyfloat    | 类似于 incbry/incrbyfloat 但是这个操作的是 field | O(1)
 hmset/hmget             | 对多个 field、value 设置、读取           | O(n) 
 hgetall                 | 获取 key 的所有 field、value | O(n)
 hvals                   | 获取 key 的所有 value  | O(n)
 hkeys                   | 获取 key 的所有 fields | O(n)

### 常用命令实践

```sh
# 设置 student 的 name 为 Jack
$ hset student name Jack

# 获取 student 的 name 值
$ hget student name
"Jack"

# 对 key student 批量设置 age、sex 属性
$ hmset student age 18 sex man

# 批量查询 student 的 age、sex 属性
$ hmget student age sex
1) "18"
2) "man"

# 获取 student 的所有 fields、value
$ hgetall student
1) "name"
2) "Jack"
3) "age"
4) "18"
5) "sex"
6) "man"
```

### 哈希（hash）应用场景

hash 适合将一些相关的数据存储在一起，例如，缓存用户信息，与字符串不同的是，hash 可以对用户信息结构中的每个字段单独存储，当我们需要获取信息时可以仅获取我们需要的部分字段，如果使用字符串存储，两种方式，一种是将用户信息拆分为多个键（每个属性一个键）来存储，这样就显得有点冗余，占用过的 Key 同时也占用空间，另一种是序列化字符串存储，这种方式如果取数据只能全部取出并且还要进行反序列化，序列化/反序列化也有一定的内存开销。

以下为缓存用户信息代码示例：

```js
// 模拟查询 Mongo 数据
const mongo = {
    getUserInfoByUserId: userId => {
        return {
            name: 'Jack',
            age: 19,
        }
    }
}

// 获取用户信息
async function getUserInfo(userId) {
    const key = `user:${userId}`;
    try {
        // 从缓存中获取数据
        const userInfoCache = await redis.hgetall(key);

        // 如果 userInfoCache 为空，返回值为 {}
        if (Object.keys(userInfoCache).length === 0) {
            const userInfo = mongo.getUserInfoByUserId(userId);

            await redis.hmset(key, userInfo);
            await redis.expire(key, 120);
            return userInfo;
        }

        return userInfoCache;
    } catch(err) {
        console.error(err);
        throw err;
    }
}

getUserInfo(1)
```

## 数据结构之列表（list）

Redis 的列表是用来存储字符串元素的集合，基于 Linked Lists 实现，这意味着插入、删除操作非常快，时间复杂度为 O(1)，索引很慢，时间复杂度为 O(n)。

Redis 列表的命令都是以 **L** 开头，在实际应用中它可以用作队列或栈

* `Stack（栈）`：后进先出，实现命令`lpush + lpop`
* `Queue（队列）`：先进先出，实现命令`lpush + rpop`
* `Capped Collection（有限集合）`：lpush + ltrim
* `Message Queue（消息队列）`：lpush + brpop

### 常用命令

命令 |   含义  | 时间复杂度
:-----:|:------:|:-------:
 lpush/rpush  | 列表左端/右端插入一个值 | O(1~n)
 linsert  | 列表指定的值前/后插入新值 | O(n)
lpop/rpop  | 列表左侧或者右侧弹出一个值 | O(1)
blpop/brpop  | lpop/rpop 的阻塞版本，需设置 timeout  | O(1)
ltrim  | 按照索引范围修剪列表 | O(n)
lrange  | 获取指定范围内的元素列表 | O(n)
llen  | 获取列表长度| O(1)
lset  | 设置列表指定索引值为新值 | O(n)

### 常用命令实践

```sh

# 列表左侧加入三个元素
$ lpush languages JavaScript Python Go

# 获取列表长度
$ llen languages

# 获取指定范围内的元素列表 lrange key start end（包含end）
# 如果从左到右 start、end 分别为 0、N-1
# 如果从右到左 start、end 分别为 -1、-N
$ lrange languages 0 2
1) "Go"
2) "Python"
3) "JavaScript"

# 列表右端插入元素
$ rpush languages TypeScript

# 再次查看列表的元素
$ lrange languages 0 3
1) "Go"
2) "Python"
3) "JavaScript"
4) "TypeScript"

# 列表左端移除一个元素
$ lpop languages
"Go"

# 列表右侧移除一个元素
$ rpop languages
"TypeScript"

# 设定列表指定索引值为新值
$ lset languages 1 JS

# 列表指定的值前/后插入新值
$ linsert languages after JS Nodejs
(integer) 3

# 按照索引范围修剪列表（元素截取）ltrim key start end
$ ltrim languages 1 2

# lpop/rpop 的阻塞版本，设置 timeout 如果列表为空，客户端将会等待设定的 timeout 时间退出
$ blpop languages 2
(nil)
(2.02s)
```

### 应用场景

**1. 消息队列**

Redis List 结构的 lpush + brpop 命令可实现消息队列，lpush 命令是从左端插入数据，brpop 命令是从右端阻塞式的读取数据，阻塞读过程中如果队列中没有数据，会立即进入休眠直到数据到来或超过设置的 timeout 时间，则会立即醒过来。

```js
async function test() {
    const key = 'languages';

    // 阻塞读，timeout 为 5 秒钟
    const result = await redis.brpop(key, 5);

    console.log(result);
}

test();
test();
```

## 数据结构之集合（set）

Redis 的集合类型可用来存储多个字符串元素，和列表不同，集合元素不允许重复，集合中的元素是无须的，也不能通过索引下标获取元素。

Redis 集合的命令都是以 **S** 开头

### 常用命令

命令 |   含义  | 时间复杂度
:-----|:------|:-------
 sadd  | 集合中添加元素，如果元素重复则添加失败 | O(1)
 srem  | 删除集合中的元素 | O(1)
 scard | 计算集合中元素个数 | O(1)
 sismember | 判断集合中是否存在指定元素 | O(1)
 srandmember | 随机从集合中返回指定元素 | O(count)
 smembers | 获取集合中所有元素，此命令谨慎使用 | O(n)
 sinter | 求集合交集 |
 sunion | 求集合并集 | 
 sdiff | 求集合差集 | 

### 常用命令实践

```sh
# 集合中添加元素
$ sadd languages Nodejs JavaScript

# 计算集合中元素个数
$ scard languages
(integer) 2

# 判断集合中是否存在指定元素
$ sismember languages Nodejs

# 随机从集合中返回指定元素
$ srandmember languages 2
1) "Nodejs"
2) "JavaScript"
```

集合间操作

```sh
# 设置用户 1 使用的语言
$ sadd user:1 Nodejs JavaScript
(integer) 2
# 设置用户 2 使用的语言
$ sadd user:2 Nodejs Python
(integer) 2

# 求 user:1 与 user:2 交集
$ sinter user:1 user:2
1) "Nodejs"

# 求 user:1 与 user:2 并集
$ sunion user:1 user:2
1) "Python"
2) "Nodejs"
3) "JavaScript"

# 求 user:1 与 user:2 差集
$ sdiff user:1 user:2
1) "JavaScript"
```

### 应用场景

**1. 抽奖**

Redis 的集合由于有去重功能，在一些抽奖类项目中可以存储中奖的用户 ID，能够保证同一个用户 ID 不会中奖两次。

```js
async function test(userId) {
    const key = `luck:users`;
    const result = await redis.sadd(key, userId);

    // 如果元素存在，返回 0 表示未添加成功
    if (result === 0) {
        console.log('您已中奖 1 次，无法再次参与');
        return false;
    }
    
    console.log('恭喜您中奖');
    return true;
}

test(1);
```

**2. 计算用户共同感兴趣的商品**

sadd + sinter 可用来统计用户共同感兴趣的商品，sadd 保存每个用户喜欢的商品标签，使用 sinter 对每个用户感兴趣的商品标签求交集。

## 数据结构之有序集合（zset）

Redis 的有序集合（zset）保留了集合（set）元素不能重复的特性之外，在有序集合的元素中是可以排序的，与列表使用索引下标不同的是有序集合是有序集合给每个元素设置一个分值（score）做为排序的依据。

Redis 有序集合的命令都是以 **Z** 开头

### 常用命令

命令 |   含义  | 时间复杂度
:-----|:------|:-------
zadd | 集合中添加元素 | O(logN)
zrem | 集合中删除元素 | O(1)
zscore | 返回元素的分数 | O(1)
zincrby | 增加或减少元素分数 | O(1)
zcard | 返回元素的个数 | O(1)

### 常用命令实践

**sadd**

Redis 3.2 对 zadd 增加了三个选项 [NX|XX]、[CH]、[INCR]：

* [NX|XX]：NX，member 必须不存在才添加成功，用于 Create；XX，member 必须存在才可更新成功，用于 UPDATE。
* [CH]：返回此次操作后有序集合元素和分数发生的变化
* [INCR]：对 score 做增加，相当于 zincrby
* score：代表分数（排序）
* member：成员

```
zadd key [NX|XX] [CH] [INCR] score member [score member ...]
```

**集合的增删改查**

```sh
# 有序集合 grades 中添加 3 个元素
$ zadd grades NX 80 xiaoming 75 xiaozhang 85 xiaoli
(integer) 3

# 查看成员 xiaozhang 分数
$ zscore grades xiaozhang
"75"

# 更新成员 xiaozhang 分数
$ zadd grades XX 90 xiaozhang

# 再次查看成员 xiaozhang 分数
$ zscore grades xiaozhang
"90"

# 查看成员排名
$ zrank grades xiaozhang # 分数从低到高返回排名
(integer) 2
$ zrevrank grades xiaozhang # 分数从高到底返回排名
(integer) 0

# 增加成员分数
$ zincrby grades 5 xiaozhang
"95"

# 返回指定范围成员排名，WITHSCORES 可选参数，去掉则不反回分数
$ zrange grades 0 2 WITHSCORES
1) "xiaoming"
2) "80"
3) "xiaoli"
4) "85"
5) "xiaozhang"
6) "95"

# 返回指定分数范围内的成员列表
$ zrangebyscore grades 85 100
1) "xiaoli"
2) "xiaozhang"

# 删除指定成员
$ zrem grades xiaoli
(integer) 1
```

### 应用场景

Redis 的有序集合一个比较典型的应用场景就是排行榜，例如，游戏排行榜、用户抽奖活动排行榜、学生成绩排行榜等。