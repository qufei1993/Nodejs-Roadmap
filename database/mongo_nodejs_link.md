# Nodejs链接mongodb

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

###### db.collection is not a function

是因为mongodb版本是3.0以上版本，将mongodb版本指定安装为2.2.34即可解决，npm安装 ``` npm install mongodb@^2.2.34 --save ```