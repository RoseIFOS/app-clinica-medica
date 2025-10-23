from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from ..models.despesa import CategoriaDespesa, StatusDespesa


class DespesaBase(BaseModel):
    descricao: str
    categoria: CategoriaDespesa
    valor: Decimal
    data_vencimento: Optional[date] = None
    observacoes: Optional[str] = None
    fornecedor: Optional[str] = None


class DespesaCreate(DespesaBase):
    status: Optional[StatusDespesa] = StatusDespesa.PENDENTE


class DespesaUpdate(BaseModel):
    descricao: Optional[str] = None
    categoria: Optional[CategoriaDespesa] = None
    valor: Optional[Decimal] = None
    data_vencimento: Optional[date] = None
    data_pagamento: Optional[datetime] = None
    status: Optional[StatusDespesa] = None
    observacoes: Optional[str] = None
    fornecedor: Optional[str] = None


class Despesa(DespesaBase):
    id: int
    status: StatusDespesa
    data_pagamento: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DespesaList(BaseModel):
    items: List[Despesa]
    total: int
    skip: int
    limit: int
