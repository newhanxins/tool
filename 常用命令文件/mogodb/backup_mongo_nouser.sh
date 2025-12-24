#!/bin/bash
# MongoDB无认证备份脚本
BACKUP_ROOT="/data/mongo_backup"
DATE_TAG=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$DATE_TAG"
CONF_FILE="/usr/local/dianzhen/mongodatabase/etc/mongodb.conf"

# 从配置文件读取关键参数
DB_PATH=$(grep -oP 'dbpath\s*=\s*\K[^\s]+' $CONF_FILE || echo "/data/db")
PORT=$(grep -oP 'port\s*=\s*\K[0-9]+' $CONF_FILE || echo "27017")

# 创建备份目录
mkdir -p $BACKUP_DIR/{data,logs}

# 执行BSON格式全量备份
/usr/local/dianzhen/mongodatabase/mongo/bin/mongodump \
  --host 127.0.0.1 \
  --port $PORT \
  --out $BACKUP_DIR/data \
  --gzip 2>&1 | tee $BACKUP_DIR/logs/backup.log

# 备份配置文件
cp $CONF_FILE $BACKUP_DIR/mongodb.conf.bak

# 生成校验文件
find $BACKUP_DIR -type f -exec md5sum {} \; > $BACKUP_DIR/checksum.md5

# 打包备份
tar -zcvf $BACKUP_ROOT/mongo_backup_$DATE_TAG.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "备份完成，文件保存在: $BACKUP_ROOT/mongo_backup_$DATE_TAG.tar.gz"
