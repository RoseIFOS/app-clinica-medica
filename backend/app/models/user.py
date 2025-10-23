from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MEDICO = "medico"
    RECEPCIONISTA = "recepcionista"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    nome = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.RECEPCIONISTA)
    crm = Column(String, unique=True, nullable=True)  # Apenas para médicos
    especialidade = Column(String, nullable=True)  # Apenas para médicos
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    consultas = relationship("Consulta", back_populates="medico")
    prontuarios = relationship("Prontuario", back_populates="medico")
