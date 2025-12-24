sudo svnserve -d -r /srv/svn/tone_src

# 查找 svnserve 进程 ID
ps aux | grep svnserve

# 杀死进程 (替换 PID 为实际进程号)
sudo kill -9 PID

# 或者直接使用 pkill
sudo pkill -9 svnserve

# 检查所有端口
sudo netstat -tulnp

# 检查端口占用
```bash
sudo kill -9 PID
# 或
sudo ss -tulnp | grep 8088
# 或
sudo netstat -tulnp | grep 8088
```
# 查看所有 Python 服务
ps -ef | grep python

# 确认进程
ps aux | grep "python.*8088"
# 通过端口反查进程
sudo lsof -i :8088 | grep python


# 获取启动文件路径
ps aux | grep python | awk '{print $11, $12}'


### mongodb
# 查看数据存储路径
cat /etc/mongod.conf | grep "dbPath"
# 或者
ps -ef | grep mongod | grep -v grep

# 检查 MongoDB 进程
ps aux | grep mongod
mongod --config /etc/mongod.conf 的进程，说明 MongoDB 正在运行

# 检查服务状态
sudo systemctl status mongod
Active: active (running) 表示服务正在运行。
Active: inactive (dead) 表示服务已停止

# 检查 MongoDB 端口
sudo lsof -i :27017
# 或
sudo netstat -tulnp | grep 27017
# 连接到 MongoDB

mongo
或
mongo --host <主机名> --port <端口号>

# 查看所有数据库
show dbs
或
show databases

# 切换/创建数据库
use <数据库名>

# 查看当前数据库的集合
show collections
或
show tables

# 查看集合中的文档
db.<集合名>.find()

# 查询指定集合的所有文档（数据记录）格式化输出
db.<集合名>.find().pretty()

# 查看集合状态‌
db.<集合名>.stats()



# 尝试连接 MongoDB
mongo --eval "db.runCommand({ping: 1})"
返回 { "ok" : 1 } 表示 MongoDB 可正常连接

# linux端数据备份
# 单数据库备份（推荐）
mongodump --host <Linux_IP> --port 27017 -u <用户名> -p <密码> --authenticationDatabase admin -d <数据库名> -o /tmp/mongobackup
# ***执行成功
mongodump --host 127.0.0.1 --port 27017 --db DZ_UPGRADE --gzip --out /home/backup/mongodb_DZ_UPGRADE
# 全量备份（含所有数据库）
mongodump --host <Linux_IP> --port 27017 -u <用户名> -p <密码> --authenticationDatabase admin -o /tmp/mongobackup

# 全量备份数据库
mongodump --host <Linux_IP> --port 27017 -u <用户名> -p <密码> --authenticationDatabase admin --out /tmp/mongobackup

# *****执行全量备份
mongodump --host 127.0.0.1 --port 27017 --gzip --out /home/backup/mongodb_full_$(date +%Y%m%d)

# 压缩备份文件
tar -zcvf mongobackup.tar.gz /tmp/mongobackup

# 传输备份文件到Windows
## SCP命令（需安装OpenSSH客户端）
# 在Windows PowerShell执行
scp -r root@<Linux_IP>:/tmp/mongobackup C:\mongobackup


# Windows端数据恢复
# 单数据库恢复
mongorestore --host localhost --port 27017 -d <目标数据库名> C:\mongobackup\<数据库名>
# ****成功
mongorestore --host 127.0.0.1 --port 27017  --gzip --dir "D:\files\mongodb_DZ_UPGRADE"
# 全量恢复
mongorestore --host localhost --port 27017 C:\mongobackup
mongorestore --host localhost --port 27017 --gzip --archive=C:\path\to\backup.tar.gz
mongorestore --host 127.0.0.1 --port 27017 --gzip --dir "C:\path\to\mongodb_full_备份日期"
mongorestore --host 127.0.0.1 --port 27017 --gzip --dir "C:\backup\mongodb_full_20250909" --drop #--drop覆盖删除之前数据库


#检查目标路径下是否存在mongo可执行文件
ls -l /usr/local/mongodatabase/mongodb/bin/mongo

# 环境变量   
##查看环境
echo $PATH | grep mongodb
## 建议为避免每次输入完整路径，可执行以下命令临时添加PATH：
export PATH="/usr/local/mongodatabase/mongo/bin:$PATH"
##永久解决方案
### 对于个人用户配置（推荐）
echo 'export PATH="/usr/local/mongodatabase/mongo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
### 系统级配置（需管理员权限）
sudo sh -c 'echo "export PATH=/usr/local/mongodatabase/mongo/bin:\$PATH" >> /etc/profile.d/mongo.sh'
sudo chmod +x /etc/profile.d/mongo.sh
source /etc/profile

# 验证配置
which mongod  # 应显示/usr/local/mongodatabase/mongo/bin/mongod
mongo --version  # 现在应能正常显示版本


# 添加MongoDB 4.4官方APT源
#第一次执行安装失败
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update
# 第二次执行如下在安装sudo apt install -y mongo-tools=4.4.29 mongodb-org-tools=4.4.29可以
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt update

# 安装指定版本工具包
sudo apt install -y mongodb-org-tools=4.4.29
sudo apt install -y mongo-tools=4.4.29 mongodb-org-tools=4.4.29





###下载连接 https://www.mongodb.com/try/download/database-tools
#版本验证
mongodump --version | grep "version"  # 应输出4.4.29

#通过TGZ包手动安装到指定路径
wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2204-x86_64-100.7.4.tgz
#解压并复制到自定义路径（如/opt/mongodb-tools/）
tar -zxvf mongodb-database-tools-*.tgz
sudo mkdir -p /opt/mongodb-tools/4.4.29
sudo cp -r mongodb-database-tools-*/bin/* /opt/mongodb-tools/4.4.29/
#添加环境变量
echo 'export PATH="/opt/mongodb-tools/4.4.29:$PATH"' >> ~/.bashrc
source ~/.bashrc

#确认系统架构‌：
#运行uname -m确认是amd64还是arm64架构
