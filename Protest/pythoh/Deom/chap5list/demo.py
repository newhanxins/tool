'''
Author: You
Date: 2022-12-25 16:07:17
LastEditors: Do not edit
LastEditTime: 2022-12-25 16:45:09
FilePath: \examsf:\Protest\pythoh\Deom\chap5\demo.py
'''
#index() 获取列表索引值
lists=['hello',12,'hello']
print(lists.index('hello'))
#print(lists.index(13))
print(lists[-1])#hello
lst=[1,12,10,15,13,20]
#获取多个值
print(lst[1:5:1])
# append() 增加末尾 extend() 末尾至少添加一个元素 insert（start,value） 任意位置添加一个元素
le=[1,2,3]
le.append(4)
print(le)
lets=[5,9]
le.extend(lets)
print(le)
# 删除列表元素
#remove() 移除一个元素
#pop()根据索引移除
#clear()清除
#del()删除列表对象
lis=[1,2,3,45,6]
lis.remove(3)
print(lis)
lis.pop(1)
print(lis)
lis.pop() #删除最后一个元素
# 修改列表元素
lj=[1,2,3]
lj[1]=6
lj[1:4]=[8,9,10]
print(lj)
# 列表排序
#sort()方法默认从小到大
news=[10,2,13,45,0,19]
print('排序',news)
news.sort()
print('排序后',news)
news.sort(reverse=True)#降序
print('降序',news)
#内置函数 sorted()对列表进行排序，产生一个新的列表对象
oldlist=[1,10,2,6,15]
print('原',oldlist)
newlist=sorted(oldlist,reverse=True)
print(newlist)
#生成列表
lst=[i*i for i in range(1,10)]
print(lst)