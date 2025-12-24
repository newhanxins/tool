# -*- coding: utf-8 -*-

# @Time    : 3/27/2019 21:54

# @Author  : MARX·CBR

# @File    : 微信Dat文件转图片.py

 

import os


 

out_path=r"D:\\"

 

def imageDecode(f,fn):

    dat_read = open(f, "rb")

    # out='P:\\'+fn+".png"

    out=out_path+fn+".png"

    png_write = open(out, "wb")

    for now in dat_read:

        for nowByte in now:

            newByte = nowByte ^ 0x33

            png_write.write(bytes([newByte]))

    dat_read.close()

    png_write.close()

 

def findFile(f):

    fsinfo = os.listdir(f)

    for fn in fsinfo:

        temp_path = os.path.join(f, fn)

        if not os.path.isdir(temp_path):

            print('文件路径: {}' .format(temp_path))

            print(fn)

            imageDecode(temp_path,fn)

        else:

            ...

 

# path = r'C:\Users\输入自己微信存储路径\Data'

# findFile(path)

 

# path = r'E:\\'

findFile(path)