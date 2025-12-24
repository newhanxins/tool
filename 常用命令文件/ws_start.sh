#!/bin/bash
 
# 定义Node.js项目的目录
PROJECT_DIR="/root/NodeJSExpressApp"
 
# 进入项目目录
cd "$PROJECT_DIR" || exit
 
# 如果有package.json文件，可以使用npm start
# 如果没有，则直接使用node命令加上你的入口文件，例如app.js
npm start || node app.js