from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Chat(Base):
    """聊天列表模型，用于管理用户的聊天会话"""
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    last_message = Column(Text, nullable=True)  # 最后一条消息内容
    last_message_time = Column(DateTime(timezone=True), nullable=True)
    is_pinned = Column(Boolean, default=False)  # 是否置顶
    is_deleted = Column(Boolean, default=False)  # 是否删除（软删除）
    unread_count = Column(Integer, default=0)  # 未读消息数量
    note = Column(Text, nullable=True)  # 客服备注
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())