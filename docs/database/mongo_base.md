# MongoDB学习与总结

## 快速导航

- [操作符介绍](#操作符介绍)
- [正则模糊匹配](#正则模糊匹配)
- [MongoDB高级查询](#mongodb高级查询)
- [update更新操作](#update更新操作)
- [DBRef数据引用](#dbref数据引用)

## 操作符介绍：

* ``` $project```：包含、排除、重命名和显示字段

* ```$match```：查询，需要同find()一样的参数

* ```$limit```：限制结果数量

* ```$skip```：忽略结果的数量

* ```$sort```：按照给定的字段排序结果

* ```$group```：按照给定表达式组合结果

* ```$unwind```：分割嵌入数组到自己顶层文件


## 正则模糊匹配

mongo语法下发如下:

```db.collection.aggregate({"$match":{"name": /hello/i}})```

Nodejs 两种写法:

* ```collection.name = new RegExp('hello', 'i')```

* ```collection.name = {$regex: 'hello'}```

## mongodb高级查询

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

* ```$in```，包含

```shell
> db.user.find({name: {$in: ['Jack']}})
{ "_id" : ObjectId("5bd1a85eca656270cb3c1405"), "name" : "Jack", "email" : [ "aaa@qq.com", "abc@qq.com" ] }
```

* ```$nin```，在数组中不包含

```shell
 db.user.find({name: {$nin: ['Jack']}})
```

* ```$ne```， 判断字段的值不等于（!=）

```shell
db.user.find({"name":{"$ne":"Jack"}})
```

* ```$exists```，判断字段是否存在(true/false)

```shell
db.user.find({"name":{"$exists": true}})
```

* ```$all```，匹配所有 ``` {age: {"all": [7, 9]}} ``` age数组中只要有7和9就满足条件。如果只有7，没有9则不符合条

```shell
db.user.find({"name":{"$all":["Jack", "Tom"]}})
```

* ```$mod```，取模运算

数据集合

```shell
{ "_id" : 1, "hours" : 80, "tasks" : 7 }
{ "_id" : 2, "hours" : 30, "tasks" : 9 }
```

使用聚合，采用```$mod```表达式来对 ```$hours```与```$tasks```进行运算

```shell
db.user.aggregate([{$project: {fields: {$mod: ["$hours", "$tasks"]}}}])
```

## update更新操作

#### MongoDB 对集合中 某个数组对象下的字段进行更新


> 例如：使用update对集合中的orderNo为o111111字段下的userInfo数组对象下的cardNo等于123456789这个对象中的logs字段和status字段(在更新的时候没有status字段将会创建) 进行日志更新

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
        "2017-08-10 timeline1 ...",
			]
		},
		{
			"name" : "o1111",
			"cardNo": "987654321",
			"logs": [
				"2017-08-09 timeline ...",
			]
		},
		...
	]
},
...
}
```

* 在Nodejs中操作，可以使用$push在找到logs数组后依次添加日志信息

```javascript
let condition = {"orderNo":"o111111","userInfo.cardNo":"123456789"}

let update = {
	$push: {
		"passengers.$.logs": "2017-08-10 timeline1 ..."
	}
}
db.collections.findOneAndUpdate(condition, update, { returnOriginal: false })
```

* 也可以使用$set 对某个字段进行更新

```javascript
let condition = {"orderNo":"o111111","userInfo.cardNo":"123456789"}

let update = {
	$set: {"passengers.$.status": "已更新"}
}

DB.orderColl.updateOne(condition,update)
```
#### 注意：

需要注意的点是位置运算符$只能在查询中使用一次，官方对于这个问题提出了一个方案[Mongodb](https://jira.mongodb.org/browse/SERVER-831) `https://jira.mongodb.org/browse/SERVER-831` 如果能在为未来发布这将是非常有用的。如果，目前你需要在嵌套层次很深的情况下想对数组的内容进行修改可以采用forEach()方法操作，像下面这样：

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