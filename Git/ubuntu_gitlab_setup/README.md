
# Ubuntu GitLab 安装与配置指南

## 安装步骤

1. 下载并运行安装脚本：
   ```bash
   chmod +x install_gitlab.sh
   ./install_gitlab.sh
   ```

2. 脚本会自动完成以下操作：
   - 更新系统包
   - 安装必要依赖
   - 添加 GitLab 官方仓库
   - 安装 GitLab CE
   - 配置端口避免冲突（SSH 2222端口，Redis 6380端口）
   - 启动 GitLab 服务
   - 配置防火墙规则

## 默认账户信息

### Root 管理员账户
- **用户名**: root
- **密码**: 查看 `/etc/gitlab/initial_root_password` 文件
- **查看命令**: `sudo cat /etc/gitlab/initial_root_password`

> ⚠️ **安全提醒**: 首次登录后请立即修改默认密码！

## 添加新用户

运行用户管理脚本：
```bash
sudo chmod +x add_user.sh
sudo ./add_user.sh
```

按照提示选择操作：
1. 添加新用户
2. 查看用户列表

## 客户端配置

### SSH 配置 (端口 2222)
在本地 `~/.ssh/config` 文件中添加：
```
Host gitlab
    HostName YOUR_SERVER_IP
    Port 2222
    User git
```

### 克隆项目
```bash
# SSH 方式
git clone git@YOUR_SERVER_IP:username/project.git

# HTTPS 方式
git clone http://YOUR_SERVER_IP/username/project.git
```

## 服务管理命令

```bash
# 查看服务状态
sudo gitlab-ctl status

# 启动服务
sudo gitlab-ctl start

# 停止服务
sudo gitlab-ctl stop

# 重启服务
sudo gitlab-ctl restart

# 重新加载配置
sudo gitlab-ctl reconfigure
```

## 常见问题

### 查看服务日志
```bash
sudo gitlab-ctl tail
```

### 修改配置后重启
```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```

### 备份与恢复
```bash
# 手动备份
sudo gitlab-backup create

# 恢复备份
sudo gitlab-ctl stop puma
sudo gitlab-ctl stop sidekiq
sudo gitlab-backup restore BACKUP=timestamp_of_backup
sudo gitlab-ctl start
```
