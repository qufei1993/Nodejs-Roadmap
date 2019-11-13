## MongoDB 操作符

## 管道操作符
| Name     | Description |
:----------|:------------|
| $project | 包含、排除、重命名和显示字段 |
| $match   | 查询，需要同 find() 一样的参数 |
| $limit   | 限制结果数量 |
| $skip    | 忽略结果的数量 |
| $sort    | 按照给定的字段排序结果 |
| $group   | 按照给定表达式组合结果 |
| $unwind  | 分割嵌入数组到自己顶层文件 |

## 比较类型操作符

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

## 算术操作符

* ```$mod```，取模运算

```shell
{ "_id" : 1, "hours" : 80, "tasks" : 7 }
{ "_id" : 2, "hours" : 30, "tasks" : 9 }
```

使用聚合，采用```$mod```表达式来对 ```$hours```与```$tasks```进行运算

```shell
db.user.aggregate([{$project: {fields: {$mod: ["$hours", "$tasks"]}}}])
```

## 聚合操作符

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

* ```$project``` 包含、排除、重命名和显示字段

```js
// 查询之前结构
{
    "_id" : ObjectId("5bd83b5749fec9c2dc934aca"),
    "name" : "小B",
    "age" : 18,
    "idCard" : "410328200005201235",
    "_class" : "com.angelo.User",
    "contactor" : {
        "name" : "zhang",
        "age" : 18
    }
}

// 查询语句
db.user.aggregate([
    {
        "$project":{
            "_id":0,
            "a":1,
            "contactorName":"$contactor.name",
            "contactorArray":[
                "$contactor.name",
                "$contactor.age",
                "$contactor.sex"
            ]
        }
    }
]);

// 查询结果，如果指定的字段不存在则返回 null
{ "contactorName" : "zhang", "contactorArray" : [ "zhang", 18, null ] }
```

* ```$unwind``` 展开数组元素

如果需要展开的字段不存在或者等于 null 和 [] 会被过滤掉，也可以使用 preserveNullAndEmptyArrays 字段告诉 unwind 不要过滤一些数据

```js
// 查询语句
db.user.aggregate([
    {
        "$unwind":{
            "path": "$hobby",
            "includeArrayIndex": "habbyIndex", // 添加新字段展示展开的位置
            "preserveNullAndEmptyArrays": true // 需要展开的字段不存在或者等于 null 和 [] 不会在被过滤
        }
    }
]);

// 查询结果

{ "_id" : ObjectId("5bd83b5749fec9c2dc934aca"), "name" : "小B", "age" : 18, "idCard" : "410328200005201235", "_class" : "com.angelo.User", "contactor" : { "name" : "zhang", "age" : 18 }, "hobby" : "篮球", "habbyIndex" : NumberLong(0) }
{ "_id" : ObjectId("5bd83b5749fec9c2dc934aca"), "name" : "小B", "age" : 18, "idCard" : "410328200005201235", "_class" : "com.angelo.User", "contactor" : { "name" : "zhang", "age" : 18 }, "hobby" : "足球", "habbyIndex" : NumberLong(1) }
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

## 正则表达式

- **MongoDB 语法**

```
db.collection.aggregate({"$match":{"name": /hello/i}})
```

- **Nodejs 两种写法**
  * ```collection.name = new RegExp('hello', 'i')```
  * ```collection.name = {$regex: 'hello'}```