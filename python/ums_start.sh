#!/bin/bash
lsof -i:8089|grep python
if [ $? -eq 1 ];  then
  pid=$(netstat -nlp | grep :8089 | awk '{print $7}' | awk -F"/" '{ print $1 }')
  if [  -n  "$pid"  ];  then
    kill  -9  $pid;
    echo "useless process has been deleted"
  fi
  cd "/home/file/UMS_Service"
  . venv/bin/activate
  nohup nohup uvicorn run:app --host 0.0.0.0 --port 8089 --reload > /usr/local/dir/python/ums_fastapi.log 2>& 1 &
  echo "the service is not exists,I help to start it"
else
  echo "The service is running"
fi
