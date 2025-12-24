from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.auth import create_access_token, get_password_hash, verify_password
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.token import Token

router = APIRouter()

@router.post("/login", response_model=Token)
def login_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    print("login api")
    # 6. 查询数据（全部记录）
    users = db.query(User).all()
    print("所有用户:")
    for userd in users:
        print(f"ID: {userd.username}")

    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(user.username,form_data.username)
    print(form_data.password, user.hashed_password)
    print('pass ok',verify_password(form_data.password, user.hashed_password))
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register")
def register(
    username: str, 
    email: str, 
    password: str, 
    is_cs: bool = False,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    """
    # 检查用户名是否已存在
    user_exists = db.query(User).filter(User.username == username).first()
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    
    # 检查邮箱是否已存在
    email_exists = db.query(User).filter(User.email == email).first()
    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    # 创建新用户
    hashed_password = get_password_hash(password)
    db_user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        is_cs=is_cs
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "User registered successfully"}