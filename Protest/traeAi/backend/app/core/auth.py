from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status, WebSocket
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import User
from app.schemas.token import TokenPayload
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise credentials_exception
    return user
def get_current_admin(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    user = get_current_user(db, token)
    if user.username != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user

async def get_current_user_ws(
    websocket: WebSocket,
    db: Session = Depends(get_db)
) -> User:
    try:
        # 从查询参数获取token
        token = websocket.query_params.get("token")
        if not token:
            await websocket.close(code=1008)
            return None
            
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            await websocket.close(code=1008)
            return None
    except JWTError:
        await websocket.close(code=1008)
        return None
        
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        await websocket.close(code=1008)
        return None
    return user