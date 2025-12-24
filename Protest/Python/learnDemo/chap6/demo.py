'''
Author: You
Date: 2022-12-25 16:56:35
LastEditors: Do not edit
LastEditTime: 2022-12-26 16:12:29
FilePath: \examsf:\Protest\pythoh\Deom\chap6\demo.py
'''
# 字典 内置函数dict() 取字典元素 [] 和get('name',value) 第二个参数设置默认值
nums={'涨三':100}
stud=dict(name='jack')
print(nums,stud)
print(nums.get('age',10))
#key 判断
print('张三' in nums)
#del 删除 clear()
del nums['涨三']
nums['list']=10
nums['lists']=100
#keys() 获取字典所以元素 value()获取所以value
#items() 获取所以的key-value 
vals=nums.values()
print(vals)
print(list(vals))
#字典生成 内置函数zip()
itess=['name','ages']
prices=['礼书',10]
#upper() 大写
newval={item.upper():price for item,price in zip(itess,prices)}
print(newval)