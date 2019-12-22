# 使用 Node.js 快速开启 ServerLess Functions：入门实践指南

近一年来我在很多地方看到 ServerLess 这一词出现，概念介绍的相对比较多，但是真正实践的还是很少，也是出于对新技术的好奇，所以我打算进一步的对 ServerLess 做一个了解，以便体验到 ServerLess 能给我们带来什么便捷，最好的例子还是先从一个 Hello World 开始。

## 关于 ServerLess Functions

Serverless 意为 “无服务器架构”，但是这并不意味着真的就无需服务器了，这些服务器的管理由云计算平台提供，对于用户侧无须关注服务器配置、监控、资源状态等，可以将重点放在业务逻辑上。

下图，将 Microservices 进一步细分为 Function as a Service（FaaS）函数即服务，相比微服务颗粒度更小。

![](https://stackify.com/wp-content/uploads/2019/07/image-1.png)

图片来源：[stackify](https://stackify.com/wp-content/uploads/2019/07/image-1.png)

**ServeLess 进一步了解**

ServerLess 是什么？网上有很多关于这些的介绍，也许你可以参考，下面列举一些之前的分享：

* [Serverless（无服务）基础知识](https://mp.weixin.qq.com/s/ldE8b4PDToGql14ePCDHWw)
* [Serverless For Frontend 前世今生](https://mp.weixin.qq.com/s/JGYOtGt7rA8NXJXzduemZw)
* [2019 年终云时代的 Node FaaS 技术展望](https://mp.weixin.qq.com/s/mTy1ZOunCJ3Vk9iU99-RzA)
* [2019 JSConf China 《面向传统，Serverless 进化之路》分享文字版](https://mp.weixin.qq.com/s/8KOD99hvjBCBoMaZJYL6zA)

## 云厂商的支持

截止目前已有很多云厂商支持 ServerLess：

* [Alibaba 函数计算](https://www.alibabacloud.com/zh/products/function-compute)
* [腾讯云函数 SCF](https://cloud.tencent.com/product/scf)
* [AWS Lambda Functions](https://amazonaws-china.com/cn/lambda/features/)
* [Azure Functions](https://azure.microsoft.com/en-in/services/functions/)
* [Google Cloud Functions](https://cloud.google.com/functions/)
* [IBM Cloud Functions](https://cloud.ibm.com/functions/)
... 更多

### AWS Lambda function

在本节示例中将使用 Aws Lambda，你可以选择上面列举的其它的服务商都是可以的，AWS 提供一年的免费试用，但是在使用 AWS 服务之前你需要先拥有一张有效的信用卡进行绑定，第一次 AWS 会扣除 1 美元的金额进行验证。

以下几步需要你先完成：

* 创建一个 AWS 账户，访问 [console.aws.amazon.com/](https://console.aws.amazon.com/)
* 设置你的 Provider Credentials，这里有一个详细的文档可参考：[https://github.com/serverless/serverless/blob/HEAD/docs/providers/aws/guide/credentials.md](https://github.com/serverless/serverless/blob/HEAD/docs/providers/aws/guide/credentials.md)，或者参考视频 [https://www.youtube.com/watch?v=HSd9uYj2LJA](https://www.youtube.com/watch?v=HSd9uYj2LJA)

## ServerLess 框架安装和配置

ServerLess 框架是一个使用 Node.js 编写的 CLI 工具，开发者无需关注底层资源即可部署完整可用的 Serverless 应用架构。在安装之前需要你先有 Node.js 运行环境，还没有安装 Node.js 的可以参考这篇文章 [“3N 兄弟” 助您完成 Node.js 环境搭建](https://mp.weixin.qq.com/s/jj2RDOn2pB3G9Vp8Pm_mHA) 介绍了多种 Node.js 安装方式。

**安装 serveless 框架**

```
$ npm i serveless -g
```

**检查 serverless 是否安装成功**

```
$ serverless --version
Framework Core: 1.60.0
Plugin: 3.2.6
SDK: 2.2.1
Components Core: 1.1.2
Components CLI: 1.4.0
```

**设置 AWS Credentials**

如果已经设置了，可能会失败，在 serverless config credentials 后面加上 -o 即可。

```
$ serverless config credentials --provider aws --key <your_access_key_id> --secret <your_access_key_secret>
Serverless: Setting up AWS...
```
 
## 创建第一个 Nodejs ServerLess 项目

通过 serverless CLI 工具可以快速创建一个项目，--template 是该脚手架所支持的模板，更多模版可参考 [github.com/serverless/serverless/tree/master/lib/plugins/create/templates](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates)

```
$ serverless create --template hello-world --path aws-hello-nodejs-function

Serverless: Generating boilerplate...
Serverless: Generating boilerplate in "/Users/test/aws-hello-nodejs-function"
 _______                             __
|   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
|   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
|____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
|   |   |             The Serverless Application Framework
|       |                           serverless.com, v1.60.0
 -------'

Serverless: Successfully generated boilerplate for template: "hello-world"
```

创建成功后可以看到如下项目结构

```sh
├── handler.js # 逻辑处理
├── .gitignore # 忽略文件
└── serverless.yml # ServerLess 配置文件
```

### handler.js

handler.js 是逻辑处理的地方，当然你也可以自定义其它的文件，一旦自定义文件之后需要在 serverless.yml 文件里也进行响应更改，本节只是入门所以不会太复杂，后续会出一个使用 ServerLess 实现的 RESTFULL API 实践，可以关注公众号 “Nodejs技术栈” 获取最新消息。

以下有三个参数是你需要了解的：

* event：用来解析请求的数据
* context：使用 context 将运行时参数传递给 Lambda 函数
* callback 返回响应数据

```js
'use strict';

module.exports.helloWorld = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);
};
```

### serverless.yml

* service：服务名称
* provider：定义你的服务需要部署的位置
* functions：定义要部署的代码
* functions.helloWorld：函数
* functions.helloWorld.handler：value 中的 “handle.helloWorld” 定义了函数文件的路径，handle 文件下的 helloWorld 函数
* functions.helloWorld.events：events 定义了如何触发 “handler.helloWorld” 程序

```yml
service: aws-hello-nodejs-function

provider:
  name: aws
  runtime: nodejs12.x

functions:
  helloWorld:
    handler: handler.helloWorld
    events:
      - http:
          path: hello-world # 定义请求路径
          method: get # 定义接口请求方式
          cors: true # 开启跨域
```

## 部署

列举一些 ServerLess 部署相关的命令：

- **部署全部**：```$ serverless deploy```
- **单个部署**：```$ serverless deploy function -f helloWorld```
- **本地触发一个函数测试**：```$ serverless invoke local -f helloWorld```
- **查看日志**：```$ serverless logs -f helloWorld -l```

执行命令 serverless deploy 看到以下信息，一个服务就已经部署成功了，是不是感觉很简单呢？服务器环境搭建、部署这些无需在关注了，可以专注于业务开发。

```bash
$ serverless deploy                    
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
........
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service aws-hello-nodejs-function.zip file to S3 (404 B)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.................................
Serverless: Stack update finished...
Service Information
service: aws-hello-nodejs-function
stage: dev
region: us-east-1
stack: aws-hello-nodejs-function-dev
resources: 12
api keys:
  None
endpoints:
  GET - https://lg7en8vkt2.execute-api.us-east-1.amazonaws.com/dev/hello-world
functions:
  helloWorld: aws-hello-nodejs-function-dev-helloWorld
layers:
  None
Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.
```

以上日志中的 endpoints 展示了访问的接口地址，现在你可以通过接口来调用，或者 postman、curl 访问。

```
$ curl https://lg7en8vkt2.execute-api.us-east-1.amazonaws.com/dev/hello-world
```

## 本地测试 ServerLess-Online

使用这个 serverless-online 插件可以在本地启动一个 HTTP 服务器模拟  AWS λ 和 API Gateway。

## 安装插件

安装插件，如果本地没有 package.json 文件，可以 npm init 生成一个 package.json 文件

```
$ npm install serverless-offline --save-dev
```

## 修改 serverless.yml

在项目的 serverless.yml 里添加插件 serverless-offline，如下所示：

```yml
plugins:
    - serverless-offline
```

## 本地启动

项目根目录执行 serverless offline 命令，就可成功的在本地开启测试

```
$ serverless offline
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for helloWorld:
Serverless: GET /hello-world
Serverless: POST /{apiVersion}/functions/aws-hello-nodejs-function-dev-helloWorld/invocations

Serverless: Offline [HTTP] listening on http://localhost:3000
```

默认地址为 http://localhost:3000 如下所示就可轻松的访问我们上面的例子

```
$ curl http://localhost:3000/hello-world
```

serverless-offline 提供了很多选项是可以让你自定义的，例如修改启动项目监听的端口，可以参考 [github.com/dherault/serverless-offline](https://github.com/dherault/serverless-offline)

本节 Github 源码地址如下：

```
https://q-angelo.github.io/project-training/serverless/movies/aws-hello-nodejs-function
```

## 总结

通过本节入门指南，希望你能掌握如何去开启第一个 ServerLess 应用程序以及如何部署、在本地进行开发调试，因为这只是一个开始，下一节我将在这个基础之上使用 ServerLess、Node.js 和 MongoDB Atlas cloud 构建一个 REST API，敬请关注公众号 “Nodejs技术栈” 获取最新信息。

## Reference

* [github.com/serverless/serverless](https://github.com/serverless/serverless)
* [stackify.com/aws-lambda-with-node-js-a-complete-getting-started-guide/](https://stackify.com/aws-lambda-with-node-js-a-complete-getting-started-guide/)
