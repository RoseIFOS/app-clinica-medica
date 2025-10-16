from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.lembrete_whatsapp import LembreteWhatsApp, StatusLembrete
from pydantic import BaseModel

router = APIRouter()


# Schemas
class LembreteResponse(BaseModel):
    id: int
    paciente_id: int
    consulta_id: int
    mensagem: str
    data_envio_programada: datetime
    data_enviado: Optional[datetime]
    status: StatusLembrete
    tentativas: int
    
    class Config:
        from_attributes = True


class LembreteList(BaseModel):
    items: List[LembreteResponse]
    total: int
    skip: int
    limit: int


# Endpoints

@router.get("/", response_model=LembreteList)
def listar_lembretes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Listar todos os lembretes
    """
    query = db.query(LembreteWhatsApp)
    
    # Filtrar por status se fornecido
    if status:
        try:
            status_enum = StatusLembrete(status)
            query = query.filter(LembreteWhatsApp.status == status_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail="Status inválido")
    
    # Ordenar por data de envio programada (mais recentes primeiro)
    query = query.order_by(LembreteWhatsApp.data_envio_programada.desc())
    
    total = query.count()
    lembretes = query.offset(skip).limit(limit).all()
    
    return {
        "items": lembretes,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.get("/{lembrete_id}", response_model=LembreteResponse)
def obter_lembrete(
    lembrete_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Obter detalhes de um lembrete específico
    """
    lembrete = db.query(LembreteWhatsApp).filter(
        LembreteWhatsApp.id == lembrete_id
    ).first()
    
    if not lembrete:
        raise HTTPException(status_code=404, detail="Lembrete não encontrado")
    
    return lembrete


@router.post("/enviar/{consulta_id}")
def enviar_lembrete_manual(
    consulta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enviar lembrete manualmente para uma consulta específica
    """
    from app.models.consulta import Consulta
    
    # Verificar se a consulta existe
    consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
    if not consulta:
        raise HTTPException(status_code=404, detail="Consulta não encontrada")
    
    # Verificar se paciente tem WhatsApp
    if not consulta.paciente.whatsapp:
        raise HTTPException(
            status_code=400, 
            detail="Paciente não possui WhatsApp cadastrado"
        )
    
    # Verificar se já existe lembrete enviado recentemente (últimas 24h)
    from datetime import timedelta
    lembrete_recente = db.query(LembreteWhatsApp).filter(
        LembreteWhatsApp.consulta_id == consulta_id,
        LembreteWhatsApp.status.in_([StatusLembrete.ENVIADO, StatusLembrete.PENDENTE]),
        LembreteWhatsApp.data_envio_programada >= datetime.now() - timedelta(hours=24)
    ).first()
    
    if lembrete_recente:
        raise HTTPException(
            status_code=400,
            detail="Já existe um lembrete enviado recentemente para esta consulta"
        )
    
    # O serviço WhatsApp irá processar isso
    # Por enquanto, apenas retornamos sucesso
    # O processamento real será feito pelo worker do WhatsApp Service
    
    return {
        "message": "Lembrete será enviado em breve",
        "consulta_id": consulta_id,
        "paciente": consulta.paciente.nome,
        "whatsapp": consulta.paciente.whatsapp
    }


@router.post("/{lembrete_id}/reenviar")
def reenviar_lembrete(
    lembrete_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Reenviar um lembrete que falhou
    """
    lembrete = db.query(LembreteWhatsApp).filter(
        LembreteWhatsApp.id == lembrete_id
    ).first()
    
    if not lembrete:
        raise HTTPException(status_code=404, detail="Lembrete não encontrado")
    
    # Apenas lembretes com status 'falhou' podem ser reenviados
    if lembrete.status != StatusLembrete.FALHOU:
        raise HTTPException(
            status_code=400,
            detail=f"Apenas lembretes com status 'falhou' podem ser reenviados. Status atual: {lembrete.status}"
        )
    
    # Atualizar status para pendente
    lembrete.status = StatusLembrete.PENDENTE
    lembrete.tentativas += 1
    db.commit()
    
    return {
        "message": "Lembrete será reenviado em breve",
        "lembrete_id": lembrete_id,
        "tentativas": lembrete.tentativas
    }


@router.get("/consulta/{consulta_id}", response_model=List[LembreteResponse])
def listar_lembretes_consulta(
    consulta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Listar todos os lembretes de uma consulta específica
    """
    lembretes = db.query(LembreteWhatsApp).filter(
        LembreteWhatsApp.consulta_id == consulta_id
    ).order_by(LembreteWhatsApp.data_envio_programada.desc()).all()
    
    return lembretes


@router.get("/paciente/{paciente_id}", response_model=List[LembreteResponse])
def listar_lembretes_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Listar todos os lembretes de um paciente específico
    """
    lembretes = db.query(LembreteWhatsApp).filter(
        LembreteWhatsApp.paciente_id == paciente_id
    ).order_by(LembreteWhatsApp.data_envio_programada.desc()).all()
    
    return lembretes


@router.delete("/{lembrete_id}")
def cancelar_lembrete(
    lembrete_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cancelar um lembrete pendente
    """
    lembrete = db.query(LembreteWhatsApp).filter(
        LembreteWhatsApp.id == lembrete_id
    ).first()
    
    if not lembrete:
        raise HTTPException(status_code=404, detail="Lembrete não encontrado")
    
    # Apenas lembretes pendentes podem ser cancelados
    if lembrete.status != StatusLembrete.PENDENTE:
        raise HTTPException(
            status_code=400,
            detail="Apenas lembretes pendentes podem ser cancelados"
        )
    
    lembrete.status = StatusLembrete.CANCELADO
    db.commit()
    
    return {"message": "Lembrete cancelado com sucesso"}

