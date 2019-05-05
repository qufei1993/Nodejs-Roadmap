# Elasticsearch

> Elasticsearch是一个实时的分布式搜索分析引擎，可以被用作全文搜索、结构化搜索、分析。提供了RestfulAPI接口进行通信，用于各语言、客户端进行调用。

## 安装

[官网：Install Elasticsearch from archive on Linux or MacOS](https://www.elastic.co/guide/en/elasticsearch/reference/current/targz.html)

- **linux系统的安装包**

```shell
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.0.0-linux-x86_64.tar.gz
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.0.0-linux-x86_64.tar.gz.sha512
shasum -a 512 -c elasticsearch-7.0.0-linux-x86_64.tar.gz.sha512
tar -xzf elasticsearch-7.0.0-linux-x86_64.tar.gz
cd elasticsearch-7.0.0/
```

- **控制台行执行以下命令运行Elasticsearch**

如果出现```can not run elasticsearch as root```错误，参考[问题：elasticsearch不能够以root权限运行解决方案](#elasticsearch不能够以root权限运行)

```
./bin/elasticsearch
```

检查elasticsearch是否运行

elasticsearch默认9200端口，控制台执行 ```$ curl http://localhost:9200 ``` 

```json
{
  "name" : "ubuntu",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "o6kv7tj-SGGnfJ5K9pLkWw",
  "version" : {
    "number" : "7.0.0",
    "build_flavor" : "default",
    "build_type" : "tar",
    "build_hash" : "b7e28a7",
    "build_date" : "2019-04-05T22:55:32.697037Z",
    "build_snapshot" : false,
    "lucene_version" : "8.0.0",
    "minimum_wire_compatibility_version" : "6.7.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

## 可视化界面kibanna

- **安装**

[官网：Install Kibana with .tar.gz](https://www.elastic.co/guide/en/kibana/current/targz.html)

```shell
$ wget https://artifacts.elastic.co/downloads/kibana/kibana-7.0.1-linux-x86_64.tar.gz
$ shasum -a 512 kibana-7.0.1-linux-x86_64.tar.gz
$ tar -xzf kibana-7.0.1-linux-x86_64.tar.gz
$ mv kibana-7.0.1-linux-x86_64 kibana-7.0.1 # 目录重命名
$ cd kibana-7.0.1/
```

- **运行kibana**

默认情况下kibana前台运行，按Ctrl+C键停止

```
./bin/kibana
```

默认运行5601端口，打开网址`http://localhost:5601/`访问

`注意`：因为我使用的本地虚拟机需要建立链接隧道才可在浏览器访问，命令`ssh -L5601:127.0.0.1:5601 qufei@192.168.6.128`，没有这个问题的可忽略。

- **配置文件**

kinaba默认配置文件路径`${kibana安装目录}/config/kibana.yml`，如若更新配置修改此文件即可，配置详细说明：[Configuring Kibana](https://www.elastic.co/guide/en/kibana/7.0/settings.html)

## 安全增强

es安装好后任何人都可以访问、修改数据，这是不安全的，v6.X版本采用x-pack增强安全权限，之后最新版本可以通过Elastic Stack的 [Security](https://www.elastic.co/cn/products/stack/security) 功能进行权限管理。

### kibana中配置security

在群集上启用X-Pack安全性时，Kibana用户必须登录。为Kibana用户配置X-Pack安全角色，以控制这些用户可以访问的数据。

### Elasticsearch中配置security

```
// todo
```

## 问题指南

#### elasticsearch不能够以root权限运行

执行`./bin/elasticsearch`命令后报以下错误，原因在于elasticsearch处于系统安全考虑不允许root权限来运行，需要创建一个单独的用户来执行

```
$ sudo ./bin/elasticsearch
OpenJDK 64-Bit Server VM warning: Option UseConcMarkSweepGC was deprecated in version 9.0 and will likely be removed in a future release.
[2019-04-28T16:22:22,563][WARN ][o.e.b.ElasticsearchUncaughtExceptionHandler] [ubuntu] uncaught exception in thread [main]
org.elasticsearch.bootstrap.StartupException: java.lang.RuntimeException: can not run elasticsearch as root
        at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:163) ~[elasticsearch-7.0.0.jar:7.0.0]
        at org.elasticsearch.bootstrap.Elasticsearch.execute(Elasticsearch.java:150) ~[elasticsearch-7.0.0.jar:7.0.0]
        at org.elasticsearch.cli.EnvironmentAwareCommand.execute(EnvironmentAwareCommand.java:86) ~[elasticsearch-7.0.0.jar:7.0.0]
        at org.elasticsearch.cli.Command.mainWithoutErrorHandling(Command.java:124) ~[elasticsearch-cli-7.0.0.jar:7.0.0]
        at org.elasticsearch.cli.Command.main(Command.java:90) ~[elasticsearch-cli-7.0.0.jar:7.0.0]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:115) ~[elasticsearch-7.0.0.jar:7.0.0]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:92) ~[elasticsearch-7.0.0.jar:7.0.0]
```

- **创建es用户**
```shell
groupadd es # 创建elsearch用户组及
useradd es -g es -p elasticsearch-7.0.0 # 创建elsearch用户
```

- **更改elasticsearch文件夹内部文件的所属用户及组为es:es**
```shell
cd /data/soft/ # 进入到你的elasticsearch安装目录
chown -R es:es  elasticsearch-7.0.0
```

- **切换至es用户**
```shell
su es # 切换账户
```

- **再次启动**
```shell
cd /data/soft/elasticsearch-7.0.0/bin # 进入bin目录
./elasticsearch # 执行启动命令
```

#### su: Authentication failure

原因是ubuntu系统默认没有激活root用户，需要通过命令`sudo passwd root`进行手动操作，示例如下：

```shell
$ sudo passwd root
[sudo] password for qufei: 
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
$ su
Password: 
$ su es
```

## 阅读推荐

* [Elasticsearch: 权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)