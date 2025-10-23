from typing import List, Optional
from datetime import datetime, date, timedelta
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.paciente import Paciente
from app.models.consulta import Consulta
from app.models.pagamento import Pagamento, MetodoPagamento, StatusPagamento
from app.schemas.pagamento import (
    PagamentoCreate, PagamentoUpdate, Pagamento as PagamentoSchema,
    PagamentoList, PagamentoResumo, PagamentoListResumo,
    RelatorioFinanceiro, Inadimplencia, InadimplenciaList, GraficoFinanceiro
)

router = APIRouter()

@router.get("/pagamentos", response_model=PagamentoListResumo)
def list_pagamentos(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros para retornar"),
    paciente_id: Optional[int] = Query(None, description="Filtrar por paciente"),
    status: Optional[StatusPagamento] = Query(None, description="Filtrar por status"),
    metodo_pagamento: Optional[MetodoPagamento] = Query(None, description="Filtrar por método"),
    data_inicio: Optional[date] = Query(None, description="Data de início"),
    data_fim: Optional[date] = Query(None, description="Data de fim"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar pagamentos com filtros e paginação"""
    query = db.query(Pagamento)
    
    # Filtros
    if paciente_id:
        query = query.filter(Pagamento.paciente_id == paciente_id)
    
    if status:
        query = query.filter(Pagamento.status == status)
    
    if metodo_pagamento:
        query = query.filter(Pagamento.metodo_pagamento == metodo_pagamento)
    
    if data_inicio:
        query = query.filter(Pagamento.created_at >= datetime.combine(data_inicio, datetime.min.time()))
    
    if data_fim:
        query = query.filter(Pagamento.created_at <= datetime.combine(data_fim, datetime.max.time()))
    
    # Ordenar por data de criação (mais recente primeiro)
    query = query.order_by(desc(Pagamento.created_at))
    
    total = query.count()
    pagamentos = query.offset(skip).limit(limit).all()
    
    # Converter para resumo
    pagamentos_resumo = []
    for pagamento in pagamentos:
        consulta_data = None
        if pagamento.consulta_id:
            consulta = db.query(Consulta).filter(Consulta.id == pagamento.consulta_id).first()
            if consulta:
                consulta_data = consulta.data_hora
        
        medico_nome = None
        if pagamento.medico:
            medico_nome = pagamento.medico.nome
        else:
            print(f"⚠️ Pagamento {pagamento.id} não tem médico associado (medico_id: {pagamento.medico_id})")
        
        pagamentos_resumo.append(PagamentoResumo(
            id=pagamento.id,
            paciente_id=pagamento.paciente_id,
            medico_id=pagamento.medico_id,
            valor=pagamento.valor,
            status=pagamento.status,
            metodo_pagamento=pagamento.metodo_pagamento,
            data_vencimento=pagamento.data_vencimento,
            data_pagamento=pagamento.data_pagamento,
            paciente_nome=pagamento.paciente.nome,
            medico_nome=medico_nome,
            consulta_data=consulta_data
        ))
    
    return PagamentoListResumo(
        items=pagamentos_resumo,
        total=total,
        skip=skip,
        limit=limit
    )

@router.post("/pagamentos", response_model=PagamentoSchema, status_code=status.HTTP_201_CREATED)
def create_pagamento(
    pagamento: PagamentoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Registrar novo pagamento"""
    # Verificar se paciente existe
    paciente = db.query(Paciente).filter(Paciente.id == pagamento.paciente_id).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    # Verificar se consulta existe (se fornecida)
    if pagamento.consulta_id:
        consulta = db.query(Consulta).filter(Consulta.id == pagamento.consulta_id).first()
        if not consulta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consulta não encontrada"
            )
    
    # Criar pagamento
    db_pagamento = Pagamento(**pagamento.dict())
    db.add(db_pagamento)
    db.commit()
    db.refresh(db_pagamento)
    
    return db_pagamento

@router.get("/pagamentos/{pagamento_id}", response_model=PagamentoSchema)
def get_pagamento(
    pagamento_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de um pagamento"""
    pagamento = db.query(Pagamento).filter(Pagamento.id == pagamento_id).first()
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    return pagamento

@router.put("/pagamentos/{pagamento_id}", response_model=PagamentoSchema)
def update_pagamento(
    pagamento_id: int,
    pagamento_update: PagamentoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar pagamento"""
    pagamento = db.query(Pagamento).filter(Pagamento.id == pagamento_id).first()
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    # Se mudou para pago, definir data de pagamento
    if pagamento_update.status == StatusPagamento.PAGO and not pagamento.data_pagamento:
        pagamento_update.data_pagamento = datetime.now()
    
    # Atualizar campos
    update_data = pagamento_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(pagamento, field, value)
    
    db.commit()
    db.refresh(pagamento)
    
    return pagamento

@router.delete("/pagamentos/{pagamento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pagamento(
    pagamento_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Excluir pagamento"""
    pagamento = db.query(Pagamento).filter(Pagamento.id == pagamento_id).first()
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    db.delete(pagamento)
    db.commit()
    
    return None

@router.post("/pagamentos/{pagamento_id}/pagar", response_model=PagamentoSchema)
def marcar_como_pago(
    pagamento_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Marcar pagamento como pago"""
    pagamento = db.query(Pagamento).filter(Pagamento.id == pagamento_id).first()
    if not pagamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado"
        )
    
    pagamento.status = StatusPagamento.PAGO
    pagamento.data_pagamento = datetime.now()
    
    db.commit()
    db.refresh(pagamento)
    
    return pagamento

@router.get("/relatorio", response_model=RelatorioFinanceiro)
def get_relatorio_financeiro(
    data_inicio: date = Query(..., description="Data de início do relatório"),
    data_fim: date = Query(..., description="Data de fim do relatório"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter relatório financeiro do período"""
    inicio_dt = datetime.combine(data_inicio, datetime.min.time())
    fim_dt = datetime.combine(data_fim, datetime.max.time())
    
    # Totais por status
    total_recebido = db.query(func.sum(Pagamento.valor)).filter(
        and_(
            Pagamento.created_at >= inicio_dt,
            Pagamento.created_at <= fim_dt,
            Pagamento.status == StatusPagamento.PAGO
        )
    ).scalar() or Decimal('0')
    
    total_pendente = db.query(func.sum(Pagamento.valor)).filter(
        and_(
            Pagamento.created_at >= inicio_dt,
            Pagamento.created_at <= fim_dt,
            Pagamento.status == StatusPagamento.PENDENTE
        )
    ).scalar() or Decimal('0')
    
    total_cancelado = db.query(func.sum(Pagamento.valor)).filter(
        and_(
            Pagamento.created_at >= inicio_dt,
            Pagamento.created_at <= fim_dt,
            Pagamento.status == StatusPagamento.CANCELADO
        )
    ).scalar() or Decimal('0')
    
    total_geral = total_recebido + total_pendente + total_cancelado
    
    # Quantidade de pagamentos
    quantidade_pagamentos = db.query(Pagamento).filter(
        and_(
            Pagamento.created_at >= inicio_dt,
            Pagamento.created_at <= fim_dt
        )
    ).count()
    
    # Pagamentos por método
    pagamentos_por_metodo = {}
    for metodo in MetodoPagamento:
        total_metodo = db.query(func.sum(Pagamento.valor)).filter(
            and_(
                Pagamento.created_at >= inicio_dt,
                Pagamento.created_at <= fim_dt,
                Pagamento.metodo_pagamento == metodo
            )
        ).scalar() or Decimal('0')
        pagamentos_por_metodo[metodo.value] = float(total_metodo)
    
    # Pagamentos por status
    pagamentos_por_status = {}
    for status_pag in StatusPagamento:
        total_status = db.query(func.sum(Pagamento.valor)).filter(
            and_(
                Pagamento.created_at >= inicio_dt,
                Pagamento.created_at <= fim_dt,
                Pagamento.status == status_pag
            )
        ).scalar() or Decimal('0')
        pagamentos_por_status[status_pag.value] = float(total_status)
    
    return RelatorioFinanceiro(
        periodo_inicio=data_inicio,
        periodo_fim=data_fim,
        total_recebido=total_recebido,
        total_pendente=total_pendente,
        total_cancelado=total_cancelado,
        total_geral=total_geral,
        quantidade_pagamentos=quantidade_pagamentos,
        pagamentos_por_metodo=pagamentos_por_metodo,
        pagamentos_por_status=pagamentos_por_status
    )

@router.get("/inadimplencia", response_model=InadimplenciaList)
def get_inadimplencia(
    dias_atraso_minimo: int = Query(1, ge=0, description="Dias mínimos de atraso"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter lista de inadimplência"""
    data_limite = date.today() - timedelta(days=dias_atraso_minimo)
    
    # Buscar pagamentos pendentes vencidos
    pagamentos_pendentes = db.query(Pagamento).filter(
        and_(
            Pagamento.status == StatusPagamento.PENDENTE,
            Pagamento.data_vencimento < data_limite
        )
    ).all()
    
    # Agrupar por paciente
    inadimplencia_por_paciente = {}
    for pagamento in pagamentos_pendentes:
        paciente_id = pagamento.paciente_id
        if paciente_id not in inadimplencia_por_paciente:
            inadimplencia_por_paciente[paciente_id] = {
                'paciente': pagamento.paciente,
                'total_devendo': Decimal('0'),
                'quantidade_pendente': 0,
                'ultimo_vencimento': pagamento.data_vencimento
            }
        
        inadimplencia_por_paciente[paciente_id]['total_devendo'] += pagamento.valor
        inadimplencia_por_paciente[paciente_id]['quantidade_pendente'] += 1
        if pagamento.data_vencimento > inadimplencia_por_paciente[paciente_id]['ultimo_vencimento']:
            inadimplencia_por_paciente[paciente_id]['ultimo_vencimento'] = pagamento.data_vencimento
    
    # Converter para lista
    inadimplencia_list = []
    total_devendo = Decimal('0')
    
    for paciente_id, dados in inadimplencia_por_paciente.items():
        dias_atraso = (date.today() - dados['ultimo_vencimento']).days
        
        inadimplencia_list.append(Inadimplencia(
            paciente_id=paciente_id,
            paciente_nome=dados['paciente'].nome,
            total_devendo=dados['total_devendo'],
            quantidade_pendente=dados['quantidade_pendente'],
            ultimo_vencimento=dados['ultimo_vencimento'],
            dias_atraso=dias_atraso
        ))
        
        total_devendo += dados['total_devendo']
    
    # Ordenar por total devendo (maior primeiro)
    inadimplencia_list.sort(key=lambda x: x.total_devendo, reverse=True)
    
    return InadimplenciaList(
        items=inadimplencia_list,
        total=total_devendo,
        quantidade_pacientes=len(inadimplencia_list)
    )

@router.get("/grafico", response_model=List[GraficoFinanceiro])
def get_grafico_financeiro(
    dias: int = Query(30, ge=7, le=365, description="Número de dias para o gráfico"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter dados para gráfico financeiro"""
    data_inicio = date.today() - timedelta(days=dias)
    grafico_data = []
    
    for i in range(dias):
        data_grafico = data_inicio + timedelta(days=i)
        inicio_dia = datetime.combine(data_grafico, datetime.min.time())
        fim_dia = datetime.combine(data_grafico, datetime.max.time())
        
        recebido = db.query(func.sum(Pagamento.valor)).filter(
            and_(
                Pagamento.created_at >= inicio_dia,
                Pagamento.created_at <= fim_dia,
                Pagamento.status == StatusPagamento.PAGO
            )
        ).scalar() or Decimal('0')
        
        pendente = db.query(func.sum(Pagamento.valor)).filter(
            and_(
                Pagamento.created_at >= inicio_dia,
                Pagamento.created_at <= fim_dia,
                Pagamento.status == StatusPagamento.PENDENTE
            )
        ).scalar() or Decimal('0')
        
        total = recebido + pendente
        
        grafico_data.append(GraficoFinanceiro(
            data=data_grafico.strftime("%Y-%m-%d"),
            recebido=recebido,
            pendente=pendente,
            total=total
        ))
    
    return grafico_data

