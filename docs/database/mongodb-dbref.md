# dbref数据引用

## 官方文档

```
https://docs.mongodb.com/manual/reference/database-references/#dbrefs
```

## 使用DBref

```javascript
{ $ref : , $id : , $db :  }
```

## 三个字段意义:

* ```$ref```：集合名称

* ```$id```：引用的id

* ```$db```:数据库名称，可选参数

## 数据库保存格式
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

## 查找

```javascript
var user = db.users.findOne({"name":"Tom Benzamin"})
var dbRef = user.address

//如果dbRef是对象使用以下方式查找
db[dbRef.$ref].findOne({"_id":(dbRef.$id)})
```

## 插入

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