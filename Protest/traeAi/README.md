# 即时通信客服系统

一个基于FastAPI和Vue3的即时通信客服系统，支持用户与客服实时聊天。

## 项目结构

```
traeAi/
├── backend/               # 后端服务
│   ├── app/               # 应用代码
│   │   ├── api/           # API路由
│   │   ├── models/        # 数据库模型
│   │   ├── schemas/       # Pydantic模式
│   │   ├── __init__.py    # 应用初始化
│   │   ├── database.py    # 数据库配置
│   │   └── main.py        # 主应用
│   ├── init_db.py         # 数据库初始化脚本
│   ├── requirements.txt   # 依赖项
│   └── run.py             # 启动脚本
├── frontend/              # 前端应用
│   ├── admin-app/         # 客服管理系统
│   │   ├── src/           # 源代码
│   │   ├── index.html     # HTML入口
│   │   └── package.json   # 项目配置
│   └── user-app/          # 用户聊天应用
│       ├── src/           # 源代码
│       ├── index.html     # HTML入口
│       └── package.json   # 项目配置
└── README.md              # 项目文档
```

## 功能特性

- 用户注册和登录
- 实时聊天（WebSocket通信）
- 消息历史记录
- 客服管理界面
- 用户在线状态监控
- 安全认证和授权

## 技术栈

### 后端
- FastAPI: 高性能Web框架
- SQLAlchemy: ORM数据库操作
- Pydantic: 数据验证
- WebSockets: 实时通信
- JWT: 用户认证

### 前端
- Vue 3: 渐进式JavaScript框架
- Pinia: 状态管理
- Vue Router: 路由管理
- Vant UI: 用户端UI组件库
- Element Plus: 管理端UI组件库
- Axios: HTTP客户端

## 快速开始

### 后端设置
1. 安装虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # 在Windows上使用 venv\Scripts\activate
```

2. 激活虚拟环境：
```bash
source venv/bin/activate  # 在Windows上使用 venv\Scripts\activate
```

3. 安装依赖:
```bash

cd backend
pip install -r requirements.txt
```

4. 初始化数据库:
```bash
python init_db.py
```

5. 启动后端服务:
```bash
python run.py
```

后端服务将在 http://localhost:8000 运行。

### 前端设置

#### 用户应用

1. 安装依赖:
```bash
cd frontend/user-app
npm install
```

2. 启动开发服务器:
```bash
npm run dev
```

用户应用将在 http://localhost:5173 运行。

#### 管理员应用

1. 安装依赖:
```bash
cd frontend/admin-app
npm install
```

2. 启动开发服务器:
```bash
npm run dev
```

管理员应用将在 http://localhost:5174 运行。

## 默认账户

### 用户账户
- 用户名: user
- 密码: password

### 客服账户
- 用户名: admin
- 密码: admin123

## API文档

启动后端服务后，可以通过以下URL访问API文档:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 开发指南

### 添加新API端点

1. 在 `backend/app/api/` 目录下创建新的路由文件
2. 在 `backend/app/main.py` 中注册新的路由

### 添加新的数据模型

1. 在 `backend/app/models/` 目录下创建新的模型文件
2. 在 `backend/app/schemas/` 目录下创建对应的Pydantic模式

### 前端开发

- 用户界面组件位于 `frontend/user-app/src/components/`
- 管理界面组件位于 `frontend/admin-app/src/components/`
- 状态管理位于各自应用的 `src/store/` 目录

## 部署

### 后端部署

1. 使用Gunicorn作为WSGI服务器:
```bash
cd backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### 前端部署

1. 构建生产版本:
```bash
cd frontend/user-app
npm run build
```

2. 将生成的 `dist` 目录部署到Web服务器

## 许可证

MIT