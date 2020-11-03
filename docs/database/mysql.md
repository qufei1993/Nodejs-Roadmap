
#  MySql入门

## 安装

Mac 版登录官网 [http://www.mysql.com/downloads/](http://www.mysql.com/downloads/) 找到 dmg 文件下载，下载好后打开 ```.dmg``` 文件，傻瓜式安装即可。

* 5.7 之前版本默认用户名密码都为 root
* 5.7 及之后版本只有默认用户名 root，安装的时候会自动生成一个密码且以弹窗形式提醒，这个要记下的，不然安装成功之后没法登录的。

### 配置快捷键

编辑 ``` vim ~/.zshrc ``` 文件，增加 ``` alias mysql=/usr/local/mysql/bin/mysql ```，保存退出(按 ESC 键盘，输入 :wq ，回车)

重新加载文件 ```source ~/.zshrc```

命令行登录 mysql，输入密码

```
$ mysql -u root -p

Enter password: 
```

若修改密码：

``` SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newpass'); ```

```
mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('123456');
Query OK, 0 rows affected, 1 warning (0.00 sec)
```

若需推出终端，执行 ```exit``` 命令。

## 基础命令

* 服务器版本：select version();
* 当前时间：select now();
* 查询用户：select user();
* 查看数据库：show databases;

