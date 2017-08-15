# 项目发布

## 目录

* [创建用户](#创建用户)

* [登录远程服务器](#登录远程服务器)

  * [三种登录方法](#方法1)

* [增强服务器安全等级](#增强服务器安全等级)

  * [修改端口号](#修改端口号)

  * [设定iptables规则](#设定iptables规则)

  * [设置fail2ban](#设置fail2ban)


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

## 登录远程服务器

### 三种登录方法

#### 方法1

  ssh root@ip地址

#### 方法2

 在mac下面如果安装了zsh 会有.zshrc这样一个配置文件

 ``` subl .zshrc ```  

 在这个配置文件里面可以通过软链接加入命令 ``` alias ssh_demo="ssh root@ip地址" ```

 通过 ``` source .zshrc ``` 重新载入这个用户变量

 最后控制台输入 ``` ssh_demo ``` 将会自动调用上面配置好的这个命令

#### 方法3

  如果有多台服务器，每次都需要输入密码 这样还是有些繁琐的 适合通过私钥认证的方式来 实现无密码登录

  配置秘钥命令: ``` ssh-keygen -t rsa -b 4096 -C "demo_manager@qq.com" ```

  开启ssh代理 ``` eval "$(ssh-agent -s)" ```

  将ssh key加入这个代理中 ``` ssh-add ~/.ssh/id_rsa ```

  在服务器的 .ssh目录 创建一个授权文件 ``` vim authorized_keys ```,将本地电脑生成的公钥放入这个授权文件里 现在服务器已经持有了某台电脑的上的公钥，此时这台电脑就可不需输入密码来登录这台服务器

  修改授权文件权限 ``` chmod 600 authorized_keys ```

  重启ssh服务 ``` sudo service ssh restart ```

## 增强服务器安全等级

### 修改端口号
 服务器默认端口是22， 出于基本的安全考虑也是需要来修改这个端口号的  

 修改配置文件 ``` vim /etc/ssh/sshd_config ``` 执行此命令会提示输入密码

```bash
# 修改port端口号 范围为1 到 65536, 0 1024之间的可能会被系统所占用，因此最好采用1024之外的  

Port 39999 # 此时将会禁用22端口

UseDNS no # 此处确保为 no

# 加入我们为这个服务创建的用户
AllowUsrs demo_manager

# 出去安全层面考虑 可以关闭root密码登录
PermitRootLogin no

# 已经配好了秘钥登录的 可以将下面是是否允许密码登录(授权) 给关掉
PasswordAuthentication no

# 是否允许空密码
# PermitEmptyPasswords no
```

### 设定iptables规则

清空掉所有的iptables 规则 ``` sudo iptables -F ```

修改配置文件 ``` sudo vim /etc/iptables.up.rules ```

```bash
*filter

#允许所有简历起来的链接
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#允许所有出去的流量, 此处也可以设置一些特定的流量规则
-A OUTPUT -j ACCEPT

# 允许https协议下的请求链接
-A INPUT -p tcp --dport 443 -j ACCEPT

# 所有的网站访问一台服务器都是从80端口进去的，因此让80端口的流量可以进出
-A INPUT -p tcp --dport 80 -j ACCEPT

# 通过这条设定 我们登录服务器就只能通过这个端口，如果是别的防火墙就会拦截
-A INPUT -p tcp -m state --sate NEW --dport 39999 -j ACCEPT

# 允许外网来ping这台服务器
-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# 记录下被拒绝的这些请求
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied:" --log-level 7

# 对一些恶意的请求做一些拦截 ,下面的例子意思是 如果一个ip在60内对80端口 发出了150次请求 我们就认为他是恶意请求
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --set
-A INPUT -p tcp --dport 80 -i eth0 -m state --state NEW -m recent --update --seconds 60 --hitcount 150 -j DROP


# reject all other inbound 拒绝所有其他的进入到这台服务器的流量
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT

```

告诉iptables 配置文件的位置 ``` sudo iptables-restore < /etc/iptables.up.rules  ```

查看防火墙的状态 ``` sudo ufw status  ```

如果为 inactive 表示没被激活,执行此命令来激活(如果激活状态为 active) ``` sudo ufw enable ```

设置防火墙开机自启动 ``` sudo vim /etc/network/if-up.d/iptables ```
```bash
#!/bin/sh
iptables-restore /etc/iptables.up.rules
```
给予这个脚本执行的权限 ``` sudo chmod +x /etc/network/if-up.d/iptables ```

#### 设置fail2ban

Fail2Ban可以看做是个防御型的动作库，通过监控系统的日志文件，根据检测到的任何可疑的行为，可以触发不同的环境动作

安装 ``` sudo apt-get install fail2ban ```

进入配置文件 ``` sudo vim /etc/fail2ban/jail.conf ```

```bash

#bantime 可以设置的稍微大点
bantime = 3600

# destemail 可以设置为我们自己的邮箱
destemail = 2105324852@qq.com

# 定义下action
action = %(action_mw)s

```

查看fail2ban的运行状态 ``` sudo service fail2ban status ```

停掉fail2ban服务 ``` sudo service fail2ban stop ```

开启fail2ban服务 ``` sudo service fail2ban start ```

补充：df -h 查看硬盘使用情况
