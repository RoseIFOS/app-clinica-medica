#!/usr/bin/env python3
"""
Script para criar usuário admin
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User, UserRole
import hashlib

def create_admin():
    """Criar usuário admin"""
    db = SessionLocal()
    
    try:
        # Verificar se admin já existe
        existing_admin = db.query(User).filter(User.email == "admin@clinica.com").first()
        if existing_admin:
            print("[INFO] Admin ja existe, atualizando senha...")
            existing_admin.hashed_password = hashlib.sha256("admin".encode()).hexdigest()
            db.commit()
            print("[OK] Senha do admin atualizada")
        else:
            admin = User(
                email="admin@clinica.com",
                hashed_password=hashlib.sha256("admin".encode()).hexdigest(),
                nome="Administrador",
                role=UserRole.ADMIN
            )
            db.add(admin)
            db.commit()
            print("[OK] Admin criado com sucesso")
        
    except Exception as e:
        print(f"[ERROR] Erro ao criar admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
