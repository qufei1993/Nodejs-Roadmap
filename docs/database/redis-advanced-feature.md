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