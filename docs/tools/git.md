# Git

> Git 当下最流行的版本管理工具，结合自己工作中的实际应用做了以下梳理，如果您在使用中还有其它问题欢迎评论留言

## 快速导航

* [基础命令](#基础命令)
* [分支操作](#分支操作)
* [修改远程仓库地址](#修改远程仓库地址)
* [远程分支获取最新的版本到本地](#远程分支获取最新的版本到本地)
* [拉取远程仓库指定分支到本地](#拉取远程仓库指定分支到本地)
* [工具类](#工具类)
* [常见问题](#常见问题)

## 基础命令

* ``` git init ``` 初始化本地仓库
* ``` git add -A . ``` 来一次添加所有改变的文件
* ``` git add -A ``` 表示添加所有内容  
* ``` git add . ``` 表示添加新文件和编辑过的文件不包括删除的文件  
* ``` git add -u ``` 表示添加编辑或者删除的文件，不包括新添加的文件  
* ``` git commit -m '版本信息' ``` 提交的版本信息描述
* ``` git status ``` 查看状态  
* ``` git push -u origin master ``` 推送到远程仓库看
* ``` git pull ``` 拉取远程仓库代码到本地
* ```git branch -av``` 查看每个分支的最新提交记录
* ```git branch -vv``` 查看每个分支属于哪个远程仓库
* ```git reset --hard a3f40baadd5fea57b1b40f23f9a54a644eebd52e``` 代码回归到某个提交记录

## 分支操作

* 查看本地都有哪些分支 ``` git branch -a ```
* 新建分支 ``` git branch dev```
* 查看当前分支 ``` git branch ```
* 切换分支 ``` git checkout dev ```
* 删除本地分支 ```git branch -d dev```
* 同步删除远程分支 ```git push origin :dev```
* 本地分支重命名 ```git branch -m oldBranch newBranch```

## 修改远程仓库地址

* 方法1，先删后加:
	* ``` git remote rm origin ``` 先删除
	* ``` git remote add origin 仓库地址 ``` 链接到到远程git仓库
* 方法2，修改命令:
	* ```git remote set-url origin 仓库地址```

## 远程分支获取最新的版本到本地

* 执行``` git pull ```命令
* 如果以上命令还是失败尝试以下步骤：
	1. 首先从远程的origin的master主分支下载最新的版本到origin/master分支上  

		```git fetch origin master```
		
	2. 比较本地的master分支和origin/master分支的差别  

		```git log -p master..origin/master```
		
	3. 进行合并  

		```git merge origin/master```

## 拉取远程仓库指定分支到本地

* 首先要与origin master建立连接：```git remote add origin git@github.com:XXXX/nothing2.git```  

* 切换到其中某个子分支：```git checkout -b dev origin/dev```  

* 可能会报这种错误:

```
fatal: Cannot update paths and switch to branch 'dev' at the same time.
Did you intend to checkout 'origin/dev' which can not be resolved as commit?
```
* 原因是你本地并没有dev这个分支，这时你可以用 ```git branch -a``` 命令来查看本地是否具有dev分支

* 我们需要：```git fetch origin dev``` 命令来把远程分支拉到本地

* 然后使用：```git checkout -b dev origin/dev``` 在本地创建分支dev并切换到该分支

* 最后使用：```git pull origin dev``` 就可以把某个分支上的内容都拉取到本地了

## 工具类

* [Beyond Compare (http://www.scootersoftware.com/download.php](http://www.scootersoftware.com/download.php) 代码合并
* [官方Git文档地址 https://git-scm.com/book/zh/v2](https://git-scm.com/book/zh/v2)

## 常见问题

#### Question1

如何解决 ``` failed to push some refs to git ```

#### Answer1
* ```git pull --rebase origin master``` 进行代码合并
* ```git push -u origin master``` 即可完成代码上传

<hr>

#### Question2

```
If you wish to set tracking information for this branch you can do so with:
git branch --set-upstream-to=origin/<branch> master
```

#### Answer2

指定当前当前工作目录工作分支，跟远程仓库分支之间的联系

```
git branch --set-upstream master origin/master
```

<hr>

#### Question3

获取 ```git pull``` 最新代码报以下错误:

```
fatal: refusing to merge unrelated histories
```

#### Answer3

git pull之后加上可选参数 --allow-unrelated-histories 强制合并

```
git pull origin master --allow-unrelated-histories
```

<hr>

#### Question4

使用钩子``` pre-commit ```，提交代码提示如下错误：

```shell
$ git commit -m '.'
sh: eslint: command not found
pre-commit:
pre-commit: We've failed to pass the specified git pre-commit hooks as the `fix`
pre-commit: hook returned an exit code (1). If you're feeling adventurous you can
pre-commit: skip the git pre-commit hooks by adding the following flags to your commit:
pre-commit:
pre-commit:   git commit -n (or --no-verify)
pre-commit:
pre-commit: This is ill-advised since the commit is broken.
pre-commit:
```

#### Answer4

* 打开项目中的 ```.git/hooks``` 文件夹，找到 ```pre-commit.sample``` 文件，将以下代码替换到文件中，或者，```npm install pre-commit --save``` 也可以，这个命令会自动执行以下操作。

```shell
#!/bin/bash
TSLINT="$(git rev-parse --show-toplevel)/node_modules/.bin/tslint"
for file in $(git diff --cached --name-only | grep -E '\.ts$')
do
        git show ":$file" | "$TSLINT" "$file"
        if [ $? -ne 0 ]; then
                exit 1
        fi
done
```
* 将```pre-commit.sample```文件名修改为```pre-commit```。

<hr>

#### Question5

.gitignore 规则不生效的解决办法

#### Answer5

把某些目录或文件加入忽略规则，按照上述方法定义后发现并未生效，原因是.gitignore只能忽略那些原来没有被追踪的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。那么解决方法就是先把本地缓存删除（改变成未被追踪状态），然后再提交：

```
git rm -r --cached . 或者 git rm -r README.md
git add .
git commit -m 'update .gitignore'
```
