from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.models.user import User
from app.models.chat import Chat
from app.schemas.chat import ChatCreate, ChatUpdate, Chat as ChatSchema
from app.core.auth import get_current_user, get_current_admin

router = APIRouter()

# 获取用户的聊天列表
@router.get("/user/chats", response_model=List[ChatSchema])
async def get_user_chats(
    skip: int = 0,
    limit: int = 100,
    include_deleted: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 断点调试 - 打印传入参数
    print("===== DEBUG: get_user_chats =====")
    print(f"skip: {skip}, limit: {limit}, include_deleted: {include_deleted}")
    print(f"current_user: {current_user.id}, username: {current_user.username}")
    
    try:
        query = db.query(Chat).filter(Chat.user_id == current_user.id)
        print("查询语句:", str(query))
        
        if not include_deleted:
            query = query.filter(Chat.is_deleted == False)
        
        # 先返回置顶的，再按最后消息时间排序
        chats = query.order_by(Chat.is_pinned.desc(), Chat.last_message_time.desc()).offset(skip).limit(limit).all()
        print(f"找到聊天记录数量: {len(chats)}")
        return chats
    except Exception as e:
        print(f"ERROR in get_user_chats: {str(e)}")
        # 返回空列表而不是抛出异常，避免前端崩溃
        return []

# 获取管理员的聊天列表
@router.get("/admin/chats", response_model=List[ChatSchema])
async def get_admin_chats(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # 断点调试 - 打印传入参数
    print("===== DEBUG: get_admin_chats =====")
    print(f"skip: {skip}, limit: {limit}, search: {search}")
    print(f"current_admin: {current_admin.id}, username: {current_admin.username}, is_admin: {current_admin.is_admin}")
    
    try:
        query = db.query(Chat).filter(Chat.is_deleted == False)
        print("初始查询语句:", str(query))
        
        # 如果有搜索条件，联表查询用户信息
        if search:
            query = query.join(User, Chat.user_id == User.id).filter(
                User.username.contains(search) | User.email.contains(search)
            )
            print("添加搜索条件后查询语句:", str(query))
        
        # 先返回置顶的，再按最后消息时间排序
        chats = query.order_by(Chat.is_pinned.desc(), Chat.last_message_time.desc()).offset(skip).limit(limit).all()
        print(f"找到聊天记录数量: {len(chats)}")
        return chats
    except Exception as e:
        print(f"ERROR in get_admin_chats: {str(e)}")
        # 返回空列表而不是抛出异常，避免前端崩溃
        return []

# 创建或更新聊天
@router.post("/chats", response_model=ChatSchema)
async def create_or_update_chat(
    chat_data: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 检查是否已存在聊天
    existing_chat = db.query(Chat).filter(
        Chat.user_id == chat_data.user_id,
        Chat.admin_id == chat_data.admin_id
    ).first()
    
    if existing_chat:
        # 更新现有聊天
        for key, value in chat_data.dict(exclude_unset=True).items():
            setattr(existing_chat, key, value)
        
        existing_chat.updated_at = datetime.now()
        db.commit()
        db.refresh(existing_chat)
        return existing_chat
    else:
        # 创建新聊天
        db_chat = Chat(**chat_data.dict())
        db.add(db_chat)
        db.commit()
        db.refresh(db_chat)
        return db_chat

# 更新聊天（置顶、删除、添加备注）
@router.put("/chats/{chat_id}", response_model=ChatSchema)
async def update_chat(
    chat_id: int,
    chat_update: ChatUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 获取聊天
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # 检查权限（用户只能更新自己的聊天，管理员可以更新任何聊天）
    if not current_user.is_cs and chat.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this chat")
    
    # 更新聊天
    for key, value in chat_update.dict(exclude_unset=True).items():
        setattr(chat, key, value)
    
    chat.updated_at = datetime.now()
    db.commit()
    db.refresh(chat)
    return chat

# 标记聊天为已读
@router.put("/chats/{chat_id}/read", response_model=ChatSchema)
async def mark_chat_as_read(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 获取聊天
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # 检查权限
    if not current_user.is_cs and chat.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this chat")
    
    # 标记为已读
    chat.unread_count = 0
    chat.updated_at = datetime.now()
    db.commit()
    db.refresh(chat)
    return chat