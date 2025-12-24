from datetime import datetime
from typing import Optional
from pydantic import BaseModel

# 共享属性
class ChatBase(BaseModel):
    user_id: int
    admin_id: Optional[int] = None
    last_message: Optional[str] = None
    is_pinned: bool = False
    note: Optional[str] = None

# 创建聊天
class ChatCreate(ChatBase):
    pass

# 更新聊天
class ChatUpdate(BaseModel):
    is_pinned: Optional[bool] = None
    is_deleted: Optional[bool] = None
    note: Optional[str] = None

# 数据库中的聊天
class ChatInDBBase(ChatBase):
    id: int
    last_message_time: Optional[datetime] = None
    unread_count: int = 0
    is_deleted: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# 返回给API的聊天
class Chat(ChatInDBBase):
    pass