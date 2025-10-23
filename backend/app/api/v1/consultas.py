from typing import List, Optional
from datetime import datetime, date, time, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.models.consulta import Consulta, TipoConsulta, StatusConsulta
from app.models.paciente import Paciente
from app.models.horario_disponivel import HorarioDisponivel, DiaSemana
from app.schemas.consulta import (
    ConsultaCreate, ConsultaUpdate, Consulta as ConsultaSchema, 
    ConsultaList, HorarioDisponivel as HorarioDisponivelSchema,
    AgendaMedico, ConsultaResumo, ConsultaListResumo
)

router = APIRouter()

@router.get("/", response_model=ConsultaListResumo)
def list_consultas(
    skip: int = Query(0, ge=0, description="Número de registros para pular"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros para retornar"),
    data_inicio: Optional[str] = Query(None, description="Data de início para filtrar (YYYY-MM-DD)"),
    data_fim: Optional[str] = Query(None, description="Data de fim para filtrar (YYYY-MM-DD)"),
    medico_id: Optional[int] = Query(None, description="ID do médico para filtrar"),
    status: Optional[StatusConsulta] = Query(None, description="Status da consulta"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Listar consultas com filtros e paginação"""
    query = db.query(Consulta)
    
    print(f"🔍 Filtros recebidos - data_inicio: {data_inicio} (tipo: {type(data_inicio)}), data_fim: {data_fim} (tipo: {type(data_fim)}), medico_id: {medico_id}, status: {status}")
    
    # Filtros
    if data_inicio:
        data_inicio_obj = datetime.strptime(data_inicio, '%Y-%m-%d').date()
        inicio_datetime = datetime.combine(data_inicio_obj, time.min)
        query = query.filter(Consulta.data_hora >= inicio_datetime)
        print(f"✅ Aplicado filtro data_inicio: {data_inicio} -> {inicio_datetime}")
    
    if data_fim:
        data_fim_obj = datetime.strptime(data_fim, '%Y-%m-%d').date()
        fim_datetime = datetime.combine(data_fim_obj, time.max)
        query = query.filter(Consulta.data_hora <= fim_datetime)
        print(f"✅ Aplicado filtro data_fim: {data_fim} -> {fim_datetime}")
    
    if medico_id:
        query = query.filter(Consulta.medico_id == medico_id)
    
    if status:
        query = query.filter(Consulta.status == status)
    
    # Ordenar por data
    query = query.order_by(Consulta.data_hora.asc())
    
    total = query.count()
    consultas = query.offset(skip).limit(limit).all()
    
    print(f"📊 Total de consultas encontradas: {total}")
    print(f"📊 Consultas retornadas: {len(consultas)}")
    
    # Converter para resumo
    consultas_resumo = []
    for consulta in consultas:
        consultas_resumo.append(ConsultaResumo(
            id=consulta.id,
            paciente_id=consulta.paciente_id,
            medico_id=consulta.medico_id,
            data_hora=consulta.data_hora,
            paciente_nome=consulta.paciente.nome,
            medico_nome=consulta.medico.nome,
            status=consulta.status,
            tipo=consulta.tipo
        ))
    
    return ConsultaListResumo(
        items=consultas_resumo,
        total=total,
        skip=skip,
        limit=limit
    )

@router.post("/", response_model=ConsultaSchema, status_code=status.HTTP_201_CREATED)
def create_consulta(
    consulta: ConsultaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Agendar nova consulta"""
    # Verificar se paciente existe
    paciente = db.query(Paciente).filter(Paciente.id == consulta.paciente_id).first()
    if not paciente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Paciente não encontrado"
        )
    
    # Verificar se médico existe
    medico = db.query(User).filter(User.id == consulta.medico_id).first()
    if not medico or medico.role != "medico":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    # Verificar conflito de horário
    data_inicio = consulta.data_hora
    data_fim = data_inicio + timedelta(minutes=consulta.duracao)
    
    # Buscar consultas existentes do médico no período
    consultas_existentes = db.query(Consulta).filter(
        and_(
            Consulta.medico_id == consulta.medico_id,
            Consulta.status.in_([StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA])
        )
    ).all()
    
    # Verificar sobreposição de horários
    conflito = False
    for consulta_existente in consultas_existentes:
        inicio_existente = consulta_existente.data_hora
        fim_existente = inicio_existente + timedelta(minutes=consulta_existente.duracao)
        
        # Verificar se há sobreposição
        if (data_inicio < fim_existente and data_fim > inicio_existente):
            conflito = True
            break
    
    if conflito:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Horário já ocupado por outra consulta"
        )
    
    # Criar consulta
    db_consulta = Consulta(**consulta.dict())
    db.add(db_consulta)
    db.commit()
    db.refresh(db_consulta)
    
    return db_consulta

@router.get("/{consulta_id}", response_model=ConsultaSchema)
def get_consulta(
    consulta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter detalhes de uma consulta"""
    consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
    if not consulta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    return consulta

@router.put("/{consulta_id}", response_model=ConsultaSchema)
def update_consulta(
    consulta_id: int,
    consulta_update: ConsultaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualizar consulta"""
    consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
    if not consulta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    # Verificar conflito se mudou horário
    if consulta_update.data_hora and consulta_update.data_hora != consulta.data_hora:
        data_inicio = consulta_update.data_hora
        duracao = consulta_update.duracao or consulta.duracao
        data_fim = data_inicio + timedelta(minutes=duracao)
        
        conflito = db.query(Consulta).filter(
            and_(
                Consulta.medico_id == consulta.medico_id,
                Consulta.id != consulta_id,
                Consulta.status.in_([StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA]),
                or_(
                    and_(
                        Consulta.data_hora <= data_inicio,
                        func.date_add(Consulta.data_hora, func.interval(Consulta.duracao, 'MINUTE')) > data_inicio
                    ),
                    and_(
                        Consulta.data_hora < data_fim,
                        func.date_add(Consulta.data_hora, func.interval(Consulta.duracao, 'MINUTE')) >= data_fim
                    )
                )
            )
        ).first()
        
        if conflito:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Horário já ocupado por outra consulta"
            )
    
    # Atualizar campos
    update_data = consulta_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(consulta, field, value)
    
    db.commit()
    db.refresh(consulta)
    
    return consulta

@router.delete("/{consulta_id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_consulta(
    consulta_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancelar consulta"""
    consulta = db.query(Consulta).filter(Consulta.id == consulta_id).first()
    if not consulta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consulta não encontrada"
        )
    
    consulta.status = StatusConsulta.CANCELADA
    db.commit()
    
    return None

@router.get("/agenda/{medico_id}", response_model=AgendaMedico)
def get_agenda_medico(
    medico_id: int,
    data: Optional[date] = Query(None, description="Data específica (padrão: hoje)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter agenda de um médico"""
    if not data:
        data = date.today()
    
    # Verificar se médico existe
    medico = db.query(User).filter(User.id == medico_id).first()
    if not medico or medico.role != "medico":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    # Buscar consultas do dia
    data_inicio = datetime.combine(data, time.min)
    data_fim = datetime.combine(data, time.max)
    
    consultas = db.query(Consulta).filter(
        and_(
            Consulta.medico_id == medico_id,
            Consulta.data_hora >= data_inicio,
            Consulta.data_hora <= data_fim
        )
    ).order_by(Consulta.data_hora.asc()).all()
    
    # Buscar horários disponíveis
    dia_semana = data.strftime('%A').lower()
    horarios_disponiveis = db.query(HorarioDisponivel).filter(
        and_(
            HorarioDisponivel.medico_id == medico_id,
            HorarioDisponivel.dia_semana == dia_semana,
            HorarioDisponivel.ativo == True
        )
    ).all()
    
    # Converter horários disponíveis
    horarios_schema = []
    for horario in horarios_disponiveis:
        horarios_schema.append(HorarioDisponivelSchema(
            data=data,
            hora_inicio=horario.hora_inicio,
            hora_fim=horario.hora_fim,
            medico_id=medico_id,
            medico_nome=medico.nome,
            disponivel=True
        ))
    
    return AgendaMedico(
        medico_id=medico_id,
        medico_nome=medico.nome,
        especialidade=medico.especialidade,
        consultas=consultas,
        horarios_disponiveis=horarios_schema
    )

@router.get("/horarios-disponiveis/", response_model=List[HorarioDisponivelSchema])
def get_horarios_disponiveis(
    medico_id: int,
    data: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter horários disponíveis para agendamento"""
    # Verificar se médico existe
    medico = db.query(User).filter(User.id == medico_id).first()
    if not medico or medico.role != "medico":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Médico não encontrado"
        )
    
    # Buscar horários do dia da semana
    dia_semana = data.strftime('%A').lower()
    horarios = db.query(HorarioDisponivel).filter(
        and_(
            HorarioDisponivel.medico_id == medico_id,
            HorarioDisponivel.dia_semana == dia_semana,
            HorarioDisponivel.ativo == True
        )
    ).all()
    
    # Buscar consultas já agendadas no dia
    data_inicio = datetime.combine(data, time.min)
    data_fim = datetime.combine(data, time.max)
    
    consultas_agendadas = db.query(Consulta).filter(
        and_(
            Consulta.medico_id == medico_id,
            Consulta.data_hora >= data_inicio,
            Consulta.data_hora <= data_fim,
            Consulta.status.in_([StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA])
        )
    ).all()
    
    # Gerar slots de horários disponíveis
    horarios_disponiveis = []
    for horario in horarios:
        hora_atual = horario.hora_inicio
        while hora_atual < horario.hora_fim:
            # Verificar se horário está livre
            data_hora_slot = datetime.combine(data, hora_atual)
            conflito = any(
                data_hora_slot >= consulta.data_hora and 
                data_hora_slot < consulta.data_hora + timedelta(minutes=consulta.duracao)
                for consulta in consultas_agendadas
            )
            
            horarios_disponiveis.append(HorarioDisponivelSchema(
                data=data,
                hora_inicio=hora_atual,
                hora_fim=(datetime.combine(data, hora_atual) + timedelta(minutes=60)).time(),
                medico_id=medico_id,
                medico_nome=medico.nome,
                disponivel=not conflito
            ))
            
            hora_atual = (datetime.combine(data, hora_atual) + timedelta(minutes=60)).time()
    
    return horarios_disponiveis
