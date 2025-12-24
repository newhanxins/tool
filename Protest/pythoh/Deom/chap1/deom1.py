# coding=utf-8
# 输出字符串
print("520")
# 输出文件
fid=open("F:/Protest/pythoh/Deom/file/a.txt","a+")
print('helloword',file=fid)
fid.close()
# 转义字符 \n换行 \t \r 覆盖 \b 退一格
print("hello\nword")
print('大家：\'ccc\'')
# 位 字节 ASCll
print(chr(0b100111001011000))
print(ord('乘'))