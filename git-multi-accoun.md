
# GitHub多账号配置完整指南

## 概述
本指南详细说明如何在同一台电脑上配置多个GitHub账号，实现不同项目使用不同账号进行版本管理。

## 1. 生成SSH密钥

### 为新账号生成密钥对
```bash
ssh-keygen -t rsa -C "new_email@example.com" -f ~/.ssh/id_rsa_new
```

执行命令后：
- 提示输入文件名：直接回车使用默认
- 提示输入密码：直接回车跳过（或设置简单密码）

## 2. 配置SSH连接

### 编辑SSH配置文件
```bash
nano ~/.ssh/config
```

### 配置文件内容
```
# 默认账号配置
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa

# 新账号配置
Host github-new
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_rsa_new
```

## 3. 添加公钥到GitHub

### 复制公钥内容
```bash
cat ~/.ssh/id_rsa_new.pub
```

### GitHub设置步骤
1. 登录新GitHub账号
2. 进入 Settings → SSH and GPG keys
3. 点击 New SSH key
4. 标题设置为"My New Account"
5. 粘贴公钥内容并保存

## 4. 验证连接状态

### 测试SSH连接
```bash
ssh -T git@github-new
```

成功提示：`Hi [新用户名]! You've successfully authenticated...`

## 5. 创建本地项目

### 初始化项目目录
```bash
mkdir my-new-project
cd my-new-project
git init
```

## 6. 配置项目级Git信息

### 设置用户信息
```bash
git config user.name "New-Username"
git config user.email "new_email@example.com"
```

## 7. 创建项目文档

### README.md文件内容
```markdown
# My New Project

## 项目描述
这是一个使用新GitHub账号创建的项目。

## 功能特性
- 功能模块1
- 功能模块2
- 功能模块3

## 技术栈
- 技术1
- 技术2
- 技术3

## 安装使用

### 环境要求
- Node.js 14+
- Python 3.8+

### 安装步骤
```bash
git clone git@github-new:New-Username/my-new-project.git
cd my-new-project
```

## 开发计划
- [ ] 功能开发1
- [ ] 功能开发2
- [ ] 功能开发3
```

## 8. 关联远程仓库

### 添加远程仓库地址
```bash
git remote add origin git@github-new:New-Username/my-new-project.git
```

## 9. 初始提交和推送

### 提交文件到本地仓库
```bash
git add .
git commit -m "Initial commit: Project setup with README"
git push -u origin main
```

## 10. 后续维护

### 更新项目代码
```bash
git add .
git commit -m "Update: 修改说明"
git push origin main
```

## 常见问题处理

### 权限错误
- 检查SSH配置文件语法
- 验证密钥文件权限（600）

### 冲突解决
```bash
git pull origin main --allow-unrelated-histories
```

## 注意事项
- 确保每个项目都配置对应的用户信息
- 使用正确的SSH别名进行克隆和推送操作
- 定期验证SSH连接状态

## 验证步骤
1. 刷新GitHub仓库页面
2. 确认文件显示正常
3. 检查提交记录显示正确的账号信息

---

**文档说明**：本指南涵盖了从SSH密钥生成到项目部署的完整流程，适用于需要在同一台电脑上管理多个GitHub账号的开发场景。
