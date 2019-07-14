# Node.js + Consul 实现服务注册、健康检查、配置中心

![图片描述](//img.mukewang.com/5d274b250001e9f412800853.jpg)
本篇主要介绍了 Node.js 如何与 Consul 进行集成，Consul 只是服务注册的一种实现，还有其它的例如 Zookeeper、Etcd 等，服务注册发现在微服务架构中扮演这一个重要的角色，伴随着服务的大量出现，服务与服务之间的配置管理、运维管理也变的难以维护，通过 Consul 可以解决这些问题，实现服务治理、服务监控。

关于 Consul 的更多知识点不在这里赘述，但是在学习本节之前还是希望您能先了解下，请移步我之前写的 [微服务服务注册发现之 Consul 系列文章](https://www.nodejs.red/#/microservice/consul)。

## 初始化 Consul 客户端

> 初始化一个 Consul 客户端，关于 Node.js 中的 Consul 客户端以下项目使用 node-consul 模块。

作者：五月君
链接：https://www.imooc.com/article/289202
来源：慕课网
本文首次发布于慕课网 ，转载请注明出处，谢谢合作

**核心配置说明**

* host (String, default: 127.0.0.1): 配置 Consul 地址
* port (Integer, default: 8500): 配置 Consul 端口
* secure (Boolean, default: false): 启用 HTTPS
* promisify (Boolean|Function, optional): 启动 Promise 风格，默认为 Callback

**示例**

```js
const Consul = require('consul');

const consul = new Consul({
    host: '192.168.6.128',
    port: 8500,
    promisify: true,
});
```

## 服务注册与健康检查

> 注册一个服务并启动健康检查

**核心配置说明**

* name (String): 注册的服务名称
* id (String, optional): 服务注册标识
* tags (String[], optional): 服务标签
* address (String, optional): 需要注册的服务地址（客户端）
* port (Integer, optional): 需要注册的服务端口（客户端）
* check (Object, optional): 服务的健康检查核心参数如下
    * http (String): 健康检查路径, interval 参数为必须设置
    * interval (String): 健康检查频率
    * timeout (String, optional): 健康检查超时时间
* checks (Object[], optional): 如果有多个检查的路径，可采用对象数组形式，参数参照上面的 check

**简单示例**

```js
consul.agent.service.register({
    name: serviceName,
    address: '192.168.20.193',
    port: 3000,
    check: {
        http: 'http://192.168.20.193:3000/health',
        interval: '10s',
        timeout: '5s',
    }
}, function(err, result) {
    if (err) {
        console.error(err);
        throw err;
    }

    console.log(serviceName + ' 注册成功！');
})
```

## 配置Consul管理控制台

Consul 提供了 Key/Value 存储，可以做为服务的配置中心，并且提供了 JSON、YAML、HCL 三种格式，在最早的 Consul 版本中只有一种 JSON 格式。

以下是我为 Consul 管控台配置的数据，如下图所示：

![图片描述](//img.mukewang.com/5d273c1800011efc23081138.png)

## 服务配置中心实现

Consul 的 Key/Value 功能可以做为服务的配置中心，对于项目中一些可变化的参数信息，可配置在 Consul 中，这样当数据改变时候不用因为配置的更改而导致项目还要重新发布

**获取配置信息**

这个 Key 为我们配置的路径，例如我要获取上面配置的 User 数据，Key 就为 'develop/user'

```js
consul.kv.get(key)
```

**更新配置信息**

* key (String): 更新的路径，例如 'develop/user'
* value (String|Buffer): 更新的数据信息

注意：如果我们要更新 JSON 中的某个字段，首先我们需要先通过 consul.kv.get 读取到 JSON 对象，程序处理之后，做为 set 的第二个参数进行传递更新。

```js
consul.kv.set('develop/user', JSON.stringify(user))
```

**HTTP API 调用**

还可以直接通过 HTTP API 接口直接调用，例如：http://192.168.6.128:8500/v1/kv/develop/user?raw，如果你只想用 Consul 做为配置中心，也可以通过简单的 HTTP API 调用将数据存入本地定时更新本地配置，但这要你自己去实现。

![图片描述](//img.mukewang.com/5d273c270001462510960310.png)

## 在Nodejs中进行测试

以下为一个简单的 Demo 展示了在 Node.js 如何与 Consul 之间进行服务注册、健康检查及配置中心的应用，可以很好的将上面讲解的理论知识进行实践。

**封装 Consul**

```js
// consul.js
const Consul = require('consul');

class ConsulConfig {
    constructor () {
        const serviceName = 'consul-demo';
        
        // 初始化 consul
        this.consul = new Consul({
            host: '192.168.6.128',
            port: 8500,
            promisify: true,
        });
        
        // 服务注册与健康检查配置
        this.consul.agent.service.register({
            name: serviceName,
            address: '192.168.20.193', // 注意：192.168.20.193 为我本地的内网 ip，通过 ifconfig 查看
            port: 3000,
            check: {
                http: 'http://192.168.20.193:3000/health',
                interval: '10s',
                timeout: '5s',
            }
        }, function(err, result) {
            if (err) {
                console.error(err);
                throw err;
            }

            console.log(serviceName + ' 注册成功！');
        })
    }
    
    async getConfig(key) {
        const result = await this.consul.kv.get(key);

        if (!result) {
            return Promise.reject(key + '不存在');
        }

        return JSON.parse(result.Value);
    }
    
    // 读取 user 配置简单封装
    async getUserConfig(key) {
        const result = await this.getConfig('develop/user');

        if (!key) {
            return result;
        }

        return result[key];
    }

	// 更新 user 配置简单封装
    async setUserConfig(key, val) {
        const user = await this.getConfig('develop/user');

        user[key] = val;

        return this.consul.kv.set('develop/user', JSON.stringify(user))
    }
}

module.exports = ConsulConfig;
```

**编写启动文件**

```js
// app.js
const http = require('http');
const ConsulConfig = require('./consul');
const consul = new ConsulConfig();

http.createServer(async (req, res) => {
    const {url, method} = req;

    // 测试健康检查
    if (url === '/health') {
        res.end('OK!');
    }

    // 测试动态读取数据
    if (method === 'GET' && url === '/user/info') {
        const user = await consul.getUserConfig();
        res.end(`你好，我是 ${user.name} 今年 ${user.age}`);
    }

    // 测试数据更新
    if (method === 'POST' && url === '/user') {
        try {
            await consul.setUserConfig('age', 18) // 将 age 更改为 18
            res.end('OK!');
        } catch (err) {
            console.error(err);
            res.end('ERROR!');
        }
    }
}).listen(3000, '192.168.20.193'); // 192.168.20.193 为我本地的内网 ip，通过 ifconfig 查看
```

### 接口测试

**健康检查接口**

该接口在服务启动后且向 Consul 配置中心注册后，根据 consul.js 文件配置的服务注册和健康检查信息进行自动调用。

```
$ curl http://192.168.20.193:3000/health
OK!
```

注册成功后展示我们服务的名称及健康检查结果如下：

![图片描述](//img.mukewang.com/5d273c4d000119c919360726.png)
![图片描述](//img.mukewang.com/5d273c5d0001616719460332.png)
**获取配置信息接口**

```
$ curl http://192.168.20.193:3000/user/info
你好，我是 Jack 今年 20
```

**更新配置信息接口**

```
$ curl -X POST http://192.168.20.193:3000/user
OK!
```

**更新之后重新获取配置**

可以看到使用 Consul 做为配置中心之后，在我的项目没有重启的情况下也是可以实现数据动态变更的。

```
$ curl http://192.168.20.193:3000/user/info
你好，我是 Jack 今年 18
```

本节源码 Github 地址：[Node.js + Consul 实现服务注册、健康检查、配置中心 Demo](https://github.com/Q-Angelo/project-training/tree/master/nodejs/consul-demo)

## 总结

总结起来本文主要讲解了 Consul 的三个功能点在 Node.js 中的应用，客户端进行服务注册成功之后，则可以在 Consul 管控台看到当前的服务列表。健康检查功能，可以检查接口的可用性，进一步还可以做运维监控报警，配置中心这个对于我们开发者是很实用的，有了它可以做一些运行时配置。

Consul 的应用并非只有上面介绍的三点，通过 Consul 还可以做负载均衡、分布式锁，有没有感觉很厉害 ing，这个功能是我之前在看 Spring Cloud Consul 的时候了解到的，欢迎关注「Nodejs技术栈 」公众号，关于这些后续实践之后也会进行分享。

## 阅读推荐

* [Nodejs-Interview-Questions —专注于 Node.js 面试及常见问题分享](https://github.com/Q-Angelo/Nodejs-Interview-Questions)
* [Nodejs 技术栈 — 一份 Node.js 开发与学习的技术栈指南](https://www.nodejs.red)
* 关注公众号「Nodejs技术栈」为您推荐更多 Node.js 相关学习指南