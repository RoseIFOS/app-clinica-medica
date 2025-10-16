from typing import List
from datetime import datetime, date, timedelta
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from app.api.deps import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.paciente import Paciente
from app.models.consulta import Consulta, StatusConsulta
from app.models.pagamento import Pagamento, StatusPagamento
from app.schemas.dashboard import Dashboard, EstatisticasGerais, ConsultaProxima, PacienteRecente, MedicoTop, GraficoConsultas, GraficoFaturamento

router = APIRouter()

@router.get("/estatisticas", response_model=Dashboard)
def get_dashboard(
    dias_grafico: int = Query(30, ge=7, le=365, description="Número de dias para gráficos"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter estatísticas gerais do dashboard"""
    hoje = date.today()
    inicio_mes = hoje.replace(day=1)
    inicio_grafico = hoje - timedelta(days=dias_grafico)
    
    # Estatísticas gerais
    total_pacientes = db.query(Paciente).count()
    total_medicos = db.query(User).filter(User.role == UserRole.MEDICO).count()
    
    # Consultas de hoje
    inicio_hoje = datetime.combine(hoje, datetime.min.time())
    fim_hoje = datetime.combine(hoje, datetime.max.time())
    
    total_consultas_hoje = db.query(Consulta).filter(
        and_(
            Consulta.data_hora >= inicio_hoje,
            Consulta.data_hora <= fim_hoje
        )
    ).count()
    
    consultas_realizadas_hoje = db.query(Consulta).filter(
        and_(
            Consulta.data_hora >= inicio_hoje,
            Consulta.data_hora <= fim_hoje,
            Consulta.status == StatusConsulta.REALIZADA
        )
    ).count()
    
    # Consultas do mês
    inicio_mes_dt = datetime.combine(inicio_mes, datetime.min.time())
    total_consultas_mes = db.query(Consulta).filter(
        Consulta.data_hora >= inicio_mes_dt
    ).count()
    
    # Consultas pendentes
    consultas_pendentes = db.query(Consulta).filter(
        Consulta.status.in_([StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA])
    ).count()
    
    # Faturamento
    faturamento_hoje = db.query(func.sum(Pagamento.valor)).filter(
        and_(
            Pagamento.data_pagamento >= inicio_hoje,
            Pagamento.data_pagamento <= fim_hoje,
            Pagamento.status == StatusPagamento.PAGO
        )
    ).scalar() or 0
    
    faturamento_mes = db.query(func.sum(Pagamento.valor)).filter(
        and_(
            Pagamento.data_pagamento >= inicio_mes_dt,
            Pagamento.status == StatusPagamento.PAGO
        )
    ).scalar() or 0
    
    estatisticas = EstatisticasGerais(
        total_pacientes=total_pacientes,
        total_medicos=total_medicos,
        total_consultas_hoje=total_consultas_hoje,
        total_consultas_mes=total_consultas_mes,
        consultas_pendentes=consultas_pendentes,
        consultas_realizadas_hoje=consultas_realizadas_hoje,
        faturamento_mes=faturamento_mes,
        faturamento_hoje=faturamento_hoje
    )
    
    # Próximas consultas (próximas 5)
    proximas_consultas = db.query(Consulta).filter(
        and_(
            Consulta.data_hora >= datetime.now(),
            Consulta.status.in_([StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA])
        )
    ).order_by(Consulta.data_hora.asc()).limit(5).all()
    
    proximas_consultas_schema = []
    for consulta in proximas_consultas:
        proximas_consultas_schema.append(ConsultaProxima(
            id=consulta.id,
            data_hora=consulta.data_hora,
            paciente_nome=consulta.paciente.nome,
            medico_nome=consulta.medico.nome,
            tipo=consulta.tipo.value
        ))
    
    # Pacientes recentes (últimos 5)
    pacientes_recentes = db.query(Paciente).order_by(
        Paciente.created_at.desc()
    ).limit(5).all()
    
    pacientes_recentes_schema = []
    for paciente in pacientes_recentes:
        # Buscar última consulta
        ultima_consulta = db.query(Consulta).filter(
            Consulta.paciente_id == paciente.id
        ).order_by(Consulta.data_hora.desc()).first()
        
        pacientes_recentes_schema.append(PacienteRecente(
            id=paciente.id,
            nome=paciente.nome,
            data_cadastro=paciente.created_at,
            ultima_consulta=ultima_consulta.data_hora if ultima_consulta else None
        ))
    
    # Médicos com mais consultas
    medicos_top = db.query(
        User,
        func.count(Consulta.id).label('total_consultas')
    ).join(Consulta, User.id == Consulta.medico_id).filter(
        and_(
            User.role == UserRole.MEDICO,
            Consulta.data_hora >= inicio_grafico
        )
    ).group_by(User.id).order_by(
        func.count(Consulta.id).desc()
    ).limit(5).all()
    
    medicos_top_schema = []
    for medico, total in medicos_top:
        medicos_top_schema.append(MedicoTop(
            id=medico.id,
            nome=medico.nome,
            especialidade=medico.especialidade or "Sem especialidade",
            total_consultas=total
        ))
    
    # Gráfico de consultas por dia
    grafico_consultas = []
    for i in range(dias_grafico):
        data_grafico = inicio_grafico + timedelta(days=i)
        inicio_dia = datetime.combine(data_grafico, datetime.min.time())
        fim_dia = datetime.combine(data_grafico, datetime.max.time())
        
        total_dia = db.query(Consulta).filter(
            and_(
                Consulta.data_hora >= inicio_dia,
                Consulta.data_hora <= fim_dia
            )
        ).count()
        
        realizadas_dia = db.query(Consulta).filter(
            and_(
                Consulta.data_hora >= inicio_dia,
                Consulta.data_hora <= fim_dia,
                Consulta.status == StatusConsulta.REALIZADA
            )
        ).count()
        
        canceladas_dia = db.query(Consulta).filter(
            and_(
                Consulta.data_hora >= inicio_dia,
                Consulta.data_hora <= fim_dia,
                Consulta.status == StatusConsulta.CANCELADA
            )
        ).count()
        
        grafico_consultas.append(GraficoConsultas(
            data=data_grafico.strftime("%Y-%m-%d"),
            total=total_dia,
            realizadas=realizadas_dia,
            canceladas=canceladas_dia
        ))
    
    # Gráfico de faturamento por dia
    grafico_faturamento = []
    for i in range(dias_grafico):
        data_grafico = inicio_grafico + timedelta(days=i)
        inicio_dia = datetime.combine(data_grafico, datetime.min.time())
        fim_dia = datetime.combine(data_grafico, datetime.max.time())
        
        faturamento_dia = db.query(func.sum(Pagamento.valor)).filter(
            and_(
                Pagamento.data_pagamento >= inicio_dia,
                Pagamento.data_pagamento <= fim_dia,
                Pagamento.status == StatusPagamento.PAGO
            )
        ).scalar() or 0
        
        grafico_faturamento.append(GraficoFaturamento(
            data=data_grafico.strftime("%Y-%m-%d"),
            valor=faturamento_dia
        ))
    
    return Dashboard(
        estatisticas=estatisticas,
        proximas_consultas=proximas_consultas_schema,
        pacientes_recentes=pacientes_recentes_schema,
        medicos_top=medicos_top_schema,
        grafico_consultas=grafico_consultas,
        grafico_faturamento=grafico_faturamento
    )

@router.get("/metricas-rapidas")
def get_metricas_rapidas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Obter métricas rápidas para widgets"""
    hoje = date.today()
    inicio_hoje = datetime.combine(hoje, datetime.min.time())
    fim_hoje = datetime.combine(hoje, datetime.max.time())
    
    return {
        "consultas_hoje": db.query(Consulta).filter(
            and_(
                Consulta.data_hora >= inicio_hoje,
                Consulta.data_hora <= fim_hoje
            )
        ).count(),
        "pacientes_novos_hoje": db.query(Paciente).filter(
            and_(
                Paciente.created_at >= inicio_hoje,
                Paciente.created_at <= fim_hoje
            )
        ).count(),
        "faturamento_hoje": db.query(func.sum(Pagamento.valor)).filter(
            and_(
                Pagamento.data_pagamento >= inicio_hoje,
                Pagamento.data_pagamento <= fim_hoje,
                Pagamento.status == StatusPagamento.PAGO
            )
        ).scalar() or 0,
        "consultas_pendentes": db.query(Consulta).filter(
            Consulta.status.in_([StatusConsulta.AGENDADA, StatusConsulta.CONFIRMADA])
        ).count()
    }
