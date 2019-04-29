ELK日志三件套（Elasticsearch+Logstash+Kibana）

什么是ELK

ELK是Elasticsearch、Logstash、Kibana的简称，一个开源的日志实时分析平台，微服务架构下服务众多日志管理也显得较为重要，不可能打开每台机器在用grep等linux命令进行检索，另外ELK在日志检索、分析、统计和展示上也提供了强大了功能。

Elasticsearch：是一个实时的分布式搜索分析引擎，可以被用作全文搜索、结构化搜索、分析。提供了RestfulAPI接口进行通信，用于各语言、客户端进行调用。

Logstash：是开源的服务器端数据处理管道，能够同时从多个来源采集数据，转换数据，然后将数据发送到存储库（例如：Elasticsearch）中。

Kibana：一个可视化的Web UI界面，Logstash采集的数据存储到Elasticsearch库中通过Kibana进行可视化呈现，用户可以在界面上进行检索、分析日志数据。

## 阅读推荐

* [Elasticsearch: 权威指南](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html)
* [Logstash 数据采集](https://www.elastic.co/cn/products/logstash)
* [KIBANA](https://www.elastic.co/cn/products/kibana)
