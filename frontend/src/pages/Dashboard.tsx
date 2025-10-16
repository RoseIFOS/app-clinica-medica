import { Users, Calendar, FileText, DollarSign, TrendingUp, Clock } from 'lucide-react'

const stats = [
  {
    name: 'Total de Pacientes',
    value: '5',
    icon: Users,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    name: 'Consultas Hoje',
    value: '2',
    icon: Calendar,
    color: 'text-success-600',
    bgColor: 'bg-success-100',
  },
  {
    name: 'Prontuários Pendentes',
    value: '1',
    icon: FileText,
    color: 'text-warning-600',
    bgColor: 'bg-warning-100',
  },
  {
    name: 'Receita do Mês',
    value: 'R$ 1.250,00',
    icon: DollarSign,
    color: 'text-success-600',
    bgColor: 'bg-success-100',
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'consulta',
    description: 'Nova consulta agendada para Maria da Silva',
    time: '2 horas atrás',
    icon: Calendar,
  },
  {
    id: 2,
    type: 'paciente',
    description: 'João Santos atualizou seus dados',
    time: '4 horas atrás',
    icon: Users,
  },
  {
    id: 3,
    type: 'pagamento',
    description: 'Pagamento de R$ 150,00 confirmado',
    time: '6 horas atrás',
    icon: DollarSign,
  },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600">Visão geral da clínica médica</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Próximas Consultas</h3>
            <p className="card-description">Consultas agendadas para hoje</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600" />
                <div className="flex-1">
                  <p className="font-medium text-secondary-900">Maria da Silva</p>
                  <p className="text-sm text-secondary-600">09:00 - Dr. João Silva</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-success-100 text-success-800 rounded-full">
                  Confirmada
                </span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                <Clock className="w-5 h-5 text-primary-600" />
                <div className="flex-1">
                  <p className="font-medium text-secondary-900">João Santos</p>
                  <p className="text-sm text-secondary-600">15:00 - Dra. Maria Santos</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-warning-100 text-warning-800 rounded-full">
                  Pendente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Atividades Recentes</h3>
            <p className="card-description">Últimas ações no sistema</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="p-2 bg-secondary-100 rounded-lg">
                    <activity.icon className="w-4 h-4 text-secondary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Receita */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Receita Mensal</h3>
          <p className="card-description">Evolução da receita nos últimos 6 meses</p>
        </div>
        <div className="card-content">
          <div className="h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-500">Gráfico de receita será implementado em breve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
