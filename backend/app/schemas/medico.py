from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, time
from ..models.user import UserRole

class MedicoBase(BaseModel):
    nome: str
    email: str
    crm: str
    especialidade: str

class MedicoCreate(MedicoBase):
    password: str

class MedicoUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[str] = None
    crm: Optional[str] = None
    especialidade: Optional[str] = None
    password: Optional[str] = None

class Medico(MedicoBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class MedicoList(BaseModel):
    items: List[Medico]
    total: int
    skip: int
    limit: int

class HorarioMedico(BaseModel):
    id: int
    dia_semana: str
    hora_inicio: time
    hora_fim: time
    ativo: bool

class MedicoComHorarios(Medico):
    horarios: List[HorarioMedico] = []
