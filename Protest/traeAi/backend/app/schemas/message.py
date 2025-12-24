from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from enum import Enum

class MessageStatusEnum(str, Enum):
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class MessageTypeEnum(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AT = "at"

# 共享属性
class MessageBase(BaseModel):
    content: str
    user_id: int
    is_from_user: bool = True
    message_type: MessageTypeEnum = MessageTypeEnum.TEXT
    media_url: Optional[str] = None
    mentioned_user_id: Optional[int] = None

# 创建消息
class MessageCreate(MessageBase):
    pass

# 数据库中的消息
class MessageInDBBase(MessageBase):
    id: int
    created_at: datetime
    status: MessageStatusEnum = MessageStatusEnum.SENT
    is_recalled: bool = False

    class Config:
        orm_mode = True

# 返回给API的消息
class Message(MessageInDBBase):
    pass

# 消息状态更新
class MessageStatusUpdate(BaseModel):
    status: MessageStatusEnum

# 消息撤回
class MessageRecall(BaseModel):
    message_id: int