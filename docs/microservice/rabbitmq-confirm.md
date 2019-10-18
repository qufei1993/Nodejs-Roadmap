# RabbitMQ 系列之：消息确认机制（Confirm）

消息的确认机制（Confirm）是实现 RabbitMQ 消息高可用投递的关键步骤，生产者在发送消息之后，如果 Broker 收到消息则会给生产端一个答复，用来确定这条消息是否正常发送。

Confirm 的另一个优点是它所处理的逻辑是异步的，生产者在发送一条消息之后可以进行异步监听通过回调来处理该消息，同时还可继续发送下一条，如果 RabbitMQ 因为系统内部错误导致消息丢失，回调会收到一条 nack 消息，用来处理失败的逻辑，否则会收到一条 ack 成功的消息。

## Node.js 版实现

一个 channel 使用确认模式 “confirmation mode”，可参考官方文章 [http://www.squaremobius.net/amqp.node/channel_api.html#confirmchannel](http://www.squaremobius.net/amqp.node/channel_api.html#confirmchannel)

**实现步骤**

1. 通过 connect.createConfirmChannel() 获取一个确认模式的 channel
2. 使用 publish() 或者 sendToQueue() 接收回调做为附加参数

**代码实现**

主要变动生产者代码部分

```js
const amqp = require('amqplib');

async function producer() {
    // 创建链接对象
    const connection = await amqp.connect('amqp://localhost:5672');

    // 获取通道
    const channel = await connection.createConfirmChannel();

    // 声明参数
    const exchangeName = 'confirm_exchange_name';
    const routingKey = 'confirm_routingKey';
    const msg = 'confirm_hello world';

    // 交换机
    await channel.assertExchange(exchangeName, 'direct', {
        durable: true,
    });

    // 发送消息
    channel.publish(exchangeName, routingKey, Buffer.from(msg), {}, function(err, ok){
        console.log(err, ok);

        if (err !== null) {
            console.warn('Message nacked!');
        } else {
            console.log('Message acked');
        }
    });

    // 关闭链接
    // await channel.close();
    // await connection.close();
}

producer();
```

**源码地址**

```
https://github.com/Q-Angelo/project-training/tree/master/rabbitmq/helloworld-confirm
```

## Java 版实现

**实现步骤**

1. 开启确认模式 channel.confirmSelect()
2. 添加监听 channel.addConfirmListener 监听失败或成功结果

**代码实现**

主要改动部分为生产者部分，并且取消了关闭了链接（channel.close()、connection.close()）否则就无法监听

```java
public class Producer {
    public static void main(String[] args) throws Exception {
        // 创建链接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        connectionFactory.setHost("127.0.0.1");
        connectionFactory.setPort(5672);
        connectionFactory.setVirtualHost("/");

        // 通过链接工厂创建链接
        Connection connection = connectionFactory.newConnection();

        // 通过链接创建通道（channel）
        Channel channel = connection.createChannel();

        // 指定消息确认模式
        channel.confirmSelect();

        // 通过 channel 发送数据
        // exchange：交换机，如果不传默认为 AMQP default
        String confirmExchangeName = "confirm_exchange_name";
        String confirmRoutingKey = "confirm_routingKey";
        String confirmMsg = "confirm hello world";

        channel.basicPublish(confirmExchangeName, confirmRoutingKey, null, confirmMsg.getBytes());

        channel.addConfirmListener(new ConfirmListener() {
            @Override
            public void handleAck(long l, boolean b) throws IOException {
                System.out.println("--------handleAck-----------");
                System.out.print(l);
                System.out.print(b);
            }

            @Override
            public void handleNack(long l, boolean b) throws IOException {
                System.out.println("--------handleNack-----------");
                System.out.print(l);
                System.out.print(b);
            }
        });

        // 关闭链接
        // channel.close();
        // connection.close();
    }
}
```

**源码地址**

```
https://github.com/Q-Angelo/SpringBoot-Course/tree/master/chapter8/chapter8-1/src/main/java/com/may/rabbitmq/confirm/helloworld
```
