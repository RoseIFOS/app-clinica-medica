import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, DollarSign, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data - será substituído por dados reais da API
const stats = [
  {
    title: 'Total de Pacientes',
    value: '150',
    icon: Users,
    trend: '+12%',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    title: 'Consultas Hoje',
    value: '12',
    icon: Calendar,
    trend: '+3',
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  {
    title: 'Receita do Mês',
    value: 'R$ 51.000',
    icon: DollarSign,
    trend: '+8%',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100'
  },
  {
    title: 'Taxa de Comparecimento',
    value: '92.5%',
    icon: TrendingUp,
    trend: '+2.5%',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
];

const consultasData = [
  { mes: 'Mai', consultas: 45 },
  { mes: 'Jun', consultas: 52 },
  { mes: 'Jul', consultas: 48 },
  { mes: 'Ago', consultas: 61 },
  { mes: 'Set', consultas: 55 },
  { mes: 'Out', consultas: 67 },
];

const receitaData = [
  { mes: 'Mai', valor: 38 },
  { mes: 'Jun', valor: 42 },
  { mes: 'Jul', valor: 39 },
  { mes: 'Ago', valor: 47 },
  { mes: 'Set', valor: 44 },
  { mes: 'Out', valor: 51 },
];

const tipoConsultaData = [
  { name: 'Primeira Consulta', value: 45, color: '#10B981' },
  { name: 'Retorno', value: 280, color: '#3B82F6' },
  { name: 'Exame', value: 15, color: '#F59E0B' },
];

const proximasConsultas = [
  { paciente: 'Maria da Silva', horario: '09:00', medico: 'Dr. João Silva', tipo: 'Retorno' },
  { paciente: 'José Santos', horario: '10:00', medico: 'Dr. João Silva', tipo: 'Primeira Consulta' },
  { paciente: 'Ana Oliveira', horario: '11:00', medico: 'Dra. Maria Costa', tipo: 'Exame' },
  { paciente: 'Pedro Lima', horario: '14:00', medico: 'Dr. João Silva', tipo: 'Retorno' },
];

export default function Dashboard() {
  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Visão geral da clínica"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="card-shadow hover:card-shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="text-green-600 font-medium">{stat.trend}</span> vs mês anterior
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Consultas Chart */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Consultas (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consultasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="consultas" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Receita Chart */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Receita Mensal (R$ mil)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={receitaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Tipo de Consulta Chart */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Consultas por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tipoConsultaData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tipoConsultaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {tipoConsultaData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximas Consultas */}
          <Card className="card-shadow md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Próximas Consultas de Hoje</CardTitle>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximasConsultas.map((consulta, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {consulta.paciente.split(' ')[0].charAt(0)}
                          {consulta.paciente.split(' ')[1]?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{consulta.paciente}</p>
                        <p className="text-sm text-muted-foreground">{consulta.medico}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{consulta.horario}</p>
                      <p className="text-sm text-muted-foreground">{consulta.tipo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
