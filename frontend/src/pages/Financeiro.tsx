import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Clock, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const receitaData = [
  { mes: 'Mai', receita: 38000, despesas: 12000 },
  { mes: 'Jun', receita: 42000, despesas: 13500 },
  { mes: 'Jul', receita: 39000, despesas: 11800 },
  { mes: 'Ago', receita: 47000, despesas: 14200 },
  { mes: 'Set', receita: 44000, despesas: 13000 },
  { mes: 'Out', receita: 51000, despesas: 15000 },
];

const metodosData = [
  { name: 'Dinheiro', value: 28, color: '#10B981' },
  { name: 'Cartão Crédito', value: 35, color: '#3B82F6' },
  { name: 'Cartão Débito', value: 22, color: '#F59E0B' },
  { name: 'PIX', value: 15, color: '#8B5CF6' },
];

const pagamentosMock = [
  { id: 1, paciente: 'Maria da Silva', valor: 150.00, metodo: 'Dinheiro', status: 'pago', data: '15/10/2025' },
  { id: 2, paciente: 'José Santos', valor: 200.00, metodo: 'Cartão Crédito', status: 'pago', data: '14/10/2025' },
  { id: 3, paciente: 'Ana Oliveira', valor: 150.00, metodo: 'PIX', status: 'pendente', data: '16/10/2025' },
  { id: 4, paciente: 'Pedro Lima', valor: 180.00, metodo: 'Convênio', status: 'pendente', data: '13/10/2025' },
];

export default function Financeiro() {
  return (
    <MainLayout 
      title="Financeiro" 
      subtitle="Controle financeiro da clínica"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita do Mês</p>
                  <p className="text-2xl font-bold mt-2">R$ 51.000</p>
                  <p className="text-xs text-green-600 mt-1">+8% vs mês anterior</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Despesas do Mês</p>
                  <p className="text-2xl font-bold mt-2">R$ 15.000</p>
                  <p className="text-xs text-red-600 mt-1">+5% vs mês anterior</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">A Receber</p>
                  <p className="text-2xl font-bold mt-2">R$ 3.200</p>
                  <p className="text-xs text-muted-foreground mt-1">8 pagamentos</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                  <p className="text-2xl font-bold mt-2">R$ 36.000</p>
                  <p className="text-xs text-primary mt-1">70.6% margem</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Receitas e Despesas (R$ mil)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={receitaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="despesas" fill="#EF4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Métodos de Pagamento (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metodosData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {metodosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {metodosData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Payments */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pagamentos Recentes</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Pagamento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pagamentosMock.map((pagamento) => (
                <div 
                  key={pagamento.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{pagamento.paciente}</p>
                      <p className="text-sm text-muted-foreground">{pagamento.metodo} • {pagamento.data}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-lg">R$ {pagamento.valor.toFixed(2)}</p>
                      <Badge className={pagamento.status === 'pago' ? 'badge-pago' : 'badge-pendente'}>
                        {pagamento.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
