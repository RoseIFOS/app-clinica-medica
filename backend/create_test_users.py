#!/usr/bin/env python3
"""
Script para criar usuários de teste
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def create_test_users():
    """Criar usuários de teste"""
    db = SessionLocal()
    
    try:
        # Usuários de teste
        users_data = [
            {
                "email": "admin@clinica.com",
                "password": "admin123",
                "nome": "Administrador",
                "role": UserRole.ADMIN
            },
            {
                "email": "medico@clinica.com",
                "password": "medico123",
                "nome": "Dr. João Silva",
                "role": UserRole.MEDICO,
                "crm": "123456",
                "especialidade": "Cardiologia"
            },
            {
                "email": "recepcao@clinica.com",
                "password": "recepcao123",
                "nome": "Maria Santos",
                "role": UserRole.RECEPCIONISTA
            }
        ]
        
        for user_data in users_data:
            # Verificar se usuário já existe
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if existing_user:
                print(f"[INFO] Usuario ja existe: {user_data['email']}")
                # Atualizar senha
                existing_user.hashed_password = get_password_hash(user_data["password"])
                db.commit()
                print(f"[OK] Senha atualizada: {user_data['email']}")
            else:
                user = User(
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    nome=user_data["nome"],
                    role=user_data["role"],
                    crm=user_data.get("crm"),
                    especialidade=user_data.get("especialidade"),
                    is_active=True
                )
                db.add(user)
                print(f"[OK] Usuario criado: {user_data['email']}")
        
        db.commit()
        print("\n[SUCCESS] Usuarios de teste criados/atualizados com sucesso!")
        
    except Exception as e:
        print(f"[ERROR] Erro ao criar usuarios: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()
