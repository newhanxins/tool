from sqlalchemy.orm import Session
from app.models.message import Message
from app.core.database import SessionLocal

async def save_message(user_id: int, content: str, is_from_user: bool = True):
    """保存消息到数据库"""
    db = SessionLocal()
    try:
        db_message = Message(
            user_id=user_id,
            content=content,
            is_from_user=is_from_user
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message
    finally:
        db.close()

def get_user_messages(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """获取用户的消息历史"""
    return db.query(Message).filter(
        Message.user_id == user_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()