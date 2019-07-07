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