# React 项目发布

## 目录

* [生产环境配置](#生产环境配置)

  * [安装Nodejs](#安装nodejs)

  * [安装Webpack](#安装webpack)

  * [安装Git并配置权限](#安装Git并配置权限)

* [发布脚本编写](#发布脚本编写)

  * [拉取最新代码](#拉取最新代码)

  * [项目初始化](#项目初始化)

  * [执行打包编译](#执行打包编译)

  * [复制build目录到目标目录](#复制build目录到目标目录)

* [Nginx域名配置](#nginx域名配置)

  * [Nginx域名配置](#nginx域名配置)

  * [通过指定hosts方式做Nginx配置测试](#通过指定hosts方式做nginx配置测试)

  * [更改域名解析](#更改域名解析)

  # 发布脚本编写

```shell
# 使用方法：

# project1 : project_deploy.sh project1
# project2 : project_deploy.sh project2

```

```shell
#!/bin/sh

# git仓库目录
GIT_HOME=/develop/git-repository/

# 目标目录
DEST_PATH=/product/

# cd dir
if [ ! -n "$1" ];
    then
    echo -e "请输入要发布的项目"
    exit
fi

if [ $1 = "project1" ];
    then
    echo -e "=================Enter project1================="
    cd $GIT_HOME$1
elif [ $1 = "project2" ];
    then
    echo -e "=================Enter project2================="
    cd $GIT_HOME$1
else
    echo -e "输入的项目名没有找到"
    exit
fi

# clear git build
echo -e "=================clear git build================="
rm -rf ./build

# git checkout master
echo -e "=================git checkout master================="
git checkout master

# git pull
echo -e "=================git pull================="
git pull

# npm install
echo -e "=================npm install================="
npm install --registry=https://registry.npm.taobao.org

# npm run build
echo -e "=================npm run build================="
npm run build

if [ -d './build' ]
    then
    # backup dest
    echo -e "=================dest back================="
    mv $DEST_PATH$1/build $DEST_PATH$1/build.bak

    # copy
    echo -e "=================copy================="
    cp -R ./build $DEST_PATH$1

    # echo result
    echo -e "=================deploy succcess==============="
else
    # echo result
    echo -e "=================deploy error==============="
fi
```
