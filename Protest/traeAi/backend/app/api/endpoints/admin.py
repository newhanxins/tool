from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.auth import create_access_token, verify_password, get_current_admin
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.token import Token
from app.schemas.user import User as UserSchema

router = APIRouter()

class AdminLoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", response_model=Token)
def admin_login(
    login_data: AdminLoginRequest,
    db: Session = Depends(get_db)
):
    """
    管理员登录接口
    """
    user = db.query(User).filter(User.username == login_data.username).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 检查是否为管理员
    if user.username != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，仅限管理员登录"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserSchema)
def get_admin_info(current_admin: User = Depends(get_current_admin)):
    """
    获取当前管理员信息
    """
    return current_admin