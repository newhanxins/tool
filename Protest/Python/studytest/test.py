import sys
import os
from os import path
import time
import random

#!/usr/bin/python3

#迭代器对象从集合的第一个元素开始访问，直到所有的元素被访问完结束。迭代器只能往前不会后退。
def app():
    print("Hello World!1111")
    class MyNumbers:
        def __iter__(self):
            self.a = 1
            return self
        
        def __next__(self):
            if self.a <= 2:
                x = self.a
                self.a += 1
                return x
            else:
                raise StopIteration
        
    myclass = MyNumbers()
    myiter = iter(myclass)
    for x in myiter:
        print(x)
        time.sleep(0.01)
    
    s='hello world'
    str(s)
    repr(s)
    print(path.basename(path.abspath(__file__)))
    print(path.dirname(path.abspath(__file__)))

    try:
        raise KeyboardInterrupt('HiThere')  # 模拟一个异常
    except KeyboardInterrupt:
        print('GoodbyeKeyboardInterrupt')
    else:
        print('Goodbyeelse')
    finally:
        print('Goodbye,finally')

if __name__ == "__main__":
    print("Hello World!")
    print("Python version is", sys.version)
    print("Python version info is", sys.version_info)
    print("Python path is", sys.path)
    print("Python path length is", len(sys.path))
    print("Python path length is", os.path)
    print("Python path length is", os.path.abspath('.'))
    

