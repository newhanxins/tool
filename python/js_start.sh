#!/bin/bash
lsof -i:80|grep java
if [ $? -eq 1 ];  then
  pid=$(netstat -nlp | grep :80 | awk '{print $7}' | awk -F"/" '{ print $1 }')
  if [  -n  "$pid"  ];  then
    kill  -9  $pid;
    echo "useless process has been deleted"
  fi
  cd "/root"
  nohup nohup java -jar -Dserver.port=80 dzem-100-0.0.1-SNAPSHOT.jar > tmp.txt 2>&1 &
  echo "the service is not exists,I help to start it"
else
  echo "The service is running"
fi
