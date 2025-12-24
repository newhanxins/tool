from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class MessageStatus(enum.Enum):
    SENDING = "sending"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class MessageType(enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AT = "at"

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    is_from_user = Column(Boolean, default=True)  # True: 用户发送, False: 客服发送
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(Enum(MessageStatus), default=MessageStatus.SENT)
    message_type = Column(Enum(MessageType), default=MessageType.TEXT)
    media_url = Column(String, nullable=True)  # 用于存储图片或视频URL
    is_recalled = Column(Boolean, default=False)  # 是否已撤回
    mentioned_user_id = Column(Integer, nullable=True)  # @用户的ID