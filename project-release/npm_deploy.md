npm 发布自己模块

查看npm源

```bash
  npm config get registry
  # http://registry.npmjs.org/
```

在安装一些npm包，如果网络较慢可设置为taobao源

```bash
  npm config set registry=https://registry.npm.taobao.org
```

在npm publish的时候 需要切换回npm源

```bash
  npm config set registry=http://registry.npmjs.org
```
