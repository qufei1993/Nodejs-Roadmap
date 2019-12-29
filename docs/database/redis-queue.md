# 基于 Redis 实现消息队列

Redis 的消息队列使用起来很简单，相比较 RabbitMQ 没有很多高级特性，例如消息的 ACK 保证，如果对消息的可靠性有很高的要求，选择一些专业的消息中间件可能会更高些。

## List 数据结构实现消息队列

Redis 的 List 数据结构可以做为消息队列实现，lpush、rpush 入队，lpop、rpop 出队。

## 推荐阅读

* [有赞延迟队列设计](https://tech.youzan.com/queuing_delay/)
* [https://github.com/antirez/disque](https://github.com/antirez/disque)
* [https://github.com/Automattic/kue](https://github.com/Automattic/kue)