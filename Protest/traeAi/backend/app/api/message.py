from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import shutil
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.message import Message, MessageType, MessageStatus
from app.models.chat import Chat
from app.schemas.message import MessageCreate, Message as MessageSchema, MessageStatusUpdate, MessageRecall
from app.schemas.chat import ChatCreate
from app.core.auth import get_current_user, get_current_admin

router = APIRouter()

# 上传媒体文件
@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # 创建上传目录
    upload_dir = os.path.join("static", "uploads", str(current_user.id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # 生成文件名
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{datetime.now().strftime('%Y%m%d%H%M%S')}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)
    
    # 保存文件
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 返回文件URL
    return {"url": f"/static/uploads/{current_user.id}/{file_name}"}

# 撤回消息
@router.put("/messages/{message_id}/recall", response_model=MessageSchema)
async def recall_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 获取消息
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # 检查权限（只能撤回自己发送的消息或管理员可以撤回任何消息）
    if not current_user.is_cs and (message.user_id != current_user.id or not message.is_from_user):
        raise HTTPException(status_code=403, detail="Not authorized to recall this message")
    
    # 撤回消息
    message.is_recalled = True
    db.commit()
    db.refresh(message)
    
    return message

# 获取用户聊天历史
@router.get("/user/messages", response_model=List[MessageSchema])
async def get_user_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    messages = db.query(Message).filter(
        Message.user_id == current_user.id,
        Message.is_recalled == False  # 不返回已撤回的消息
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    # 反转顺序以便按时间升序显示
    messages.reverse()
    
    # 更新消息状态为已读
    for message in messages:
        if not message.is_from_user and message.status != MessageStatus.READ:
            message.status = MessageStatus.READ
    
    # 更新聊天列表中的未读计数
    chat = db.query(Chat).filter(Chat.user_id == current_user.id).first()
    if chat:
        chat.unread_count = 0
        chat.updated_at = datetime.now()
    
    db.commit()
    
    return messages

# 获取管理员与特定用户的聊天历史
@router.get("/admin/messages/{user_id}", response_model=List[MessageResponse])
async def get_admin_messages(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # 验证用户是否存在
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    messages = db.query(Message).filter(
        Message.user_id == user_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    # 反转顺序以便按时间升序显示
    messages.reverse()
    
    return messages

# 保存消息到数据库
async def save_message(db: Session, user_id: int, content: str, is_from_user: bool, 
                  message_type=MessageType.TEXT, media_url=None, mentioned_user_id=None):
    # 创建消息
    db_message = Message(
        content=content,
        is_from_user=is_from_user,
        user_id=user_id,
        message_type=message_type,
        media_url=media_url,
        mentioned_user_id=mentioned_user_id,
        status=MessageStatus.SENT
    )
    db.add(db_message)
    
    # 更新或创建聊天列表
    chat = db.query(Chat).filter(Chat.user_id == user_id).first()
    if chat:
        chat.last_message = content
        chat.last_message_time = datetime.now()
        if not is_from_user:  # 如果是客服发送的消息，增加未读计数
            chat.unread_count += 1
    else:
        # 创建新的聊天
        chat = Chat(
            user_id=user_id,
            last_message=content,
            last_message_time=datetime.now(),
            unread_count=0 if is_from_user else 1
        )
        db.add(chat)
    
    db.commit()
    db.refresh(db_message)
    return db_message

# WebSocket连接管理
class ConnectionManager:
    def __init__(self):
        # 用户连接 {user_id: WebSocket}
        self.user_connections = {}
        # 管理员连接 {admin_id: WebSocket}
        self.admin_connections = {}
        # 活跃用户ID列表
        self.active_users = set()
    
    async def connect_user(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        self.user_connections[user_id] = websocket
        self.active_users.add(user_id)
        
        # 通知所有管理员有新用户上线
        await self.notify_admins_user_active()
    
    async def connect_admin(self, websocket: WebSocket, admin_id: int):
        await websocket.accept()
        self.admin_connections[admin_id] = websocket
    
    def disconnect_user(self, user_id: int):
        self.user_connections.pop(user_id, None)
        self.active_users.discard(user_id)
    
    def disconnect_admin(self, admin_id: int):
        self.admin_connections.pop(admin_id, None)
    
    async def send_message_to_user(self, user_id: int, message: dict):
        if user_id in self.user_connections:
            await self.user_connections[user_id].send_text(json.dumps(message))
    
    async def send_message_to_admin(self, admin_id: int, message: dict):
        if admin_id in self.admin_connections:
            await self.admin_connections[admin_id].send_text(json.dumps(message))
    
    async def broadcast_to_admins(self, message: dict):
        for admin_connection in self.admin_connections.values():
            await admin_connection.send_text(json.dumps(message))
    
    async def notify_admins_user_active(self):
        # 通知所有管理员更新活跃用户列表
        for admin_connection in self.admin_connections.values():
            await admin_connection.send_text(json.dumps({
                "type": "user_active"
            }))

# 创建连接管理器实例
manager = ConnectionManager()

# 用户WebSocket端点
@router.websocket("/ws/user")
async def websocket_user_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    # 验证用户Token
    try:
        user = await get_current_user(token=token, db=db)
    except HTTPException:
        await websocket.close(code=1008)  # Policy Violation
        return
    
    await manager.connect_user(websocket, user.id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # 解析消息数据
            content = message_data.get("content", "")
            message_type = MessageType[message_data.get("message_type", "TEXT")]
            media_url = message_data.get("media_url")
            mentioned_user_id = message_data.get("mentioned_user_id")
            
            # 保存消息到数据库
            db_message = await save_message(
                db=db,
                user_id=user.id,
                content=content,
                is_from_user=True,
                message_type=message_type,
                media_url=media_url,
                mentioned_user_id=mentioned_user_id
            )
            
            # 构建消息响应
            message_response = {
                "type": "message",
                "message": {
                    "id": db_message.id,
                    "content": db_message.content,
                    "is_from_user": db_message.is_from_user,
                    "user_id": db_message.user_id,
                    "created_at": db_message.created_at.isoformat()
                }
            }
            
            # 发送给所有管理员
            await manager.broadcast_to_admins({
                "type": "message",
                "user_id": user.id,
                "message": message_response["message"]
            })
            
            # 发送确认消息给用户
            await websocket.send_text(json.dumps(message_response))
            
    except WebSocketDisconnect:
        manager.disconnect_user(user.id)
    except Exception as e:
        print(f"Error in user websocket: {e}")
        manager.disconnect_user(user.id)

# 管理员WebSocket端点
@router.websocket("/ws/admin")
async def websocket_admin_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    # 验证管理员Token
    try:
        admin = await get_current_admin(token=token, db=db)
    except HTTPException:
        await websocket.close(code=1008)  # Policy Violation
        return
    
    await manager.connect_admin(websocket, admin.id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "message":
                user_id = message_data.get("user_id")
                content = message_data.get("content", "")
                
                # 验证用户是否存在
                user = db.query(User).filter(User.id == user_id).first()
                if not user:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": "User not found"
                    }))
                    continue
                
                # 解析消息数据
                message_type = MessageType[message_data.get("message_type", "TEXT")]
                media_url = message_data.get("media_url")
                mentioned_user_id = message_data.get("mentioned_user_id")
                
                # 保存消息到数据库
                db_message = await save_message(
                    db=db,
                    user_id=user_id,
                    content=content,
                    is_from_user=False,
                    message_type=message_type,
                    media_url=media_url,
                    mentioned_user_id=mentioned_user_id
                )
                
                # 构建消息响应
                message_response = {
                    "type": "message",
                    "message": {
                        "id": db_message.id,
                        "content": db_message.content,
                        "is_from_user": db_message.is_from_user,
                        "user_id": db_message.user_id,
                        "created_at": db_message.created_at.isoformat()
                    }
                }
                
                # 发送给对应用户
                await manager.send_message_to_user(user_id, message_response)
                
                # 发送确认消息给管理员
                await websocket.send_text(json.dumps(message_response))
                
    except WebSocketDisconnect:
        manager.disconnect_admin(admin.id)
    except Exception as e:
        print(f"Error in admin websocket: {e}")
        manager.disconnect_admin(admin.id)

# 获取活跃用户列表
@router.get("/admin/active-users")
async def get_active_users(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    active_user_ids = list(manager.active_users)
    active_users = db.query(User).filter(
        User.id.in_(active_user_ids),
        User.is_admin == False
    ).all()
    
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }
        for user in active_users
    ]