from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user
    """
    return current_user

@router.get("/cs", response_model=List[UserSchema])
def read_cs_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all customer service users
    """
    if not current_user.is_cs:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(User).filter(User.is_cs == True).offset(skip).limit(limit).all()