from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.paciente import Paciente
from app.schemas.paciente import PacienteCreate, PacienteUpdate, Paciente as PacienteSchema, PacienteList

router = APIRouter()

@router.get("/", response_model=PacienteList)
def list_pacientes(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros para retornar"),
    search: Optional[str] = Query(None, description="Termo de busca (nome, CPF, telefone)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar pacientes com paginação e busca"""
    query = db.query(Paciente).filter(Paciente.is_active == True)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Paciente.nome.ilike(search_term),
                Paciente.cpf.ilike(search_term),
                Paciente.telefone.ilike(search_term),
                Paciente.email.ilike(search_term)
            )
        )
    
    total = query.count()
    pacientes = query.offset(skip).limit(limit).all()
    
    return PacienteList(
        items=pacientes,
        total=total,
        skip=skip,
        limit=limit
    )

@router.post("/", response_model=PacienteSchema, status_code=status.HTTP_201_CREATED)
def create_paciente(
    paciente: PacienteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo paciente"""
    # Verificar se CPF já existe
    existing_paciente = db.query(Paciente).filter(Paciente.cpf == paciente.cpf).first()
    if existing_paciente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CPF já cadastrado"
        )
    
    # Verificar se email já existe
    if paciente.email:
        existing_email = db.query(Paciente).filter(Paciente.email == paciente.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
    
    paciente_data = paciente.dict()
    paciente_data['is_active'] = True
    db_paciente = Paciente(**paciente_data)
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    
    return db_paciente

@router.get("/{paciente_id}", response_model=PacienteSchema)
def get_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um paciente"""
    paciente = db.query(Paciente).filter(
        Paciente.id == paciente_id,
        Paciente.is_active == True
    ).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    return paciente

@router.put("/{paciente_id}", response_model=PacienteSchema)
def update_paciente(
    paciente_id: int,
    paciente_update: PacienteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar dados de um paciente"""
    paciente = db.query(Paciente).filter(
        Paciente.id == paciente_id,
        Paciente.is_active == True
    ).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    # Verificar se CPF já existe (se foi alterado)
    if paciente_update.cpf and paciente_update.cpf != paciente.cpf:
        existing_paciente = db.query(Paciente).filter(
            Paciente.cpf == paciente_update.cpf,
            Paciente.id != paciente_id
        ).first()
        if existing_paciente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CPF já cadastrado"
            )
    
    # Verificar se email já existe (se foi alterado)
    if paciente_update.email and paciente_update.email != paciente.email:
        existing_email = db.query(Paciente).filter(
            Paciente.email == paciente_update.email,
            Paciente.id != paciente_id
        ).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
    
    # Atualizar apenas os campos fornecidos
    update_data = paciente_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(paciente, field, value)
    
    db.commit()
    db.refresh(paciente)
    
    return paciente

@router.delete("/{paciente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Desativar um paciente (soft delete)"""
    paciente = db.query(Paciente).filter(
        Paciente.id == paciente_id,
        Paciente.is_active == True
    ).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    # Soft delete - apenas marcar como inativo
    paciente.is_active = False
    db.commit()
    
    return None

@router.get("/{paciente_id}/historico")
def get_paciente_historico(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter histórico completo do paciente"""
    paciente = db.query(Paciente).filter(
        Paciente.id == paciente_id,
        Paciente.is_active == True
    ).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    # Aqui você pode adicionar consultas, prontuários, pagamentos, etc.
    # Por enquanto, retornamos apenas os dados básicos
    return {
        "paciente": paciente,
        "consultas": [],  # TODO: Implementar consultas
        "prontuarios": [],  # TODO: Implementar prontuários
        "pagamentos": []  # TODO: Implementar pagamentos
    }
