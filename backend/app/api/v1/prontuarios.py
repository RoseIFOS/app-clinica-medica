from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Response
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.api.deps import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.paciente import Paciente
from app.models.consulta import Consulta
from app.models.prontuario import Prontuario
from app.schemas.prontuario import (
    ProntuarioCreate, ProntuarioUpdate, Prontuario as ProntuarioSchema,
    ProntuarioList, ProntuarioResumo, ProntuarioCompleto, ProntuarioPDF, ProntuarioTemplate
)

router = APIRouter()

@router.get("/", response_model=ProntuarioList)
def list_prontuarios(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros para retornar"),
    paciente_id: Optional[int] = Query(None, description="Filtrar por paciente"),
    medico_id: Optional[int] = Query(None, description="Filtrar por médico"),
    data_inicio: Optional[str] = Query(None, description="Data de início (YYYY-MM-DD)"),
    data_fim: Optional[str] = Query(None, description="Data de fim (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar prontuários com filtros e paginação"""
    query = db.query(Prontuario)
    
    # Filtros
    if paciente_id:
        query = query.filter(Prontuario.paciente_id == paciente_id)
    
    if medico_id:
        query = query.filter(Prontuario.medico_id == medico_id)
    
    if data_inicio:
        from datetime import datetime
        data_inicio_dt = datetime.strptime(data_inicio, "%Y-%m-%d")
        query = query.filter(Prontuario.data >= data_inicio_dt)
    
    if data_fim:
        from datetime import datetime
        data_fim_dt = datetime.strptime(data_fim, "%Y-%m-%d")
        query = query.filter(Prontuario.data <= data_fim_dt)
    
    # Ordenar por data (mais recente primeiro)
    query = query.order_by(Prontuario.data.desc())
    
    total = query.count()
    prontuarios = query.offset(skip).limit(limit).all()
    
    return ProntuarioList(
        items=prontuarios,
        total=total,
        skip=skip,
        limit=limit
    )

@router.get("/paciente/{paciente_id}", response_model=List[ProntuarioResumo])
def list_prontuarios_paciente(
    paciente_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar prontuários de um paciente específico"""
    # Verificar se paciente existe
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    prontuarios = db.query(Prontuario).filter(
        Prontuario.paciente_id == paciente_id
    ).order_by(Prontuario.data.desc()).all()
    
    prontuarios_resumo = []
    for prontuario in prontuarios:
        prontuarios_resumo.append(ProntuarioResumo(
            id=prontuario.id,
            data=prontuario.data,
            medico_nome=prontuario.medico.nome,
            diagnostico=prontuario.diagnostico,
            consulta_id=prontuario.consulta_id
        ))
    
    return prontuarios_resumo

@router.post("/", response_model=ProntuarioSchema, status_code=status.HTTP_201_CREATED)
def create_prontuario(
    prontuario: ProntuarioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Criar novo prontuário"""
    # Verificar se paciente existe
    paciente = db.query(Paciente).filter(Paciente.id == prontuario.paciente_id).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    # Verificar se médico existe
    medico = db.query(User).filter(
        User.id == prontuario.medico_id,
        User.role == UserRole.MEDICO
    ).first()
    if not medico:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    # Verificar se consulta existe (se fornecida)
    if prontuario.consulta_id:
        consulta = db.query(Consulta).filter(Consulta.id == prontuario.consulta_id).first()
        if not consulta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consulta não encontrada"
            )
    
    # Criar prontuário
    db_prontuario = Prontuario(**prontuario.dict())
    db.add(db_prontuario)
    db.commit()
    db.refresh(db_prontuario)
    
    return db_prontuario

@router.get("/{prontuario_id}", response_model=ProntuarioCompleto)
def get_prontuario(
    prontuario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um prontuário"""
    prontuario = db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado"
        )
    
    # Buscar dados da consulta se existir
    consulta_data = None
    if prontuario.consulta_id:
        consulta = db.query(Consulta).filter(Consulta.id == prontuario.consulta_id).first()
        if consulta:
            consulta_data = consulta.data_hora
    
    return ProntuarioCompleto(
        id=prontuario.id,
        paciente_id=prontuario.paciente_id,
        consulta_id=prontuario.consulta_id,
        medico_id=prontuario.medico_id,
        data=prontuario.data,
        anamnese=prontuario.anamnese,
        diagnostico=prontuario.diagnostico,
        prescricao=prontuario.prescricao,
        exames_solicitados=prontuario.exames_solicitados,
        observacoes=prontuario.observacoes,
        created_at=prontuario.created_at,
        updated_at=prontuario.updated_at,
        paciente_nome=prontuario.paciente.nome,
        medico_nome=prontuario.medico.nome,
        consulta_data=consulta_data
    )

@router.put("/{prontuario_id}", response_model=ProntuarioSchema)
def update_prontuario(
    prontuario_id: int,
    prontuario_update: ProntuarioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar prontuário"""
    prontuario = db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado"
        )
    
    # Atualizar campos
    update_data = prontuario_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prontuario, field, value)
    
    db.commit()
    db.refresh(prontuario)
    
    return prontuario

@router.delete("/{prontuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prontuario(
    prontuario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Excluir prontuário"""
    prontuario = db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado"
        )
    
    db.delete(prontuario)
    db.commit()
    
    return None

@router.get("/{prontuario_id}/html", response_class=HTMLResponse)
def get_prontuario_html(
    prontuario_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter prontuário em formato HTML para visualização"""
    prontuario = db.query(Prontuario).filter(Prontuario.id == prontuario_id).first()
    if not prontuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prontuário não encontrado"
        )
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prontuário - {prontuario.paciente.nome}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            .header {{ border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }}
            .section {{ margin-bottom: 20px; }}
            .section h3 {{ color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }}
            .section p {{ margin: 10px 0; line-height: 1.6; }}
            .footer {{ margin-top: 30px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Prontuário Médico</h1>
            <p><strong>Paciente:</strong> {prontuario.paciente.nome}</p>
            <p><strong>Médico:</strong> Dr(a). {prontuario.medico.nome}</p>
            <p><strong>Data:</strong> {prontuario.data.strftime('%d/%m/%Y %H:%M')}</p>
        </div>
        
        <div class="section">
            <h3>Anamnese</h3>
            <p>{prontuario.anamnese}</p>
        </div>
        
        <div class="section">
            <h3>Diagnóstico</h3>
            <p>{prontuario.diagnostico}</p>
        </div>
        
        {f'<div class="section"><h3>Prescrição</h3><p>{prontuario.prescricao}</p></div>' if prontuario.prescricao else ''}
        
        {f'<div class="section"><h3>Exames Solicitados</h3><p>{prontuario.exames_solicitados}</p></div>' if prontuario.exames_solicitados else ''}
        
        {f'<div class="section"><h3>Observações</h3><p>{prontuario.observacoes}</p></div>' if prontuario.observacoes else ''}
        
        <div class="footer">
            <p>Prontuário gerado em {prontuario.created_at.strftime('%d/%m/%Y %H:%M')}</p>
        </div>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content)

@router.get("/templates/default", response_model=ProntuarioTemplate)
def get_prontuario_template(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter template padrão para prontuários"""
    return ProntuarioTemplate(
        anamnese_template="""Queixa Principal:
História da Doença Atual:
Antecedentes Pessoais:
Antecedentes Familiares:
Medicamentos em Uso:
Alergias:
Exame Físico:""",
        diagnostico_template="""Diagnóstico Principal:
Diagnósticos Secundários:
CID-10:""",
        prescricao_template="""Medicamentos:
- 
- 
- 

Orientações:
- 
- 
- """,
        observacoes_template="""Observações Gerais:
Retorno em: ___ dias
Próxima consulta: __/__/____"""
    )

