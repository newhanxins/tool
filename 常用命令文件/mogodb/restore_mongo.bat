
@echo off
SET BACKUP_DIR="C:\mongo_backup"
SET MONGO_PATH="C:\Program Files\MongoDB\Server\6.0\bin\mongorestore.exe"

REM 验证文件完整性
certutil -hashfile %BACKUP_DIR%\checksum.md5 MD5

REM 执行BSON恢复
%MONGO_PATH% --host localhost --port 27017 --gzip --dir %BACKUP_DIR% --drop

pause
