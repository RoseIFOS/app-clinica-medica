from fastapi import FastAPI
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

# Configurar CORS - Permitir todas as origens
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas as origens
    allow_credentials=False,  # Não usar credentials com allow_origins=*
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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


# Incluir rotas da API
from .api.v1.api import api_router
app.include_router(api_router, prefix="/api/v1")
