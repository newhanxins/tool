
#!/bin/bash
# ==============================================
# MongoDB单数据库备份脚本（带详细注释版）
# 功能：自动备份指定MongoDB数据库，支持认证/非认证模式
# 作者：智能助手
# 日期：2025-09-09
# ==============================================

# ---------- 配置区（用户可修改部分）----------
# 备份根目录（建议使用绝对路径）
BACKUP_ROOT="/data/mongo_backup"
# 需要备份的数据库名称（根据实际情况修改）
DB_NAME="your_database"
# MongoDB配置文件路径（根据实际安装位置调整）
CONF_FILE="/usr/local/dianzhen/mongodatabase/etc/mongodb.conf"

# ---------- 自动生成参数 ----------
# 生成带时间戳的备份目录名（格式：YYYYMMDD_HHMMSS）
DATE_TAG=$(date +%Y%m%d_%H%M%S)
# 完整备份路径（包含日期标签）
BACKUP_DIR="$BACKUP_ROOT/$DATE_TAG"

# ---------- 配置文件解析 ----------
# 提取MongoDB服务端口（默认27017）
PORT=$(grep -oP 'port\s*=\s*\K[0-9]+' $CONF_FILE || echo "27017")
# 检测是否启用认证（默认false）
AUTH_ENABLED=$(grep -oP 'auth\s*=\s*\Ktrue' $CONF_FILE || echo "false")

# ---------- 目录准备 ----------
# 创建带子目录的备份目录结构
# data/ 存放BSON备份文件，logs/ 存放操作日志
mkdir -p $BACKUP_DIR/{data,logs}

# ---------- 带认证的备份函数 ----------
backup_with_auth() {
    echo "[$(date)] 开始带认证备份流程..."
    # 从配置文件提取认证参数
    USER=$(grep -oP 'username\s*=\s*\K\w+' $CONF_FILE)
    PASS=$(grep -oP 'password\s*=\s*\K\w+' $CONF_FILE)
    AUTH_DB=$(grep -oP 'authenticationDatabase\s*=\s*\K\w+' $CONF_FILE || echo "admin")

    # 执行mongodump命令
    /usr/local/dianzhen/mongodatabase/mongo/bin/mongodump \
      --host 127.0.0.1 \
      --port $PORT \
      -u $USER \
      -p $PASS \
      --authenticationDatabase $AUTH_DB \
      --db $DB_NAME \          # 指定备份单个数据库
      --out $BACKUP_DIR/data \ # 输出目录
      --gzip \                 # 启用BSON压缩
      2>&1 | tee $BACKUP_DIR/logs/backup.log  # 同时输出到文件和屏幕
}

# ---------- 无认证的备份函数 ----------
backup_without_auth() {
    echo "[$(date)] 开始无认证备份流程..."
    /usr/local/dianzhen/mongodatabase/mongo/bin/mongodump \
      --host 127.0.0.1 \
      --port $PORT \
      --db $DB_NAME \
      --out $BACKUP_DIR/data \
      --gzip \
      2>&1 | tee $BACKUP_DIR/logs/backup.log
}

# ---------- 主执行逻辑 ----------
echo "=== 开始备份数据库 [$DB_NAME] ==="
if [ "$AUTH_ENABLED" = "true" ]; then
    backup_with_auth
else
    backup_without_auth
fi

# ---------- 备份后处理 ----------
# 生成文件校验码（用于后续完整性验证）
find $BACKUP_DIR/data -type f -name "*.bson.gz" -exec md5sum {} \; > $BACKUP_DIR/checksum.md5

# 打包备份目录（减少存储空间）
tar -zcvf $BACKUP_ROOT/${DB_NAME}_backup_$DATE_TAG.tar.gz -C $BACKUP_DIR .

# 清理临时目录
rm -rf $BACKUP_DIR

echo "=== 备份完成 ==="
echo "备份文件路径: $BACKUP_ROOT/${DB_NAME}_backup_$DATE_TAG.tar.gz"
echo "校验文件: $BACKUP_ROOT/${DB_NAME}_backup_$DATE_TAG.tar.gz.md5"
