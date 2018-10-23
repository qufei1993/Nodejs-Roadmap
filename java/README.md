
# Java

## jenv管理java版本

homebrew安装jenv

``` brew install jenv ```

#### 查看java版本

``` jenv versions ``` 只列出了系统默认的java版本，其它的版本需要手动添加到jenv中

```s
$ jenv versions
* system (set by /Users/yourdirname/.jenv/version)
```

#### jenv中添加新的版本

添加jdk1.8

```s
$ jenv add /Library/Java/JavaVirtualMachines/jdk1.8.0_102.jdk/Contents/Home
oracle64-1.8.0.102 added
1.8.0.102 added
1.8 added
```

#### 指定java版本号

jenv local <版本号>

```s
$ jenv local 1.8
```

现在在查看当前版本号，就变成了1.8

```s
$ jenv version
1.8 (set by /Library/Java/JavaVirtualMachines/.java-version)
```

#### 查看当前版本在硬盘上的位置

```s
$ jenv which java
/Users/yourdirname/.jenv/versions/1.8/bin/java
```

``` /Users/yourdirname/.jenv/versions/ ``` 目录下列了所有的java版本

上面通过jenv add添加的java版本都被列在了这里

```s
ls /Users/yourdirname/.jenv/versions/
1.8			11			oracle64-1.8.0.102
1.8.0.102		openjdk64-11
```

## maven安装

#### 下载maven

官网地址： ``` http://maven.apache.org/download.cgi ```

选择binary zip archive 的类型或者浏览器输入以下地址，将```3.5.4-bin.tar.gz```修改为你需要的版本号，可直接下载

[http://mirror.bit.edu.cn/apache/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz](http://mirror.bit.edu.cn/apache/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz)

#### 解压maven

解压下载好的maven，将目录丢到终端命令去获取文件路径。设置path

vim ~/.bash_profile

```s
export M2_HOME=/Users/yourdirname/Documents/apache/apache-maven-3.5.4
export PATH=$PATH:$M2_HOME/bin
```

#### maven生效检测

输入以下命令使文件生效：

```s
source ~/.bash_profile
``` 

检测mvn配置是否生效

```s
mvn -v
```

出现以下结果:

```s
Apache Maven 3.5.4 (1edded0938998edf8bf061f1ceb3cfdeccf443fe; 2018-06-18T02:33:14+08:00)
Maven home: /Users/yourdirname/Documents/apache/apache-maven-3.5.4
Java version: 1.8.0_102, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk1.8.0_102.jdk/Contents/Home/jre
Default locale: zh_CN, platform encoding: UTF-8
OS name: "mac os x", version: "10.12.6", arch: "x86_64", family: "mac"
```

#### 注意

如果按照以上方法设置之后无法生效，请仔细检查~/.bash_profile文件中的maven路径是否正确，找不到maven路径下的bin文件会无法生效。