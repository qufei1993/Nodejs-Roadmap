#  sudo 出现unable to resolve host 解决方法

Ubuntu环境, 假设这台机器名字叫abc(机器的hostname), 每次执行sudo 就出现这个警告讯息:
sudo: unable to resolve host abc

虽然sudo 还是可以正常执行, 但是警告讯息每次都出来,而这只是机器在反解上的问题, 所以就直接从/etc/hosts 设定, 让abc(hostname) 可以解回127.0.0.1 的IP 即可.

/etc/hosts 原始内容

```bash
  127.0.0.1       localhost
  # The following lines are desirable for IPv6 capable hosts
  ::1     localhost ip6-localhost ip6-loopback ip6-loopback
  fe00::0 ip6-localnet
  ff00::0 ip6-mcastprefix
  ff02::1 ip6-allnodes
  ff02::2 ip6-allrouters
  ff02::3 ip6-allhosts
```

 在127.0.0.1 localhost 后面加上主机名称(hostname) 即可, /etc/hosts 内容修改成如下:

 ```bash
   127.0.0.1       localhost
   127.0.0.1       abc #注意这里是主机名
   
   # The following lines are desirable for IPv6 capable hosts
   ::1     localhost ip6-localhost ip6-loopback ip6-loopback
   fe00::0 ip6-localnet
   ff00::0 ip6-mcastprefix
   ff02::1 ip6-allnodes
   ff02::2 ip6-allrouters
   ff02::3 ip6-allhosts
 ```
