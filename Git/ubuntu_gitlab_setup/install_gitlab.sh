
#!/bin/bash

# GitLab 自动化安装脚本
# 适用于 Ubuntu 20.04 LTS

set -e  # 遇到错误时停止执行

echo "开始安装 GitLab..."

# 更新系统包
echo "更新系统包..."
sudo apt update && sudo apt upgrade -y

# 安装依赖项
echo "安装依赖项..."
sudo apt install -y curl openssh-server ca-certificates tzdata perl postfix

# 添加 GitLab 官方仓库
echo "添加 GitLab 官方仓库..."
curl -fsSL https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/gitlab.gpg
echo "deb [signed-by=/usr/share/keyrings/gitlab.gpg] https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu/ focal main" | sudo tee /etc/apt/sources.list.d/gitlab_gitlab-ce.list
sudo apt update

# 安装 GitLab CE（使用服务器IP作为外部URL）
echo "请输入服务器公网IP地址:"
read SERVER_IP
sudo EXTERNAL_URL="http://$SERVER_IP" apt install -y gitlab-ce

# 配置端口避免冲突
echo "配置 GitLab 端口避免冲突..."
sudo sed -i "s|# gitlab_rails\['gitlab_shell_ssh_port'\] = 22|gitlab_rails['gitlab_shell_ssh_port'] = 2222|" /etc/gitlab/gitlab.rb
sudo sed -i "s|# redis\['port'\] = 6379|redis['port'] = 6380|" /etc/gitlab/gitlab.rb

# 重新配置 GitLab
echo "重新配置 GitLab..."
sudo gitlab-ctl reconfigure

# 启动 GitLab 服务
echo "启动 GitLab 服务..."
sudo gitlab-ctl start

# 配置防火墙
echo "配置防火墙..."
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 2222/tcp
sudo ufw --force enable

echo "GitLab 安装完成！"
echo "访问地址: http://$SERVER_IP"
echo "SSH 端口: 2222"
echo ""
echo "默认 root 账户密码信息:"
echo "用户名: root"
echo "密码文件位置: /etc/gitlab/initial_root_password"
echo "请使用以下命令查看初始密码:"
echo "sudo cat /etc/gitlab/initial_root_password"
echo ""
echo "首次登录后请立即修改默认密码！"
