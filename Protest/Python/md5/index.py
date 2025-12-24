# -*- coding: utf-8 -*-
import hashlib
import os

def file_md5(file_path):
    # 计算文件的 MD5 哈希值
    with open(file_path, "rb") as f:
        file_hash = hashlib.md5()
        while True:
            chunk = f.read(8192)
            if not chunk:
                break
            file_hash.update(chunk)
    return file_hash.hexdigest()

def get_directory_md5(directory_path):
    # 获取目录下所有文件的 MD5 哈希值
    directory_md5 = {}
    try:
        for root, dirs, files in os.walk(directory_path):
            for filename in files:
                file_path = os.path.join(root, filename)
                relative_path = os.path.relpath(file_path, directory_path)
                md5 = file_md5(file_path)
                directory_md5[relative_path] = md5
    except Exception as e:
        print("Error:", e)
    return directory_md5

def gen_md5_id(item):
    md5_machine = hashlib.md5()
    md5_machine.update(item.encode('utf-8'))
    return md5_machine.hexdigest()
# 示例：获取目录下所有文件的 MD5 哈希值
directory_path = 'F:\Protest\Python\md5'  # 替换为你要遍历的目录路径
directory_md5 = get_directory_md5(directory_path)
print(directory_md5)
print(gen_md5_id("123"))


def calculate_file_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def get_directory_files_with_md5(directory):
    files_with_md5 = {}
    for root, dirs, files_in_dir in os.walk(directory):
        for file_name in files_in_dir:
            file_path = os.path.join(root, file_name)
            md5_value = calculate_file_md5(file_path)
            files_with_md5[file_path] = md5_value
    return files_with_md5

# 使用示例
directory = 'F:\Protest\Python\md5'
files_with_md5 = get_directory_files_with_md5(directory)
for file_path, md5_value in files_with_md5.items():
    print("File: ", file_path, "MD5:",md5_value)

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()
 
print(get_md5('F:\Protest\Python\md5\main.png'))