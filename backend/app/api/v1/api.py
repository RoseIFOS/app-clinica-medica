from fastapi import APIRouter
from app.api.v1 import auth, pacientes, consultas, medicos, dashboard, prontuarios, financeiro, lembretes, despesas

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["autenticação"])
api_router.include_router(pacientes.router, prefix="/pacientes", tags=["pacientes"])
api_router.include_router(consultas.router, prefix="/consultas", tags=["consultas"])
api_router.include_router(medicos.router, prefix="/medicos", tags=["médicos"])
api_router.include_router(prontuarios.router, prefix="/prontuarios", tags=["prontuários"])
api_router.include_router(financeiro.router, prefix="/financeiro", tags=["financeiro"])
api_router.include_router(despesas.router, prefix="/despesas", tags=["despesas"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(lembretes.router, prefix="/lembretes", tags=["lembretes"])
