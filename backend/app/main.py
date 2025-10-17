from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.database import engine
from .core.database import Base

# Criar tabelas no banco de dados (será feito via Alembic)
# Base.metadata.create_all(bind=engine)

# Criar aplicação FastAPI
app = FastAPI(
    title="Sistema de Gerenciamento de Clínica Médica",
    description="API para gerenciamento completo de clínica médica",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware customizado para adicionar headers CORS em TODAS as respostas
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Expose-Headers"] = "*"
    response.headers["Access-Control-Max-Age"] = "3600"
    return response

# Configurar CORS - Permitir todas as origens (necessário para Lovable)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=False,  # Não usar credentials com allow_origins=*
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight por 1 hora
)


@app.get("/")
async def root():
    return {
        "message": "Sistema de Gerenciamento de Clínica Médica",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Adicionar handler OPTIONS global para CORS preflight
@app.options("/{path:path}")
async def options_handler(path: str):
    return {"status": "ok"}


# Incluir rotas da API
from .api.v1.api import api_router
app.include_router(api_router, prefix="/api/v1")
