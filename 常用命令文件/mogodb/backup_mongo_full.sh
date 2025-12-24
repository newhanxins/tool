
#!/bin/bash
# ==============================================
# MongoDB全量备份脚本（带认证检测）
# 功能：支持全库/单库备份，自动识别认证配置
# 版本：2.1
# ==============================================

# ---------- 用户配置区 ----------
BACKUP_ROOT="/data/mongo_backup"  # 备份根目录
CONF_FILE="/etc/mongod.conf"      # MongoDB配置文件路径
MONGODUMP_PATH="/usr/bin/mongodump" # mongodump路径

# ---------- 参数解析 ----------
while getopts "d:" opt; do
  case $opt in
    d) DB_NAME="$OPTARG" ;;  # -d 指定单库备份
    *) echo "用法: $0 [-d 数据库名]"; exit 1 ;;
  esac
done

# ---------- 初始化参数 ----------
DATE_TAG=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$DATE_TAG"
LOG_FILE="$BACKUP_DIR/backup_$DATE_TAG.log"

# ---------- 配置文件解析 ----------
parse_config() {
  PORT=$(grep -oP 'port\s*=\s*\K[0-9]+' $CONF_FILE || echo "27017")
  AUTH_ENABLED=$(grep -oP 'auth\s*=\s*\Ktrue' $CONF_FILE || echo "false")
  
  if [ "$AUTH_ENABLED" = "true" ]; then
    USER=$(grep -oP 'username\s*=\s*\K\w+' $CONF_FILE)
    PASS=$(grep -oP 'password\s*=\s*\K\w+' $CONF_FILE)
    AUTH_DB=$(grep -oP 'authenticationDatabase\s*=\s*\K\w+' $CONF_FILE || echo "admin")
  fi
}

# ---------- 备份执行函数 ----------
run_backup() {
  mkdir -p $BACKUP_DIR
  
  local COMMON_OPTS="--host 127.0.0.1 --port $PORT --gzip --out $BACKUP_DIR"
  
  if [ "$AUTH_ENABLED" = "true" ]; then
    $MONGODUMP_PATH $COMMON_OPTS \
      -u $USER -p $PASS \
      --authenticationDatabase $AUTH_DB \
      ${DB_NAME:+--db $DB_NAME} 2>&1 | tee $LOG_FILE
  else
    $MONGODUMP_PATH $COMMON_OPTS \
      ${DB_NAME:+--db $DB_NAME} 2>&1 | tee $LOG_FILE
  fi
}

# ---------- 备份后处理 ----------
post_process() {
  # 生成校验文件
  find $BACKUP_DIR -type f -name "*.bson.gz" -exec md5sum {} \; > $BACKUP_DIR/checksum.md5
  
  # 打包备份目录
  local PREFIX=${DB_NAME:-full}
  tar -zcvf $BACKUP_ROOT/${PREFIX}_backup_$DATE_TAG.tar.gz -C $BACKUP_DIR . && \
  rm -rf $BACKUP_DIR
  
  echo "备份完成: $BACKUP_ROOT/${PREFIX}_backup_$DATE_TAG.tar.gz"
}

# ---------- 主流程 ----------
parse_config
run_backup
post_process
