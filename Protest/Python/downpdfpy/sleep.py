# import time
# import threading

# def thread_run(name):
#     print("%s's first thread!!!"% name)
#     time.sleep(5)

# mike = threading.Thread(target=thread_run, args=('Mike', ))
# jone = threading.Thread(target=thread_run, args=('jone', ))

# mike.start()
# jone.start()



# import threading
 
# def hello():
#     print("hello, world")
#     t = threading.Timer(10.0, hello)
#     t.start() 
# print("Hi")
# i=10
# i=i+20
# print(i)
# hello()



import requests
import os
import threading
import time
 
# def fun_timer():
#     print('hello timer')
#     print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
#     global timer
#     #重复构造定时器
#     timer = threading.Timer(5.8,fun_timer)
#     timer.start()
# #定时调度
# timer = threading.Timer(2,fun_timer)
# timer.start()
 
 
# # 50秒后停止定时器
# time.sleep(50)
# timer.cancel()


# for x in range(1,10):
#     time.sleep(0.1)
#     print(x)
#     print(time.ctime())


def getHTMLText(url):
    maxTryNum = 20
    for tries in range(maxTryNum):
        try:
            kv = {"user-agent": "Mizilla/5.0"}
            response = requests.get(url, headers=kv, timeout=10)
            print(response.text)
            return response.text
        except:
            if tries < (maxTryNum - 1):
                continue
            else:
                print("Has tried %d times to access url %s, all failed!" % (maxTryNum, url))
                break

