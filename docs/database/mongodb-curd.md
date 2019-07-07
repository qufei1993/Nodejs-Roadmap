# MongoDB 的 CRUD 操作

## 插入数据（Create）

向 demo_admin 表中插入数据，mongo 中使用 json 格式以键值对的方式插入数据，会自动创建一个 _id（ObjectID） 字段，在全局范围内不会重复

```
> db.demo_admin.insert({name: 'Jack'})
```

- ***循环插入数据***

```
> for(i=0;i<10;i++)db.demo_admin.insert({x:i})
```

## 读取数据（Retrieve）

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

## 更新数据（Update）

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

## 删除数据（Delete）

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