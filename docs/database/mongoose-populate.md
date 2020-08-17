# Mongoose 关联查询和踩坑记录

本文源自工作中的一个问题，在使用 Mongoose 做关联查询时发现使用 populate() 方法不能直接关联非 _id 之外的其它字段，在网上搜索时这块的解决方案也并不是很多，在经过一番查阅、测试之后，有两种可行的方案，使用 Mongoose 的 virtual 结合 populate 和 MongoDB 原生提供的 Aggregate 里面的 $lookup 阶段来实现。

## 文档内嵌与引用模式

MongoDB 是一种文档对象模型，使用起来很灵活，它的文档结构分为 **内嵌和引用** 两种类型。

**内嵌是把相关联的数据保存在同一个文档内，我们可以用对象或数组的形式来存储**，这样好处是我们可以在一个单一操作内完成，可以发送较少的请求到数据库服务端，但是这种内嵌类型也是一种冗余的数据模型，会造成数据的重复，如果很复杂的一对多或多对多的关系，表达起来就很复杂，也要注意内嵌还有一个最大的单条文档记录限制为 16MB。

**引用模型是一种规范化的数据模型**，通过主外键的方式来关联多个文档之间的引用关系，减少了数据的冗余，在使用这种数据模型中就要用到关联查询，也就是本文我们要讲解的重点。<br />


![](https://mongoing.com/docs/_images/data-model-normalized.png)

 图片来源：[mongoing](https://mongoing.com/docs/core/data-modeling-introduction.html#references "mongoing")

<a name="LkL9O"></a>
## 引用模型示例
<a name="uiAXk"></a>
### JSON 模型
我们通过作者和书籍的关系，一个作者对应多个书籍这样一个简单的示例来学习如何在 MongoDB 中实现关联非 _id 查询。

- Author
```javascript
{
  "bookIds":[
      26351021,
      26854244,
      27620408
  ],
  "authorId":1,
  "name":"Kyle Simpson"
}
```

- Book
```javascript
[
  {
    "bookId":26351021,
    "name":"你不知道的JavaScript（上卷）",
  },
  {
    "bookId":26854244,
    "name":"你不知道的JavaScript（中卷）",
  },
  {
    "bookId":27620408,
    "name":"你不知道的JavaScript（下卷）",
  }
]
```
<a name="yKtHS"></a>
### 定义 Schema
使用 Mongoose 第一步要先定义集合的 Schema。

- **author.js**

创建 model/author.js 定义作者的 Schema，代码中的 ref 表示要关联的 Model 是谁，在 Schema 定义好之后后面我会创建 Model
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
  authorId: Number,
  name: String,
  bookIds: [{ type: Number, ref: 'Books' }]
});
AuthorSchema.index({ authorId: 1}, { unique: true });

module.exports = AuthorSchema;
```

- book.js

创建 model/book.js 定义书籍的 Schema。
```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BookSchema = new Schema({
  bookId: Number,
  name: String,
});
BookSchema.index({ bookId: 1}, { unique: true });

module.exports = BookSchema;
```

- index.js

创建 model/index.js 定义 Model 和链接数据库。
```javascript
const mongoose = require('mongoose');
const AuthorSchema = require('./author');
const BookSchema = require('./book');

const DB_URL = process.env.DB_URL;
const AuthorModel = mongoose.model('Authors', AuthorSchema, 'authors');
const BookModel = mongoose.model('Books', BookSchema, 'books');

mongoose.set('useCreateIndex', true)
mongoose.connect(DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

module.exports = {
  AuthorModel,
  BookModel,
}
```
<a name="ghAwU"></a>
## 使用 Aggregate 的 $lookup 实现关联查询
MongoDB 3.2 版本新增加了 ```$lookup``` 实现多表关联，在聚合管道阶段中使用，经过 ```$lookup``` 阶段的处理，输出的新文档中会包含一个新生成的数组列。

创建一个 aggregateTest.js 重点在于 $lookup 对象，代码如下所示：

- $lookup.from: 在同一个数据库中指定要 Join 的集合的名称。
- $lookup.localFiled: 关联的源集合中的字段，本示例中是 Authors 表的 authorId 字段。
- $lookup.foreignFiled: 被 Join 的集合的字段，本示例中是 Books 表的 bookId 字段。
- $as:  别名，关联查询返回的这个结果起一个新的名称。

如果需要指定哪些字段返回，哪些需要过滤，可定义 $project 对象，关联查询的字段过滤可使用 **别名.关联文档中的字段** 进行指定。
```javascript
const { AuthorModel } = require('./model');
(async () => {
  const res = await AuthorModel.aggregate([
    {
      $match: { authorId: 1 }
    },
    {
      $lookup: {
        from: 'books',
        localField: 'bookIds',
        foreignField: 'bookId',
        as: 'bookList',
      }
    },
    {
      $project: {
        '_id': 0,
        'authorId': 1,
        'name': 1,
        'bookList.bookId': 1, // 指定 books 表的 bookId 字段返回
        'bookList.name': 1
      }
    }
  ]);
  console.log(JSON.stringify(res));
})();
```
运行以上程序，将得到以下结果：
```javascript
[
  {
    "authorId":1,
    "name":"Kyle Simpson",
    "bookList":[
      {
        "bookId":26351021,
        "name":"你不知道的JavaScript（上卷）"
      },
      {
        "bookId":26854244,
        "name":"你不知道的JavaScript（中卷）"
      },
      {
        "bookId":27620408,
        "name":"你不知道的JavaScript（下卷）"
      }
    ]
  }
]
```
关于 $lookup 更多操作参考 MongoDB 官方文档 [#lookup-aggregation](https://docs.mongodb.com/v4.2/reference/operator/aggregation/lookup/index.html "#lookup-aggregation")
<a name="ps2dU"></a>
## Mongoose Virtual 和 populate 实现
Mongoose 的 populate 方法默认情况下是指向的要关联的集合的 _id 字段，并且在 populate 方法里无法更改的，但是在 Mongoose 4.5.0 之后增加了[虚拟值填充](http://www.mongoosejs.net/docs/populate.html#populate-virtuals "虚拟值填充")，以便实现文档中更复杂的一些关系。

在我们本节示例中 Authors 集合会关联 Books 集合，那么我们就需要在 Authors 集合中定义 virtual, 下面的一些参数和 $lookup 是一样的，个别参数做下介绍：

- ref: 表示的要 Join 的集合的名称，同 $lookup.from
- justOne: 默认为 false 返回多条数据，如果设置为 true 就只会返回一条数据
```javascript
AuthorSchema.virtual('bookList', {
  ref: 'Books',
  localField: 'bookIds',
  foreignField: 'bookId',
  justOne: false,
});
```
之前在这样设置之后，发现没有效果，这里还要注意一点： **虚拟值默认不会被 toJSON() 或 toObject 输出。**<br />
<br />**如果你需要填充的虚拟值的显示是在 JSON 序列化中输出，就需要设置 toJSON 属性**，例如 console.log(JSON.stringify(res))。**如果是直接显示的对象，就需要设置 toObject 属性**，例如直接打印 console.log(res)。

可以在创建 Schema 时在第二个参数 options 中设置，也可以使用创建的 Schema 对象的 set 方法设置。

```javascript
const AuthorSchema = new Schema({
  authorId: Number,
  name: String,
  bookIds: [{ type: Number, ref: 'Books' }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// 或以下方式
// AuthorSchema.set('toObject', { virtuals: true });
// AuthorSchema.set('toJSON', { virtuals: true });
```
经过以上设置之后就可以使用 populate 做关联查询。
```javascript
const { AuthorModel } = require('./model');
(async () => {
  const res = await AuthorModel.findOne({ authorId: 1 })
    .populate({
      path: 'bookList',
      select: 'bookId name -_id'
    });
})();
```
Mongoose 的虚拟值填充，还可以对匹配的文档数量进行计数，使用如下：
```javascript
// model/author.js
AuthorSchema.virtual('bookListCount', {
  ref: 'Books',
  localField: 'bookIds',
  foreignField: 'bookId',
  count: true
});

// populateTest.js
const res = await AuthorModel.findOne({ authorId: 1 }).populate('bookListCount');
console.log(res.bookListCount); // 3
```
<a name="ehM10"></a>
## 总结
本文主要是介绍了在 Mongoose 关联查询时如何关联一个非 _id 字段，一种方式是直接使用 MongoDB 原生提供的 Aggregate 聚合管道的 ```$lookup``` 阶段来实现，这种方式使用起来灵活，可操作的空间更大，例如通过 as 即可对字段设置别名，还可以使用 ```$unwind``` 等关键字对数据做二次处理。另外一种是 Mongoose 提供的 populate 方法，这种方式写起来，代码会更简洁些，**这里需要注意如果关联的字段是非 _id 字段，一定要在 Schema 中设置虚拟值填充，否则 populate 关联时会失败**。

Github 获取文中代码示例 [mongoose-populate](https://github.com/qufei1993/Examples/tree/master/code/database/mongoose-populate "mongoose-populate")