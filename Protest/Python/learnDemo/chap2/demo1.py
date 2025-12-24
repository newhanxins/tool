#coding:utf-8
# 变量
username='李好'
print('标识',id(username))
print('类型',type(username))
print('值',username)
# 常见数据类型
# 整数 int integer
# 浮点数 float
# 布尔 bool boolean
# 字符串 str
# 二进制0b 八进制0o 十六进制0x 十进制默认
print('八进制',0o12)
print(2.1+1.1)
from decimal import Decimal
print(Decimal('2.1')+Decimal('1.1'))

# 字符串 单引号和双引号 一行  三引号 多行
# 转换 str()字符串 int()整数 只能转浮点数字符串数字 
# float()浮点数转换 数字加点
age=25
print('今年多少岁'+str(age))
# 注释
#  '#'单行 多行可用三引号
'''多行
注释'''
