#-*- coding:utf-8 -*-
import requests
import os
from requests import exceptions

from right import download

def downfile():
    try:
        response = requests.get("https://api.github.com/user/emails",timeout=0.1, auth=('username', 'password'))
    except exceptions.Timeout as e:
        print(str(e))
        print('c')
        return False
    else:
        print('response.text')
        print(response.text)
        return True
backinfo=downfile()
print('返回结果',backinfo)

os.system('dir')   
#//dir 显示磁盘目录命令
os.system('ipconfig/all')
# os.system('python right.py')