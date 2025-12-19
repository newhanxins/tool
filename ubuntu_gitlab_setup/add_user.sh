
#!/bin/bash

# GitLab 用户添加脚本

# 检查是否以root权限运行
if [ "$EUID" -ne 0 ]; then
  echo "请以root权限运行此脚本"
  exit 1
fi

# 添加新用户函数
add_gitlab_user() {
    echo "请输入新用户名:"
    read USERNAME
    
    echo "请输入用户邮箱:"
    read EMAIL
    
    echo "请输入用户全名:"
    read FULLNAME
    
    # 进入GitLab控制台添加用户
    sudo gitlab-rails runner "
    user = User.new(
      username: '$USERNAME',
      email: '$EMAIL',
      name: '$FULLNAME',
      password: 'TempPass123!',
      password_confirmation: 'TempPass123!'
    )
    if user.save
      puts '用户 $USERNAME 创建成功！'
      puts '临时密码: TempPass123!'
      puts '请提醒用户首次登录后立即修改密码'
    else
      puts '用户创建失败:'
      user.errors.full_messages.each { |msg| puts msg }
    end
    "
}

# 显示用户列表函数
list_gitlab_users() {
    echo "GitLab 用户列表:"
    sudo gitlab-rails runner "
    User.all.each do |user|
      puts \"用户名: #{user.username}, 邮箱: #{user.email}, 状态: #{user.state}\"
    end
    "
}

# 主菜单
echo "GitLab 用户管理工具"
echo "1. 添加新用户"
echo "2. 查看用户列表"
echo "请选择操作 (1 或 2):"
read CHOICE

case $CHOICE in
    1)
        add_gitlab_user
        ;;
    2)
        list_gitlab_users
        ;;
    *)
        echo "无效选择"
        ;;
esac
