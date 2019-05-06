# RabbitMQ高级消息队列

## 快速导航
* [主流消息中间件简介](/database/rabbitmq_base.md#主流消息中间件简介)
* [RabbitMQ安装](/database/rabbitmq_base.md#安装)
    - `[RabbitMQ安装]` Mac版安装
    - `[RabbitMQ安装]` Linux系统（Ubuntu、CentOS）安装 
    - `[RabbitMQ安装]` 运行与启动 

## 主流消息中间件简介

* ```ActiveMQ```：Apache出品，早起很流行主要应用于中小企业，面对大量并发场景会有阻塞、消息堆积问题。
* ```Kafka```：是由Apache软件基金会开发的一个开源流处理平台，由Scala和Java编写，是一种高吞吐量的分布式发布订阅消息系统，支持单机每秒百万并发。最开始目的主要用于大数据方向日志收集、传输。0.8版本开始支持复制，不支持事物，因此对消息的重复、丢失、错误没有严格的要求。
* ```RocketMQ```：阿里开源的消息中间件，是一款低延迟、高可靠、可伸缩、易于使用的消息中间件，思路起源于Kafka。最大的问题商业版收费，有些功能不开放。
* ```RabbitMQ```：是一个由erlang（有着和原生Socket一样低的延迟）语言开发基于AMQP协议的开源消息队列系统。能保证消息的可靠性、稳定性、安全性。

## 安装

* ### Mac版安装

直接通过```HomeBrew```安装，执行以下命令

```brew install rabbitmq```

启动rabbitmq

进入安装目录 ```/usr/local/Cellar/rabbitmq/3.7.8``` 
启动 ```sbin/rabbitmq-server```

浏览器输入```http://localhost:15672/#/```，默认用户名密码：guest

* ### Linux系统安装

#### 安装依赖
```apt-get install build-essential openssl openssl-devel unixODBC unixODBC-devel make gcc gcc-c++ kernel-devel m4 ncurses-devel tk tc xz lsof```

#### 获取安装包

rabbitmq和erlang安装包一定要对应，具体可以查看对应关系，官网有说明[RabbitMQ Erlang Version Requirements](http://www.rabbitmq.com/which-erlang.html)

- ***获取erlang安装包***

```sudo wget http://www.rabbitmq.com/releases/erlang/erlang-18.3-1.el6.x86_64.rpm```

- ***获取socat安装包***

socat支持多协议，用于协议处理、端口转发，rabbitmq依赖于此。

``` sudo wget http://repo.iotti.biz/CentOS/7/x86_64/socat-1.7.3.2-5.el7.lux.x86_64.rpm ```

- ***获取rabbitmq-server安装包***
rabbitmq-server [```安装包列表```](http://www.rabbitmq.com/releases/rabbitmq-server/)
```sudo wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.6.5/rabbitmq-server-3.6.5-1.noarch.rpm```


#### 安装

- **Centos rpm一键安装**

这里采用rpm一键安装，centos 执行命令 ```rpm -ivh erlang-18.3-1.el6.x86_64.rpm```，在```ubuntu```中不支持此命令```rpm```，使用```rpm```提示如下信息：

```bash
rpm: RPM should not be used directly install RPM packages, use Alien instead!
rpm: However assuming you know what you are doing...
error: Failed dependencies:
```

- **```ubuntu```系统rpm一键安装解决方案**
  1. 安装```alien```，执行命令```sudo apt-get install alien```
  2. 转换```rpm```包为```.deb```格式，执行命令```sudo alien package.rpm```其中```package.rpm```为你的包名
  3. 通过dpkg安装，```sudo dpkg -i package.deb```

- **以下顺序安装（以下是基于CentOS系统安装）**
```shell
rpm -ivh erlang-18.3-1.el6.x86_64.rpm
rpm -ivh socat-1.7.3.2-5.el7.lux.x86_64.rpm
rpm -ivh rabbitmq-server-3.6.5-1.noarch.rpm
```

- **修改配置文件**
```
vim /usr/lib/rabbitmq/lib/rabbitmq_server-3.6.5/ebin/rabbit.app
```

```js
{loopback_users, [<<"guest">>]}, // 修改为 {loopback_users, [guest]},
```

#### 运行与启动

- **开启rabbitmq**
```
rabbitmqctl start_app
```

- **开启管理插件**
```
rabbitmq-plugins enable rabbitmq_management
``` 

- **检查状态**
```shell
$ lsof  -i:5672 # 看到以下提示则开启成功
COMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
beam    4678 rabbitmq   49u  IPv6 294158      0t0  TCP *:amqp (LISTEN)
```

- **开启管理通知台**
终端更多操作命令，以下有说明，浏览区输入```http://host:15672```打开管理控制台

![](./img/20181118_rabbitmq_001.png)

- **几个端口区别说明**
    * `5672`：通信默认端口号
    * `15672`：管理控制台默认端口号
    * `25672`：集群通信端口号

`注意:` 阿里云ECS服务器如果出现RabbitMQ安装成功，外网不能访问是因为安全组的问题没有开放端口[解决方案](https://blog.csdn.net/lsq_401/article/details/79921221)

## 操作命令

* ```whereis rabbitmq```：查看rabbitmq安装位置
* ```whereis erlang```：查看erlang安装位置
* ```rabbitmqctl start_app```：启动应用
* ```rabbitmqctl stop_app```：关闭应用
* ```rabbitmqctl status```：节点状态
* ```rabbitmqctl add_user username password```：添加用户
* ```rabbitmqctl list_users```：列出所有用户
* ```rabbitmqctl delete_user username```：删除用户
* ```rabbitmqctl add_vhost vhostpath```：创建虚拟主机
* ```rabbitmqctl list_vhosts```：列出所有虚拟主机
* ```rabbitmqctl list_queues```：查看所有队列
* ```rabbitmqctl -p vhostpath purge_queue blue```：清除队列里消息

## 推荐资源
[消息队列应用场景](http://www.cnblogs.com/stopfalling/p/5375492.html)
[架构设计之NodeJS操作消息队列RabbitMQ](http://www.cnblogs.com/wukong-holmes/p/9306733.html)