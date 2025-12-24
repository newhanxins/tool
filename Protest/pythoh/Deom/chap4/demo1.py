'''
Author: You
Date: 2022-12-25 15:13:03
LastEditors: Do not edit
LastEditTime: 2022-12-25 15:57:43
FilePath: \examsf:\Protest\pythoh\Deom\chap4\demo1.py
'''

#range() 内置函数 不调用内存相同
r=range(10)#默认0开始 相差1步长
print(list(r))# [0,1 ...9]

r=range(1,10)
print(list(r))
r=range(1,10,2)
print(list(r))
print(10 in r)
'''
a=1
while a<10:
    print(a)
    a+=1
'''

#for 循环不需要自定义变量可以写"_"
for item in 'hello':
    
    if item=='l':
        print(item)
        break
    elif item=='e':
        print('跳过'+item)
        continue
else:
    print('循环完毕')

for i in range(1,10):
    for j in range(1,i+1):
        print(i,'*',j,'=',i*j,end='\t')
    print()
