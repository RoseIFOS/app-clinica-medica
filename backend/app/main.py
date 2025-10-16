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

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
