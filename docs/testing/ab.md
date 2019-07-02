# ab压力测试

ab 是 apachebench 命令的缩写，是 Apache 自带的压力测试工具。执行原理是创建多个并发访问线程，来模拟多用户对同一 URL 地址进行压力测试。

## 快速导航
- 安装指南
- 请求参数详解
- 应用实践
- 响应参数说明

## 安装指南

* CentOS ```yum install httpd-tools```
* Ubuntu ```apt-get install httpd-tools```

## ab请求参数详解

执行 ```ab -help``` 查看参数

```
$ ab -help
Usage: ab [options] [http[s]://]hostname[:port]/path
Options are:
    -n requests     Number of requests to perform
    -c concurrency  Number of multiple requests to make at a time
    -t timelimit    Seconds to max. to spend on benchmarking
                    This implies -n 50000
    -s timeout      Seconds to max. wait for each response
                    Default is 30 seconds
    -b windowsize   Size of TCP send/receive buffer, in bytes
    -B address      Address to bind to when making outgoing connections
    -p postfile     File containing data to POST. Remember also to set -T
    -u putfile      File containing data to PUT. Remember also to set -T
    -T content-type Content-type header to use for POST/PUT data, eg.
                    'application/x-www-form-urlencoded'
                    Default is 'text/plain'
    -v verbosity    How much troubleshooting info to print
    -w              Print out results in HTML tables
    -i              Use HEAD instead of GET
    -x attributes   String to insert as table attributes
    -y attributes   String to insert as tr attributes
    -z attributes   String to insert as td or th attributes
    -C attribute    Add cookie, eg. 'Apache=1234'. (repeatable)
    -H attribute    Add Arbitrary header line, eg. 'Accept-Encoding: gzip'
                    Inserted after all normal header lines. (repeatable)
    -A attribute    Add Basic WWW Authentication, the attributes
                    are a colon separated username and password.
    -P attribute    Add Basic Proxy Authentication, the attributes
                    are a colon separated username and password.
    -X proxy:port   Proxyserver and port number to use
    -V              Print version number and exit
    -k              Use HTTP KeepAlive feature
    -d              Do not show percentiles served table.
    -S              Do not show confidence estimators and warnings.
    -q              Do not show progress when doing more than 150 requests
    -l              Accept variable document length (use this for dynamic pages)
    -g filename     Output collected data to gnuplot format file.
    -e filename     Output CSV file with percentages served
    -r              Don't exit on socket receive errors.
    -m method       Method name
    -h              Display usage information (this message)
    -I              Disable TLS Server Name Indication (SNI) extension
    -Z ciphersuite  Specify SSL/TLS cipher suite (See openssl ciphers)
    -f protocol     Specify SSL/TLS protocol
                    (SSL3, TLS1, TLS1.1, TLS1.2 or ALL)
```

* -n：总请求数
* -c：每次执行的请求个数
* -t：测试进行的最大时间，单位为秒
* -p：POST 请求时的参数
* -T：POST 请求信息的请求头 Content-Type 设置 “application/json”
* -H：请求头 Headers 信息

## 应用实践

**GET请求示例**

我们对一个接口每次执行 10 个并发，总共完成 100 个请求

```
$ ab -n 100 -c 10 -t 30 https://www.baidu.com/
```

**POST请求示例**

我们对一个接口每次执行 100 个并发，总共持续两分钟。

***注意:*** 如果 POST 请求需要先将请求体保存为一个文件，例如 order.txt 通过 -p 参数加载

```
$ ab -c 200 -t 120 -T 'application/json' -p order.txt http://192.168.6.128:3000/v1/order
```

**POST 请求传递 Headers 示例**

多个 header 参数使用多个 -H 传递，这块也是在使用过程中踩过的坑

```
$ ab -c 200 -t 120 -T 'application/json' -H 'token: 123456' -H 'userId: 111'  -p order.txt http://192.168.6.128:3000/v1/order
```

## ab响应参数说明

```bash
ab -c 200 -t 60 -T 'application/json' -p order.txt http://192.168.6.128:3000/v1/order
This is ApacheBench, Version 2.3 <$Revision: 1430300 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking 192.168.6.128 (be patient)
Completed 5000 requests
Completed 10000 requests
Finished 11435 requests

Server Software:        
Server Hostname:        192.168.6.128
Server Port:            300

Document Path:          /?orderType=yongche
Document Length:        473 bytes

Concurrency Level:      100
Time taken for tests:   60.037 seconds
Complete requests:      11435
Failed requests:        0
Write errors:           0
Total transferred:      7798670 bytes
Total body sent:        18223720
HTML transferred:       5408755 bytes
Requests per second:    190.47 [#/sec] (mean)
Time per request:       525.027 [ms] (mean)
Time per request:       5.250 [ms] (mean, across all concurrent requests)
Transfer rate:          126.85 [Kbytes/sec] received
                        296.43 kb/s sent
                        423.28 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   2.3      0      33
Processing:    43  515 231.0    485    1717
Waiting:       43  515 231.0    485    1716
Total:         43  516 231.0    486    1717

Percentage of the requests served within a certain time (ms)
  50%    486
  66%    578
  75%    638
  80%    677
  90%    781
  95%    928
  98%   1145
  99%   1351
 100%   1717 (longest request)
```

* Server Software：表示被测试的软件服务器名称
* Server Hostname：表示请求的 URL 主机名称
* Server Port：表示请求的端口号
* Document Path：请求的路径
* Document Length：响应数据正文长度
* Concurrency Level：表示并发用户数，也是我们设置的 -c 参数
* Time taken for tests：请求处理完成所花费的时间
* Complete requests：本次测试总请求数
* Failed requests：失败的请求数量
* Total transferred：所有请求的响应数据长度总和
* HTML transferred：所有请求的响应中正文数据的总和，减去了一些 HTTP 头数据信息
* **Requests per second：吞吐率（QPS = Complete requests / Time taken for tests）这个是我们主要关注的性能指标**
* Time per request：用户请求平均等待时间（Time token for tests / (Complete requests / Concurrency Level)）
* Time per request (mean, across all concurrent requests)：服务器完成一个请求所花费的时间（Time taken for tests / Complete requests）
* Transfer rate：网络传输速度（Total trnasferred / Time taken for tests）