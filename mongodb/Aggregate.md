# 聚合函数 aggregate

### 操作符介绍：

* $project：包含、排除、重命名和显示字段

* $match：查询，需要同find()一样的参数

* $limit：限制结果数量

* $skip：忽略结果的数量

* $sort：按照给定的字段排序结果

* $group：按照给定表达式组合结果

* $unwind：分割嵌入数组到自己顶层文件


### match 使用正则进行模糊匹配

db.collection.aggregate({"$match":{"name": /hello/i}}) Nodejs 两种写法:

* collection.name = new RegExp('hello', 'i')

* collection.name = {$regex: 'hello'}

### MongoDB高级查询

* $gt 大于 >  ``` {"age": {$gt: 1}}  ```  返回年龄大于1的所有文档

* $lt 小于 <  ``` {"age": {$lt: 1}}  ```  返回年龄小于1的所有文档

* $gte 大于等于 >=

* $lte 小于等于

* $all 匹配所有 ``` {age: {"all": [7, 9]}} ``` age数组中只要有7和9就满足条件。如果只有7，没有9则不符合条

* $exists 判断字段是否存在(true/false) ``` {age: {$exists: true}} ```

* $mod 取模运算 ``` {age: {$mod: [7,6]}} ``` 集合中模7余6的数据

* $ne 不等于 ``` {age: {$ne: [10, 11]}} ```

* $nin 在数组中不包含 ``` {age: {$nin: [10, 11]}} ```

* $in 包含 ``` {age: {$in: [10, 11]}} ```

* $size 数组元素个数 ``` {age:{$size:4}} ``` age数组元素个数为4的数据结果集。
