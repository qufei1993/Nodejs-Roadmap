## MongoDB —— update更新

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

