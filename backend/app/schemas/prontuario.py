from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProntuarioBase(BaseModel):
    paciente_id: int
    consulta_id: Optional[int] = None
    medico_id: int
    data: datetime
    anamnese: str
    diagnostico: str
    prescricao: Optional[str] = None
    exames_solicitados: Optional[str] = None
    observacoes: Optional[str] = None

class ProntuarioCreate(ProntuarioBase):
    pass

class ProntuarioUpdate(BaseModel):
    anamnese: Optional[str] = None
    diagnostico: Optional[str] = None
    prescricao: Optional[str] = None
    exames_solicitados: Optional[str] = None
    observacoes: Optional[str] = None

class Prontuario(ProntuarioBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProntuarioList(BaseModel):
    items: List[Prontuario]
    total: int
    skip: int
    limit: int

class ProntuarioResumo(BaseModel):
    id: int
    data: datetime
    medico_nome: str
    diagnostico: str
    consulta_id: Optional[int] = None

class ProntuarioCompleto(Prontuario):
    paciente_nome: str
    medico_nome: str
    consulta_data: Optional[datetime] = None

class ProntuarioPDF(BaseModel):
    id: int
    html_content: str
    pdf_url: Optional[str] = None

class ProntuarioTemplate(BaseModel):
    anamnese_template: str
    diagnostico_template: str
    prescricao_template: str
    observacoes_template: str
