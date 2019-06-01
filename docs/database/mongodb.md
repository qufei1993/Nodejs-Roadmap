# MongoDB

## 快速导航
- [Mac 系统安装 MongoDB](#Mac系统下安装MongoDB)
- [CRUD 操作](#CRUD操作)
- [MongoDB 聚合管道（Aggregation Pipeline）](#聚合管道)
- [DBRef 数据引用](#dbref数据引用)
- [Nodejs 客户端链接 MongoDB](#Nodejs客户端链接MongoDB)
- [MongoDB 索引](database/mongodb-indexes.md)

## Mac系统下安装MongoDB

> Mac 系统可通过 Homebrew 安装 MongoDB 还是相对较简单的

- **更新 Homebrew 数据包**

```
brew update
```

- **安装 MongoDB**

```
brew install mongodb
```

- **启动 MongoDB**

通过 ```--dbpath``` 参数自定义目录路径，若省略 ```--dbpath``` 参数，将会使用系统默认的数据目录 (```/data/db```) 

```
mongod --dbpath <自定义的目录路径>
```

- **检查是否成功启动**

> 出现以下信息链接成功，默认端口为 27017

```r
2018-01-28T21:20:50.190+0800 I CONTROL  [initandlisten] MongoDB starting : pid=10488 port=27017 dbpath=/Users/may/documents/mongodb/data 64-bit host=XXXX.local
2018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] db version v3.6.22018-01-28T21:20:50.191+0800 I CONTROL  [initandlisten] git version: 489d177dbd0f0420a8ca04d39fd78d0a2c539420
2018-01-28T21:20:50.956+0800 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
2018-01-28T21:20:50.979+0800 I FTDC     [initandlisten] Initializing full-time diagnostic data capture with directory '/Users/may/documents/mongodb/data/diagnostic.data'
2018-01-28T21:20:50.980+0800 I NETWORK  [initandlisten] waiting for connections on port 27017
```

- **打开 mongodb 客户端**

打开本地控制台输入命令 mongo 连接到 mongodb 服务器

```
mongo
```

看到以下信息链接成功，会显示 mongodb 的版本号、链接地址，默认端口号为 27017

```r
MongoDB shell version v3.6.2
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.2
Server has startup warnings: 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] ** WARNING: Access control is not enabled for the database.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          Read and write access to data and configuration is unrestricted.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] ** WARNING: This server is bound to localhost.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          Remote systems will be unable to connect to this server. 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          Start the server with --bind_ip <address> to specify which IP 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          addresses it should serve responses from, or with --bind_ip_all to
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          bind to all interfaces. If this behavior is desired, start the
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] **          server with --bind_ip 127.0.0.1 to disable this warning.
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] 
2018-01-28T20:26:16.102+0800 I CONTROL  [initandlisten] ** WARNING: soft rlimits too low. Number of files is 256, should be at least 1000
```
- **显示所有数据库**

```r
> show dbs
admin   0.000GB
config  0.000GB
local   0.000GB
```

- **查看当前所连接的数据库**

```r
> db
test
```

- **查看当前数据库下的所有集合(数据表)**

```r
> show collections
demo_admin
```

- **切换/创建数据库**

切换数据库，使用use之前我们不需要对数据库进行额外的创建，在mongo中会在需要的时候自己创建。

```
> use demo
switched to db demo
```

## CRUD操作

#### 插入数据（Create）

向 demo_admin 表中插入数据，mongo 中使用 json 格式以键值对的方式插入数据，会自动创建一个 _id（ObjectID） 字段，在全局范围内不会重复

```
> db.demo_admin.insert({name: 'Jack'})
```

- ***循环插入数据***

```
> for(i=0;i<10;i++)db.demo_admin.insert({x:i})
```

#### 读取数据（Retrieve）

- ***查找所有***

```
> db.demo_admin.find()
{ "_id" : ObjectId("5a6e82586757472b44d72122"), "name" : "Jack" }
{ "_id" : ObjectId("5a6e83206757472b44d72123"), "x" : 0 }
{ "_id" : ObjectId("5a6e83206757472b44d72124"), "x" : 1 }
{ "_id" : ObjectId("5a6e83206757472b44d72125"), "x" : 2 }
{ "_id" : ObjectId("5a6e83206757472b44d72126"), "x" : 3 }
{ "_id" : ObjectId("5a6e83206757472b44d72127"), "x" : 4 }
{ "_id" : ObjectId("5a6e83206757472b44d72128"), "x" : 5 }
{ "_id" : ObjectId("5a6e83206757472b44d72129"), "x" : 6 }
{ "_id" : ObjectId("5a6e83206757472b44d7212a"), "x" : 7 }
{ "_id" : ObjectId("5a6e83206757472b44d7212b"), "x" : 8 }
{ "_id" : ObjectId("5a6e83206757472b44d7212c"), "x" : 9 }
```

- ***指定条件查找***

```
> db.demo_admin.find({x: 0})
{ "_id" : ObjectId("5a6e83206757472b44d72123"), "x" : 0 }
```

- ***按条件或查找***

```
> db.demo_admin.find({'$or': [{x: 1}, {name: 'jack'}]})
{ "_id" : ObjectId("5a6e83206757472b44d72124"), "x" : 1 }
```

- ***使用count数据统计***

```
> db.demo_admin.find().count()
11
```

- ***其他查找方法***
	* ```skip(3)```：表示过滤掉前 3 条  
	* ```limit(2)```：显示 2 条结果  
	* ```sort({x:1})```： 使用 x:1 递增排序 ASC，-1 时递减排序 DESC  

```
> db.demo_admin.find().skip(3).limit(2).sort({x:1});
{ "_id" : ObjectId("5a6e83206757472b44d72125"), "x" : 2 }
{ "_id" : ObjectId("5a6e83206757472b44d72126"), "x" : 3 }
```

#### 更新数据（Update）

- ***语法***
	* a 代表修改条件
	* b 代表的是新的数据内容
	* c 值为 bool 类型，作用是如果修改的数据在数据库中不存在，是否插入数据库默认 false，表示不插入
	* d 作用是同样条件的数据，只修改一条还是修改所有默认 false
```
db.conllections.update(a, b, c, d);
```
- ***将条件 x=1 更新为 x=111***

```
> db.demo_admin.update({"x":1},{"x":111}) 
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```

- ***c 值测试***

设置 c 值为 true，插入一条新的数据

```
> db.demo_admin.update({"y":999}, {"y":9999}, true)
WriteResult({
  "nMatched" : 0,
  "nUpserted" : 1,
  "nModified" : 0,
  "_id" : ObjectId("5a6e85a36c2de84d2e5a69d6")
})
```

设置 c 值为 false，则不会插入数据

```r
> db.demo_admin.update({"y":999},{"y":9999888}, false)
WriteResult({ "nMatched" : 0, "nUpserted" : 0, "nModified" : 0 })
```

- ***d 值测试***

```r
db.demo_admin.update({"a":2},{$set:{"a":222}},false,true);
db.demo_admin.update({"x":100},{$set:{"y":99}})
```


- **MongoDB对象数组更新**

> 例如：使用 update 对集合中的 orderNo 为 o111111 字段下的 userInfo 数组对象下的 cardNo 等于 123456789 这个对象中的 logs 字段和 status 字段(在更新的时候没有 status 字段将会创建) 进行日志更新

```javascript
{
	"_id" : ObjectId("59546c5051eb690367d457fa"),
	"orderNo" : "o111111"
	"userInfo" : [
		{
			"name" : "o1111",
			"cardNo" : "123456789",
			"logs" : [
				"2017-08-09 timeline ...",
			]
		}
		...
	]
},
...
}
```

可以使用 $push 在找到 logs 数组后依次添加日志信息

```javascript
let condition = {"orderNo":"o111111","userInfo.cardNo":"123456789"}

let update = {
	$push: {
		"passengers.$.logs": "2017-08-10 timeline1 ..."
	}
}
db.collections.findOneAndUpdate(condition, update, { returnOriginal: false })
```

也可以使用 $set 对某个字段进行更新

```javascript
let condition = {"orderNo":"o111111","userInfo.cardNo":"123456789"}

let update = {
	$set: {"passengers.$.status": "已更新"}
}

DB.orderColl.updateOne(condition,update)
```

需要注意的点是位置运算符 $ 只能在查询中使用一次，官方对于这个问题提出了一个方案 [https://jira.mongodb.org/browse/SERVER-831](https://jira.mongodb.org/browse/SERVER-831) 如果能在未来发布这将是非常有用的。如果，目前你需要在嵌套层次很深的情况下想对数组的内容进行修改可以采用 forEach() 方法操作，像下面这样：

```javascript
db.post
  .find({"answers.comments.name": "jeff"})
  .forEach(function(post) {
    if (post.answers) {
      post.answers.forEach(function(answer) {
        if (answer.comments) {
          answer.comments.forEach(function(comment) {
            if (comment.name === "jeff") {
              comment.name = "joe";
            }
          });
        }
      });

      db.post.save(post);
    }
});
```

#### 删除数据（Delete）

- ***remove 删除一条数据***

```
> db.demo_admin.remove({a:222})
WriteResult({ "nRemoved" : 1 })
```

- ***drop 删除一张表***

返回true删除成功, false删除失败

```
> db.demo_admin.drop()
true
```

## 聚合管道

#### 管道操作符
| Name     | Description |
:----------|:------------|
| $project | 包含、排除、重命名和显示字段 |
| $match   | 查询，需要同 find() 一样的参数 |
| $limit   | 限制结果数量 |
| $skip    | 忽略结果的数量 |
| $sort    | 按照给定的字段排序结果 |
| $group   | 按照给定表达式组合结果 |
| $unwind  | 分割嵌入数组到自己顶层文件 |

#### 比较类型操作符

* ```$gt``` 大于 (>)

```shell
db.user.find({"hours": {$gt: 80}})
```
* ```$gte``` 大于等于 (>=)

```shell
{ "_id" : 1, "hours" : 80, "tasks" : 7 }
```

* ```$lt``` 小于 (<)

```shell
> db.user.find({"hours": {$lt: 30}})
```
* ```$lte``` 小于等于 (<=)

```shell
{ "_id" : 2, "hours" : 30, "tasks" : 9 }
```

* ```$ne```， 判断字段的值不等于（!=）

```shell
db.user.find({"name":{"$ne":"Jack"}})
```

#### 算术操作符

* ```$mod```，取模运算

```shell
{ "_id" : 1, "hours" : 80, "tasks" : 7 }
{ "_id" : 2, "hours" : 30, "tasks" : 9 }
```

使用聚合，采用```$mod```表达式来对 ```$hours```与```$tasks```进行运算

```shell
db.user.aggregate([{$project: {fields: {$mod: ["$hours", "$tasks"]}}}])
```

#### 聚合操作符

* ```$addToSet```，往数组中添加一个不重复的元素

```shell
> db.user.update({name: 'Jack'}, {$addToSet: {"email": "abc@qq.com"}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
```

* ```$size```，数组元素个数，查找email数组元素个数为2的数据结果集

```shell
> db.user.find({email: {$size: 2}})
{ "_id" : ObjectId("5bd1a85eca656270cb3c1405"), "name" : "Jack", "email" : [ "aaa@qq.com", "abc@qq.com" ] }
```

#### 高级查询操作符

* ```$in```，包含

```shell
> db.user.find({name: {$in: ['Jack']}})
{ "_id" : ObjectId("5bd1a85eca656270cb3c1405"), "name" : "Jack", "email" : [ "aaa@qq.com", "abc@qq.com" ] }
```

* ```$nin```，在数组中不包含

```shell
 db.user.find({name: {$nin: ['Jack']}})
```

* ```$exists```，判断字段是否存在(true/false)

```shell
db.user.find({"name":{"$exists": true}})
```

* ```$all```，匹配所有 ``` {age: {"all": [7, 9]}} ``` age数组中只要有7和9就满足条件。如果只有7，没有9则不符合条

```shell
db.user.find({"name":{"$all":["Jack", "Tom"]}})
```

#### 正则表达式

- **MongoDB 语法**

```
db.collection.aggregate({"$match":{"name": /hello/i}})
```

- **Nodejs 两种写法**
  * ```collection.name = new RegExp('hello', 'i')```
  * ```collection.name = {$regex: 'hello'}```

## dbref数据引用

#### 官方文档

```
https://docs.mongodb.com/manual/reference/database-references/#dbrefs
```

#### 使用DBref

```javascript
{ $ref : , $id : , $db :  }
```

#### 三个字段意义:

* ```$ref```：集合名称

* ```$id```：引用的id

* ```$db```:数据库名称，可选参数

#### 数据库保存格式
```javascript
{
   "_id":ObjectId("53402597d852426020000002"),
   "address": {
       "$ref": "address_home",
       "$id": ObjectId("534009e4d852427820000002"),
       "$db": "w3cschoolcc"
   },
   "contact": "987654321",
   "dob": "01-01-1991",
   "name": "Tom Benzamin"
}
```

#### 查找

```javascript
var user = db.users.findOne({"name":"Tom Benzamin"})
var dbRef = user.address

//如果dbRef是对象使用以下方式查找
db[dbRef.$ref].findOne({"_id":(dbRef.$id)})
```

#### 插入

插入时注意```$ref```要放在```$id```之前，否则会报错

```javascript
    relatedFields: [
        {
            $ref: 'user', //指向的集合
            $id: ObjectId("5a72af0e937e6425bf4201e4"), //mongo生成的_id
            $db: 'demo', //数据库名 可选默认当前数据库，如果为其他数据库的必传
        }
    ]
```

## Nodejs客户端链接MongoDB

```javascript
const MongoClient = require('mongodb').MongoClient;
const mongodbUrl = "mongodb://localhost:27017/demo";
const DB = {};
const userCollName = 'user'; //指定集合名

//封装初始化数据库方法
const init = () => {
    if(DB.db){
        return Promise.reject('mongodb has already initialized');
    }

    return MongoClient.connect(mongodbUrl)
        .then(db => {
            DB.db  = db;
            DB.userColl = db.collection(userCollName);

            //退出关闭mongodb数据库连接
            process.on('exit', () => db.close());

            console.log('mongodb initialized');
        });
}
```

#### 问题汇总

- ```db.collection is not a function```

是因为mongodb版本是3.0以上版本，将mongodb版本指定安装为2.2.34即可解决，npm安装 ``` npm install mongodb@^2.2.34 --save ```
