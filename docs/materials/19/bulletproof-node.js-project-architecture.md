# 不容错过的 Node.js 项目架构

Express.js 是用于开发 Node.js REST API 的优秀框架，但是它并没有为您提供有关如何组织 Node.js 项目的任何线索。

虽然听起来很傻，但这确实是个问题。

正确的组织 Node.js 项目结构将避免重复代码、提高服务的稳定性和扩展性。

这篇文章是基于我多年来在处理一些糟糕的 Node.js 项目结构、不好的设计模式以及无数个小时的代码重构经验的探索研究。

如果您需要帮助调整 Node.js 项目架构，只需给我发一封信 sam@softwareontheroad.com。

## 目录

* [目录结构 🏢](#目录结构-🏢)
* [三层架构 🥪](#三层架构-🥪)
* [服务层 💼](#将业务逻辑用于服务层-💼)
* [Pub/Sub 层 ️️️️🎙️️](#发布与订阅层-🎙️)
* [依赖注入💉](#依赖注入💉)
* [单元测试🕵🏻](#单元测试🕵🏻)
* [Cron Jobs 和重复任务 ⚡](#Cron-Jobs-和重复任务-⚡)
* [配置和密钥 🤫](配置和密钥-🤫)
* [Loaders 🏗️](Loaders-🏗️)

## 目录结构 🏢

这是我要谈论的 Node.js 项目结构。

我在构建的每个 Node.js REST API 服务中都使用了下面这个结构，让我们了解下每个组件的功能。

```
src
  │   app.js          # App 入口
  └───api             # Express route controllers for all the endpoints of the app
  └───config          # 环境变量和配置相关
  └───jobs            # 对于 agenda.js 的任务调度定义
  └───loaders         # 将启动过程拆分为模块
  └───models          # 数据库模型
  └───services        # 所有的业务逻辑应该在这里
  └───subscribers     # 异步任务的事件处理程序
  └───types           # 对于 Typescript 的类型声明文件（d.ts）
```

以上不仅仅是组织 JavaScript 文件的一种方式...

## 三层架构 🥪

其思想是使用**关注点分离原则**将业务逻辑从 Node.js API 路由中移开。

![server_layers](./img/bulletproof-node.js-project-architecture-server_layers.jpg)

因为有一天，您将希望在一个 CLI 工具上来使用您的业务逻辑，又或从来不使用。对于一些重复的任务，然后从 Node.js 服务器上对它自己进行调用，显然这不是一个好的主意。

![server_layers_2](./img/bulletproof-node.js-project-architecture-server_layers_2.jpg)


### ☠️ 不要将您的业务逻辑放入控制器中!! ☠️

你可能想用 Express.js 的 Controllers 层来存储应用层的业务逻辑，但是很快你的代码将会变得难以维护，只要你需要编写单元测试，就需要编写 Express.js req 或 res 对象的复杂模拟。

判断何时应该发送响应以及何时应该在 “后台” 继续处理（例如，将响应发送到客户端之后），这两个问题比较复杂。

```js
route.post('/', async (req, res, next) => {

    // 这应该是一个中间件或者应该由像 Joi 这样的库来处理
    // Joi 是一个数据校验的库 github.com/hapijs/joi
    const userDTO = req.body;
    const isUserValid = validators.user(userDTO)
    if(!isUserValid) {
      return res.status(400).end();
    }

    // 这里有很多业务逻辑...
    const userRecord = await UserModel.create(userDTO);
    delete userRecord.password;
    delete userRecord.salt;
    const companyRecord = await CompanyModel.create(userRecord);
    const companyDashboard = await CompanyDashboard.create(userRecord, companyRecord);

    ...whatever...


    // 这就是把一切都搞砸的“优化”。
    // 响应被发送到客户端...
    res.json({ user: userRecord, company: companyRecord });

    // 但代码块仍在执行 :(
    const salaryRecord = await SalaryModel.create(userRecord, companyRecord);
    eventTracker.track('user_signup',userRecord,companyRecord,salaryRecord);
    intercom.createUser(userRecord);
    gaAnalytics.event('user_signup',userRecord);
    await EmailService.startSignupSequence(userRecord)
  });
```

## 将业务逻辑用于服务层 💼

这一层是放置您的业务逻辑。

遵循适用于 Node.js 的 SOLID 原则，它只是一个具有明确目的的类的集合。

这一层不应存在任何形式的 “SQL 查询”，可以使用数据访问层。

* 从 Express.js 的路由器移除你的代码。
* 不要将 req 或 res 传递给服务层
* 不要从服务层返回任何与 HTTP 传输层相关的信息，例如 status code（状态码）或者 headers

例子

```js
route.post('/', 
    validators.userSignup, // 这个中间层负责数据校验
    async (req, res, next) => {
      // 路由层实际负责的
      const userDTO = req.body;

      // 调用 Service 层
      // 关于如何访问数据层和业务逻辑层的抽象
      const { user, company } = await UserService.Signup(userDTO);

      // 返回一个响应到客户端
      return res.json({ user, company });
    });
```

这是您的服务在后台的运行方式。

```js
import UserModel from '../models/user';
import CompanyModel from '../models/company';

export default class UserService {

    async Signup(user) {
        const userRecord = await UserModel.create(user);
        const companyRecord = await CompanyModel.create(userRecord); // needs userRecord to have the database id 
        const salaryRecord = await SalaryModel.create(userRecord, companyRecord); // depends on user and company to be created

        ...whatever

        await EmailService.startSignupSequence(userRecord)

        ...do more stuff

        return { user: userRecord, company: companyRecord };
    }
}
```

## 发布与订阅层 🎙️

pub/sub 模式超出了这里提出的经典的 3 层架构，但它非常有用。

现在创建一个用户的简单 Node.js API 端点，也许是调用第三方服务，也许是一个分析服务，也许是开启一个电子邮件序列。

不久之后，这个简单的 “创建” 操作将完成几件事，最终您将获得 1000 行代码，所有这些都在一个函数中。

这违反了单一责任原则。

因此，最好从一开始就将职责划分，以使您的代码保持可维护性。

```js
import UserModel from '../models/user';
  import CompanyModel from '../models/company';
  import SalaryModel from '../models/salary';

  export default class UserService() {

    async Signup(user) {
      const userRecord = await UserModel.create(user);
      const companyRecord = await CompanyModel.create(user);
      const salaryRecord = await SalaryModel.create(user, salary);

      eventTracker.track(
        'user_signup',
        userRecord,
        companyRecord,
        salaryRecord
      );

      intercom.createUser(
        userRecord
      );

      gaAnalytics.event(
        'user_signup',
        userRecord
      );

      await EmailService.startSignupSequence(userRecord)

      ...more stuff

      return { user: userRecord, company: companyRecord };
    }

  }
```

**强制调用依赖服务不是一个好的做法。**

一个最好的方法是触发一个事件，即 “user_signup”，像下面这样已经完成了，剩下的就是事件监听者的事情了。

```js
import UserModel from '../models/user';
  import CompanyModel from '../models/company';
  import SalaryModel from '../models/salary';

  export default class UserService() {

    async Signup(user) {
      const userRecord = await this.userModel.create(user);
      const companyRecord = await this.companyModel.create(user);
      this.eventEmitter.emit('user_signup', { user: userRecord, company: companyRecord })
      return userRecord
    }

  }
```

现在，您可以将事件处理程序/侦听器拆分为多个文件。

```js
eventEmitter.on('user_signup', ({ user, company }) => {

    eventTracker.track(
        'user_signup',
        user,
        company,
    );

    intercom.createUser(
        user
    );

    gaAnalytics.event(
        'user_signup',
        user
    );
})
```

```js
eventEmitter.on('user_signup', async ({ user, company }) => {
    const salaryRecord = await SalaryModel.create(user, company);
})
```

```js
eventEmitter.on('user_signup', async ({ user, company }) => {
    await EmailService.startSignupSequence(user)
})
```

你可以将 await 语句包装到 try-catch 代码块中，也可以让它失败并通过 'unhandledPromise' 处理 process.on('unhandledRejection',cb)。

## 依赖注入💉

DI 或控制反转（IoC）是一种常见的模式，通过 “注入” 或通过构造函数传递类或函数的依赖关系，有助于代码的组织。

通过这种方式，您可以灵活地注入“兼容的依赖项”，例如，当您为服务编写单元测试时，或者在其他上下文中使用服务时。

***没有 DI 的代码***

```js
import UserModel from '../models/user';
import CompanyModel from '../models/company';
import SalaryModel from '../models/salary';  
class UserService {
    constructor(){}
    Sigup(){
        // Caling UserMode, CompanyModel, etc
        ...
    }
}
```

带有手动依赖项注入的代码

```js
export default class UserService {
    constructor(userModel, companyModel, salaryModel){
        this.userModel = userModel;
        this.companyModel = companyModel;
        this.salaryModel = salaryModel;
    }
    getMyUser(userId){
        // models available throug 'this'
        const user = this.userModel.findById(userId);
        return user;
    }
}
```

在您可以注入自定义依赖项。

```js
import UserService from '../services/user';
import UserModel from '../models/user';
import CompanyModel from '../models/company';
const salaryModelMock = {
  calculateNetSalary(){
    return 42;
  }
}
const userServiceInstance = new UserService(userModel, companyModel, salaryModelMock);
const user = await userServiceInstance.getMyUser('12346');
```

服务可以拥有的依赖项数量是无限的，当您添加一个新服务时，重构它的每个实例化是一项乏味且容易出错的任务。这就是创建依赖注入框架的原因。

这个想法是在类中定义你的依赖，当你需要一个类的实例时只需要调用 “Service Locator” 即可。

现在让我们来看一个使用 TypeDI 的 NPM 库示例，以下 Node.js 示例将引入 DI。

可以在官网查看更多关于 TypeDI 的信息。

[https://www.github.com/typestack/typedi](https://www.github.com/typestack/typedi)

***typescript 示例***

```ts
import { Service } from 'typedi';
@Service()
export default class UserService {
    constructor(
        private userModel,
        private companyModel, 
        private salaryModel
    ){}

    getMyUser(userId){
        const user = this.userModel.findById(userId);
        return user;
    }
}
```

***services/user.ts***

现在 TypeDI 将负责解决 UserService 需要的任何依赖项。

```ts
import { Container } from 'typedi';
import UserService from '../services/user';
const userServiceInstance = Container.get(UserService);
const user = await userServiceInstance.getMyUser('12346');
```

滥用 service locator 调用是一种 anti-pattern（反面模式）

### 依赖注入与 Express.js 结合实践

在 Express.js 中使用 DI 是 Node.js 项目体系结构的最后一个难题。

**路由层**

```js
route.post('/', 
    async (req, res, next) => {
        const userDTO = req.body;

        const userServiceInstance = Container.get(UserService) // Service locator

        const { user, company } = userServiceInstance.Signup(userDTO);

        return res.json({ user, company });
    });
```

太好了，项目看起来很棒！它是如此的有条理，使我现在想编码。

## 单元测试示例🕵🏻

通过使用依赖项注入和这些组织模式，单元测试变得非常简单。

你不必模拟 req/res 对象或 require(...) 调用。

**示例**：用户注册方法的单元测试

***tests/unit/services/user.js***

```js
import UserService from '../../../src/services/user';

  describe('User service unit tests', () => {
    describe('Signup', () => {
      test('Should create user record and emit user_signup event', async () => {
        const eventEmitterService = {
          emit: jest.fn(),
        };

        const userModel = {
          create: (user) => {
            return {
              ...user,
              _id: 'mock-user-id'
            }
          },
        };

        const companyModel = {
          create: (user) => {
            return {
              owner: user._id,
              companyTaxId: '12345',
            }
          },
        };

        const userInput= {
          fullname: 'User Unit Test',
          email: 'test@example.com',
        };

        const userService = new UserService(userModel, companyModel, eventEmitterService);
        const userRecord = await userService.SignUp(teamId.toHexString(), userInput);

        expect(userRecord).toBeDefined();
        expect(userRecord._id).toBeDefined();
        expect(eventEmitterService.emit).toBeCalled();
      });
    })
  })
```

## Cron Jobs 和重复任务 ⚡

因此，既然业务逻辑封装到了服务层中，那么从 Cron job 中使用它就更容易了。

您不应该依赖 Node.js setTimeout 或其他延迟代码执行的原始方法，而应该依赖于一个将您的 Jobs 及其执行持久化到数据库中的框架。

这样您将控制失败的 Jobs 和一些成功者的反馈，可参考我写的关于最佳 Node.js 任务管理器 [https://softwareontheroad.com/nodejs-scalability-issues/](https://softwareontheroad.com/nodejs-scalability-issues/)

## 配置和密钥 🤫

遵循经过测试验证适用于 Node.js 的 Twelve-Factor App（十二要素应用 [https://12factor.net/](https://12factor.net/)）概念，这是存储 API 密钥和数据库链接字符串的最佳实践，它是用的 dotenv。

放置一个 .env 文件，这个文件永远不能提交（但它必须与默认值一起存在于存储库中），然后，这个 dotenv NPM 包将会加载 .env 文件并将里面的变量写入到 Node.js 的 process.env 对象中。

这就足够了，但是，我想增加一个步骤。有一个 config/index.ts 文件，其中 NPM 包 dotenv 加载 .env 

文件，然后我使用一个对象存储变量，因此我们具有结构和代码自动完成功能。

***config/index.js***

```js
const dotenv = require('dotenv');
  // config() 将读取您的 .env 文件，解析其中的内容并将其分配给 process.env
  dotenv.config();

  export default {
    port: process.env.PORT,
    databaseURL: process.env.DATABASE_URI,
    paypal: {
      publicKey: process.env.PAYPAL_PUBLIC_KEY,
      secretKey: process.env.PAYPAL_SECRET_KEY,
    },
    paypal: {
      publicKey: process.env.PAYPAL_PUBLIC_KEY,
      secretKey: process.env.PAYPAL_SECRET_KEY,
    },
    mailchimp: {
      apiKey: process.env.MAILCHIMP_API_KEY,
      sender: process.env.MAILCHIMP_SENDER,
    }
  }
```

这样，您可以避免使用 process.env.MY_RANDOM_VAR 指令来充斥代码，并且通过自动补全，您不必知道如何命名环境变量。

## Loaders 🏗️

我从 W3Tech 的微框架中采用这种模式，但并不依赖于它们的包装。

这个想法是将 Node.js 的启动过程拆分为可测试的模块。

让我们看一下经典的 Express.js 应用初始化

```js
const mongoose = require('mongoose');
  const express = require('express');
  const bodyParser = require('body-parser');
  const session = require('express-session');
  const cors = require('cors');
  const errorhandler = require('errorhandler');
  const app = express();

  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
  app.use(cors());
  app.use(require('morgan')('dev'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json(setupForStripeWebhooks));
  app.use(require('method-override')());
  app.use(express.static(__dirname + '/public'));
  app.use(session({ secret: process.env.SECRET, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

  require('./config/passport');
  require('./models/user');
  require('./models/company');
  app.use(require('./routes'));
  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: {}
    }});
  });


  ... more stuff 

  ... maybe start up Redis

  ... maybe add more middlewares

  async function startServer() {    
    app.listen(process.env.PORT, err => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Your server is ready !`);
    });
  }

  // Run the async function to start our server
  startServer();
```

如您所见，应用程序的这一部分可能真是一团糟。

这是一种有效的处理方法。

```js
const loaders = require('./loaders');
const express = require('express');

async function startServer() {

  const app = express();

  await loaders.init({ expressApp: app });

  app.listen(process.env.PORT, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Your server is ready !`);
  });
}

startServer();
```

现在目的很明显 loaders 仅仅是一个小文件。

***loaders/index.js***

```js
 import expressLoader from './express';
  import mongooseLoader from './mongoose';

  export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    console.log('MongoDB Intialized');
    await expressLoader({ app: expressApp });
    console.log('Express Intialized');

    // ... more loaders can be here

    // ... Initialize agenda
    // ... or Redis, or whatever you want
  }
```

The express loader

***loaders/express.js***

```js
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

export default async ({ app }: { app: express.Application }) => {

    app.get('/status', (req, res) => { res.status(200).end(); });
    app.head('/status', (req, res) => { res.status(200).end(); });
    app.enable('trust proxy');

    app.use(cors());
    app.use(require('morgan')('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));

    // ...More middlewares

    // Return the express app
    return app;
})
```

The mongo loader

***loaders/mongoose.js***
```js
import * as mongoose from 'mongoose'
export default async (): Promise<any> => {
    const connection = await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    return connection.connection.db;
}
```

以上代码可从代码仓库 https://github.com/santiq/bulletproof-nodejs 获取。

## 结论

我们深入研究了经过生产测试的 Node.js 项目结构，以下是一些总结的技巧：

* 使用 3 层架构。
* 不要将您的业务逻辑放入 Express.js 控制器中。
* 使用 Pub/Sub 模式并为后台任务触发事件。
* 进行依赖注入，让您高枕无忧。
* 切勿泄漏您的密码、机密和 API 密钥，请使用配置管理器。
* 将您的 Node.js 服务器配置拆分为可以独立加载的小模块。


> 原文：https://softwareontheroad.com/ideal-nodejs-project-structure/
> 作者：Sam Quinn
> 译者：五月君
> 更多优质文章：关注公众号 “[Nodejs技术栈](https://nodejsred.oss-cn-shanghai.aliyuncs.com/node_roadmap_wx.jpg?x-oss-process=style/may)”，开源项目 “https://www.nodejs.red/”