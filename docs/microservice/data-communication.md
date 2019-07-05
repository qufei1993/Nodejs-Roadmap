# 数据通信

## RPC 通信
- [gRPC 官方文档中文版](http://doc.oschina.net/grpc?t=57966)
- [Apache Thrift](http://thrift.apache.org/)
- [Apache Dubbo一款高性能Java RPC框架](http://dubbo.apache.org/zh-cn/index.html)

## HTTP 通信
- [RESTful API 设计指南](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)
- [Best Practices for Designing a Pragmatic RESTful API](https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api#versioning)

## 消息队列

> 通过消息中间件类似 Rabbitmq 可以将同步消息转为异步消息

**RabbitMQ**

一个由 erlang（有着和原生 Socket 一样低的延迟）语言开发基于 AMQP 协议的开源消息队列系统。能保证消息的可靠性、稳定性、安全性。[more](microservice/rabbitmq-base.md)

**RocketMQ**

阿里开源的消息中间件，是一款低延迟、高可靠、可伸缩、易于使用的消息中间件，思路起源于Kafka。最大的问题商业版收费，有些功能不开放。[more](https://github.com/apache/rocketmq)

**ActiveMQ**

Apache 出品，早起很流行主要应用于中小企业，面对大量并发场景会有阻塞、消息堆积问题。[more](http://activemq.apache.org/)

**Kafka**

是由Apache软件基金会开发的一个开源流处理平台，由Scala和Java编写，是一种高吞吐量的分布式发布订阅消息系统，支持单机每秒百万并发。最开始目的主要用于大数据方向日志收集、传输。0.8版本开始支持复制，不支持事物，因此对消息的重复、丢失、错误没有严格的要求。[more](http://kafka.apache.org/)