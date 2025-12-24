from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List, Optional
from app.core.auth import get_current_user_ws
from app.models.user import User
from app.services.message_service import save_message

# 创建WebSocket路由
websocket_router = APIRouter()

# 连接管理器
class ConnectionManager:
    def __init__(self):
        # 客户连接: {user_id: WebSocket}
        self.user_connections: Dict[int, WebSocket] = {}
        # 客服连接: {cs_id: WebSocket}
        self.cs_connections: Dict[int, WebSocket] = {}
        # 用户-客服映射: {user_id: cs_id}
        self.user_cs_mapping: Dict[int, int] = {}

    async def connect_user(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.user_connections[user_id] = websocket

    async def connect_cs(self, cs_id: int, websocket: WebSocket):
        await websocket.accept()
        self.cs_connections[cs_id] = websocket

    def disconnect_user(self, user_id: int):
        if user_id in self.user_connections:
            del self.user_connections[user_id]
        if user_id in self.user_cs_mapping:
            del self.user_cs_mapping[user_id]

    def disconnect_cs(self, cs_id: int):
        if cs_id in self.cs_connections:
            del self.cs_connections[cs_id]
        # 移除所有映射到此客服的用户
        for user_id, mapped_cs_id in list(self.user_cs_mapping.items()):
            if mapped_cs_id == cs_id:
                del self.user_cs_mapping[user_id]

    def assign_cs_to_user(self, user_id: int, cs_id: int):
        self.user_cs_mapping[user_id] = cs_id

    async def send_message_to_user(self, user_id: int, message: str):
        if user_id in self.user_connections:
            await self.user_connections[user_id].send_text(message)

    async def send_message_to_cs(self, cs_id: int, message: str):
        if cs_id in self.cs_connections:
            await self.cs_connections[cs_id].send_text(message)

    async def broadcast_to_all_cs(self, message: str):
        for cs_id in self.cs_connections:
            await self.cs_connections[cs_id].send_text(message)

    def get_cs_for_user(self, user_id: int) -> Optional[int]:
        return self.user_cs_mapping.get(user_id)


manager = ConnectionManager()

@websocket_router.websocket("/ws/user/{user_id}")
async def websocket_user_endpoint(
    websocket: WebSocket, 
    user_id: int,
    user: User = Depends(get_current_user_ws)
):
    print("ddddddddddd",user_id)
    print(f"user: {user}")
    if user is None or 'id' not in user or user['id'] != user_id:
        await websocket.close(code=1008)  # Policy violation
        return
        
    await manager.connect_user(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # 保存消息
            await save_message(user_id=user_id, content=data, is_from_user=True)
            
            # 查找分配的客服
            cs_id = manager.get_cs_for_user(user_id)
            if cs_id:
                # 发送给指定客服
                await manager.send_message_to_cs(
                    cs_id, 
                    f'{{"type": "message", "user_id": {user_id}, "content": "{data}"}}'
                )
            else:
                # 广播给所有客服，请求服务
                await manager.broadcast_to_all_cs(
                    f'{{"type": "service_request", "user_id": {user_id}, "content": "{data}"}}'
                )
    except WebSocketDisconnect:
        manager.disconnect_user(user_id)


@websocket_router.websocket("/ws/cs/{cs_id}")
async def websocket_cs_endpoint(
    websocket: WebSocket, 
    cs_id: int,
    user: User = Depends(get_current_user_ws)
):
    if not user.is_cs:
        await websocket.close(code=1008)  # Policy violation
        return
        
    await manager.connect_cs(cs_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # 解析消息格式: {"user_id": 123, "content": "消息内容"}
            import json
            try:
                msg_data = json.loads(data)
                user_id = msg_data.get("user_id")
                content = msg_data.get("content")
                
                if user_id and content:
                    # 保存消息
                    await save_message(user_id=user_id, content=content, is_from_user=False)
                    
                    # 分配客服给用户（如果尚未分配）
                    if not manager.get_cs_for_user(user_id):
                        manager.assign_cs_to_user(user_id, cs_id)
                    
                    # 发送消息给用户
                    await manager.send_message_to_user(user_id, content)
            except json.JSONDecodeError:
                await websocket.send_text("Invalid message format")
    except WebSocketDisconnect:
        manager.disconnect_cs(cs_id)