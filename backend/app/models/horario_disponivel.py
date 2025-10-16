from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Time
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class DiaSemana(str, enum.Enum):
    SEGUNDA = "segunda"
    TERCA = "terca"
    QUARTA = "quarta"
    QUINTA = "quinta"
    SEXTA = "sexta"
    SABADO = "sabado"
    DOMINGO = "domingo"


class HorarioDisponivel(Base):
    __tablename__ = "horarios_disponiveis"

    id = Column(Integer, primary_key=True, index=True)
    medico_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dia_semana = Column(String, nullable=False)  # Usando string para flexibilidade
    hora_inicio = Column(Time, nullable=False)
    hora_fim = Column(Time, nullable=False)
    ativo = Column(Boolean, default=True)

    # Relacionamentos
    medico = relationship("User")
