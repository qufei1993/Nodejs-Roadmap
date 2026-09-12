# Nodejs技术栈

[![stars](https://badgen.net/github/stars/qufei1993/Nodejs-Roadmap?icon=github&color=4ab8a1)](https://github.com/qufei1993/Nodejs-Roadmap) [![forks](https://badgen.net/github/forks/qufei1993/Nodejs-Roadmap?icon=github&color=4ab8a1)](https://github.com/qufei1993/Nodejs-Roadmap) [<img src="https://img.shields.io/static/v1.svg?label=%E6%85%95%E8%AF%BE&message=7k%20stars&color=ef151f">](https://www.imooc.com/u/2667395) [<img src="https://img.shields.io/badge/%E5%BE%AE%E4%BF%A1-%E5%85%AC%E4%BC%97%E5%8F%B7-brightgreen">](https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may)

本文档是作者 **@五月君** 从事 Node.js 开发以来的学习历程，希望这些分享能帮助到正在学习、使用 Node.js 的朋友们，也真诚的希望能聚集所有 Node.js 爱好者，共建互帮互助的「Nodejs技术栈」交流平台。

如果本文能为您得到帮助，请给予支持！

**如何支持：**
- 关注公众号 👉 [**Nodejs技术栈**](https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may)
- 点击**右上角 Star :star: 给予关注，勿 fork**
- 分享给您身边更多的小伙伴

**作者简介**：

五月君，Software Designer，公众号「**Nodejs技术栈**」|「**五月君**」作者，一个疯狂输出干货的技术博主。

**话题标签：**

> 所有相关话题均围绕 Node.js 讨论，例如数据库部分，会介绍在 Node.js 中使用 Redis、MySql、MongoDB 等常见数据库的一些基础应用、问题、实践记录。

`基础入门` `系统模块` `NPM 模块` `高级进阶` `好文翻译` `实践指南` `Node.js 小知识` `Node.js News` `数据库` `微服务`  `Serverless` `DevOps`

**在线预览：** [https://www.nodejs.red](https://www.nodejs.red/)

## 话题目录

- Introduction
    - [简介](README.md)

- 基础入门
    - [Node.js 是什么？我为什么选择它？](/docs/nodejs/base/what-is-nodejs.md)
    - [Node.js 版本知多少？又该如何选择？](/docs/nodejs/base/release.md)
    - [“3N 兄弟” 助您完成 Node.js 环境搭建](/docs/nodejs/base/install.md)
    - [Node.js 包管理器 NPM](/docs/nodejs/base/npm.md)
    - [使用 Chrome Devtools 来调试你的 Node.js 程序](/docs/nodejs/base/debug-nodejs-with-chrome-devtools.md)

- 系统模块
    - [`[Module]` CommonJS 模块机制](/docs/nodejs/module.md)
    - [`[Module]` ES Modules 入门基础](/docs/nodejs/modules/esm.md)
    - [`[Events]` 事件触发器](/docs/nodejs/events.md)
    - [`[Crypto]` 加解密模块](/docs/nodejs/crypto.md)
    - [`[Buffer]` 缓冲区模块](/docs/nodejs/buffer.md)
    - [`[Process]` 线程和进程](/docs/nodejs/process-threads.md)
    - [`[Console]` 日志模块](/docs/nodejs/console.md)
    - [`[Net]` 网络模块](/docs/nodejs/net.md)
    - [`[DNS]` 域名解析](/docs/nodejs/dns.md)
    - [`[Cluster]` 集群模块](/docs/nodejs/cluster-base.md)
    - [`[Stream]` 多文件合并实现](/docs/nodejs/modules/stream-mutil-file-merge.md)
    - [`[Stream]` pipe 基本使用与实现分析](/docs/nodejs/modules/stream-pipe.md)
    - [`[Stream]` internal/stremas/egacy.js 文件分析](/docs/nodejs/modules/stream-lib-internal-stremas-legacy.md)
    - [`[Util]` util.promisify 实现原理分析](/docs/nodejs/modules/util-promisify.md)
    - [`[FileSystem]` 如何在 Node.js 中判断一个文件/文件夹是否存在？](/docs/nodejs/modules/fs-file-exists-check.md)
    - [`[Report]` 在 Node.js 中使用诊断报告快速追踪问题](/docs/nodejs/modules/report.md)
    - [`[AsyncHooks]` 使用 Async Hooks 模块追踪异步资源](/docs/nodejs/modules/async-hooks.md)
    - [`[HTTP]` HTTP 请求与响应如何设置 Cookie 信息](/docs/nodejs/modules/http-set-cookies.md)

- NPM 模块
    - [Node.js + Socket.io 实现一对一即时聊天](/docs/nodejs/npm/private-chat-socketio.md)
    - [request 已废弃 - 推荐 Node.js HTTP Client undici](/docs/nodejs/npm/undici.md)

- 高级进阶
    - [Egg-Logger 模块实践](/docs/nodejs/logger.md)
    - [I/O 模型浅谈](/docs/nodejs/IO.md)
    - [Memory 内存管理和 V8 垃圾回收机制](/docs/nodejs/memory.md)
    - [Cache 缓存](/docs/nodejs/cache.md#缓存)
    - [Schedule 定时任务](/docs/nodejs/schedule.md#定时任务)
    - [Template 模板引擎](/docs/nodejs/template.md#模板引擎)
    - [Testing 测试](/docs/nodejs/test.md)
    - [Framework Web 开发框架选型](/docs/nodejs/framework.md#框架)
    - [ORM 对象关系映射](/docs/nodejs/orm.md#ORM)
    - [Middleware 常用 Web 框架&中间件汇总](/docs/nodejs/middleware.md)
    - [深入 Nodejs 源码探究 CPU 信息的获取与实时计算](/docs/nodejs/modules/os-cpu-usage.md)
    - [Node.js 中出现未捕获异常如何处理？](/docs/nodejs/advanced/uncaugh-exception.md)
    - [探索异步迭代器在 Node.js 中的使用](/docs/nodejs/advanced/asynciterator-in-nodejs.md)
    - [多维度分析 Express、Koa 之间的区别](/docs/nodejs/base/express-vs-koa.md)
    - [在 Node.js 中如何处理一个大型 JSON 文件？](/docs/nodejs/advanced/json-stream.md)
    - [Node.js 中遇到大数处理精度丢失如何解决？前端也适用！](/docs/nodejs/advanced/floating-point-number-float-bigint-question.md)
    - [Stream 的两种模式](/docs/nodejs/advanced/stream-object-mode-and-flow-mode.md)
    - [Stream 的背压问题 — 消费端数据积压来不及处理会怎么样？](/docs/nodejs/advanced/stream-back-pressure.md)

- 好文翻译
    - [你需要了解的有关 Node.js 的所有信息](/docs/nodejs/translate/everything-you-need-to-know-about-node-js-lnc.md)
    - [不容错过的 Node.js 项目架构](/docs/nodejs/translate/bulletproof-node.js-project-architecture.md)

- 实践指南
    - [企业实践](/docs/nodejs/practice/enterprise.md)
    - [框架实践](/docs/nodejs/practice/frame.md)

- 数据库
    - [`[Redis]` Node.js 中实践 Redis Lua 脚本](/docs/database/redis-lua.md)
    - [`[Redis]` Node.js 中实践 Redis 分布式锁](/docs/database/redis-lock.md)
    - [`[MongoDB]` 事务 | 基础篇](/docs/database/mongodb-transactions.md)
    - [`[MongoDB]` 事务 | 多文档事务实践篇](/docs/database/mongodb-transactions-pratice.md)
    - [`[MongoDB]` Node.js 中用 Mongoose 关联查询踩坑记录](/docs/database/mongoose-populate.md)

- 微服务
    - [`[Microservice]` 数据通信方式 RPC、HTTP、消息队列](/docs/microservice/data-communication.md)
    - [`[Consul]` 服务注册与发现 Consul](/docs/microservice/consul.md)
    - [`[RabbitMQ]` 入门篇](/docs/microservice/rabbitmq-base.md)
    - [`[RabbitMQ]` 交换机消息投递机制](/docs/microservice/rabbitmq-exchange.md)
    - [`[RabbitMQ]` DLX（死信队列）+ TTL 实现延迟队列](/docs/microservice/rabbitmq-schedule.md)
    - [`[RabbitMQ]` Delayed Message 插件实现延迟队列](/docs/microservice/rabbitmq-delayed-message-exchange.md)
    - [`[RabbitMQ]` 高并发下消费端限流实践](/docs/microservice/rabbitmq-prefetch.md)
    - [`[RabbitMQ]` 服务异常重连](/docs/microservice/rabbitmq-reconnecting.md)

- Node.js 小知识
    - [HTTP 请求与响应如何设置 Cookie 信息]()
    - [如何实现线程睡眠？](/docs/nodejs/tips/sleep.md)
    - [实现图片上传写入磁盘的接口](/docs/nodejs/tips/upload-picture.md)

- Node.js News
    - [Node.js v15.x 新特性 — 控制器对象 AbortController]()
    - [Node.js 16 来了，14 将支持到 2023 年]()
    - [一起来看看 Node.js v14.x LTS 中的这些新功能](/docs/nodejs/version/node-v14-feature.md)
    - [Node.js v14.15.0 已发布进入 LTS 长期支持](/docs/nodejs/version/node-v14.15.0-lts-intro.md)

- Serverless
    - [Node.js 快速开启 Serverless Functions：入门实践指南](/docs/serverless/serverless-functions-using-node-and-aws.md)
    - [TypeScript + Serverless 开发 REST API 实战](https://github.com/qufei1993/aws-node-rest-api-typescript/blob/master/intro-zh.md)
    - [使用 Serverless, Nodejs, MongoDB Atlas cloud 构建 REST API](/docs/serverless/node-mongodb-altas-serverless-api.md)

- DevOps
    - [`[Docker]` 入门到实践](/docs/devops/docker-base.md)
    - [`[Docker]` Node.js 服务容器化实践](/docs/devops/docker-nodejs.md)
    - [`[Docker]` Node.js 进程的优雅退出](/docs/devops/docker-build-nodejs-smooth-program.md)
    - [`[NPM]` 学会发布一个自己公共/私有包](/docs/devops/npm-deploy.md)
    - [`[Deploy]` Node.js 生产环境完整部署指南](/docs/devops/node-deploy.md)

* 其他
    - [关于 Node.js 技术栈](/docs/other/about-us.md)
    - [2020 Nodejs技术栈原创文章合辑](/docs/other/2020-noderoadmap-original-compilation.md)
    - [2020 年度回顾 — 缘起「Nodejs技术栈」](/docs/other/may-2020-review.md)
    - [Blog 推荐](/docs/other/blog.md)
## 转载分享

* 本站所有文章首发于公众号「Nodejs技术栈」，请发邮件至 qzfweb@gmail.com。
* 原创文章需要转载至公众号的，在邮件中说明具体的文章和转载到的公众号。
* 原创文章需要转载至个人博客的，在邮件中说明具体的文章和转载到的博客地址。
* 转载时须标注转载来源 “**文章转载自公众号「Nodejs技术栈」，作者@五月君**”，缺失来源的或来源隐蔽的视为侵权。

## 参与贡献

1. 如果您对本项目有任何建议或发现文中内容有误的，欢迎提交 issues 进行指正。
2. 对于文中我没有涉及到知识点，欢迎提交 PR。
3. 如果您有文章推荐请以 markdown 格式到邮箱 `qzfweb@gmail.com`，[中文技术文档的写作规范指南](https://github.com/ruanyf/document-style-guide)。

## 联系我

- **加入群聊**
本群的宗旨是给大家提供一个良好的技术学习交流平台，所以杜绝一切广告！请扫描下方二维码先添加作者 “五月君” 微信，备注：Node。
<img src="https://nodejsred.oss-cn-shanghai.aliyuncs.com/wx.jpeg?x-oss-process=style/may" width="180" height="180"/>

- **公众号「Nodejs技术栈」**
Node.js 开发者聚集地，聚集所有 Node.js 爱好者，共建互帮互助的「**Nodejs技术栈**」交流平台。分享 Node.js 在前端、后端等领域下应用实践，通过 Node.js 祝您早日成为一名全栈开发工程师。 如果大家感兴趣可以给予关注支持！
<img src="https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may" width="180" height="180"/>

## 关注「Nodejs技术栈」

由于精力有限目前所有文章主要维护在 Github，同时首发于微信公众号，在微信公众号也按照 “话题标签” 分类做了整理，便于大家在手机端查看。

* Github: https://github.com/qufei1993/Nodejs-Roadmap
* 关注微信公众号「Nodejs技术栈」对话框底部 “原创好文” -> “话题标签”，[链接直达](http://mp.weixin.qq.com/s?__biz=MzIyNDU2NTc5Mw==&mid=100012388&idx=1&sn=97fc192f6d61c0b50a84e966a3a0e949&chksm=680fbe2a5f78373cfc21ab1d1a95e8d4f78f24066c3d5a612e1a3e388bfef9890230037446f5#rd)。
<hr/>

**未完待续，持续更新中。。。**
