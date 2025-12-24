from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.message import Message
from app.services.message_service import get_user_messages

router = APIRouter()

@router.get("/history/{user_id}", response_model=List[Message])
def read_user_messages(
    user_id: int,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取用户的消息历史
    """
    # 只有自己或客服可以查看消息历史
    if current_user.id != user_id and not current_user.is_cs:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return get_user_messages(db=db, user_id=user_id, skip=skip, limit=limit)