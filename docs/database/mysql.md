
## Mysql安装

Mac版，登录官网找到dmg文件下载 [http://www.mysql.com/downloads/](http://www.mysql.com/downloads/)

选择下载好后的```.dmg```文件，傻瓜式安装即可

* 5.7之前版本默认用户名密码都为root
* 5.7及之后版本只有默认用户名root，安装的时候会自动生成一个密码且以弹窗形式提醒，这个要记下的，不然安装成功之后没法登录的。

配置路径

编辑``` vim ~/..zshrc ```文件

文件中增加 ``` alias mysql=/usr/local/mysql/bin/mysql ```，保存退出(按ESC键盘，输入:wq，回车)

重新加载文件 ``` source ~/..zshrc ```

命令行登录mysql，输入密码

```
$ mysql -u root -p

Enter password: 
```

修改密码：

``` SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newpass'); ```

```shell
mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('123456');
Query OK, 0 rows affected, 1 warning (0.00 sec)
```




