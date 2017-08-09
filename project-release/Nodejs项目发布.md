
## 登录远程服务器

### 方法1

  ssh root@ip地址

### 方法2

 在mac下面如果安装了zsh 会有.zshrc这样一个配置文件

 ``` subl .zshrc ```  

 在这个配置文件里面可以通过软链接加入命令``` alias ssh_demo="ssh root@ip地址" ```

 通过 ``` source .zshrc ``` 重新载入这个用户变量

 最后控制台输入 ``` ssh_demo ``` 将会自动调用上面配置好的这个命令

### 方法3

  如果有多台服务器，每次都需要输入密码 这样还是有些繁琐的 适合通过私钥认证的方式来 实现无密码登录


## 创建用户

创建用户名 ``` adduser demo_manager ``` 之后会提示设置密码 和一些信息

创建好用户之后我们可以来修改用户权限 ``` gpasswd -a demo_manager sudo ```

成功之后会出现一个添加user的提示 ``` Adding user demo_manager to group sudo  ```

执行命令``` sudo visudo ``` 打开该文件编辑

找到 ``` root ALL=(ALL:ALL) ALL ``` 在这段代码下面添加 这个刚创建的user
```bash
  demo_manager ALL=(ALL:ALL) ALL

  #demo_manager  指我们新增的这个用户 以上这些规则对这个用户生效
  #第一个ALL 这些规则对所有用户生效
  #第二个ALL demo_manager可以任意用户来执行命令
  #第三个ALL demo_manager 可以以任何的组来执行命令
  #第四个ALL 这个适用于所有命令
```

最后ssh restart 重启一下






df -h 查看硬盘使用情况
