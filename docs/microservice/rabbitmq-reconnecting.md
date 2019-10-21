# 一次 RabbitMQ 生产故障引发的服务重连限流思考

原由是生产环境 RabbitMQ 消息中间件因为某些原因出现了故障导致当时一些相关的服务短时间不可用，后来 RabbitMQ 修复之后，按理来说服务是要正常恢复的，但是一些潜在问题出现了，因为一些老服务很少受到关注，当人工发现的时候消息已经堆积了几百万条，造成堆积原因是这些服务做为消费方没有重连机制，但是生产端是有的导致生产端一直写消息，消费端不能消费从而导致消息堆积。

这个时候也许你会想到我去把服务重启下就可以了，是的，重启之后可以让消费端这边的服务正常工作，但是请不要忽略一点，如果这个时候你的队列里堆积了很多消息，且服务也没有做限流措施，请谨慎操作，否则可能又是一场灾难。总结起来本次需要做的两点就是服务重连、服务限流，也是以下要主要讲的两个点。

## 建立服务重连机制

以下我建立了 rabbitmq.js 文件主要做以下功能：

* 初始化 Rabbitmq connection
* 通过监听 error、close 事件获取异常消息，进行重连
* isConnection 字段是为了防止建立多个连接（kill -9 processId 会同时触发 error、close 两个事件）
* 建立重连机制，每隔 10 秒钟重试一次
* 统计重连次数，这个可以设置一个阀值做为监控报警（扩展）
* 链接成功之后初始化我们的消费端

```js
// rabbitmq.js
const amqp = require('amqplib');
const consumer = require('./consumer');

let connection = null;
let isConnection = false;
let reconnectingCount = 0;
const init = () => amqp.connect('amqp://localhost:5672').then(conn => {
    connection = conn;
    conn.on('error', function(err) {
        reconnecting(err, 'error');
    });
    conn.on('close', function(err) {
        reconnecting(err, 'close');
    });

    console.log('rabbitmq connect success');
    isConnection = false;
    consumer.run(connection); // 开启消费者
    return connection;
}).catch(err => {
    isConnection = false;
    reconnecting(err, 'catch')
});

/**
 * 重连
 * @param { Object } err 
 */
const reconnecting = (err, event) => {
    if (!isConnection) {
        isConnection = true;
        reconnectingCount++;
        console.error(`Lost connection to RMQ. reconnectingCount: ${reconnectingCount}. Reconnecting in 10 seconds...`);
        console.error('Rabbitmq close: ', event, err);
        
        return setTimeout(init, 10 * 1000);
    }
}

module.exports = {
    init,
    connection: () => {
        return connection;
    },
}
```

实现方式可以有多种，在 qmqplib 库的 issue [How to reestablish connection after a failure?](https://github.com/squaremo/amqp.node/issues/153) 也有人提到过这个问题，可以参考下。

## 消费端限流机制

和正常建立消费端一样，要实现限流操作需要借助 prefetch 方法，这是 Rabbitmq 提供的服务质量保证 ( QOS) 功能，详细内容参见我的另一篇文章 [Node.js 结合 RabbitMQ 高级特性 Prefetch 实现消费端限流策略](https://mp.weixin.qq.com/s/Clq9DdFppirXQ98sf10qTQ)

```js
// consumer.js
async function consumer ({
    exchange,
    queue,
    routingKey,
    connection,
}, cb) {
    const ch = await connection.createChannel();
    await ch.assertExchange(exchange, 'direct', { durable: true });
    const queueResult = await ch.assertQueue(queue, {
        exclusive: false,
    });

    console.info('%j', queueResult);

    await ch.bindQueue(queueResult.queue, exchange, routingKey);
    await ch.prefetch(1, false);
    await ch.consume(queueResult.queue, msg => {
        cb(msg, ch);
    }, { noAck: false });
}

module.exports = {
    run: (connection) => { 
        consumer({
            exchange: 'task',
            queue: 'order_tasks',
            routingKey: 'order_task',
            connection,
        }, async function(msg, ch) {
            const data = msg.content.toString();
            console.info(`${(new Date()).getMinutes()}:${(new Date()).getSeconds()} consumer msg：%j`, data);
        
            return setTimeout(function () {
                try {
                    ch.ack(msg);
                } catch (err) {
                    console.error('消息 Ack Error：', err)
                }
            }, 5000);
        })
    }
}
```

注意在 ack 时如果当前有消息正在消费且暴力退出（kill -9 processId）的情况，会报 ```IllegalOperationError: Channel closed``` 错误，需要 try catch 捕获。

## 建立生产端

同样的和正常建立生产者是没有区别的，示例如下：

```js
// producer.js
const rabbitMQ = require('./rabbitmq');

async function producer({
    exchange,
    routingKey,
}) {
    // 获取链接
    const connection = await rabbitMQ.connection();

    if (!connection) {
        console.error('链接不存在！');
        return;
    }

    try {
        // 获取通道
        const channel = await connection.createChannel();

        // 声明交换机
        await channel.assertExchange(exchange, 'direct', { durable: true });
        
        for (let i=0; i<5; i++) {
            const msg = `第${i}条消息`;
            console.log('Producer：', msg);

            // 发送消息
            await channel.publish(exchange, routingKey, Buffer.from(msg));
        }

        await channel.close();
    } catch (err) {
        console.error('生产消息 Error：', err);
    }
}

module.exports = {
    run: () => {
        producer({
            exchange: 'task',
            routingKey: 'order_task'
        })
    }
}
```

## 重连限流测试

**开启一个 HTTP 接口用于后续测试**

* 提供了生产消息接口：127.0.0.1:3000/producer
* 初始化 RabbitMQ

```js
const http = require('http');
const producer = require('./producer');
const rabbitmq = require('./rabbitmq');

http.createServer((req, res) => {
    if (req.url === '/producer') {
        producer.run();
    }

    res.end('ok!');
}).listen(3000, () => {
    rabbitmq.init();
    console.log('the server is start at port:', 3000);
});
```

这里假设你的 MQ 已经开启，如果不知道怎么开启的参见，[RabbitMQ高级消息队列安装篇](https://www.nodejs.red/#/microservice/rabbitmq-base)

```bash
$ node app
the server is start at port: 3000
rabbitmq connect success
{"queue":"order_tasks","messageCount":0,"consumerCount":0}
```

**连接异常测试**

ps -ef | grep 5672 找到进程 id，kill -9 26179 暴力退出，如下所示

![](./img/rabbitmq_connection_error.png)

**正常情况下测试**

curl http://127.0.0.1:3000/producer 如下所示，每次仅消费 1 条消息待消息确认后在推送下一条，5 分钟间隔时间为 setTimeout 设置的延迟。

```bash
Producer： 第0条消息
Producer： 第1条消息
Producer： 第2条消息
Producer： 第3条消息
Producer： 第4条消息
32:12 consumer msg："第0条消息"
32:17 consumer msg："第1条消息"
32:22 consumer msg："第2条消息"
32:27 consumer msg："第3条消息"
32:32 consumer msg："第4条消息"
```

[本节源码 Github 地址 ](https://github.com/Q-Angelo/project-training/tree/master/rabbitmq/reconnection)

以上就是本文对服务重连、服务限流的实践，文中对于生产者如果出现链接终断情况，没有做消息保存这样消息是会丢失的所以牵扯到另外一个内容高可用性，关于 RabbitMQ 消息的高可用性将会在下一节进行讲解。欢迎关注微信公众号 “Nodejs技术栈”、Github [https://www.nodejs.red](https://www.nodejs.red) 获取最新消息。