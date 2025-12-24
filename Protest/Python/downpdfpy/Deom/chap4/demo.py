'''
Author: You
Date: 2022-12-25 14:43:02
LastEditors: Do not edit
LastEditTime: 2022-12-25 15:10:59
FilePath: \examsf:\Protest\pythoh\Deom\chap4\demo.py
'''
# 程序的组织结构 顺序结构 选择结构 循环结构
print(bool(''))
print(bool(False))
print(bool(0))
print(bool(None))#False
print(bool(list()))#False 空列表
print(bool(()))#False 空元祖
print(bool(tuple()))#False 空元祖
print(bool({}))#False 空字典
print(bool(dict()))#False 空字典
print(bool(set()))#False 空集合
print('---------以上位False------')
print(bool(18))


money=1000
s=int(input('请输入金额:'))
if money>=s and s>0:
    money-=s
    print('取款成功，余额：',money)
elif s<=0:
    print('请输入大于0的')
else:
    print('余额不足')
print('使用条件表达式比较')
num1=int(input('第一个'))
num2=int(input('第二个'))
print(str(num1)+'大于等于'+str(num2) if num1>=num2 else str(num1)+'小于'+str(num2))
# pass 一个占位符