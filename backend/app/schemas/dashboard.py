from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from decimal import Decimal

class EstatisticasGerais(BaseModel):
    total_pacientes: int
    total_medicos: int
    total_consultas_hoje: int
    total_consultas_mes: int
    consultas_pendentes: int
    consultas_realizadas_hoje: int
    faturamento_mes: Decimal
    faturamento_hoje: Decimal

class ConsultaProxima(BaseModel):
    id: int
    data_hora: datetime
    paciente_nome: str
    medico_nome: str
    tipo: str

class PacienteRecente(BaseModel):
    id: int
    nome: str
    data_cadastro: datetime
    ultima_consulta: Optional[datetime] = None

class MedicoTop(BaseModel):
    id: int
    nome: str
    especialidade: str
    total_consultas: int

class GraficoConsultas(BaseModel):
    data: str
    total: int
    realizadas: int
    canceladas: int

class GraficoFaturamento(BaseModel):
    data: str
    valor: Decimal

class Dashboard(BaseModel):
    estatisticas: EstatisticasGerais
    proximas_consultas: List[ConsultaProxima]
    pacientes_recentes: List[PacienteRecente]
    medicos_top: List[MedicoTop]
    grafico_consultas: List[GraficoConsultas]
    grafico_faturamento: List[GraficoFaturamento]
