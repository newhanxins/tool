'''
Author: You
Date: 2022-12-26 16:30:43
LastEditors: Do not edit
LastEditTime: 2022-12-26 16:47:10
FilePath: \examsf:\Protest\pythoh\Deom\chap7\demo.py
'''
'''可变序列 列表，字典  可增删改对象地址不发生更改'''
'''不可变序列 字符串，元组'''
#元组创建方式
'''第一种() 只有一个元素后面加一个,号和小括号'''
t=('d','names','word')
print(type(t))
print(t)
'''第二种创建方式 内置函数tuple()'''
t1=tuple(('python',10))
'''空元组创建'''
t3=()
t4=tuple()
'''元组设计为不可变序列 元素为可变序列可以修改'''
t9=(10,[20,30],9)
print(t9[1],type(t9[1]),id(t9[1]))
t9[1].append(100)
print(t9,id(t9[1]))