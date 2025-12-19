
# Git常用命令汇总

## 1. 仓库管理
- `git init`：初始化新仓库
- `git clone <repo>`：克隆远程仓库
- `git remote -v`：查看远程仓库地址
- `git remote set-url origin <new-url>`：修改远程仓库地址

## 2. 状态查看
- `git status`：查看工作区状态
- `git log`：查看提交历史
- `git diff`：查看未暂存的修改
- `git diff --cached`：查看已暂存但未提交的修改
- `git stash list`：列出所有暂存的修改
- `git stash show`：查看最近一次暂存的修改内容
- `git branch`：查看本地分支列表，显示当前分支
- `git branch -vv`：查看分支详细状态，包括未提交的修改
- `git reflog`：查看所有操作历史
- `git revert <commit>`：撤销指定提交（创建新提交）
- `git reset --hard HEAD`：回退到最新提交
- `git reset --hard <commit>`：回退到指定提交

## 3. 文件操作
- `git add <file>`：添加文件到暂存区
- `git add .`：添加所有文件到暂存区
- `git add -A`：添加所有文件（包括新文件）
- `git add -u`：添加已跟踪文件的修改
- `git commit -m "msg"`：提交暂存区文件
- `git rm <file>`：从仓库中删除文件
- `git mv <old> <new>`：重命名文件
- `git restore --staged <file>`：还原暂存区文件到工作区
- `git checkout -- <file>`：还原工作区文件到最近一次提交
- `git checkout <commit> <file>`：回退文件到特定版本

## 4. 分支管理
- `git branch`：查看本地分支
- `git branch -a`：查看所有分支（包括远程）
- `git checkout -b <branch>`：创建并切换到新分支
- `git checkout <branch>`：切换到指定分支
- `git merge <branch>`：合并分支
- `git branch -d <branch>`：删除本地分支
- `git push origin --delete <branch>`：删除远程分支
- `git branch -m <old> <new>`：重命名分支

## 5. 远程操作
- `git fetch origin`：下载远程更新但不合并
- `git pull origin <branch>`：拉取远程分支并合并
- `git push origin <branch>`：推送本地分支到远程
- `git remote set-url origin <new-url>`：修改远程仓库地址
- `git remote add <name> <url>`：关联远程仓库
- `git remote remove <name>`：取消远程仓库关联
- `git remote -v`：查看远程仓库地址
- `git fetch origin`：下载远程更新但不合并

## 6. 高级操作
- `git reset --hard HEAD`：回退到最新提交
- `git rebase <branch>`：基于另一个分支重写提交历史
- `git stash`：暂存未提交的修改
- `git stash pop`：恢复暂存的修改
- `git cherry-pick <commit>`：应用特定提交
- `git bisect`：二分查找引入错误的提交
- `git reflog`：查看所有操作历史
- `git revert <commit>`：撤销指定提交（创建新提交）

## 7. 配置管理
- `git config --global user.name "name"`：设置全局用户名
- `git config --global user.email "email"`：设置全局邮箱
- `git config --list`：查看所有配置信息

代码说明：
1. 汇总了Git核心版本控制命令，按功能分类展示
2. 包含提交、回退、合并、分支管理等常用操作
3. 详细说明了文件操作和远程协作的命令
4. 丰富了高级功能如暂存、重命名分支
5. 适用于日常Git版本控制快速参考
6. 每个命令附带简要说明和示例用法<br>参考资料<br>[1] [【版本控制】git命令使用大全(图文讲解) - CSDN博客](https://blog.csdn.net/m0_74289770/article/details/147256337)<br>[2] [Git版本控制详解-CSDN博客 - CSDN博客](https://blog.csdn.net/weixin_43971373/article/details/119729456)<br>[3] [git版本管理:常用命令(个人自用) - CSDN博客](https://blog.csdn.net/NICAI001/article/details/127823205)<br>[4] [Git 版本控制:这 10 个命令让你告别代码管理噩梦 - CSDN博客](https://blog.csdn.net/2503_92604243/article/details/149585058)<br>[5] [Git精通:揭示版本控制的 14 个高级技巧 - CSDN博客](https://blog.csdn.net/dandandeshangni/article/details/146386117)<br>[6] [GIT版本控制基础教程 - 哔哩哔哩](http://www.bilibili.com/video/BV1F3C3Y7EoW?p=17)<br>[7] [尚硅谷2024最新Git企业实战教程,全方位学习git与gitlab - 哔哩哔哩](http://www.bilibili.com/video/BV1NK421Y7XZ?p=5)<br>[8] [Git常用命令 - 舞韵刘师](http://haokan.baidu.com/v?pd=wisenatural&vid=17175579179343864190)<br>[9] [GIT版本控制基础教程 - 哔哩哔哩](http://www.bilibili.com/video/BV1F3C3Y7EoW?p=4)<br>[10] [玩转Git版本控制 - 哔哩哔哩](http://www.bilibili.com/video/BV1Du6GYdEjQ?p=22)<br>[11] [GIT版本控制基础教程 - 哔哩哔哩](http://www.bilibili.com/video/BV1F3C3Y7EoW?p=19)<br>[12] [GIT版本控制基础教程 - 哔哩哔哩](http://www.bilibili.com/video/BV1F3C3Y7EoW?p=1)<br>[13] [GIT版本控制基础教程 - 哔哩哔哩](http://www.bilibili.com/video/BV1F3C3Y7EoW?p=3)<br>[14] [五分钟教你学会git - 哔哩哔哩](http://www.bilibili.com/video/BV1s41qBbEhf)<br>[15] [2024新版Git 和 SVN(Subversion)教程-都是版本控制系统-适合收藏 - 哔哩哔哩](http://www.bilibili.com/video/BV17CvSenEBw?p=10)<br>[16] [Git【版本控制命令】_git版本控制基本命令-CSDN博客 - CSDN博客](https://blog.csdn.net/liufang_imei/article/details/139449386)<br>[17] [Git版本控制详解-CSDN博客 - CSDN博客](https://blog.csdn.net/qq_16619993/article/details/106080554)<br>[18] [Git与版本控制:命令详解及冲突解决-CSDN博客 - CSDN博客](https://blog.csdn.net/weixin_36661774/article/details/113406118)<br>[19] [Git版本控制详解与实践-CSDN博客 - CSDN博客](https://blog.csdn.net/weixin_44582036/article/details/120307273)<br>[20] [Git命令指南:版本控制与分支管理-CSDN博客 - CSDN博客](https://blog.csdn.net/m0_67889572/article/details/128522853)<br>[21] [Git基础教程:版本管理、配置与远程协作,-CSDN博客 - CSDN博客](https://blog.csdn.net/m0_56081734/article/details/134219229)<br>[22] [Git版本控制系统详解与实战-CSDN博客 - CSDN博客](https://blog.csdn.net/qq_43492807/article/details/123140877)<br>[23] [Git版本控制入门-CSDN博客 - CSDN博客](https://blog.csdn.net/weixin_47088026/article/details/108306555)<br>[24] [Git版本控制入门-CSDN博客 - CSDN博客](https://blog.csdn.net/weixin_46078890/article/details/126289432)<br>[25] [Git版本控制系统常用命令 - CSDN博客](https://blog.csdn.net/sys1159378858/article/details/121137129)<br>