# 高并发情况下 RabbitMQ 服务限流实践

应用范围为服务访问量突然剧增，原因可能有多种外部的调用或内部的一些问题导致消息积压，对服务的访问超过服务所能处理的最大峰值，导致系统超时负载从而崩溃。

## 业务场景

举一些我们平常生活中的消费场景，例如：火车票、机票等，通常来说这些服务在下单之后，后续的出票结果都是异步通知的，如果服务本身只支持每秒 1000 访问量，由于外部服务的原因突然访问量增加到每秒 2000 并发，这个时候服务接收者因为流量的剧增，超过了自己系统本身所能处理的最大峰值，如果没有对消息做限流措施，系统在这段时间内就会造成不可用，在生产环境这是一个很 ```严重``` 的问题，实际应用场景不止于这些，本文通过 RabbitMQ 来讲解如何对消费端做限流措施。

## 消费端限流机制

RabbitMQ 提供了服务质量保证 (`QOS`) 功能，对 channel（通道）预先设置一定的消息数目，每次发送的消息条数都是基于预先设置的数目，如果消费端一旦有未确认的消息，这时服务端将不会再发送新的消费消息，直到消费端将消息进行完全确认，注意：此时消费端不能设置自动签收，否则会无效。

在 `RabbitMQ v3.3.0` 之后，放宽了限制，除了对 channel 设置之外，还可以对每个消费者进行设置。

#### Node.js 版

以下为 Node.js 开发语言 amqplib 库对于限流实现提供的接口方法 prefetch

```js
export interface Channel extends events.EventEmitter {
    prefetch(count: number, global?: boolean): Promise<Replies.Empty>;
    ...
}
```

**prefetch 参数说明**：

* count：每次推送给消费端 N 条消息数目，如果这 N 条消息没有被ack，生产端将不会再次推送直到这 N 条消息被消费。
* global：在哪个级别上做限制，ture 为 channel 上做限制，false 为消费端上做限制，默认为 false。


#### Java 版

同上面讲解的 Node.js 版本都是一样，第一个参数 prefetchSize 是指预读取的消息内容大小上限，可以简单理解为消息有效载荷字节数组的最大长度限制，0 表示无上限

```java
void BasicQos(uint prefetchSize, ushort prefetchCount, bool global);
```

## 代码实践 Node.js 版

**建立生产端**

```js
const amqp = require('amqplib');

async function producer() {
    // 1. 创建链接对象
    const connection = await amqp.connect('amqp://localhost:5672');

    // 2. 获取通道
    const channel = await connection.createChannel();

    // 3. 声明参数
    const exchangeName = 'qosEx';
    const routingKey = 'qos.test001';
    const msg = 'Producer：';

    // 4. 声明交换机
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    
    for (let i=0; i<5; i++) {
        // 5. 发送消息
        await channel.publish(exchangeName, routingKey, Buffer.from(`${msg} 第${i}条消息`));
    }

    await channel.close();
}

producer();
```

**建立消费端**

```js
const amqp = require('amqplib');

async function consumer() {
    // 1. 创建链接对象
    const connection = await amqp.connect('amqp://localhost:5672');

    // 2. 获取通道
    const channel = await connection.createChannel();

    // 3. 声明参数
    const exchangeName = 'qosEx';
    const queueName = 'qosQueue';
    const routingKey = 'qos.#';

    // 4. 声明交换机、对列进行绑定
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    await channel.assertQueue(queueName);
    await channel.bindQueue(queueName, exchangeName, routingKey);
    
    // 5. 限流参数设置
    await channel.prefetch(1, false);

    // 6. 限流，noAck参数必须设置为false
    await channel.consume(queueName, msg => {
        console.log('Consumer：', msg.content.toString());

        // channel.ack(msg);
    }, { noAck: false });
}

consumer();
```

**未确认消息情况测试**

在 consumer 中我们暂且将 `channel.ack(msg)` 注释掉，分别启动生产者和消费者，看看是什么情况？

![](./img/rabbitmq_qos_20190523_001.jpeg)

如上图所示，总共5条消息按照预先设置的发送了一条消息，因为我将 `channel.ack(msg)` 注释掉了，服务端在未得到 ack 确认，将不会在发送剩下已 Ready 消息。

**确认消息测试**

修改 consumer 代码，打开确认消息注释，重新启动消费端进行测试

```js
await channel.consume(queueName, msg => {
    console.log('Consumer：', msg.content.toString());

    channel.ack(msg); // 打开注释
}, { noAck: false });
```

![](./img/rabbitmq_qos_20190523_002.png)

如上图所示，Unacked 为0，消息已全部消费成功。

**源码地址**

```
https://github.com/Q-Angelo/project-training/tree/master/nodejs/rabbitmq-prefetch
```

## 代码实践 Java 版

重点是在消费端变化，第一步增加限流设置，第二步设置限流的 autoAck 为 false

**构建消费者**

```java
// 设置限流 prefetchCount 表示每次处理多少条
// void BasicQos(uint prefetchSize, ushort prefetchCount, bool global);
channel.basicQos(0, 1, false);

// 设置 channel autoAck 限流模式一定要设置为 false
channel.basicConsume(qosQueueName, false, myConsumer);
```

**源码地址**

```
https://github.com/Q-Angelo/SpringBoot-Course/tree/master/chapter8/chapter8-1/src/main/java/com/may/rabbitmq/qos/helloworld
```

## RabbitMQ 限流使用总结

限流在我们的实际工作中还是很有意义的，在使用上生产端没有变化，重点在消费端，着重看以下两点：

* 增加限流参数设置
* 限流情况 ack 设置为手动签收

