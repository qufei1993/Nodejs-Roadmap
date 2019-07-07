
# DataBase

数据库是用来存储数据的仓库，做为一名服务端开发的同学难免是要掌握的。以下列举了一些数据库，并不是说一定要全部都会可以根据实际业务需要有选择的去学习，非关系型数据库里 Redis、MongoDB 和 关系型数据库里的 Mysql/PostgreSQL 这些希望是你能够掌握的，通常在实际业务中它们也是用的较多的。

## NoSQL

* Redis

Redis 是一个 Key/Value 的键值数据库，就像语言中的哈希表，可以通过 key 快速的进行添加、查寻等操作，典型的代表就是 Redis。[more](/database/redis.md)

* MongoDB

MongoDB 是一个文档型的数据库，它支持的数据结构非常松散，是类似 json 的 bson 格式，因此可以存储比较复杂的数据类型。MongoDB 最大的特点是它支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。[more](/database/mongodb.md)

* RocksDB

RocksDB 是 FaceBook 开放的一种嵌入式、持久化存储、KV型且非常适用于 fast storage 的存储引擎。具有高性能、快速存储、可适配性、基础和高级的数据库操作四大特性。[RocksDB中文网](https://rocksdb.org.cn/)

* CouchDB

CouchDB 是用 Erlang 开发的面向文档的数据库系统，具有高度可用性与可伸缩性，可通过 RESTful API 访问。也许你会对这个名字比较陌生，做为 Node.js 同学每天都在用的 NPM 背后就是使用的 CouchDB。[CouchDB](http://couchdb.apache.org/)

## Relational

* MySql

在关系型数据库中 MySql 是最流行的一种，被广泛应用于中小型企业。[more](https://www.mysql.com/)

* SQL Server

SQL Server 是由 Microsoft 开发和推广的关系数据库管理系统（DBMS）。[more](https://www.microsoft.com/en-us/sql-server/sql-server-2017)

* PostgreSQL

PostgreSQL 是一个功能强大的开源对象关系数据库管理系统(ORDBMS)。由 PostgreSQL 全球开发集团(全球志愿者团队)开发。它不受任何公司或其他私人实体控制。它是开源的，其源代码是免费提供的。[more](https://www.postgresql.org/)

* Oracle

Oracle 是甲骨文公司的一款关系数据库管理系统。它是在数据库领域一直处于领先地位的产品。可以说 Oracle 数据库系统是目前世界上流行的关系数据库管理系统，系统可移植性好、使用方便、功能强，适用于各类大、中、小、微机环境。[more](https://www.oracle.com/index.html)

## SearchEngines

* ElasticSearch。

ElasticSearch 是一个基于 Lucene 的搜索服务器。它提供了一个分布式多用户能力的全文搜索引擎，基于RESTful web接口，常见日志三剑客 ELK，其中就用到了ElasticSearch。[more](https://www.elastic.co/)

* Solr

Solr是一个独立的企业级搜索应用服务器，它对外提供类似于Web-service的API接口。用户可以通过http请求，向搜索引擎服务器提交一定格式的XML文件，生成索引；也可以通过Http Get操作提出查找请求，并得到XML格式的返回结果。[more](http://lucene.apache.org/solr/)

* Sphinxsearch

Sphinx--强大的开源全文检索引擎，Coreseek--免费开源的中文全文检索引擎。中文手册参考 [more](http://sphinxsearch.com/)