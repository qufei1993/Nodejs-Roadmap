# 项目发布

## 目录

* [创建用户](#创建用户)

* [登录远程服务器](#登录远程服务器)

  * [三种登录方法](#方法1)

* [增强服务器安全等级](#增强服务器安全等级)

  * [修改端口号](#修改端口号)

  * [设定iptables规则](#设定iptables规则)

  * [设置fail2ban](#设置fail2ban)

* [Nodejs生产环境部署](#nodejs生产环境部署)

* [Nginx映射](#nginx映射)

* [Mongodb](#mongodb)

  * [mongodb安装](#mongodb安装)

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

  最后 ``` service ssh restart ``` 重启一下

## 登录远程服务器

### 三种登录方法

#### 方法1

  ssh root@ip地址

#### 方法2

 在mac下面如果安装了zsh 会有.zshrc这样一个配置文件 ``` subl .zshrc ```

 在这个配置文件里面可以通过软链接加入命令
```bash
  alias ssh_demo="ssh root@ip地址"
```

 通过 ``` source .zshrc ``` 重新载入这个用户变量

 最后控制台输入 ``` ssh_demo ``` 将会自动调用上面配置好的这个命令

#### 方法3

  如果有多台服务器，每次都需要输入密码 这样还是有些繁琐的 适合通过私钥认证的方式来 实现无密码登录

  首先确定本地有没有生成过秘钥，如果之前生成过就不要在生成，这样会覆盖你之前的电脑上的秘钥，也许会影响到你的其他程序

  进入 .ssh 目录执行以下配置秘钥命令:
   ```bash

   ssh-keygen -t rsa -b 4096 -C "demo_manager@qq.com"

   ```
  将会生成 id_rsa  id_rsa.pub 两个文件， ``` cat id_rsa ``` 查看内容

  进入.ssh目录，开启ssh代理 ``` eval "$(ssh-agent -s)" ```

  进入.ssh目录，将ssh key加入这个代理中 ``` ssh-add ~/.ssh/id_rsa ```

  以上操作是在本地电脑上生成私钥，同样现在我们登入服务器，按照上面的步骤在服务器上生成私钥，如果已经有了，就不需要了。

  进入服务器的 .ssh目录  创建一个授权文件 ``` vim authorized_keys ```,将本地电脑生成的公钥放入这个授权文件里 现在服务器已经持有了某台电脑的上的公钥，此时这台电脑就可不需输入密码来登录这台服务器

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

## nodejs生产环境部署

安装相关的模块 ``` sudo apt-get install vim openssl build-essential libssl-dev wget curl git ```

可以使用[nvm](https://github.com/creationix/nvm)``` https://github.com/creationix/nvm ```这个工具来安装nodejs 方便后面的升级与管理

在控制台执行命令,安装nvm ``` wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash ```

安装nodejs版本为v6.9.5 ``` nvm install v6.9.5 ```

把这个版本指定下 ``` nvm use v6.9.5 ```

设定系统的默认版本为 v6.9.5 ``` nvm alias default v6.9.5 ```

查看node版本 ``` node -v ```

配置npm源为国内的淘宝源 ``` npm --registry=https://registry.npm.taobao.org install -g npm ```

增加一个系统的文件监控树 ``` echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p  ```

为了保障更快更稳定的速度，此处采用cnpm来替代npm ``` npm --registry=https://registry.npm.taobao.org install -g cnpm ```

查看cnpm版本 ``` cnpm -v ```

在网络不是太慢或者连不上的情况下 还是推荐使用 npm，如果有些模块如果实在拿不到我们可以通过cnpm sync 同步到npm 上 例如koa ``` cnpm sync koa ```

安装一些常用的工具包 ``` npm i pm2 webpack gulp grunt-cli -g ```

到此nodejs的环境已安装好，如果想要通过不带端口号的ip或者域名直接来访问到服务器的80端口node服务， 下一步则需要配置Nginx反向代理，来实现。

## nginx映射

新购买的服务器一般都会预装apache如果用户可以删除, 此处给出关于删除apache的命令。

```bash
  sudo service apache2 stop

  sudo service apache stop

  #删除apache2
  update-rc.d -f apache2 remove

  #移出apache2
  sudo apt-get remove apache2
```

安装nginx ``` sudo apt-get install nginx ```

查看版本 ``` nginx -v ```

进入 ``` etc/nginx/conf.d ``` 创建配置文件 ``` sudo vim yuming-com-8081.conf ```

```bash
upstream yuming {
  server 127.0.0.1:8081;
}

server {
  listen 80;

  # 当通过这个ip地址来访问，服务器的server_name会匹配到这个地址，向这个地址发起请求的所有流量 都转发到上面的 upstream yuming 里面去
  server_name 服务器IP地址;

  location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forward $proxy_add_x_forwarded_for;

    proxy_set_header Host $http_host;
    proxy_set_header X-Nginx-Proxy true;

    //配置指令实现代理 把域名代理到集群（这个应用的名字上面）
    proxy_pass http://yuming;
    proxy_redirect off; //关闭
  }
}
```

进入 ``` etc/nginx/ ``` 找到 ``` vim nginx.conf ``` 这个配置文件查看以下两个配置是否打开

```bash
# 加载conf.d下面的所有.conf文件
include /etc/nginx/conf.d/*.conf;

# 加载sites-enabled下面的所有文件
include /etc/nginx/sites-enabled/*
```

查看上面写的配置文件是否正确 ``` sudo nginx -t  ```

重启nginx ```bash sudo nginx -s reload ```

在浏览器中会显示我们的nginx服务器版本信息 如果不想显示 进入 ``` etc/nginx/nginx.conf ``` 将 ``` server_tokens off ``` 注释打开

## mongodb

### mongodb安装
打开[mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)官网，可以根据自己的系统环境安装，此处介绍ubuntu安装步骤

导入key ``` sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6```

为mongodb的配置文件创建一个列表 ``` sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6 ```

更新本地包 ``` sudo apt-get update ```

安装mongodb ``` sudo apt-get install -y mongodb-org ```

因为mongodb的源在国外，可能会很慢，可以按下ctrl+c中断操作来修改源，进入目录 ``` cd /etc/apt/sources.list.d ``` 编辑文件 ``` sudo vim mongodb-org-3.4.list ```

```bash
# 将现有的源 http://repo.mongodb.org 改为 阿里云的 http://mirrors.aliyun.com/mongodb

```

修改完成之后更新下源 ``` sudo apt-get update```

在重新安装,这时会从阿里云镜像来安装，将会快很多 ``` sudo apt-get install -y mongodb-org ```

开启服务 ``` sudo service mongodb start ```

重启服务 ``` sudo service mongodb restart ```

如果设置了防火墙 打开配置文件加入27017mongodb这个端口号 ``` sudo vim /etc/iptables.up.rules```

```bash
-A INPUT -s 127.0.0.1 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT

-A OUTPUT -d 127.0.0.1 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
```

重新载入 ``` sudo iptables-restore < /etc/iptables.up.rules ```

通过mongo连接实例 看是否成功 ``` mongo ```

目前安装已经成功，mongodb的默认端口跑在27017端口，出于最基本的考虑，改掉这个端口号，编辑此文件 ``` sudo vim /etc/mongod```

```bash

#找到port 修改为29999
net:
 port: 29999
```

注意：修改mongodb默认端口号之后 还要更新下防火墙中设置的端口号

重启mongodb  ``` sudo service mongodb restart ````
通过mongo链接 mongo --port 29999

### 演示如何向线上的数据库导入初识数据



补充：df -h 查看硬盘使用情况
