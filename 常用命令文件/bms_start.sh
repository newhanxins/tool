#!/bin/bash
lsof -i:8088|grep python
if [ $? -eq 1 ];  then
  pid=$(netstat -nlp | grep :8088 | awk '{print $7}' | awk -F"/" '{ print $1 }')
  if [  -n  "$pid"  ];  then
    kill  -9  $pid;
    echo "useless process has been deleted"
  fi
  cd "/home/youhongchun/BMS_Service"
  . venv/bin/activate
  nohup nohup uvicorn run:app --host 0.0.0.0 --port 8088 --reload > /usr/local/dianzhen/python/bms_fastapi.log 2>& 1 &
  deactivate
  echo "the service is not exists,I help to start it"
else
  echo "The service is running"
fi
