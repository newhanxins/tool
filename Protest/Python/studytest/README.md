# 项目
## 创建项目
 1.生成 requirements.txt 文件
```bash
pip freeze > requirements.txt
```
 2.生成项目
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```
 3.创建项目
```bash
python -m venv venv
```
 4.激活项目
```bash
# linux
source venv/bin/activate
# windows
venv\Scripts\activate
# 退出
deactivate
```
 5.安装依赖
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```
 6.创建项目
```bash
python manage.py startapp app
```



# 安装 FastAPI 和 Uvicorn
FastAPI 是一个现代的 web 框架，而 Uvicorn 是一个用于运行 FastAPI 应用的 ASGI 服务器。打开 VS Code 的终端并使用以下命令安装它们：

打开 VS Code，按 Ctrl + ~ 打开终端（或者通过顶部菜单 终端 -> 新建终端）。
使用 pip 安装 FastAPI 和 Uvicorn：
```bash
pip install fastapi uvicorn
```
# 创建 FastAPI 项目文件夹
在 VS Code 中创建一个新的项目文件夹，或者你也可以使用终端命令行来创建：

```bash
mkdir fastapi_project
cd fastapi_project
```
在这个文件夹内，你会创建你的 FastAPI 应用程序。

# 创建一个 Python 文件（main.py）
在项目文件夹中，创建一个新的 Python 文件（例如：main.py）。
编写一个简单的 FastAPI 应用程序，代码如下：
```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}
```
# 创建虚拟环境（可选）
为了更好的管理项目依赖，可以创建一个虚拟环境。你可以使用以下命令来创建并激活虚拟环境：

创建虚拟环境：
```bash
python -m venv venv
```
激活虚拟环境：
在 Windows 上:
```bash
venv\Scripts\activate
```
在 macOS/Linux 上:
```bash
source venv/bin/activate
```
1. 安装依赖（在虚拟环境中）
确保在虚拟环境中安装 fastapi 和 uvicorn：

```bash
pip install fastapi uvicorn
```
# 运行 FastAPI 应用
使用 Uvicorn 运行 FastAPI 应用，输入以下命令：

```bash
uvicorn main:app --reload
```
这里 main 是你的 Python 文件名（main.py），app 是 FastAPI 实例的名字，--reload 是让开发时每次修改代码都自动重启应用。

如果一切正常，你会看到类似这样的输出：
```bash
INFO:     Will watch for changes in these directories: ['.', 'app']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

## 安装库
### 安装 motor
motor 是 MongoDB 的异步驱动程序，用于与 MongoDB 数据库进行交互。你可以使用以下命令来安装 motor：
```bash
pip install motor
```


# linux系统安装
## 安装python3
```bash
sudo apt-get install python3
```
## 安装pip3
```bash
sudo apt-get install python3-pip
```
## 安装fastapi
```bash
pip3 install fastapi
```
## 安装uvicorn
```bash
pip3 install uvicorn
```
## 安装motor
```bash
pip3 install motor
```

## 下载虚拟环境安装工具
```bash
	pip3 install virtualenv
```

## 进入项目目录 cd
## 创建虚拟环境
```bash
	virtualenv venv
```
## 进入虚拟环境
	Windows 上:
```bash
	. venv\Scripts\activate
```
	macOS/Linux 上:
```bash
	. venv/bin/activate
```
## 下载文件包
```bash
	pip install -r requirements.txt
```
## 运行
```bash
nohup uvicorn run:app --host 0.0.0.0 --port 8000 --reload >/dev/null 2>& 1 &
//后台挂起 控制台不打印
```
### >/dev/null 2>&1
1 >/dev/null：将标准输出（stdout）重定向到 /dev/null，意味着所有输出的内容都会被丢弃，不会显示在终端中。

2 2>&1：将标准错误输出（stderr）也重定向到标准输出（stdout）。所以，所有的错误信息也会被丢弃，不会显示在终端中。

这两部分的结合意味着你运行应用时，不会在终端看到任何日志输出。

3 &
& 是一个将命令放到后台执行的符号。这样，命令会在后台运行，而不会阻塞当前的终端或 shell。你可以继续在终端执行其他命令。

# linux 查看端口占用
```bash
netstat -anlp | grep 80
netstat -tnlp | grep 80
```
-a：表示显示所有连接和监听端口。
-n：表示以数字形式显示地址和端口号，而不是解析为主机名和服务名称。
-l：表示仅显示在监听状态的端口。
-p：表示显示哪个进程在使用该端口。
-t：表示仅显示 TCP 连接。与 -a（显示所有连接）不同，这个选项只关注 TCP 协议的连接。
# 使用 lsof 找到并杀死进程
```bash
lsof -i:8000
```
```bash
kill -9 [PID]
//-9 强制终止：
```
# 使用 ps 找到并杀死进程
使用 ps 和 grep 来查找正在运行的 uvicorn 进程，然后使用 kill 命令来终止它。
```bash
ps -ef | grep uvicorn
```
```bash
kill -9 [PID]
//-9 强制终止：
```