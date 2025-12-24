from typing import Optional
from pydantic import BaseModel, EmailStr

# 共享属性
class UserBase(BaseModel):
    username: str
    email: EmailStr
    is_cs: Optional[bool] = False

# 创建用户
class UserCreate(UserBase):
    password: str

# 更新用户
class UserUpdate(UserBase):
    password: Optional[str] = None

# 数据库中的用户
class UserInDBBase(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

# 返回给API的用户
class User(UserInDBBase):
    pass

# 数据库中存储的用户（包含密码）
class UserInDB(UserInDBBase):
    hashed_password: str