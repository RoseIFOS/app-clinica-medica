from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date


class PacienteBase(BaseModel):
    nome: str
    cpf: str
    data_nascimento: date
    telefone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None
    convenio: Optional[str] = None
    numero_carteirinha: Optional[str] = None


class PacienteCreate(PacienteBase):
    pass


class PacienteUpdate(BaseModel):
    nome: Optional[str] = None
    cpf: Optional[str] = None
    data_nascimento: Optional[date] = None
    telefone: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    cep: Optional[str] = None
    convenio: Optional[str] = None
    numero_carteirinha: Optional[str] = None


class PacienteInDB(PacienteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Paciente(PacienteInDB):
    pass


class PacienteList(BaseModel):
    items: List[Paciente]
    total: int
    skip: int
    limit: int
