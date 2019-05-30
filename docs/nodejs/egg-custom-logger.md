# 基于 egg-logger 定制日志中间件实现日志链路追踪

## 快速导航

- [需求背景](#需求背景)
- [自定义日志插件开发](#自定义日志插件开发)
- [项目扩展](#项目扩展)
- [项目应用](#项目应用)

## 需求背景

API接口服务接收到调用请求，根据调用者传的traceId (如果没有自己生成)，在该次调用链中处理业务时，如需打印日志，日志信息按照约定的规范进行打印，并记录traceId，实现日志链路追踪。

```
日志时间[]traceId[]服务端IP[]客户端IP[]日志级别[]日志内容
```

采用 Egg.js 框架 egg-logger 中间件，在实现过程中发现对于按照以上日志格式打印是无法满足需求的（至少目前我还没找到可实现方式），如果要自己实现，可能要自己造轮子了，好在官方的  egg-logger 中间件提供了自定义日志扩展功能，参考 [高级自定义日志](https://eggjs.org/zh-cn/core/logger.html#%E9%AB%98%E7%BA%A7%E8%87%AA%E5%AE%9A%E4%B9%89%E6%97%A5%E5%BF%97)，本身也提供了日志分割、多进程日志处理等功能。

egg-logger 提供了多种传输通道，我们的需求主要是对请求的业务日志自定义格式存储，主要用到 fileTransport 和 consoleTransport 两个通道，分别打印日志到文件和终端。

## 自定义日志插件开发

基于 egg-logger 定制开发一个插件项目，参考 [插件开发](https://eggjs.org/zh-cn/advanced/plugin.html)，以下以 egg-logger-custom 为项目，展示核心代码编写

- **编写logger.js**

```egg-logger-custom/lib/logger.js```

```js
const moment = require('moment');
const FileTransport = require('egg-logger').FileTransport;
const utils = require('./utils');
const util = require('util');

/**
 * 继承 FileTransport
 */
class AppTransport extends FileTransport {
    constructor(options, ctx) {
        super(options);

        this.ctx = ctx; // 得到每次请求的上下文
    }

    log(level, args, meta) {
        // 获取自定义格式消息
        const customMsg = this.messageFormat({
            level,
        });

        // 针对 Error 消息打印出错误的堆栈
        if (args[0] instanceof Error) {
            const err = args[0] || {};
            args[0] = util.format('%s: %s\n%s\npid: %s\n', err.name, err.message, err.stack, process.pid);
        } else {
            args[0] = util.format(customMsg, args[0]);
        }

        // 这个是必须的，否则日志文件不会写入
        super.log(level, args, meta);
    }

    /**
     * 自定义消息格式
     * 可以根据自己的业务需求自行定义
     * @param { String } level
     */
    messageFormat({
        level
    }) {
        const { ctx } = this;
        const params = JSON.stringify(Object.assign({}, ctx.request.query, ctx.body));

        return [
            moment().format('YYYY/MM/DD HH:mm:ss'),
            ctx.request.get('traceId'),
            utils.serviceIPAddress,
            utils.clientIPAddress(ctx.req),
            level,
        ].join(utils.loggerDelimiter) + utils.loggerDelimiter;
    }
}

module.exports = AppTransport;
```

- **工具**

```egg-logger-custom/lib/utils.js```

```js
const interfaces = require('os').networkInterfaces();

module.exports = {

    /**
     * 日志分隔符
     */
    loggerDelimiter: '[]',

    /**
     * 获取当前服务器IP
     */
    serviceIPAddress: (() => {
        for (const devName in interfaces) {
            const iface = interfaces[devName];

            for (let i = 0; i < iface.length; i++) {
                const alias = iface[i];

                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    })(),

    /**
     * 获取当前请求客户端IP
     */
    clientIPAddress: req => {
        const address = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;

        return address.replace(/::ffff:/ig, '');
    }
}
```

- **初始化 Logger**

```egg-logger-custom/app.js```
```js
const Logger = require('egg-logger').Logger;
const ConsoleTransport = require('egg-logger').ConsoleTransport;
const AppTransport = require('./app/logger');

module.exports = (ctx, options) => {
    const logger = new Logger();

    logger.set('file', new AppTransport({
        level: options.fileLoggerLevel || 'INFO',
        file: `/var/logs/${options.appName}.log`,
    }, ctx));

    logger.set('console', new ConsoleTransport({
        level: options.consoleLevel || 'INFO',
    }));

    return logger;
}
```

以上对于日志定制格式开发已经好了，如果你有实际业务需要可以根据自己团队的需求，封装为团队内部的一个 npm 中间件来使用。

## 项目扩展

自定义日志中间件封装好之后，在实际项目应用中我们还需要一步操作，Egg 提供了 [框架扩展](https://eggjs.org/zh-cn/basics/extend.html) 功能，包含五项：Application、Context、Request、Response、Helper，可以对这几项进行自定义扩展，对于日志因为每次日志记录我们需要记录当前请求携带的 traceId 做一个链路追踪，需要用到 Context（是 Koa 的请求上下文） 扩展项。

新建 ``` app/extend/context.js ``` 文件

```js
const AppLogger = require('@boluome/egg-logger');

module.exports = {
    get logger() { // 名字自定义 也可以是 customLogger
        return AppLogger(this, {
            appName: 'test', // 项目名称
            consoleLevel: 'DEBUG', // 终端日志级别
            fileLoggerLevel: 'DEBUG', // 文件日志级别
        });
    }
}
```

**建议**：对于日志级别，可以采用配置中心如 Consul 进行配置，上线时日志级别设置为 INFO，当需要生产问题排查时，可以动态开启 DEBUG 模式。关于 Consul 可以关注我之前写的 [服务注册发现 Consul 系列](https://www.nodejs.red/#/microservice/consul)

## 项目应用

错误日志记录，直接会将错误日志完整堆栈信息记录下来，并且输出到 errorLog 中，为了保证异常可追踪，必须保证所有抛出的异常都是 Error 类型，因为只有 Error 类型才会带上堆栈信息，定位到问题。

```js
const Controller = require('egg').Controller;

class ExampleController extends Controller {
    async list() {
        const { ctx } = this;

        ctx.logger.error(new Error('程序异常！'));

        ctx.logger.debug('测试');

        ctx.logger.info('测试');
    }
}
```

最终日志打印格式如下所示：

```
2019/05/30 01:50:21[]d373c38a-344b-4b36-b931-1e8981aef14f[]192.168.1.20[]221.69.245.153[]INFO[]测试
```

**扩展**：基于以上日志格式，可以采用 ELK 做日志搜集、分析、检索。



