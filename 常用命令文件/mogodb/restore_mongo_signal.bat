
@echo off
REM ==============================================
REM MongoDB单数据库恢复脚本（Windows版）
REM 功能：从压缩包恢复指定MongoDB数据库
REM 注意：需提前安装MongoDB工具链
REM ==============================================

REM ---------- 配置区（用户可修改部分）----------
SET DB_NAME=your_database      REM 要恢复的数据库名
SET BACKUP_FILE="C:\backup\mongo_backup_20250909.tar.gz"  REM 备份文件路径
SET MONGO_PATH="C:\Program Files\MongoDB\Server\6.0\bin\mongorestore.exe"  REM mongorestore路径
SET TEMP_DIR="C:\temp\mongo_restore"  REM 临时解压目录

REM ---------- 解压备份文件 ----------
echo 正在解压备份文件...
mkdir %TEMP_DIR%
tar -zxvf %BACKUP_FILE% -C %TEMP_DIR%

REM ---------- 执行恢复操作 ----------
echo 正在恢复数据库...
"%MONGO_PATH%" --host localhost --port 27017 ^
    --gzip ^                  REM 启用压缩模式
    --db %DB_NAME% ^          REM 指定目标数据库
    --dir "%TEMP_DIR%\data\%DB_NAME%" ^  REM 备份数据路径
    --drop ^                  REM 清空现有数据
    --noIndexRestore ^        REM 不恢复索引（可选）
    --maintainInsertionOrder  REM 保持文档插入顺序

REM ---------- 清理临时文件 ----------
echo 清理临时文件...
rmdir /s /q %TEMP_DIR%

echo 恢复完成！按任意键退出...
pause
