
#!/bin/bash
# MongoDB跨平台备份脚本
BACKUP_DIR="/data/mongo_backup_$(date +%Y%m%d)"
CONFIG_FILE="/usr/local/dianzhen/mongodatabase/etc/mongodb.conf"

# 从配置文件读取认证信息
USER=$(grep -oP 'username:\s*\K\w+' $CONFIG_FILE)
PASS=$(grep -oP 'password:\s*\K\w+' $CONFIG_FILE)
AUTH_DB=$(grep -oP 'authenticationDatabase:\s*\K\w+' $CONFIG_FILE)

# 执行BSON格式全量备份
/usr/local/dianzhen/mongodatabase/mongo/bin/mongodump \
  --host 127.0.0.1 \
  --port 27017 \
  -u $USER \
  -p $PASS \
  --authenticationDatabase $AUTH_DB \
  --out $BACKUP_DIR \
  --gzip 2>&1 | tee $BACKUP_DIR/backup.log

# 生成校验文件
md5sum $BACKUP_DIR/*/*.bson.gz > $BACKUP_DIR/checksum.md5

echo "备份完成，BSON文件已保存到: $BACKUP_DIR"
