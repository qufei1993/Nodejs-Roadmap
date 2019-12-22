# Redis 缓存

业务中的一些冷查询可以直接访问数据库，对于一些热点数据则必须要走缓存，一方面减轻了数据的压力，另一方面对于服务性能也得到了提升，关于缓存可以使用 Redis 或 服务的内存缓存。

## 缓存更新策略

- **```maxmemory-policy```**：redis 中的默认的过期策略是 volatile-lru，只对设置了过期时间（但还没有过期）的 key 进行 LRU。[redis-as-LRU-cache](http://oldblog.antirez.com/post/redis-as-LRU-cache.html)

- **```定期更新```**：用户的登陆 token 通过设置 expire 属性实现定期进行过期更新。

- **```超时剔除```**：设置最大的过期时间，主动剔除。

- **```主动更新 + 超时剔除```**：例如配置信息获取一个活动 banner，根据业务需求 banner 是随时都有可能进行调整的，显然这时候不适合上面的定期更新策略，可以根据缓存的 key 进行设置，我们可以将 key 存在 zk/consul 中，对 key 加上当前时间戳，每次配置管理后台更新之后同步更新缓存 key 的时间戳即可。

## 缓存穿透

**什么是缓存穿透？**

设置缓存的目的就是为了保证数据存储层，例如：MongoDB、MySql 等。正常的请求流程业务层先从缓存层拿数据，若没有缓存数据从数据存储层查询并返回。假设现在查询一个不存的用户，每次都会走到数据存储层查询一遍，由于数据层也查询不到直接返回给应用层，如果被恶意攻击，每次都会经过数据存储层，这就是缓存穿透或者击穿。

**造成缓存穿透的原因**

* 业务代码本身的问题造成
* 存在恶意攻击

**缓存空对象解决**

这种方案针对于恶意攻击的情况，可以对数据存储层进行有效的保护，看以下代码示例：

```js
async function getUserById(id) {
    const key = `user:${id}`;
    const user = await redis.get(Key);

    if (!user) { // 缓存不存在
        let result = await mongo.getUserById(id); // mongo 查询

        if (!result) { // 如果用户不存在，缓存空对象，防止缓存穿透对数据层造成压力
            redis.set(key, 'null', ttl);// 设置过期时间
        } else {
            redis.set(key, JSON.stringify(result)); // 存储的时候进行序列化
        }   
    }

    return user;
}
```

**布隆过滤器**

[Redis 布隆过滤器实战「缓存击穿、雪崩效应」](https://juejin.im/post/5c9442ae5188252d77392241)

## 缓存雪崩

保证服务高可用

* Redis Cluster、Redis Snetinel

## 无底洞现象

由 facebook 在 2010 年产生，当时已达到 3000 个 memcached 节点，储存数千 G 的缓存。他们发现一个问题 memcached 的连接效率下降了，于是添加 memcached 节点，添加完之后，并没有好转。称为 “无底洞” 现象

[Facebook's Memcached Multiget Hole: More Machines != More Capacity 
](http://highscalability.com/blog/2009/10/26/facebooks-memcached-multiget-hole-more-machines-more-capacit.html)

## 热点Key重建

**互斥锁**

**物理不过期设置逻辑过期**




