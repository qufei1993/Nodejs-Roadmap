# Node.js技术栈

[![stars](https://badgen.net/github/stars/qufei1993/Nodejs-Roadmap?icon=github&color=4ab8a1)](https://github.com/qufei1993/Nodejs-Roadmap) [![forks](https://badgen.net/github/forks/qufei1993/Nodejs-Roadmap?icon=github&color=4ab8a1)](https://github.com/qufei1993/Nodejs-Roadmap) [<img src="https://img.shields.io/static/v1.svg?label=%E6%85%95%E8%AF%BE&message=6k%20stars&color=ef151f">](https://www.imooc.com/u/2667395) [<img src="https://img.shields.io/badge/%E5%BE%AE%E4%BF%A1-%E5%85%AC%E4%BC%97%E5%8F%B7-brightgreen">](https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may)

> 本文档是作者从事 Node.js 开发以来的学习历程，旨在为大家提供一个较详细的学习教程，侧重点更倾向于 Node.js 服务端所涉及的技术栈，如果本文能为您得到帮助，请给予支持！

**如何支持：**
- 关注公众号[「Nodejs技术栈」](https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may)
- 点击右上角 Star :star: 给予关注
- 分享给您身边更多的小伙伴

**作者简介**：

> 五月君，Software Designer，公众号「Nodejs技术栈」作者，[慕课网认证作者](https://www.imooc.com/u/2667395)。

```JavaScript```| `ECMAScript6` | `Node.js`| `DataBase` | `Microservice` | `HTTP` | `DevOps` | `工具` | `其他`
 :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-:

**「Nodejs技术栈」在线预览：** [https://www.nodejs.red/](https://www.nodejs.red/)

## 目录

* JavaScript
    - [基础](/docs/javascript/base.md)
    - [This](/docs/javascript/this.md)
    - [函数](/docs/javascript/func.md)
    - [对象](/docs/javascript/object.md)
    - [原型](/docs/javascript/prototype.md)
    - [正则](/docs/javascript/regexp.md)
    - [浮点数之谜：0.1 + 0.2 为什么不等于 0.3？](/docs/javascript/floating-point-number-0.1-0.2.md)
    - [浮点数之迷：大数危机？](/docs/javascript/floating-point-number-float-bigint-question.md)

* ECMAScript6
    - [let&const 变量声明](/docs/es6/readme.md#新增声明变量)
    - [对象&数组解构赋值](/docs/es6/readme.md#解构赋值)
    - [数据类型功能扩展系列](/docs/es6/readme.md#解构赋值)
    - [Set、Map 数据结构](/docs/es6/set-map.md#解构赋值)
    - [Promise](/docs/es6/promise.md)
    - [Iterator](/docs/es6/iterator.md)
    - [Decorators](/docs/es6/decorators.md)
    - [Symbol](/docs/es6/symbol.md)
    - [Generator](/docs/es6/generator.md)

- TypeScript
    - [入门篇](/docs/ts/basis.md)
    - [面向对象程序设计](/docs/ts/oop.md)

* Node.js 基础
    - [Node.js 是什么？我为什么选择它？](/docs/nodejs/base/what-is-nodejs.md)
    - [Node.js 版本知多少？又该如何选择？](/docs/nodejs/base/release.md)
    - [“3N 兄弟” 助您完成 Node.js 环境搭建](/docs/nodejs/base/install.md)
    - [Node.js 包管理器 NPM](/docs/nodejs/base/npm.md)
    - [多维度分析 Express、Koa 之间的区别](/docs/nodejs/base/express-vs-koa.md)
    - [Node.js + Socket.io 实现一对一即时聊天](/docs/nodejs/base/private-chat-socketio.md)
    - [使用 Chrome Devtools 来调试你的 Node.js 程序](/docs/nodejs/base/debug-nodejs-with-chrome-devtools.md)

* Node.js 模块
    - [Module 模块机制](/docs/nodejs/module.md)
    - [Events 事件触发器](/docs/nodejs/events.md)
    - [Crypto 加解密模块](/docs/nodejs/crypto.md)
    - [Buffer 缓冲区模块](/docs/nodejs/buffer.md)
    - [Process 线程和进程](/docs/nodejs/process-threads.md)
    - [Console 日志模块](/docs/nodejs/console.md)
    - [Net 网络模块](/docs/nodejs/net.md)
    - [DNS 域名解析](/docs/nodejs/dns.md)
    - [Cluster 集群模块](nodejs/cluster-base.md)
    - [Stream - 多文件合并实现](nodejs/modules/stream-mutil-file-merge.md)
    - [Stream - pipe 基本使用与实现分析](nodejs/modules/stream-pipe.md)
    - [Stream - internal/stremas/egacy.js 文件分析](nodejs/modules/stream-lib-internal-stremas-legacy.md)
    - [Util 工具模块 - promisify 实现原理](nodejs/modules/util-promisify.md)
    - [ESModules 入门基础](/docs/nodejs/modules/esm.md)
    - [FS 如何在 Node.js 中判断一个文件/文件夹是否存在？](/docs/nodejs/modules/fs-file-exists-check.md)
    - [Report 在 Node.js 中使用诊断报告快速追踪问题](/docs/nodejs/modules/report.md)
    - [Async-Hooks 使用 Node.js 的 Async Hooks 模块追踪异步资源](/docs/nodejs/modules/async-hooks.md)
    
* Node.js 进阶
    - [Egg-Logger 模块实践](/docs/nodejs/logger.md)
    - [I/O 模型浅谈](/docs/nodejs/IO.md)
    - [Memory 内存管理和V8垃圾回收机制](/docs/nodejs/memory.md)
    - [Cache 缓存](/docs/nodejs/cache.md#缓存)
    - [Schedule 定时任务](/docs/nodejs/schedule.md#定时任务)
    - [Template 模板引擎](/docs/nodejs/template.md#模板引擎)
    - [Testing 测试](/docs/nodejs/test.md)
    - [Framework Web 开发框架选型](/docs/nodejs/framework.md#框架)
    - [ORM 对象关系映射](/docs/nodejs/orm.md#ORM)
    - [Middleware 常用 Web 框架&中间件汇总](/docs/nodejs/middleware.md)
    - [深入 Nodejs 源码探究 CPU 信息的获取与实时计算](nodejs/modules/os-cpu-usage.md)
    - [Node.js 中出现未捕获异常如何处理？](nodejs/advanced/uncaugh-exception.md)
    - [探索异步迭代器在 Node.js 中的使用](nodejs/advanced/asynciterator-in-nodejs.md)

- Node.js 翻译
    - [你需要了解的有关 Node.js 的所有信息](/docs/nodejs/translate/everything-you-need-to-know-about-node-js-lnc.md)
    - [不容错过的 Node.js 项目架构](/docs/nodejs/translate/bulletproof-node.js-project-architecture.md)

- Node.js 实践
    - [企业实践](/docs/nodejs/practice/enterprise.md)
    - [框架实践](/docs/nodejs/practice/frame.md)

- Node.js 版本
    - [一起来看看 Node.js v14.x LTS 中的这些新功能](/docs/nodejs/version/node-v14-feature.md)
    - [Node.js v14.15.0 已发布进入 LTS 长期支持](/docs/nodejs/version/node-v14.15.0-lts-intro.md)

- DataBase | Redis
    - [基础总结](/docs/database/redis.md)
    - [五种数据结构](/docs/database/redis-typeof-data.md)
    - [高级特性](/docs/database/redis-advanced-feature.md)
    - [主从复制](/docs/database/redis-master-slave.md)
    - [数据持久化](/docs/database/redis-persistence.md)
    - [哨兵高可用](/docs/database/redis-sentinel.md)
    - [集群模式](/docs/database/redis-cluster.md)
    - [缓存设计](/docs/database/redis-cache.md)
    - [应用场景](/docs/database/redis-scene.md)
    - [面试指南](/docs/database/redis-interview.md)
    - [实践 | Redis 计数器实现并发场景下的优惠券领取功能](/docs/database/redis-counter-luck.md)
    - [实践 | Node.js 中实践 Redis Lua 脚本](/docs/database/redis-lua.md)
    - [实践 | Node.js 中实践 Redis 分布式锁](/docs/database/redis-lock.md)

- DataBase | MongoDB
    - [MongoDB 安装入门篇](/docs/database/mongodb.md)
    - [MongoDB CURD 操作](/docs/database/mongodb-curd.md)
    - [MongoDB Indexes 索引](/docs/database/mongodb-indexes.md)
    - [MongoDB 常用操作符](/docs/database/mongodb-operator.md)
    - [MongoDB 复制集 | 理论篇](/docs/database/mongodb-replication.md)
    - [MongoDB 复制集 | 实践篇](/docs/database/mongodb-replication-pratice.md)
    - [MongoDB 事务 | 基础篇](/docs/database/mongodb-transactions.md)
    - [MongoDB 事务 | 多文档事务实践篇](/docs/database/mongodb-transactions-pratice.md)
    - [Mongoose 关联查询和踩坑记录](/docs/database/mongoose-populate.md)

- ServerLess
    - [Node.js 快速开启 Serverless Functions：入门实践指南](/docs/serverless/serverless-functions-using-node-and-aws.md)
    - [TypeScript + Serverless 开发 REST API 实战](https://github.com/Q-Angelo/aws-node-rest-api-typescript/blob/master/docs/intro-zh.md)
    - [使用 Serverless, Nodejs, MongoDB Atlas cloud 构建 REST API](/docs/serverless/node-mongodb-altas-serverless-api.md)

- Microservice
    - [服务注册与发现 Consul](microservice/consul.md)
    - [数据通信方式 RPC、HTTP、消息队列](/docs/microservice/data-communication.md)
    - [RabbitMQ：入门篇](/docs/microservice/rabbitmq-base.md)
    - [RabbitMQ：交换机消息投递机制](/docs/microservice/rabbitmq-exchange.md)
    - [RabbitMQ：DLX（死信队列）+ TTL 实现延迟队列](/docs/microservice/rabbitmq-schedule.md)
    - [RabbitMQ：Delayed Message 插件实现延迟队列](/docs/microservice/rabbitmq-delayed-message-exchange.md)
    - [RabbitMQ：高并发下消费端限流实践](/docs/microservice/rabbitmq-prefetch.md)
    - [RabbitMQ：服务异常重连](/docs/microservice/rabbitmq-reconnecting.md)
    
* HTTP
    * [理论加实践搞懂浏览器缓存策略](https://github.com/Q-Angelo/http-protocol/blob/master/docs/http-cache.md)
    * [Nginx 代理服务配置缓存实践](https://github.com/Q-Angelo/http-protocol/blob/master/docs/nginx-cache.md)
    * [HTTP 长链接 — HTTP1.1 与 HTTP2 下的对比](https://github.com/Q-Angelo/http-protocol/blob/master/docs/http-keepalive.md)
    * [跨域（CORS）产生的原因分析与解决方案](https://github.com/Q-Angelo/http-protocol/blob/master/docs/cors.md)
    * [Socket hang up 是什么？什么情况下会发生？](https://github.com/Q-Angelo/http-protocol/blob/master/docs/socket-hang-up.md)
    * [DNS 域名解析过程？](https://github.com/Q-Angelo/http-protocol/blob/master/docs/dns-process.md)
    * [内容安全策略（CSP）](https://github.com/Q-Angelo/http-protocol/blob/master/docs/csp.md)
    * [URI/URL/URN](https://github.com/Q-Angelo/http-protocol/blob/master/docs/uri-url-urn.md)
    * [Cookie 和 Session](https://github.com/Q-Angelo/http-protocol/blob/master/docs/cooike-and-session.md)

* DevOps
    - [Node.js 生产环境完整部署指南](/docs/devops/node-deploy.md)
    - [NPM 模块管理应用实践](/docs/devops/npm-deploy.md)
    - [Docker系列一：入门到实践](/docs/devops/docker-base.md)
    - [Docker系列二：Node.js 服务容器化实践](/docs/devops/docker-nodejs.md)
    - [Docker系列三：Node.js 进程的优雅退出](/docs/devops/docker-build-nodejs-smooth-program.md)

* 工具
    - [Nodejs 项目开发中应用 ESLint 代码规范](/docs/tools/eslint.md)
    - [Git 常用命令及日常问题集锦](/docs/tools/git.md)
    - [SEO 网站优化 title 置与快速排名](/docs/tools/seo.md)
    - [Docsify 快速搭建个人博客](/docs/tools/docsify.md)

* 数据结构与算法
    - [Queue 队列](/docs/algorithm/queue.md)
    - [Stack 栈](/docs/algorithm/stack.md)
    - [Linear List 线性表](/docs/algorithm/linear-list.md)
    - [BST 二叉搜索树](/docs/algorithm/bst.md)

* 其他
    - [关于 Node.js 技术栈](/docs/other/about-us.md)
    - [转载&投稿合作](/docs/other/collaboration.md)
    - [Blog 推荐](/docs/other/blog.md)

## 转载分享

建立本开源项目的初衷是基于个人学习与工作中对 Node.js 相关技术栈的总结记录，在这里也希望能帮助一些在学习 Node.js 过程中遇到问题的小伙伴，欢迎分享给身边需要的朋友。

如果您需要转载本项目下的一些文章到自己的博客或公众号，请先阅读 [转载须知](other/reprint-contribution-collaboration.md)。

## 参与贡献

1. 如果您对本项目有任何建议或发现文中内容有误的，欢迎提交 issues 进行指正。
2. 对于文中我没有涉及到知识点，欢迎提交 PR。
3. 如果您有文章推荐请以 markdown 格式到邮箱 `qzfweb@gmail.com`，[中文技术文档的写作规范指南](https://github.com/ruanyf/document-style-guide)。

## 联系我

- **加入群聊**
本群的宗旨是给大家提供一个良好的技术学习交流平台，所以杜绝一切广告！由于微信群人满 100 之后无法加入，请扫描下方二维码先添加作者 “五月君” 微信，备注：Node.js。
<img src="https://nodejsred.oss-cn-shanghai.aliyuncs.com/wx.jpeg?x-oss-process=style/may" width="180" height="180"/>

- **公众号**
专注于Node.js相关技术栈的研究分享，包括基础知识、Nodejs、Consul、Redis、微服务、消息中间件等，如果大家感兴趣可以给予关注支持！
<img src="https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may" width="180" height="180"/>

<hr/>

**未完待续，持续更新中。。。**
