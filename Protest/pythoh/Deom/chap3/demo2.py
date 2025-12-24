'''
Author: You
Date: 2022-12-25 14:05:03
LastEditors: Do not edit
LastEditTime: 2022-12-25 14:40:56
FilePath: \examsf:\Protest\pythoh\Deom\chap3\demo2.py
'''
# 算术运算符
print(1+1)
print(11//2) #整除 一正一负向下取整
print(9//-4)
print(11%2)#取余运算
print(2**3)#幂运算
print(9%-4) #-3 余数=被除数-除数*3 9-（-4）*（-3）
#+= -= *= 、= 、、= %=
a,b,c=10,30,40
e=10
print(a,b,c)
#比较运算 > >= != is
print(a==e)#true value相等
print(a is e)# id标识相等
print(a is b)# id标识不相等
#and or not取反 in   not in
print(a==10 and b==30)
s="hello"
print('e' in s)
#位运算 & | << >>
print(4&8) #按位与 通为1为1
print(4|8) #按位或 通为0为0
# << 左移位 高位溢出舍弃，低位补0 
print(4<<1) #向左移动一位 相当于乘2
# >> 右移位 低位溢出舍弃，高位补0
print(4>>1) #向右移动一位 相当于除以2
#运输符优先级 算术>位>比较运算符>布尔运算>赋值