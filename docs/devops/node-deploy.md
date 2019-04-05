# Node.js生产环境完整部署指南

> 项目上线之前的最后一步，生产环境搭建、代码部署，在一些公司可能是运维同事在做这些事，但是做为一名Developer掌握如何进行服务部署也是你通往全栈工程师的必经之路。本文编程语言主要讲解了Node.js，对于用户权限管理、服务器安全等级增强、MongoDB生产部署、Nginx映射等不论你使用Java、PHP、Python等编程语言在进行部署时都是可以应用到的。

## 快速导航

#### 用户权限管理及登陆服务器
* [创建用户](#创建用户)
* [用户查找](#用户查找)
* [用户删除](#用户删除)
* [登录远程服务器](#登录远程服务器)

#### 增强服务器安全等级
* [修改端口号](#修改端口号)
* [设定iptables规则](#设定iptables规则)
* [设置fail2ban](#设置fail2ban)

#### Node.js生产环境部署
* [安装相关依赖模块](#安装相关依赖模块)
* [nvm版本管理](#nvm版本管理)
* [nvm安装指定Node.js版本](#node安装)
* [demo验证](#demo验证)
* [Nginx映射](#nginx映射)

#### Mongodb生产环境部署
* [Mongodb安装](#mongodb安装)
* [防火墙中加入mongodb端口号](#防火墙中加入mongodb端口号)
* [更改MongoDB默认端口号](#更改MongoDB默认端口号)
* [开启MongoDB服务](#开启MongoDB服务)

#### 代码部署
  * [选择代码托管仓库](#选择代码托管仓库)
  * [实现服务器与第三方仓库的关联](#实现服务器与第三方仓库的关联)
  * [PM2部署代码到服务器](#PM2部署代码到服务器)
  * [pm2发布遇到的一些问题](#pm2发布遇到的一些问题)

## 用户权限管理及登陆服务器

#### 创建用户

* 创建用户名： ``` adduser demo_manager ``` 之后会提示设置密码 和一些信息

* 修改用户权限： ``` gpasswd -a demo_manager sudo ```
> 成功之后会出现一个添加user的提示 ``` Adding user demo_manager to group sudo  ```

* 编辑文件：``` sudo visudo ```

> 找到 ``` root ALL=(ALL:ALL) ALL ``` 在这段代码下面添加 这个刚创建的user
  ```bash
    demo_manager ALL=(ALL:ALL) ALL

    #demo_manager  指我们新增的这个用户 以上这些规则对这个用户生效
    #第一个ALL 这些规则对所有用户生效
    #第二个ALL demo_manager可以任意用户来执行命令
    #第三个ALL demo_manager 可以以任何的组来执行命令
    #第四个ALL 这个适用于所有命令
  ```

* 重启配置：``` service ssh restart ```

#### 用户查找

* 查看用户：``` cat /etc/passwd ```
* 查看用户组：``` cat /etc/group ```
* 查看当前活跃的用户列表：``` w ```
* 查看指定用户：``` cat /etc/passwd|grep root ```
* 查看当前服务用户：``` whoami ```

#### 用户删除

> userdel 是一个底层用于删除用户的工具。在 Debian 上，我们通常会使用 deluser 命令。userdel 会查询系统账户文件，例如 /etc/password 和 /etc/group。那么它会删除所有和用户名相关的条目。在我们删除它之前，用户名必须存在。

* 删除用户：``` userdel testuser ```
* 完全删除用户家目录：``` userdel -r testuser ```

#### 登录远程服务器

* 方法1：```ssh root@ip地址```

* 方法2：
    * 安装```zsh```并编辑配置文件 ``` subl .zshrc ```
  ```bash
    # 通过软链接加入命令
    alias ssh_demo="ssh root@ip地址"
  ```
    * 重载配置文件 ``` source .zshrc ```
    * 控制台输入``` ssh_demo ```将自动调用上面配置好的这个命令

* 方法3：
    > 如果有多台服务器，每次都需要输入密码 这样还是有些繁琐的 适合通过私钥认证的方式来，实现无密码登录。

    > 先确定本地有没生成过秘钥，如果之前生成过就不要在生成，这样会覆盖你之前的电脑上的秘钥，也许会影响到你的其他程序。

    * 进入 .ssh 目录执行以下配置秘钥命令:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "demo_manager@qq.com"
   ```
  将会生成 id_rsa  id_rsa.pub 两个文件， ``` cat id_rsa ``` 查看内容

  进入.ssh目录，开启ssh代理 ``` eval "$(ssh-agent -s)" ```

  进入.ssh目录，将ssh key加入这个代理中 ``` ssh-add ~/.ssh/id_rsa ```

  以上操作是在本地电脑上生成私钥，同样现在我们登入服务器，按照上面的步骤在服务器上生成私钥，如果已经有了，就不需要了。

  进入服务器，如果没有生成过密钥，重复上述步骤在服务器端生成密钥，进入.ssh目录，创建一个授权文件 ``` vim authorized_keys ```，将本地电脑生成的公钥放入这个授权文件里 现在服务器已经持有了某台电脑的上的公钥，此时这台电脑就可不需输入密码来登录这台服务器

  修改授权文件权限 ``` chmod 600 authorized_keys ```

  重启ssh服务 ``` sudo service ssh restart ```

  采用了密钥登录，如果本地链接还需要输入密码，可参考这个解决方案 [`[issue]`](https://github.com/Q-Angelo/summarize/issues/2)

## 增强服务器安全等级

#### 修改端口号

服务器默认端口是22， 出于基本的安全考虑也是需要来修改这个端口号的  

修改配置文件 ``` vim /etc/ssh/sshd_config ``` 执行此命令会提示输入密码

```bash
# 修改port端口号 范围为1 到 65536, 0 1024之间的可能会被系统所占用，因此最好采用1024之外的  

Port 39999 # 此时将会禁用22端口

UseDNS no # 此处确保为 no

# 加入我们为这个服务创建的用户
AllowUsers demo_manager

# 出去安全层面考虑 可以关闭root密码登录
PermitRootLogin no

# 已经配好了秘钥登录的 可以将下面是是否允许密码登录(授权) 给关掉
PasswordAuthentication no

# 是否允许空密码
# PermitEmptyPasswords no
```

重启ssh服务，使端口生效 ``` sudo service ssh restart ``` 

#### 设定iptables规则

清空掉所有的iptables 规则 ``` sudo iptables -F ```

修改配置文件 ``` sudo vim /etc/iptables.up.rules ```

```bash
*filter

#允许所有建立起来的链接
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#允许所有出去的流量, 此处也可以设置一些特定的流量规则
-A OUTPUT -j ACCEPT

# 允许https协议下的请求链接
-A INPUT -p tcp --dport 443 -j ACCEPT

# 所有的网站访问一台服务器都是从80端口进去的，因此让80端口的流量可以进出
-A INPUT -p tcp --dport 80 -j ACCEPT

# 通过这条设定 我们登录服务器就只能通过这个端口，如果是别的防火墙就会拦截
-A INPUT -p tcp -m state --state NEW --dport 39999 -j ACCEPT

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

安装过程中出现以下错误，执行 ``` sudo apt-get update ``` 更新下源即可

```bash
Reading package lists... Done
Building dependency tree       
Reading state information... Done
E: Unable to locate package fail2ban
```

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

#### 安装相关依赖模块

``` sudo apt-get install vim openssl build-essential libssl-dev wget curl git ```

#### nvm版本管理

可以使用[nvm](https://github.com/creationix/nvm)``` https://github.com/creationix/nvm ```这个工具来安装nodejs 方便后面的升级与管理

在控制台执行命令,安装nvm ``` wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash ```

nvm安装成功，控制台 nvm 找不到命令，解决办法 [`[issue]`](https://github.com/Q-Angelo/summarize/issues/1)

查看所有node版本 ``` nvm ls-remote ```

查看本地node版本 ``` nvm ls-remote ```

#### node安装

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

#### demo验证

> 到此有关nodejs的环境已安装完毕，下面给个例子来测试，上面的安装是否成功。

新建一个```app.js``` ``` vim app.js ```

```js
const http = require('http');

http.createServer( (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
}).listen(8081);

// 注意：如果设置了防火墙，需要在防火墙强的规则里面添加8081这个端口-A INPUT -p tcp --dport 8081 -j ACCEPT

console.log('Server Runing at http://120.26.89.1:8081');
```

到此Node.js的环境已安装完毕，如果想要通过不带端口号的```ip```或者域名直接来访问到服务器的```80```端口， 下一步则需要配置```Nginx```反向代理，来实现。

## nginx映射

> 新购买的服务器一般都会预装apache如果用户可以删除, 此处给出关于删除apache的命令。

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

```conf
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

  # 如果有css 图片 等 需要设置下
  location ~* ^.+\.(jpg|jpeg|gif|png|ico|css|js|pdf|txt){
    root /www/boyi_api/pro/current/public;
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

重启nginx ``` sudo nginx -s reload ```

在浏览器中会显示我们的nginx服务器版本信息 如果不想显示 进入 ``` etc/nginx/nginx.conf ``` 将 ``` server_tokens off ``` 注释打开

## mongodb

#### mongodb安装

打开[mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)官网，可以根据自己的系统环境安装，此处介绍ubuntu安装步骤

导入key ``` sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6```

为mongodb的配置文件创建一个列表 ``` echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list ```

更新本地包 ``` sudo apt-get update ```

安装mongodb ``` sudo apt-get install -y mongodb-org ```

因为mongodb的源在国外，可能会很慢，可以按下ctrl+c中断操作来修改源，进入目录 ``` cd /etc/apt/sources.list.d ``` 编辑文件 ``` sudo vim mongodb-org-3.4.list ```

```bash
# 将现有的源 http://repo.mongodb.org 改为 阿里云的 http://mirrors.aliyun.com/mongodb

```

修改完成之后更新下源 ``` sudo apt-get update```

在重新安装,这时会从阿里云镜像来安装，将会快很多 ``` sudo apt-get install -y mongodb-org ```

开启服务 ``` sudo service mongod start ```

重启服务 ``` sudo service mongod restart ```

#### 防火墙中加入mongodb端口号

如果设置了防火墙 打开配置文件加入27017mongodb这个端口号 ``` sudo vim /etc/iptables.up.rules```

```bash
-A INPUT -s 127.0.0.1 -p tcp --destination-port 27017 -m state --state NEW,ESTABLISHED -j ACCEPT

-A OUTPUT -d 127.0.0.1 -p tcp --source-port 27017 -m state --state ESTABLISHED -j ACCEPT
```

重新载入 ``` sudo iptables-restore < /etc/iptables.up.rules ```

通过mongo连接实例 看是否成功 ``` mongo ```

#### 更改MongoDB默认端口号

目前安装已经成功，但是全世界的人都知道mongodb的默认端口跑在27017端口，出于最基本的考虑，改掉这个端口号，编辑此文件 ``` sudo vim /etc/mongod.conf```

```bash
#找到port 修改为29999
net:
 port: 29999
```

注意：修改mongodb默认端口号之后 还要更新下防火墙中设置的端口号

#### 开启MongoDB服务

重启mongodb  ``` sudo service mongod restart ````
通过mongo链接 mongo --port 29999

#### 演示如何向线上的数据库导入初识数据
```js
//todo:
```

## 本地代码同步第三方仓库进行生产部署

#### 选择代码托管仓库

> 使用git仓库托管代码，可以选择github或者码云等等都可以，注册一个账号，创建一个项目，与本地的项目进行一个关联

进入本地电脑的.ssh 目录 找到id_rsa.pub文件，拷贝内容，进入码云个人中心里面找到ssh公钥，粘贴本地电脑拷贝的id_rsa内容。

进入本地的项目文件夹，如果是一个干净的项目，执行以下```Git```命令：

```bash
git init
git add .
git remote add origin # 远程仓库地址
git push
```

到此已经实现了本地项目与第三方仓库的关联。

#### 实现服务器与第三方仓库的关联

同样需要做的是，在服务上如果生成过.ssh 将 id_rsa.pub 公钥放到码云的后台

现在建立project文件夹 ``` mkdir project ```

进入project 目录 ，拉取远程仓库代码到服务器

```
git clone 远程仓库地址
```

#### PM2部署代码到服务器

通过上面这些操作实现了本地代码推送到私有仓库，服务器也可下载私有仓库的内容，下面开始用pm2管理工具，来管理我们的代码同步更新，服务重启，可参考pm2的文档里面很详细的讲解了从部署到每个参数的设置  [pm2](http://pm2.keymetrics.io/)

下面简单介绍使用 pm2 部署代码到服务器之上

首先建立一个 ecosystem.json 文件

```json
"apps" : [{
"name"      : "Website", //站点名称
"script"    : "app.js", //启动脚本，就是入口文件
"env": { //启动时候需要传入的变量
    "COMMON_VARIABLE": "true"
},
//生产环境的变量
"env_production" : {
    "NODE_ENV": "pro"
}
}],
//设置部署
"deploy" : {
"production" : {
    // 服务器上我们用户发布部署的user
    "user" : "root",
    // 服务器，如果有多台主机可以数组形式来写
    "host" : ["212.83.163.1", "212.83.163.2", "212.83.163.3"],
    // 端口
    "port" : 22,
    // 分支
    "ref"  : "origin/master",
    // 仓库地址
    "repo" : "git@github.com:repo.git",
    // 项目部署到服务器哪个目录下面的地址
    "path" : "/var/www/website",
    // key校验给取消掉
    "ssh_options": "StrictHostKeyChecking=no",
    // 设置环境
    "env"  : {
    "NODE_ENV": "pro"
    }
}
```

在发布前需要在服务器创建website文件，且给予可写的权限

```bash
mkdir /var/www/website

sudo chmod 777 website
```

如果是第一次发布，执行以下命令，让pm2连上我们的服务器，从服务器里面来创建我们发布项目所需要的文件夹

```javascript
pm2 deploy ecosystem.json pro setup
```

之后每次修改后将不需要setup 使用命令 ``` pm2 deploy ecosystem.json pro ``` 就可以发布啦，到此一个简单的项目发布就已经完成了，有问题可以提issues.

#### pm2发布遇到的一些问题

* bash: pm2: command not found

```
$ pm2 deploy ecosystem.json pro
--> Deploying to pro environment
--> on host 116.62.222.30
  ○ deploying origin/master
  ○ executing pre-deploy-local
  ○ hook pre-deploy
  ○ fetching updates
Fetching origin
  ○ resetting HEAD to origin/master
HEAD is now at 4092462 modify ecosystem.json
  ○ executing post-deploy `pm2 startOrRestart ecosystem.json --env pro`
bash: pm2: command not found

  post-deploy hook failed

Deploy failed
```

会发现在服务器上无法找到pm2命令，但是确实已经安装了呢，原因在于pm2在服务器上使用的是一个非交互式的ssh链接方式，回到服务器的用户根目录下编辑文件.bashrc ``` vim ~/.bashrc ```

```bash
# 找到以下命令加以注释，不让其提前返回

# [ -z "$PS1" ] && return

```

执行命令 重新加载 ``` source ~/.bashrc ```


* bash: npm: command not found

和上面问题一样编辑.bashrc文件

```bash
# 注释掉下面四行
# If not running interactively, don't do anything
# case $- in
#    *i*) ;;
#      *) return;;
# esac
```

执行命令 重新加载 ``` source ~/.bashrc ```

补充：df -h 查看硬盘使用情况
