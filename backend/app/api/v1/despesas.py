from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.despesa import Despesa, CategoriaDespesa, StatusDespesa
from app.schemas.despesa import (
    DespesaCreate, DespesaUpdate, Despesa as DespesaSchema,
    DespesaList
)

router = APIRouter()


@router.get("/", response_model=DespesaList)
def list_despesas(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros para retornar"),
    categoria: Optional[CategoriaDespesa] = Query(None, description="Filtrar por categoria"),
    status: Optional[StatusDespesa] = Query(None, description="Filtrar por status"),
    data_inicio: Optional[date] = Query(None, description="Data de início"),
    data_fim: Optional[date] = Query(None, description="Data de fim"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar despesas com filtros e paginação"""
    query = db.query(Despesa)
    
    # Filtros
    if categoria:
        query = query.filter(Despesa.categoria == categoria)
    
    if status:
        query = query.filter(Despesa.status == status)
    
    if data_inicio:
        query = query.filter(Despesa.data_vencimento >= data_inicio)
    
    if data_fim:
        query = query.filter(Despesa.data_vencimento <= data_fim)
    
    # Ordenar por data de criação (mais recente primeiro)
    query = query.order_by(desc(Despesa.created_at))
    
    total = query.count()
    despesas = query.offset(skip).limit(limit).all()
    
    return DespesaList(
        items=despesas,
        total=total,
        skip=skip,
        limit=limit
    )


@router.post("/", response_model=DespesaSchema, status_code=status.HTTP_201_CREATED)
def create_despesa(
    despesa: DespesaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Registrar nova despesa"""
    db_despesa = Despesa(**despesa.dict())
    db.add(db_despesa)
    db.commit()
    db.refresh(db_despesa)
    
    return db_despesa


@router.get("/{despesa_id}", response_model=DespesaSchema)
def get_despesa(
    despesa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de uma despesa"""
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada"
        )
    
    return despesa


@router.put("/{despesa_id}", response_model=DespesaSchema)
def update_despesa(
    despesa_id: int,
    despesa_update: DespesaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar despesa"""
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada"
        )
    
    # Atualizar apenas campos fornecidos
    update_data = despesa_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(despesa, field, value)
    
    db.commit()
    db.refresh(despesa)
    
    return despesa


@router.delete("/{despesa_id}")
def delete_despesa(
    despesa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Excluir despesa"""
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada"
        )
    
    db.delete(despesa)
    db.commit()
    
    return {"message": "Despesa excluída com sucesso"}


@router.patch("/{despesa_id}/status", response_model=DespesaSchema)
def update_despesa_status(
    despesa_id: int,
    status: StatusDespesa,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar status da despesa"""
    despesa = db.query(Despesa).filter(Despesa.id == despesa_id).first()
    if not despesa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada"
        )
    
    despesa.status = status
    if status == StatusDespesa.PAGO:
        despesa.data_pagamento = datetime.now()
    
    db.commit()
    db.refresh(despesa)
    
    return despesa
