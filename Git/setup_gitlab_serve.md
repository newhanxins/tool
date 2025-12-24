
# GitLab安装配置指南

## 查看操作系统发行版
```bash
lsb_release -a
# 或者
cat /etc/os-release
```

## 1. 系统更新
```bash
sudo apt update && sudo apt upgrade -y
```

## 2. 安装依赖
```bash
sudo apt install -y curl openssh-server ca-certificates tzdata perl
```

## 3. 安装Postfix（可选）
```bash
sudo apt install -y postfix
```

## 4. 添加GitLab仓库
```bash
curl -fsSL https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.deb.sh | sudo bash
```

## 5. 安装GitLab EE
```bash
sudo EXTERNAL_URL="http://your-domain.com" apt install -y gitlab-ee
```
sudo EXTERNAL_URL="http://192.168.24.5" apt install -y gitlab-ee
## 6. 配置GitLab
编辑 `/etc/gitlab/gitlab.rb`：
```bash
external_url 'http://your-domain.com'
gitlab_rails['time_zone'] = 'Asia/Shanghai'
gitlab_rails['smtp_enable'] = true
gitlab_rails['gitlab_shell_ssh_port'] = 22
nginx['listen_port'] = 80

vim /etc/gitlab/gitlab.rb
sudo gitlab-ctl reconfigure
# 配置SMTP等其他选项
```
 - 主配置文件: /etc/gitlab/gitlab.rb
- 应用配置: /var/opt/gitlab/gitlab-rails/etc/gitlab.y
- 日志目录: /var/log/gitlab/
## 修改制定存储目录
```bash
sudo vim /etc/gitlab/gitlab.rb
git_data_dirs({
"default" => { "path" => "/data/gitlab/git-data" }})
```
- 修改后需要recofigure和restart服务
- 转移仓库同步命令
```bash
# 注意 'repositories'后面不带斜杠，而
# '/data/gitlab/gitlab-data/'后面是有斜杠的。
rsync -av /var/opt/gitlab/git-data/repositories /data/gitlab/gitlab-data/
```
## 7 GitLab 常用管理命令
```bash
sudo gitlab-ctl status      # 查看状态 如果502 
sudo gitlab-ctl start       # 启动服务
sudo gitlab-ctl stop        # 停止服务
sudo gitlab-ctl restart     # 重启服务
sudo gitlab-ctl reconfigure # 重新加载配置
# 启用开机自启动
sudo systemctl enable gitlab-runsvdir.service
sudo gitlab-ctl tail # 查看日志

```
## 8. 重新配置并重启
```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```

## 9. 查看用户验证
- 验证访问
 - ‌URL‌: http://ip:8188
- ‌默认账户‌:
 - 用户名: root
 - 密码文件: /etc/gitlab/initial_root_password
 - 查看命令: sudo cat /etc/gitlab/initial_root_password
### 1. &zwnj;**重置 Root 密码**&zwnj;
sudo gitlab-rake "gitlab:password:reset"
- 操作
  - ‌操作步骤‌:
  - 执行命令后,系统会提示输入用户名 (输入 root)
  - 系统会生成并显示新密码
  - 记录新密码后按 Enter 退出
### 2. 手动设置初始密码
编辑 /etc/gitlab/gitlab.rb:
```bash
gitlab_rails['initial_root_password'] = '密码' 
#保存文件后执行重启
```
### 1. 修改密码
- 修改密码命令: sudo gitlab-rake gitlab:password:reset
- 修改密码命令: sudo gitlab-rake gitlab:password:reset USERNAME=用户名 PASSWORD=新密码

## 10. 端口冲突
### 1. 端口冲突风险
- &zwnj;**关键端口**&zwnj;:
 - &zwnj;**22**&zwnj;: SSH (默认被系统占用)
 - &zwnj;**6379**&zwnj;: Redis (默认被系统占用)
 - &zwnj;**80/443**&zwnj;: HTTP/HTTPS
 - &zwnj;**8080/8081**&zwnj;: Unicorn/Sidekiq
 - &zwnj;**5432**&zwnj;: PostgreSQL
- &zwnj;**冲突后果**&zwnj;:
 - 服务启动失败
 - 502 错误 (如 Nginx 无法连接后端)
 - 客户端连接中断
```bash
# 查看端口占用情况
sudo netstat -tuln | grep -E '22|6379|80|443|8080|8081|8088|5432'
```
gitlab 常见默认端口
```bash
# 查看gitlab默认端口
sudo gitlab-ctl show-config
```
| 服务       | 默认端口 | 冲突风险 | 建议端口                                   |
|------------|----------|----------|-------------------------------------------|
| SSH        | 22       | 极高     |  系统 SSH 默认端口，必须修改               |
| Redis      | 6379     | 极高     |  GitLab 内嵌与系统服务均使用此端口         |
| Nginx      | 80       | 高       |  Web 标准端口                              |
| Nginx(SSL) | 443      | 高       |  - HTTPS 标准端口                          |
| Puma       | 8080     | 中       |  常见于各类 Web 服务后台                   |
| PostgreSQL | 5432     | 低       |  数据库服务常用端口                        |
#### 端口
| &zwnj;**服务**&zwnj;          | &zwnj;**默认端口**&zwnj; | &zwnj;**协议**&zwnj; | &zwnj;**用途**&zwnj;                     |
|-------------------|--------------|----------|------------------------------|
| &zwnj;**HTTP/HTTPS**&zwnj;    | 80/443       | TCP      | Web 访问                     |
| &zwnj;**SSH**&zwnj;           | 22           | TCP      | 代码推送/拉取               |
| &zwnj;**SMTP**&zwnj;          | 25           | TCP      | 邮件通知（如注册/密码重置） |
| &zwnj;**Git**&zwnj;           | 9418         | TCP      | Git 协议通信               |
| &zwnj;**NFS**&zwnj;           | 2049         | TCP      | 文件共享（可选）           |
| &zwnj;**Redis**&zwnj;         | 6379         | TCP      | 缓存服务                   |
| &zwnj;**PostgreSQL**&zwnj;    | 5432         | TCP      | 数据库服务                 |
| &zwnj;**Puma/Unicorn**&zwnj;  | 8080         | TCP      | 应用服务器（GitLab 13+）   |
| &zwnj;**Nginx Status**&zwnj;  | 8060         | TCP      | 状态监控（可选）           |
| &zwnj;**Prometheus**&zwnj;    | 9090         | TCP      | 监控服务（可选）           |
| &zwnj;**Node Exporter**&zwnj; | 9100         | TCP      | 系统监控（可选）           |
| &zwnj;**Redis Exporter**&zwnj;| 9121         | TCP      | Redis 监控（可选）         |
| **Postgres Exporter| 9187         | TCP      | PostgreSQL 监控（可选）   |
| **Sidekiq Exporter| 8082         | TCP      | 任务队列监控（可选）       |
| &zwnj;**Geo PostgreSQL**&zwnj;| 5431         | TCP      | 地理复制（可选）           |
| &zwnj;**Redis Sentinel**&zwnj;| 26379        | TCP      | Redis 高可用（可选）       |
| &zwnj;**LDAP/Kerberos**&zwnj; | 取决于配置   | TCP      | 认证服务（可选）           |
| &zwnj;**Omniauth**&zwnj;      | 取决于配置   | TCP      | 第三方登录（可选）
### 2. 配置修改步骤
#### redis端口冲突
```bash
# 编辑 GitLab 配置
sudo vim /etc/gitlab/gitlab.rb
redis['port'] = 6380  # 修改为未占用端口
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
# 查看端口
sudo netstat -tuln | grep 6379
#若输出tcp 0 0 0.0.0.0:6379 0.0.0.0:* LISTEN，表示端口被占用
#若无输出，表示端口未被占用

# 停止系统 Redis （修改上面gitlab端口）
sudo systemctl stop redis-server
# 修改系统 Redis 配置
sudo vim /etc/redis/redis.conf
# port 6380  # 修改为未占用端口
sudo systemctl start redis-server
```

#### SSH 端口冲突
####  修改 SSH 端口
```bash
# 编辑 GitLab 配置
sudo vim /etc/gitlab/gitlab.rb
gitlab_rails['gitlab_shell_ssh_port'] = 2222  # 修改为未占用端口
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
## 客户端配置
在本地 ~/.ssh/config 文件中添加:
Host gitlab
    HostName your-domain.com
    User git
    Port 2222

## ‌防火墙配置‌: 修改端口后需同步更新防火墙规则
sudo ufw allow 2222/tcp

```

#### 验证
```bash
sudo netstat -tulpn | grep -E '2222|6380' # 查看端口是否在监听
```
或者
```bash
grep -i redis /etc/gitlab/gitlab.rb # 查看配置文件中 redis 端口是否修改
```
#### 客户端配置
```bash
# 编辑本地 ~/.ssh/config 文件
Host gitlab
    HostName your-domain.com
    User git
    Port 2222
    IdentityFile ~/.ssh/id_rsa_gitlab
```
#### 防火墙配置
```bash
# 编辑防火墙规则
sudo ufw allow 2222/tcp
sudo ufw allow 6380/tcp
sudo ufw --force enable
sudo ufw status verbose # 查看防火墙状态
```
####  修复关键目录权限
```bash
# 修复 /lib/ufw
sudo chmod 755 /lib/ufw
sudo chown root:root /lib/ufw

# 修复 /usr
sudo chmod 755 /usr
sudo chown root:root /usr

# 修复 /usr/sbin
sudo chmod 755 /usr/sbin
sudo chown root:root /usr/sbin
```
##### 验证修复
```bash
ls -ld /lib/ufw /lib /usr/sbin /usr
# 预期输出:
drwxr-xr-x 2 root root 4096 /lib/ufw
lrwxrwxrwx 1 root root    7 /lib -> usr/lib
drwxr-xr-x 14 root root 4096 /usr
drwxr-xr-x 2 root root 20480 /usr/sbin
```
#### 其他冲突
```bash
# 查看端口占用情况
sudo netstat -tulpn | grep -E '2222|6380'
# 查看进程占用情况
sudo lsof -i:2222
sudo lsof -i:6380
# 检查 Redis 进程
ps aux | grep redis  
netstat -tulnp | grep 6379  # 检查端口监听
redis-cli ping  # 测试连接
# 查看 Nginx 进程
ps -ef | grep nginx  
# 修改 SSH 端口
gitlab_rails['gitlab_shell_ssh_port'] = 2222  # 避免与系统 SSH 冲突

# 修改 Redis 端口
redis['port'] = 6380  # 避免与系统 Redis 冲突

# 修改 Nginx 端口（可选）
nginx['listen_port'] = 8188  # 避免与系统 Web 服务冲突

# 修改 Puma 端口（GitLab 13+）
puma['port'] = 8081  # 避免与系统 Web 服务冲突
# 防火墙 （失败）
sudo ufw allow 2222/tcp
sudo ufw allow 6380/tcp
sudo ufw allow 8081/tcp
sudo ufw allow 8188/tcp
sudo ufw --force enable

# 查看服务器是否安装 iptables 防火墙
## 核心命令
sudo iptables -L -n -v  # 查看规则# 若无输出: 表示未安装或未配置规则
# 若有输出: 显示当前规则链
sudo systemctl status iptables  # 检查服务状态
# 1. iptables
sudo iptables -A INPUT -p tcp --dport 8188 -j ACCEPT
sudo sh -c "iptables-save > /etc/iptables/rules.v4"
# 2. 使用firewalld
sudo firewall-cmd --permanent --add-port=8188/tcp
sudo firewall-cmd --reload
# 3. ‌使用nftables
sudo nft add rule filter input tcp dport 8188 accept
sudo sh -c "nft list ruleset > /etc/nftables.conf"

# 如果主机已经开启防火墙，则需要放行80端口(其他端口同理https://blog.csdn.net/weixin_53269650/article/details/144692685)
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent && sudo firewall-cmd --reload
```
#### GitLab Nginx 禁用方案（使用）

用户希望停用 GitLab 自带 Nginx，使用服务器的 Nginx 代理 GitLab 服务。

##### 1. 修改 GitLab 配置
编辑 `/etc/gitlab/gitlab.rb`:
```ruby
# 禁用 GitLab 自带 Nginx
nginx['enable'] = false

# 配置 GitLab 监听地址
gitlab_workhorse['listen_network'] = "tcp"
gitlab_workhorse['listen_addr'] = "127.0.0.1:8085"
```
##### 2. 重启 GitLab
```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```
##### 3. 配置服务器 Nginx
编辑 `/etc/nginx/nginx.conf`:
```nginx
server {
    listen 8188;
    server_name 192.168.24.5;

    location / {
        proxy_pass http://127.0.0.1:8085;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

```
##### 4. 重启 Nginx
```bash
sudo systemctl restart nginx
```
##### 5. 网络连接测试
```bash
#验证本地端口连通性
curl -I http://127.0.0.1:8085
#系统资源监控 
free -h
#验证服务器端口连通性
telnet 127.0.0.1 8085
```


#### 直接修改监听端口
```bash

# 1. 修改GitLab配置文件
sudo sed -i 's/external_url "http:\/\/.*"/external_url "http:\/\/0.0.0.0:8188"/' /etc/gitlab/gitlab.rb
sudo sed -i 's/nginx\['listen_port'\] = 80/nginx\['listen_port'\] = 8188/' /etc/gitlab/gitlab.rb

# 2. 修改Nginx配置（可选，若需修改Nginx监听端口）
# 修改Nginx配置（若文件存在）
if [ -f "/etc/gitlab/ssl/gitlab-http.conf" ]; then
    sudo sed -i 's/listen \*:80/listen \*:8188/' /etc/gitlab/ssl/gitlab-http.conf
fi

# 3. 重启GitLab服务
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart

# 4. 验证端口
sudo netstat -tuln | grep 8188
```
## 8. 创建项目
```bash
PROJECT_NAME="my-project"
PROJECT_DESCRIPTION="My project description"
PRIVATE_TOKEN="your-private-token"
GITLAB_URL="http://your-domain.com"

curl --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" \
     --data "name=$PROJECT_NAME&description=$PROJECT_DESCRIPTION" \
     --request POST "$GITLAB_URL/api/v4/projects"
```
## 最终配置
```bash
# 基础配置
external_url 'http://192.168.24.5:8188'
gitlab_rails['redis_port'] = 6380
gitlab_rails['gitlab_shell_ssh_port'] = 2222  # 修改为未占用端口
# nginx['listen_port'] = 8188

# 禁用 GitLab 自带 Nginx
nginx['enable'] = false
# # 配置 GitLab 监听地址
gitlab_workhorse['listen_network'] = "tcp"
gitlab_workhorse['listen_addr'] = "127.0.0.1:8085"
# 降低工作进程数
puma['worker_processes'] = 2  # 从 6 降到 2
puma['min_threads'] = 2
puma['max_threads'] = 2
# # 设置内存限制
puma['per_worker_max_memory_mb'] = 1024  # 1GB
```
nginx 配置
```bash
server {
    listen 8188;
    server_name 192.168.24.5;
    location / {
        proxy_pass http://127.0.0.1:8085/;  # 代理到 Workhorse
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 9. 本地Git操作
```bash
# 克隆项目 (HTTPS)
git clone http://your-domain.com/username/project-name.git
git clone http://192.168.24.5:8188/test/testhtml.git
cd project-name

# 或使用 SSH (需配置 SSH 密钥)
git clone git@your-domain.com:username/project-name.git

# 添加文件并推送
cd project-name
git checkout -b feature-branch
echo "# My New Project" > README.md
git add .
git commit -m "Initial commit"
git push -u origin feature-branch

```

## 10. 查看项目
```bash
# 查看项目列表
curl --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" \
     --request GET "$GITLAB_URL/api/v4/projects"

# 查看项目详情
curl --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" \
     --request GET "$GITLAB_URL/api/v4/projects/1"
```
## 用户管理
```bash
# 创建用户 (通过 Rails 控制台)
sudo gitlab-rails console -e production
user = User.new(username: "newuser", email: "user@example.com", name: "New User")
user.password = "strongpassword"
user.save!


# 创建用户(方式2)
curl --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" \
     --data "email=user@example.com&username=user&name=User+Name&password=password" \
     --request POST "$GITLAB_URL/api/v4/users"

# 查看用户列表
curl --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" \
     --request GET "$GITLAB_URL/api/v4/users"

# 查看用户详情
curl --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" \
     --request GET "$GITLAB_URL/api/v4/users/1"
```

## 备份和恢复
```bash
# 手动备份
sudo gitlab-backup create

# 自动备份配置 (/etc/gitlab/gitlab.rb)
gitlab_rails['backup_keep_time'] = 604800  # 保留7天

# 恢复备份
sudo gitlab-ctl stop puma
sudo gitlab-ctl stop sidekiq
sudo gitlab-backup restore BACKUP=timestamp_of_backup
sudo gitlab-ctl start

```

## SSL 配置示例
```bash
# 生成证书
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/gitlab/ssl/gitlab.key -out /etc/gitlab/ssl/gitlab.crt

# 配置 gitlab.rb
external_url 'https://gitlab.example.com'
nginx['redirect_http_to_https'] = true
nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.crt"
nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.key"
```
## 常见故障排除
```bash
# 检查 gitlab 服务状态
sudo gitlab-ctl status

# 检查 gitlab 服务日志
sudo gitlab-ctl tail

# 检查 gitlab 服务日志
sudo gitlab-ctl tail nginx

# 检查 gitlab 服务日志
sudo gitlab-ctl tail unicorn

# 检查 gitlab 服务日志
sudo gitlab-ctl tail sidekiq

# 检查 gitlab 服务日志
sudo gitlab-ctl tail gitlab-rails

# 检查服务日志
sudo gitlab-ctl tail

# 检查端口占用
sudo netstat -tulpn | grep :80
sudo lsof -i :8188  # 查看端口占用
sudo netstat -tuln | grep 8188  # 网络状态
ps -ef | grep 12345  # 定位服务进程 替换12345为实际PID
# 重建数据库
sudo gitlab-ctl reconfigure

# 清理缓存
sudo gitlab-rake cache:clear

# 清理日志
sudo gitlab-rake logs:rotate

# 清理日志
sudo gitlab-rake logs:clean

# 清理日志
sudo gitlab-rake logs:tail

# 清理日志
sudo gitlab-rake logs:tail

# 清理日志
sudo gitlab-rake logs:tail

```
## 性能监控
```bash
# 查看系统资源使用情况
top

# 查看系统资源使用情况
htop
# 查看系统资源使用
sudo gitlab-ctl status
sudo gitlab-ctl top

# Prometheus 监控 (默认启用)
# 访问 http://your-domain.com/-/metrics 查看监控数据
```
## 参考
- [GitLab 官方文档](https://docs.gitlab.com/ee/install/)
- [GitLab 安装教程](https://www.jianshu.com/p/9d9f8e0d0c5d)


# GitLab 配置文件编辑指南
## 1. 使用 Vim 编辑器
```bash
sudo vim /etc/gitlab/gitlab.rb
```
- ‌编辑步骤‌:
  - 按 i 进入插入模式
  - 修改配置 (如 external_url 'http://your-domain.com')
  - 按 Esc 退出插入模式
  - 输入 :wq 保存并退出
  - 按 / 键进入搜索模式，输入: external_url 搜索配置项
  - 按 n 键跳转到下一个匹配项
  - 按 N 键跳转到上一个匹配项
  - 按 q 键退出搜索模式
  - 
- ‌快捷键‌:
  - :q! 强制退出 (不保存)
  - :w 保存
  - :q 退出
## 2. 使用 Nano 编辑器
```bash
sudo nano /etc/gitlab/gitlab.rb

```
- ‌编辑步骤‌:
  - 修改配置 (如 external_url 'http://your-domain.com')
  - 按 Ctrl + X 退出
  - 按 Y 保存
  - 按 Enter 确认文件名
- ‌快捷键‌:
  - Ctrl + X 退出
  - Y 保存
  - Enter 确认文件名
## 3. 使用 VS Code 编辑器
```bash
sudo code /etc/gitlab/gitlab.rb
```
- ‌编辑步骤rnal_url 'http://your-domain.com')
- 保存并关闭编辑器

# Vim 使用指南
## 1. 基本模式
- &zwnj;**命令模式**&zwnj; (默认模式):
 - &zwnj;**移动光标**&zwnj;:
   - `h/j/k/l` → 左/下/上/右
   - `gg` → 文件开头
   - `G` → 文件末尾
   - `nG` → 第n行
   - `0` → 行首
   - `$` → 行尾
 - &zwnj;**剪切/删除**&zwnj;:
   - `dd` → 删除整行
   - `x` → 删除光标后字符
   - `u` → 撤销
   - `Ctrl + r` → 重做
 - &zwnj;**复制/粘贴**&zwnj;:
   - `yy` → 复制整行
   - `p` → 粘贴到光标后
   - `P` → 粘贴到光标前

## 2. 输入模式
- &zwnj;**进入输入模式**&zwnj;:
 - `i` → 光标前插入
 - `a` → 光标后插入
 - `o` → 光标后新行
- &zwnj;**退出输入模式**&zwnj;:
 - `Esc` → 返回命令模式

## 3. 末行模式
- &zwnj;**进入末行模式**&zwnj;:
 - `:` → 打开命令行
- &zwnj;**常用命令**&zwnj;:
 - `:w` → 保存
 - `:q` → 退出
 - `:wq` → 保存并退出
 - `:q!` → 强制退出
 - `:set nu` → 显示行号
 - `:set nonu` → 隐藏行号

## 4. 搜索与替换
- &zwnj;**搜索**&zwnj;:
 - `/关键词` → 向下搜索
 - `?关键词` → 向上搜索
 - `n` → 下一个匹配
 - `N` → 上一个匹配
- &zwnj;**替换**&zwnj;:
 - `:%s/旧文本/新文本/g` → 全局替换
 - `:s/旧文本/新文本` → 当前行替换

## 5. 标记与跳转
- &zwnj;**设置标记**&zwnj;:
 - `ma` → 设置a标记
- &zwnj;**跳转标记**&zwnj;:
 - `'a` → 跳转到a标记
- &zwnj;**查看标记**&zwnj;:
 - `:marks` → 显示所有标记

## 检查文件权限
```bash
ls -ld /lib/ufw /lib /usr/sbin /usr
```


# GitLab 用户添加问题解决方案

## 核心问题
用户报告在 GitLab 管理界面中添加用户 `testuser` 到组时，搜索不到该用户

## 解决方案
### 1. &zwnj;**检查用户状态**&zwnj;
- &zwnj;**登录 GitLab 管理界面**&zwnj;:
 - URL: `http://192.168.24.5:8188/gitlab`
 - 账号: `root`
 - 密码: 通过 `gitlab-rake "gitlab:password:reset"` 重置

- &zwnj;**验证用户状态**&zwnj;:
 - 进入 `Users` 页面
 - 搜索 `testuser`
 - 若用户状态为 `Blocked` 或 `Deactivated`,需激活用户:
   ```bash
   sudo gitlab-rake "gitlab:users:activate[username=testuser]"
   ```

### 2. &zwnj;**检查用户权限**&zwnj;
- &zwnj;**确保用户有访问权限**&zwnj;:
 - 进入 `Admin Area` > `Settings` > `Visibility and access controls`
 - 确认 `Restrict sign-up to internal users` 未勾选

### 3. &zwnj;**检查组配置**&zwnj;
- &zwnj;**进入目标组**&zwnj;:
 - 点击组名 > `Settings` > `Members`
 - 点击 `Invite members` 按钮
 - 输入 `testuser` 搜索
 - 若搜索不到,检查组权限:
   - 进入 `Admin Area` > `Groups` > `Your Group`
   - 确认组权限设置正确

### 4. &zwnj;**验证邮箱验证**&zwnj;
- &zwnj;**检查用户邮箱状态**&zwnj;:
 - 进入 `Users` 页面 > `testuser` > `Edit`
 - 确认 `Email` 已验证 (`Verified` 状态)

> &zwnj;**关键提示**&zwnj;:
> - 若用户未激活,需通过 `gitlab-rake` 命令激活
> - 搜索不到用户时,检查用户状态和组权限
> - 邮箱未验证会导致用户无法通过搜索添加



# GitLab SSH 配置方案
## 核心问题
用户需在已有 GitHub SSH 密钥的情况下，为 GitLab 生成新密钥并配置 2222 端口

## 解决方案
### 1. &zwnj;**生成 GitLab SSH 密钥**&zwnj;
```bash
# 生成新密钥对 (指定文件名避免覆盖 GitHub 密钥)
ssh-keygen -t rsa -b 4096 -C "testuser@example.com" -f ~/.ssh/id_rsa_gitlab
```
2. 配置 SSH 代理
```bash
启动 SSH 代理
eval "$(ssh-agent -s)"

添加 GitLab 私钥
ssh-add ~/.ssh/id_rsa_gitlab
```

3. 配置 GitLab 端口
编辑 `/etc/gitlab/gitlab.rb`:
```ruby
修改 SSH 端口
gitlab_rails['gitlab_shell_ssh_port'] = 2222
```
```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```

4. 添加公钥到 GitLab
- 登录 GitLab (`http://192.168.24.5:8188`)
- 进入 `Settings` > `SSH Keys`
- 添加公钥内容: `cat ~/.ssh/id_rsa_gitlab.pub`
- 命名: `GitLab Key`

5. 配置本地 Git 使用新密钥
编辑 `~/.ssh/config`:
```bash
配置 GitLab 连接
Host gitlab
  HostName 192.168.24.5
  User git
  Port 2222
  IdentityFile ~/.ssh/id_rsa_gitlab
```

6. 验证连接
```bash
测试连接
ssh -T git@gitlab
预期输出: Welcome to GitLab, testuser!
```

7. 提交代码
```bash
添加远程仓库
git remote add origin git@gitlab:testuser/uav.git

推送代码
git push -u origin main
```
# GitLab 远程仓库配置解决方案

问题分析
您遇到的错误 `error: remote origin already exists` 表明本地仓库已经配置了名为 `origin` 的远程地址。

解决方案

1. 查看现有远程仓库配置
```bash
git remote -v
```

2. 解决方案
方案一：更新现有远程仓库地址
```bash
git remote set-url origin http://192.168.24.5:8188/testuser/uav.git
```

3. 验证连接
```bash
拉取远程仓库信息
git fetch origin

查看远程分支
git branch -r
```

4. 提交代码到远程仓库**
```bash
添加文件到暂存区
git add .

创建提交
git commit -m "Initial UAV project commit"

推送代码
git push -u origin main
```

关键步骤

1. 检查当前远程仓库配置
```bash
git remote -v
```

2. 推送代码
```bash
强制推送（如果远程仓库不为空）
git push -f origin main
```

3. 连接方式配置
HTTPS 方式（推荐）
```bash
推送代码
git push origin main

输入认证信息
Username: testuser
Password: TestPassword123
```

注意事项
- 如果远程仓库已有内容，可能需要先拉取合并
- 推送时可能需要输入 GitLab 账号密码
- 如果启用了双重认证，需要使用个人访问令牌代替密码

推荐使用 HTTPS 方式，因为：
1. 无需配置 SSH 密钥
2. 只需在推送时输入用户名和密码
3. 支持所有标准 Git 操作

5. 验证提交
- 访问 `http://192.168.24.5:8188/testuser/uav.git


# GitLab HTTP 提交解决方案

核心问题
用户通过 HTTP 提交代码时遇到认证失败 (`HTTP Basic: Access denied`)
解决方案
1. 生成个人访问令牌
```bash
登录 GitLab
http://192.168.24.5:8188

进入 Settings > Access Tokens
- Name: git-push-token
- Expiration: 无限制
- Scopes: write_repository
- 点击 Create personal access token
```

2. 配置 Git 凭据
```bash
清除旧凭据
git config --global --unset credential.helper

重新推送代码
git push origin main
```

3. 验证连接
```bash
输入用户名: testuser
输入密码: 生成的个人访问令牌
```

4. 忽略 SSL 验证（仅限开发环境）
```bash
git config --global http.sslVerify false
```

> 关键提示:
> - 令牌代替密码可避免密码错误
> - SSL 验证需在生产环境启用<br>参考资料<br>[1] [git报错 fatal: Authentication failed Basic: Access denied. If a password was provided for Git authent - CSDN博客](https://blog.csdn.net/dubochao_xinxi/article/details/155940315)<br>[2] [关于GitLab登录/推送/拉取代码时候报错(remote: HTTP Basic: Access deniedfatal: Authentication failed fo ‘xxxx‘.) - CSDN博客](https://blog.csdn.net/weixin_57246783/article/details/134409907)<br>[3] [gitlab HTTP Basic: Access denied问题解决方法 - CSDN博客](https://blog.csdn.net/beikewz/article/details/133022100)<br>[4] [问题:Git认证失败HTTP Basic: Access denied如何解决? - CSDN问答](https://ask.csdn.net/questions/8598446)<br>[5] [记录一次git提交认证失效:HTTP Basic: Access denied. The provided password or token is incorrect or your account - CSDN博客](https://blog.csdn.net/who_im_i/article/details/141462013)<br>[6] [Gitlab 遇到 remote:HTTP Basic:Access denied的解决方法 - CSDN博客](https://blog.csdn.net/diyin_/article/details/129558865)<br>[7] [gitlab密码更新后,使用git命令报错remote: HTTP Basic: Access denied fatal: Authentication failed for ‘https:xxx‘ - CSDN博客](https://blog.csdn.net/li02112017/article/details/109179145)<br>[8] [【超详细】从0到1教你将本地方案上传到GitHub及常见问题应对 - 博客园](https://www.cnblogs.com/ljbguanli/p/19356742)<br>[9] [GitLab全方位指南:安装配置与最佳实践-CSDN博客 - CSDN博客](https://blog.csdn.net/qq_36345633/article/details/121948146)<br>[10] [排除Git SSL证书问题分步指南 - 闪电博](https://www.wbolt.com/git-ssl-certificate-issues-fix.html)<br>[11] [[1216]git问题:Authentication failed解决办法 - 腾讯云](https://cloud.tencent.com/developer/article/2336849)<br>[12] [gitlab的安装过程及配置还有各种坑总结 - CSDN博客](https://blog.csdn.net/qq_30722795/article/details/105393730)<br>[13] [HTTP连接池错误入门:从零理解凭证验证问题 - CSDN博客](https://blog.csdn.net/CyanWave34/article/details/155812015)<br>[14] [gitlab-从零开始实现你的CICD - CSDN博客](https://blog.csdn.net/qq_35323137/article/details/108754513)<br>[15] [Gitlab部署和基础使用 - CSDN博客](https://blog.csdn.net/wang11876/article/details/132332685)<br>[16] [跨平台软件开发项目中 Git 常见问题及解决方法 - CSDN博客](https://blog.csdn.net/binary0006/article/details/144249027)<br>[17] [gitlab--身份认证失败 - 51CTO博客](https://blog.51cto.com/topic/gitlabshenfenrenzhengshibai.html)<br>[18] [精通Gitlab12(二) - CSDN博客](https://blog.csdn.net/wizardforcel/article/details/148958244)<br>[19] [业务风险情报 - www.cloud.tencent.com](https://www.cloud.tencent.com/document/product/1064/33963)