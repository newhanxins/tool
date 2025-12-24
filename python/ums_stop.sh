#!/usr/bin/env bash
# 杀死8089端口
lsof -i:8089 | sed 1d | awk '{ print $2 }' | xargs kill -9 2> /dev/null || echo "已没服务占用8089端口"

