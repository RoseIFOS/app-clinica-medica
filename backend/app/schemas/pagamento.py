from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from ..models.pagamento import MetodoPagamento, StatusPagamento

class PagamentoBase(BaseModel):
    paciente_id: int
    medico_id: Optional[int] = None
    consulta_id: Optional[int] = None
    valor: Decimal
    metodo_pagamento: MetodoPagamento
    data_vencimento: Optional[date] = None
    observacoes: Optional[str] = None

class PagamentoCreate(PagamentoBase):
    status: Optional[StatusPagamento] = StatusPagamento.PENDENTE

class PagamentoUpdate(BaseModel):
    valor: Optional[Decimal] = None
    metodo_pagamento: Optional[MetodoPagamento] = None
    status: Optional[StatusPagamento] = None
    data_vencimento: Optional[date] = None
    data_pagamento: Optional[datetime] = None
    observacoes: Optional[str] = None

class Pagamento(PagamentoBase):
    id: int
    status: StatusPagamento
    data_pagamento: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PagamentoList(BaseModel):
    items: List[Pagamento]
    total: int
    skip: int
    limit: int

class PagamentoResumo(BaseModel):
    id: int
    paciente_id: int
    medico_id: Optional[int] = None
    valor: Decimal
    status: StatusPagamento
    metodo_pagamento: MetodoPagamento
    data_vencimento: Optional[date] = None
    data_pagamento: Optional[datetime] = None
    paciente_nome: str
    medico_nome: Optional[str] = None
    consulta_data: Optional[datetime] = None

class PagamentoListResumo(BaseModel):
    items: List[PagamentoResumo]
    total: int
    skip: int
    limit: int

class RelatorioFinanceiro(BaseModel):
    periodo_inicio: date
    periodo_fim: date
    total_recebido: Decimal
    total_pendente: Decimal
    total_cancelado: Decimal
    total_geral: Decimal
    quantidade_pagamentos: int
    pagamentos_por_metodo: dict
    pagamentos_por_status: dict

class Inadimplencia(BaseModel):
    paciente_id: int
    paciente_nome: str
    total_devendo: Decimal
    quantidade_pendente: int
    ultimo_vencimento: date
    dias_atraso: int

class InadimplenciaList(BaseModel):
    items: List[Inadimplencia]
    total: Decimal
    quantidade_pacientes: int

class GraficoFinanceiro(BaseModel):
    data: str
    recebido: Decimal
    pendente: Decimal
    total: Decimal

