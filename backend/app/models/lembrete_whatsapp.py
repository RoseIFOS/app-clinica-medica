from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class StatusLembrete(str, enum.Enum):
    PENDENTE = "pendente"
    ENVIADO = "enviado"
    FALHOU = "falhou"
    CANCELADO = "cancelado"


class LembreteWhatsApp(Base):
    __tablename__ = "lembretes_whatsapp"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    consulta_id = Column(Integer, ForeignKey("consultas.id"), nullable=False)
    mensagem = Column(Text, nullable=False)
    data_envio_programada = Column(DateTime, nullable=False)
    data_enviado = Column(DateTime, nullable=True)
    status = Column(Enum(StatusLembrete), default=StatusLembrete.PENDENTE)
    tentativas = Column(Integer, default=0)
    erro = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    paciente = relationship("Paciente", back_populates="lembretes")
    consulta = relationship("Consulta", back_populates="lembretes")
