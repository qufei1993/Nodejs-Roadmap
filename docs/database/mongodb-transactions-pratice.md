# MongoDB 事务 —— 多文档事务实践篇

MongoDB 在单文档操作中具有原子性，在多文档操作中就不再具有此特性，通常需要借助事务来实现 ACID 特性。

## 事务 API 介绍

客户端对于事务的操作，都由 MongoDB Client Driver 实现提供相应的 API 接口。MongoDB 4.0 之后才支持事务，对于客户端驱动版本也要选择相对应版本。

本文采用 [MongoDB Client Driver 3.5 版本](http://mongodb.github.io/node-mongodb-native/3.5/api/ClientSession.html)

### 会话 Session

Session 是 MongoDB 3.6 之后引入的概念，在以前的版本中，Mongod 进程中的每一个请求会创建一个上下文（OperationContext），可以理解为一个单行事务，**这个单行事务中对于数据、索引、oplog 的修改都是原子性的**。

MongoDB 3.6 之后的 Session 本质上也是一个上下文，在这个 Session 会话中多个请求共享一个上下文，为多文档事务实现提供了基础。

> 一个知识点：**为何 db.coll.count() 在宕机崩溃后经常就不准了?** 

原因在于 **表记录数的更新独立于数据更新的事务之外**，参考文章 [mongoing.com/archives/5476](http://mongoing.com/archives/5476)。

### 事务函数

* **startTransaction()**

开启一个新的事务，之后即可进行 CRUD 操作。

* **commitTransaction()**

提交事务保存数据，在提交之前事务中的变更的数据对外是不可见的。

* **abortTransaction()**

事务回滚，例如，一部分数据更新失败，对已修改过的数据也进行回滚。

* **endSession()**

结束本次会话。

## Mongo Shell 中简单实现

```js
var session = db.getMongo().startSession();
session.startTransaction({readConcern: { level: 'majority' },writeConcern: { w: 'majority' }});
var coll = session.getDatabase('test').getCollection('user');

coll.update({name: 'Jack'}, {$set: {age: 18}})

// 成功提交事务
session.commitTransaction();

// 失败事务回滚
session.abortTransaction();
```

## MongoDB 事务在 Nodejs 中的实践

为了更好的理解 MongoDB 事务在 Node.js 中如何应用，列举一个例子进行说明。

假设我们现在有这样一个商城商品下单场景，分为一个商品表（存储商品数据、库存信息），另一个订单表（存储订单记录）。每次下单之前需要先校验库存是否大于 0，大于 0 的时候扣减商品库存、创建订单，否则，提示库存不足无法下单。

### 数据模型

```js
// goods
{
    "_id": ObjectId("5e3b839ec2d95bfeecaad6b8"),
    "goodId":"g1000", // 商品 Id
    "name":"测试商品1", // 商品名称
    "stock":2, // 商品库存
    "price":100 // 商品金额
}
// db.goods.insert({ "goodId" : "g1000", "name" : "测试商品1", "stock" : 2, "price" : 100 })
```

```js
// order_goods
{
    "_id":ObjectId("5e3b8401c2d95bfeecaad6b9"),
    "id":"o10000", // 订单id
    "goodId":"g1000", // 订单对应的商品 Id
    "price":100 // 订单金额
}
// db.order_goods.insert({ id: "o10000", goodId: "g1000", price: 100 })
```

### Node.js 操作 MongoDB 原生 API 实现

**注意**：在一个事务操作中 readPreference 必须设置为 primary 节点，不能是 secondary 节点。

**db.js**

链接 MongoDB，初始化一个实例。

```js
const MongoClient = require('mongodb').MongoClient;
const dbConnectionUrl = 'mongodb://192.168.6.131:27017,192.168.6.131:27018,192.168.6.131:27019/?replicaSet=May&readPreference=secondaryPreferred';
const client = new MongoClient(dbConnectionUrl, {
  useUnifiedTopology: true,
});

let instance = null;

module.exports = {
  dbInstance: async () => {
    if (instance) {
      return instance;
    }

    try {
      instance = await client.connect();
    } catch(err) {
      console.log(`[MongoDB connection] ERROR: ${err}`);
      throw err;
    }

    process.on('exit', () => {
      instance.close();
    });

    return instance;
  }
};
```

**index.js**

```js
const db = require('./db');

const testTransaction = async (goodId) => {
  const client = await db.dbInstance();
  const transactionOptions = {
    readConcern: { level: 'majority' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary',
  };

  const session = client.startSession();
  console.log('事务状态：', session.transaction.state);

  try {
    session.startTransaction(transactionOptions);
    console.log('事务状态：', session.transaction.state);

    const goodsColl = await client.db('test').collection('goods');
    const orderGoodsColl = await client.db('test').collection('order_goods');
    const { stock, price } = await goodsColl.findOne({ goodId }, { session });
    
    console.log('事务状态：', session.transaction.state);
    
    if (stock <= 0) {
        throw new Error('库存不足');
    }

    await goodsColl.updateOne({ goodId }, {
        $inc: { stock: -1 } // 库存减 1
    })
    await orderGoodsColl.insertOne({ id: Math.floor(Math.random() * 1000),  goodId, price  }, { session });
    await session.commitTransaction();
  } catch(err) {
    console.log(`[MongoDB transaction] ERROR: ${err}`);
    await session.abortTransaction();
  } finally {
    await session.endSession();
    console.log('事务状态：', session.transaction.state);
  }
}

testTransaction('g1000')
```

**运行测试**

每一次事务函数执行之后，查看当前事务状态。

```
node index
事务状态： NO_TRANSACTION
事务状态： STARTING_TRANSACTION
事务状态： TRANSACTION_IN_PROGRESS
事务状态： TRANSACTION_COMMITTED
```