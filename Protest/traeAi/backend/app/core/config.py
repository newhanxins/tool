import secrets
from typing import List, Optional, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    API_ADMIN_STR: str = "/api/admin"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    PROJECT_NAME: str = "FastAPI Chat Service"
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://127.0.0.1:5173","http://localhost:5173","http://127.0.0.1:5175"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # 数据库配置
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./chat.db"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()