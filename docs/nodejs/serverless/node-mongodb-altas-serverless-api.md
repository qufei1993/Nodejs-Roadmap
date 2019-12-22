# 使用 ServerLess, Nodejs, MongoDB Atlas cloud 构建 REST API

## MongoDB Atlas cloud

### 集群创建

1. 注册：https://www.mongodb.com/cloud/atlas/register?v=2
2. 注册成功进入个人中心出现以下页面，选择 Build a Cluster 按钮 创建 Cluster

![](./img/mongo-alats-build-a-cluster.jpeg)
3. 以下提供了多种选择方案，对于初学者选择左侧免费版创建
![](./img/mongo-alats-select-a-free-cluster.jpeg)
4. 可以看到免费的集群给我们提供了 512MB 存储、共享的 RAM，这对我们初学者是绰绰有余的，还有一些其它选项可以自主选择，使用默认值也可。
![](./img/mongo-alats-create-a-starter-cluster.jpeg)
5. 点击下面的 Create Cluster 按钮，开始集群创建，大概需要等待几分钟
![](./img/mongo-alats-free-cluster-create.jpeg)
6. 创建成功如下所示
![](./img/mongo-alats-cluster-create-success.jpeg)

### 链接到集群

1. 链接到集群，第一步将您的 IP 地址加入白名单，第二步创建一个 MongoDB 用户，完成这两步操作之后，选择 “Choose a connection method” 进入下一步
![](./img/mongo-alats-connection-a-cluster.jpeg)

2. 选择第二个选项 “connect your application”
![](./img/mongo-alats-connect-your-app.jpeg)

3. 驱动版本使用默认值 Node.js 3.0 or later，复制这个链接字符串，接下来的项目中会使用到
![](./img/mongo-alats-copy-connect-string.jpeg)


## 问题

请注意 Error: querySrv ENODATA _mongodb._tcp.cluster0-on1ek.mongodb.net 错误，在链接 MongoDB Alats 过程中遇到了此问题，花费了我很长时间，使用 Google ... 没有搜到答案能解决这个问题，通过报错大致可以确定为网络和 DNS 的问题，但是仍没有找定位到真正的原因，后来我切换了网络，这个问题解决了。另外也建议检查链接字符串和白名单是否设置的正确，如果你有不同的答案，欢迎在留言处和我沟通。

