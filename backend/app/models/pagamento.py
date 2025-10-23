from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Numeric, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class MetodoPagamento(str, enum.Enum):
    DINHEIRO = "dinheiro"
    CARTAO_CREDITO = "cartao_credito"
    CARTAO_DEBITO = "cartao_debito"
    PIX = "pix"
    TRANSFERENCIA = "transferencia"
    CONVENIO = "convenio"


class StatusPagamento(str, enum.Enum):
    PENDENTE = "pendente"
    PAGO = "pago"
    CANCELADO = "cancelado"


class Pagamento(Base):
    __tablename__ = "pagamentos"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    consulta_id = Column(Integer, ForeignKey("consultas.id"), nullable=True)
    valor = Column(Numeric(10, 2), nullable=False)
    metodo_pagamento = Column(Enum(MetodoPagamento), nullable=False)
    status = Column(Enum(StatusPagamento), default=StatusPagamento.PENDENTE)
    data_vencimento = Column(Date, nullable=True)
    data_pagamento = Column(DateTime, nullable=True)
    observacoes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    paciente = relationship("Paciente", back_populates="pagamentos")
    medico = relationship("User", foreign_keys=[medico_id])
    consulta = relationship("Consulta", back_populates="pagamentos")
