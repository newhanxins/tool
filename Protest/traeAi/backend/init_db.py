from app.core.database import Base, engine
from app.models.user import User
from app.models.message import Message
from app.core.auth import get_password_hash
from sqlalchemy.orm import Session
from app.core.database import SessionLocal

# 创建数据库表
def init_db():
    Base.metadata.create_all(bind=engine)
    
    # 创建初始用户
    db = SessionLocal()
    try:
        # 检查是否已有用户
        user = db.query(User).first()
        if not user:
            # 创建普通用户
            user = User(
                username="user",
                email="user@example.com",
                hashed_password=get_password_hash("password"),
                is_cs=False
            )
            db.add(user)
            
            # 创建客服用户
            cs = User(
                username="cs",
                email="cs@example.com",
                hashed_password=get_password_hash("password"),
                is_cs=True
            )
            db.add(cs)
            
            # 创建管理员用户
            admin = User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                is_cs=True,
                is_admin=True
            )
            db.add(admin)
            
            db.commit()
            print("Created initial users")
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating initial data")
    init_db()
    print("Initial data created")