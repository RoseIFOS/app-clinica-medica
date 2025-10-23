from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Numeric, Date, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class CategoriaDespesa(str, enum.Enum):
    ALUGUEL = "aluguel"
    SALARIOS = "salarios"
    EQUIPAMENTOS = "equipamentos"
    MEDICAMENTOS = "medicamentos"
    LIMPEZA = "limpeza"
    ENERGIA = "energia"
    AGUA = "agua"
    TELEFONE = "telefone"
    INTERNET = "internet"
    MANUTENCAO = "manutencao"
    OUTROS = "outros"


class StatusDespesa(str, enum.Enum):
    PENDENTE = "pendente"
    PAGO = "pago"
    CANCELADO = "cancelado"


class Despesa(Base):
    __tablename__ = "despesas"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(255), nullable=False)
    categoria = Column(Enum(CategoriaDespesa), nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    data_vencimento = Column(Date, nullable=True)
    data_pagamento = Column(DateTime, nullable=True)
    status = Column(Enum(StatusDespesa), default=StatusDespesa.PENDENTE)
    observacoes = Column(Text, nullable=True)
    fornecedor = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
