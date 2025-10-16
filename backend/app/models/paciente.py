from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    cpf = Column(String, unique=True, index=True, nullable=False)
    data_nascimento = Column(Date, nullable=False)
    telefone = Column(String, nullable=True)
    whatsapp = Column(String, nullable=True)
    email = Column(String, nullable=True)
    endereco = Column(String, nullable=True)
    cidade = Column(String, nullable=True)
    estado = Column(String, nullable=True)
    cep = Column(String, nullable=True)
    convenio = Column(String, nullable=True)
    numero_carteirinha = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    consultas = relationship("Consulta", back_populates="paciente")
    prontuarios = relationship("Prontuario", back_populates="paciente")
    pagamentos = relationship("Pagamento", back_populates="paciente")
    lembretes = relationship("LembreteWhatsApp", back_populates="paciente")
