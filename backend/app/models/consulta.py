from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class TipoConsulta(str, enum.Enum):
    PRIMEIRA_CONSULTA = "primeira_consulta"
    RETORNO = "retorno"
    EXAME = "exame"


class StatusConsulta(str, enum.Enum):
    AGENDADA = "agendada"
    CONFIRMADA = "confirmada"
    REALIZADA = "realizada"
    CANCELADA = "cancelada"


class Consulta(Base):
    __tablename__ = "consultas"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    medico_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data_hora = Column(DateTime, nullable=False)
    duracao = Column(Integer, default=60)  # em minutos
    tipo = Column(Enum(TipoConsulta), default=TipoConsulta.PRIMEIRA_CONSULTA)
    status = Column(Enum(StatusConsulta), default=StatusConsulta.AGENDADA)
    observacoes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    paciente = relationship("Paciente", back_populates="consultas")
    medico = relationship("User", back_populates="consultas")
    prontuarios = relationship("Prontuario", back_populates="consulta")
    pagamentos = relationship("Pagamento", back_populates="consulta")
    lembretes = relationship("LembreteWhatsApp", back_populates="consulta")
