# 镜像模式构建高可用 RabbitMQ 集群架构

### 环境准备

| 节点名称 |机器              |  模式  | 端口 | 安装目录
|:-------| :----------------|:------|:-------|:---
| May128 | 192.168.6.128    | RabbitMQ Master | 5672 | /data/soft/redis-5.0.5
| May129 | 192.168.6.129    | RabbitMQ Slave1 | 5672 | /data/soft/redis-5.0.5
| May130 | 192.168.6.130    | haproxy + keepalived | 8100 | /data/soft/redis-5.0.5
| May130 | 192.168.6.131    | haproxy + keepalived | 8100 | /data/soft/redis-5.0.5