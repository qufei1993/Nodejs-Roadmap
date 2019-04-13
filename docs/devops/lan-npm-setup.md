# NPM局域网搭建

## 基础环境搭建

#### **Erlang安装**

- **获取Erlang安装包**

``` 
sudo wget http://www.rabbitmq.com/releases/erlang/erlang-18.3-1.el6.x86_64.rpm
```

- **Centos rpm一键安装**

这里采用rpm一键安装，centos 执行命令 ```rpm -ivh erlang-18.3-1.el6.x86_64.rpm```，在```ubuntu```中不支持此命令```rpm```，使用```rpm```提示如下信息：

```bash
rpm: RPM should not be used directly install RPM packages, use Alien instead!
rpm: However assuming you know what you are doing...
error: Failed dependencies:
```

- **```ubuntu```系统rpm一键安装解决方案**
  1. 安装```alien```，执行命令```sudo apt-get install alien```
  2. 转换```rpm```包为```.deb```格式，执行命令```sudo alien package.rpm```其中```package.rpm```为你的包名
  3. 通过dpkg安装，```sudo dpkg -i package.deb```

- **检查是否安装成功**
```
$ erl
Erlang/OTP 18 [erts-7.3] [source] [64-bit] [async-threads:10] [hipe] [kernel-poll:false]

Eshell V7.3  (abort with ^G)
1>
```

#### **CouchDB安装**

执行以下命令将在您的服务器上安装CouchDB和Futon

```
mkdir /data
cd /data
sudo wget http://mirrors.tuna.tsinghua.edu.cn/apache/couchdb/source/2.3.1/apache-couchdb-2.3.1.tar.gz
$ sudo tar xfv apache-couchdb-2.3.1.tar.gz
$ sudo apache-couchdb-2.3.1
$ sudo ./configure
```

```
$ sudo apt-get install couchdb -y
```

CouchDB默认端口为5984，运行以下命令检索安装信息

```
$ curl localhost:5984
{"couchdb":"Welcome","uuid":"8d11c599b6487b117e21b8d7b5f79bed","version":"1.6.0","vendor":{"version":"15.10","name":"Ubuntu"}}
```

#### 

```

$ wget http://mirrors.tuna.tsinghua.edu.cn/apache/couchdb/source/2.3.1/apache-couchdb-2.3.1.tar.gz 

```

#### **访问Futon**

> ```Futon```是```CouchDB```提供的一个```WebUI```界面，为了更安全的链接到```CouchDB```，可以从本地访问，创建一个本地到服务的```SSH```链接隧道。

如下所示：建立```本地端口5984```到远程```服务器端口5984```的链接隧道。

```shell
ssh -L5984:127.0.0.1:5984 qufei3@192.168.6.130
```

建立链接隧道之后浏览器输入URL：```http://localhost:5984/_utils/```访问，结果如下所示：

![](./img/couchdb_futon.png)

> CouchDB的更多安装姿势可参考[官网](http://docs.couchdb.org/en/latest/install/unix.html#user-registration-and-security)

#### **搭建NPM仓库**

> 在搭建NPM仓库之前确保CouchDB数据库安装成功且运行中。

1. **创建数据库**

> 用于保存模块和文件信息。

```
curl -X PUT http://localhost:5984/registry
{"ok":true}
```

3. **设置用于名密码**

```
$ curl -X PUT http://localhost:5984/_config/admins/admin -d '"123456"'
```

2. **克隆NPM远程仓库地址到本地**

```
$ git clone git://github.com/npm/npm-registry-couchapp
$ cd npm-registry-couchapp
$ npm install
$ npm start \
  --npm-registry-couchapp:couch=http://localhost:5984/registry
  npm start \
  --npm-registry-couchapp:couch=http://admin:123456@localhost:5984/registry
$ npm run load \
  --npm-registry-couchapp:couch=http://localhost:5984/registry
$ npm run copy \
  --npm-registry-couchapp:couch=http://localhost:5984/registry
```

3. **客户端设置NPM镜像**

```
$ npm config set \
  registry=http://localhost:5984/registry/_design/app/_rewrite
```