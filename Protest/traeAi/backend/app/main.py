from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from app.api.api import api_router
from app.api.chat import router as chat_router
from app.api.admin import router as admin_router
from app.core.config import settings
from app.core.websocket import websocket_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="TraeAI聊天系统API文档",
    version="1.0.0",
    docs_url=None,  # 禁用默认的/docs路径
    redoc_url=None,  # 禁用默认的/redoc路径
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# 设置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173","http://localhost:5173","http://127.0.0.1:5175","http://localhost:5175","http://127.0.0.1:5174","http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加API路由
app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_ADMIN_STR)
app.include_router(chat_router, prefix="")
# 添加WebSocket路由
app.include_router(websocket_router)

@app.get("/")
def root():
    return {"message": "Welcome to FastAPI Chat Service"}

# 自定义API文档路由
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - ReDoc",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    )