from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime, date, time
from ..models.consulta import TipoConsulta, StatusConsulta

class ConsultaBase(BaseModel):
    paciente_id: int
    medico_id: int
    data_hora: datetime
    duracao: int = 60  # em minutos
    tipo: TipoConsulta = TipoConsulta.PRIMEIRA_CONSULTA
    observacoes: Optional[str] = None

class ConsultaCreate(ConsultaBase):
    pass

class ConsultaUpdate(BaseModel):
    data_hora: Optional[datetime] = None
    duracao: Optional[int] = None
    tipo: Optional[TipoConsulta] = None
    status: Optional[StatusConsulta] = None
    observacoes: Optional[str] = None

class Consulta(ConsultaBase):
    id: int
    status: StatusConsulta
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ConsultaList(BaseModel):
    items: List[Consulta]
    total: int
    skip: int
    limit: int

class HorarioDisponivel(BaseModel):
    data: date
    hora_inicio: time
    hora_fim: time
    medico_id: int
    medico_nome: str
    disponivel: bool = True

class AgendaMedico(BaseModel):
    medico_id: int
    medico_nome: str
    especialidade: Optional[str]
    consultas: List[Consulta]
    horarios_disponiveis: List[HorarioDisponivel]

class ConsultaResumo(BaseModel):
    id: int
    data_hora: datetime
    paciente_nome: str
    medico_nome: str
    status: StatusConsulta
    tipo: TipoConsulta

class ConsultaListResumo(BaseModel):
    items: List[ConsultaResumo]
    total: int
    skip: int
    limit: int
