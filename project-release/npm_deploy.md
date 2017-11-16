npm 发布自己模块

* [npm源设置](#npm源设置)

* [nnpm注册登录](#npm注册登录)

* [npm module 发布](#npmmodule发布)

* [可能遇到的问题](#可能遇到的问题)


### npm源设置

查看当前npm源
```bash
  npm config get registry
  # http://registry.npmjs.org/
```

设置为taobao源

```bash
  npm config set registry=https://registry.npm.taobao.org
```

在npm publish的时候 需要切换回npm源

```bash
  npm config set registry=http://registry.npmjs.org
```

### npm注册登录

注册

```
$ npm adduser
Username: your name
Password: your password
Email: (this IS public) your email
```

查看当前使用的用户

```
npm whoami
```
npm登录

```
npm login
```

### npm module 发布

进入项目根目录，输入命令。

```
npm publish
```

### 可能遇到的问题

###### 问题1

```
no_perms Private mode enable, only admin can publish this module: coorddistance
```

这里注意的是因为国内网络问题，许多小伙伴把npm的镜像代理到淘宝或者别的地方了，这里要设置回原来的镜像。

```
npm config set registry=http://registry.npmjs.org

```
