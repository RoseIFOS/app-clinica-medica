#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados de teste
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User, UserRole
from app.models.paciente import Paciente
from app.models.consulta import Consulta, StatusConsulta
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import random

def create_test_data():
    """Criar dados de teste no banco"""
    db = SessionLocal()
    
    try:
        # Criar usuários de teste
        users_data = [
            {
                "email": "admin@clinica.com",
                "password": "admin",
                "nome": "Administrador",
                "role": UserRole.ADMIN
            },
            {
                "email": "medico@clinica.com", 
                "password": "medico",
                "nome": "Dr. João Silva",
                "role": UserRole.MEDICO,
                "crm": "123456",
                "especialidade": "Cardiologia"
            },
            {
                "email": "recepcao@clinica.com",
                "password": "recepcao", 
                "nome": "Maria Santos",
                "role": UserRole.RECEPCIONISTA
            }
        ]
        
        for user_data in users_data:
            # Verificar se usuário já existe
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                user = User(
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    nome=user_data["nome"],
                    role=user_data["role"],
                    crm=user_data.get("crm"),
                    especialidade=user_data.get("especialidade")
                )
                db.add(user)
                print(f"[OK] Usuario criado: {user_data['email']}")
            else:
                print(f"[INFO] Usuario ja existe: {user_data['email']}")
        
        # Criar médicos adicionais
        medicos_data = [
            {
                "email": "joao.silva@clinica.com",
                "password": "medico",
                "nome": "Dr. João Silva",
                "role": UserRole.MEDICO,
                "crm": "654321",
                "especialidade": "Cardiologia"
            },
            {
                "email": "maria.santos@clinica.com",
                "password": "medico", 
                "nome": "Dra. Maria Santos",
                "role": UserRole.MEDICO,
                "crm": "789012",
                "especialidade": "Dermatologia"
            },
            {
                "email": "pedro.costa@clinica.com",
                "password": "medico",
                "nome": "Dr. Pedro Costa", 
                "role": UserRole.MEDICO,
                "crm": "345678",
                "especialidade": "Ortopedia"
            }
        ]
        
        for medico_data in medicos_data:
            existing_medico = db.query(User).filter(User.email == medico_data["email"]).first()
            if not existing_medico:
                medico = User(
                    email=medico_data["email"],
                    hashed_password=get_password_hash(medico_data["password"]),
                    nome=medico_data["nome"],
                    role=medico_data["role"],
                    crm=medico_data["crm"],
                    especialidade=medico_data["especialidade"]
                )
                db.add(medico)
                print(f"[OK] Medico criado: {medico_data['nome']}")
            else:
                print(f"[INFO] Medico ja existe: {medico_data['nome']}")
        
        # Criar pacientes de teste
        pacientes_data = [
            {
                "nome": "Ana Silva",
                "cpf": "123.456.789-00",
                "telefone": "(11) 99999-4444",
                "email": "ana.silva@email.com",
                "data_nascimento": datetime(1990, 5, 15),
                "endereco": "Rua A, 123",
                "cidade": "São Paulo",
                "convenio": "Unimed"
            },
            {
                "nome": "Carlos Oliveira",
                "cpf": "987.654.321-00", 
                "telefone": "(11) 99999-5555",
                "email": "carlos.oliveira@email.com",
                "data_nascimento": datetime(1985, 8, 22),
                "endereco": "Rua B, 456",
                "cidade": "São Paulo", 
                "convenio": "Bradesco Saúde"
            },
            {
                "nome": "Mariana Costa",
                "cpf": "456.789.123-00",
                "telefone": "(11) 99999-6666", 
                "email": "mariana.costa@email.com",
                "data_nascimento": datetime(1992, 12, 10),
                "endereco": "Rua C, 789",
                "cidade": "São Paulo",
                "convenio": "SulAmérica"
            }
        ]
        
        for paciente_info in pacientes_data:
            existing_paciente = db.query(Paciente).filter(Paciente.cpf == paciente_info["cpf"]).first()
            if not existing_paciente:
                paciente = Paciente(**paciente_info)
                db.add(paciente)
                print(f"[OK] Paciente criado: {paciente_info['nome']}")
            else:
                print(f"[INFO] Paciente ja existe: {paciente_info['nome']}")
        
        db.commit()
        print("\n[SUCCESS] Dados de teste criados com sucesso!")
        
    except Exception as e:
        print(f"[ERROR] Erro ao criar dados de teste: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
