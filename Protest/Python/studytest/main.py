from typing import Union, List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import sys
app = FastAPI()

# MongoDB 连接字符串
MONGO_DETAILS = "mongodb://localhost:27017"

# 创建 MongoDB 客户端
client = AsyncIOMotorClient(MONGO_DETAILS)

# 打印 MongoDB 连接成功
print("MongoDB 连接成功")

# 选择数据库和集合
database = client.pyServer
collection = database.test_collection
users_collection = database.users

class User(BaseModel):
    _id: ObjectId = None
    name: str
    age: int
    password: str
    email: Optional[str] = None

CORSMiddleware(app, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/news/{news_id}")
def read_news(news_id: int, q: Union[str, None] = None):
    return {"news_id": news_id, "q": q}

@app.get("/datetime")
def get_current_datetime():
    current_datetime = datetime.now()
    return {"current_datetime": current_datetime.isoformat()}

@app.get("/test_mongo")
async def test_mongo():
    document = await collection.find_one()
    return document

@app.post("/users", response_model=List[User])
async def get_users():
    users = await users_collection.find().to_list(100)
    for user in users:
        user["_id"] = str(user["_id"])
    return users

@app.get("/add_user/{name}/{age}/{password}")
async def add_user(name: str, age: int, password: str, email: Optional[str] = None):
    user = {"name": name, "age": age, "password": password, "email": email}
    print("adduser",user)
    try:
        is_user = await users_collection.find_one({"name": name})
        if is_user:
            print("is_user",is_user)
            raise HTTPException(status_code=400, detail="用户已存在")
        else:
            await users_collection.insert_one(user)
            print("adduser success",user)
            users = await users_collection.find().to_list(100)
            for user in users:
                user["_id"] = str(user["_id"])
            print("get users",users)
            return users
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/delete_user/{name}")
async def delete_user(name: str):
    try:
        delete_result = await users_collection.delete_one({"name": name})
        if delete_result.deleted_count == 1:
            return {"message": "用户删除成功"}
        else:
            raise HTTPException(status_code=404, detail="用户未找到")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


print('================Python import mode==========================')
print ('命令行参数为:')
for i in sys.argv:
    print ("sys.argv",i)
print ('\n python 路径为',sys.path)