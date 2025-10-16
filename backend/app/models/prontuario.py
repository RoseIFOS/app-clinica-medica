from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Prontuario(Base):
    __tablename__ = "prontuarios"

    id = Column(Integer, primary_key=True, index=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    consulta_id = Column(Integer, ForeignKey("consultas.id"), nullable=True)
    medico_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    data = Column(DateTime, nullable=False)
    anamnese = Column(Text, nullable=True)
    diagnostico = Column(Text, nullable=True)
    prescricao = Column(Text, nullable=True)
    exames_solicitados = Column(Text, nullable=True)
    observacoes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    paciente = relationship("Paciente", back_populates="prontuarios")
    consulta = relationship("Consulta", back_populates="prontuarios")
    medico = relationship("User", back_populates="prontuarios")
