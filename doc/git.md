# git

### 初次发布

git init 初始化本地仓库  

git add -A . 	来一次添加所有改变的文件  
git add -A 		表示添加所有内容  
git add . 		表示添加新文件和编辑过的文件不包括删除的文件  
git add -u 表示添加编辑或者删除的文件，不包括新添加的文件  

git status 查看状态  

git commit -m '版本信息'  

链接下远程的git库  
```git remote add origin git@github.com:Q-angelo/Q-angelo```  

提交到远程  
git push -u origin master

Git中从远程的分支获取最新的版本到本地：  
1. 首先从远程的origin的master主分支下载最新的版本到origin/master分支上  

	```git fetch origin master```
	
2. 比较本地的master分支和origin/master分支的差别  

	```git log -p master..origin/master```
	
3. 进行合并  

	```git merge origin/master```
	
修改远程仓库地址

git remote rm origin
git remote add origin [url]
### 拉取dev分支到本地

首先自己要与origin master建立连接：```git remote add origin git@github.com:XXXX/nothing2.git```  

然后我们才能切换到其中某个子分支：```git checkout -b dev origin/dev```  

可能会报这种错误:
```
fatal: Cannot update paths and switch to branch 'dev' at the same time.
Did you intend to checkout 'origin/dev' which can not be resolved as commit?
 ```
原因是你本地并没有dev这个分支，这时你可以用 ```git branch -a``` 命令来查看本地是否具有dev分支

我们需要：```git fetch origin dev``` 命令来把远程分支拉到本地

然后使用：```git checkout -b dev origin/dev``` 在本地创建分支dev并切换到该分支

最后使用：```git pull origin dev``` 就可以把某个分支上的内容都拉取到本地了


### 分支操作

* 新建分支 feature/qunar  git checkout dev/branch 

* 查看当前分支 git branch

* 切换分支 git checkout dev/branch

* 删除本地分支 git branch -d dev

* 同步删除远程分支 git push origin :dev

### 问题1:

* 如何解决failed to push some refs to git

### 对策1:
* git pull --rebase origin master //进行代码合并

* git push -u origin master  //即可完成代码上传

### 问题2:

``` If you wish to set tracking information for this branch you can do so with: ```

```	git branch --set-upstream-to=origin/<branch> master ```

### 对策2:

指定当前当前工作目录工作分支，跟远程仓库分支之间的联系

``` git branch --set-upstream master origin/master  ```

### 问题3:

git pull 获取最新代码报以下错误

``` fatal: refusing to merge unrelated histories ```

### 对策3: 

git pull之后加上可选参数 --allow-unrelated-histories 强制合并

``` git pull origin master --allow-unrelated-histories ```

### 代码合并工具

[Beyond Compare](http://www.scootersoftware.com/download.php)
