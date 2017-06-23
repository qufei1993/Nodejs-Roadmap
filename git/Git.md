### git
#### 初次发布
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

#### 分支操作

* 新建分支 feature/qunar  git checkout dev/branch 

* 查看当前分支 git branch

* 切换分支 git checkout dev/branch
