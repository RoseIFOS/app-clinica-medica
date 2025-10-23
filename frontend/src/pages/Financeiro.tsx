import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, Clock, Plus, Search, Edit, Trash2, Eye, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';
import api from '@/lib/api';

// Dados serão calculados dinamicamente baseados nos pagamentos reais

const metodosData = [
  { name: 'Dinheiro', value: 28, color: '#10B981' },
  { name: 'Cartão Crédito', value: 35, color: '#3B82F6' },
  { name: 'Cartão Débito', value: 22, color: '#F59E0B' },
  { name: 'PIX', value: 15, color: '#8B5CF6' },
];

interface Pagamento {
  id: number;
  paciente_id: number;
  paciente_nome: string;
  medico_id?: number;
  medico_nome?: string;
  valor: number;
  metodo_pagamento: string;
  status: string;
  data: string;
  observacoes?: string;
}

interface Despesa {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  data_vencimento?: string;
  data_pagamento?: string;
  status: string;
  fornecedor?: string;
  observacoes?: string;
  created_at: string;
}

interface PagamentoFormData {
  paciente_id: string;
  medico_id: string;
  valor: string;
  metodo_pagamento: string;
  status: string;
  observacoes: string;
}

interface DespesaFormData {
  descricao: string;
  categoria: string;
  valor: string;
  data_vencimento: string;
  status: string;
  fornecedor: string;
  observacoes: string;
}

export default function Financeiro() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMedico, setFiltroMedico] = useState<string>('');
  const [filtroAno, setFiltroAno] = useState<string>(new Date().getFullYear().toString());
  const [filtroMes, setFiltroMes] = useState<string>((new Date().getMonth() + 1).toString());
  const [filtroStatusPagamento, setFiltroStatusPagamento] = useState<string>('all');
  const [filtroStatusDespesa, setFiltroStatusDespesa] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDespesaDialogOpen, setIsDespesaDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDespesaId, setEditingDespesaId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PagamentoFormData>({
    paciente_id: '',
    medico_id: '',
    valor: '',
    metodo_pagamento: '',
    status: 'pago',
    observacoes: '',
  });

  const [despesaFormData, setDespesaFormData] = useState<DespesaFormData>({
    descricao: '',
    categoria: 'outros',
    valor: '',
    data_vencimento: '',
    status: 'pendente',
    fornecedor: '',
    observacoes: '',
  });

  const filteredPagamentos = pagamentos.filter(pagamento => {
    const matchesSearch = pagamento.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pagamento.metodo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMedico = !filtroMedico || filtroMedico === 'all' || 
                         pagamento.medico_id?.toString() === filtroMedico;
    return matchesSearch && matchesMedico;
  });

  // Calcular receita por médico
  const receitaPorMedico = medicos.map(medico => {
    const pagamentosMedico = pagamentos.filter(p => {
      const medicoMatch = p.medico_id === medico.id;
      const statusMatch = p.status === 'pago';
      return medicoMatch && statusMatch;
    });
    const totalReceita = pagamentosMedico.reduce((sum, p) => sum + Number(p.valor), 0);
    return {
      medico: medico.nome,
      receita: totalReceita,
      consultas: pagamentosMedico.length
    };
  }).filter(item => item.receita > 0);

  // Calcular dados reais para gráfico de receitas/despesas
  const calcularDadosMensais = () => {
    const agora = new Date();
    const meses = [];
    
    for (let i = 5; i >= 0; i--) {
      const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const mesNome = data.toLocaleDateString('pt-BR', { month: 'short' });
      
      const pagamentosMes = pagamentos.filter(p => {
        const dataPagamento = new Date(p.data_pagamento || p.data);
        return dataPagamento.getMonth() === data.getMonth() && 
               dataPagamento.getFullYear() === data.getFullYear() &&
               p.status === 'pago';
      });
      
      const receita = pagamentosMes.reduce((sum, p) => sum + Number(p.valor), 0);
      
      // Calcular despesas reais do mês
      const despesasMes = despesas.filter(d => {
        const dataDespesa = new Date(d.created_at);
        return dataDespesa.getMonth() === data.getMonth() && 
               dataDespesa.getFullYear() === data.getFullYear();
      });
      const totalDespesas = despesasMes.reduce((sum, d) => sum + Number(d.valor), 0);
      
      meses.push({
        mes: mesNome,
        receita: receita,
        despesas: totalDespesas
      });
    }
    
    return meses;
  };

  const receitaData = calcularDadosMensais();

  // Calcular métodos de pagamento reais
  const calcularMetodosPagamento = () => {
    const metodos: { [key: string]: number } = {};
    const total = pagamentos.length;
    
    pagamentos.forEach(p => {
      const metodo = p.metodo_pagamento || p.metodo;
      metodos[metodo] = (metodos[metodo] || 0) + 1;
    });
    
    return Object.entries(metodos).map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value: Math.round((count / total) * 100),
      color: name === 'dinheiro' ? '#10B981' : 
             name === 'cartao_credito' ? '#3B82F6' :
             name === 'cartao_debito' ? '#F59E0B' :
             name === 'pix' ? '#8B5CF6' : '#6B7280'
    }));
  };

  const metodosData = calcularMetodosPagamento();

  useEffect(() => {
    carregarDados();
  }, [filtroAno, filtroMes, filtroStatusPagamento, filtroStatusDespesa]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Calcular data de início e fim do mês selecionado
      const ano = parseInt(filtroAno);
      const mes = parseInt(filtroMes) - 1; // JavaScript usa 0-11 para meses
      const dataInicio = new Date(ano, mes, 1);
      const dataFim = new Date(ano, mes + 1, 0); // Último dia do mês
      
      const params = {
        data_inicio: dataInicio.toISOString().split('T')[0],
        data_fim: dataFim.toISOString().split('T')[0],
        ...(filtroStatusPagamento && filtroStatusPagamento !== 'all' && { status: filtroStatusPagamento })
      };
      
      const [pagamentosRes, despesasRes, pacientesRes, medicosRes] = await Promise.all([
        api.get('/financeiro/pagamentos', { params }),
        api.get('/despesas', { 
          params: {
            data_inicio: dataInicio.toISOString().split('T')[0],
            data_fim: dataFim.toISOString().split('T')[0],
            ...(filtroStatusDespesa && filtroStatusDespesa !== 'all' && { status: filtroStatusDespesa })
          }
        }),
        api.get('/pacientes'),
        api.get('/medicos'),
      ]);
      
      setPagamentos(pagamentosRes.data.items || pagamentosRes.data || []);
      setDespesas(despesasRes.data.items || despesasRes.data || []);
      setPacientes(pacientesRes.data.items || pacientesRes.data || []);
      setMedicos(medicosRes.data.items || medicosRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Usar dados mock se API não estiver disponível
      setPagamentos([
        { id: 1, paciente_id: 1, paciente_nome: 'Maria da Silva', medico_id: 1, medico_nome: 'Dr. João Silva', valor: 150.00, metodo_pagamento: 'dinheiro', status: 'pago', data: '15/10/2025' },
        { id: 2, paciente_id: 2, paciente_nome: 'José Santos', medico_id: 2, medico_nome: 'Dra. Maria Santos', valor: 200.00, metodo_pagamento: 'cartao_credito', status: 'pago', data: '14/10/2025' },
        { id: 3, paciente_id: 3, paciente_nome: 'Ana Oliveira', medico_id: 1, medico_nome: 'Dr. João Silva', valor: 150.00, metodo_pagamento: 'pix', status: 'pendente', data: '16/10/2025' },
        { id: 4, paciente_id: 4, paciente_nome: 'Pedro Lima', medico_id: 3, medico_nome: 'Dr. Pedro Costa', valor: 180.00, metodo_pagamento: 'convenio', status: 'pendente', data: '13/10/2025' },
      ]);
      setPacientes([
        { id: 1, nome: 'Maria da Silva' },
        { id: 2, nome: 'José Santos' },
        { id: 3, nome: 'Ana Oliveira' },
        { id: 4, nome: 'Pedro Lima' },
      ]);
      setMedicos([
        { id: 1, nome: 'Dr. João Silva' },
        { id: 2, nome: 'Dra. Maria Santos' },
        { id: 3, nome: 'Dr. Pedro Costa' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarPagamento = () => {
    setEditingId(null);
    setFormData({
      paciente_id: '',
      medico_id: '',
      valor: '',
      metodo_pagamento: '',
      status: 'pago',
      observacoes: '',
    });
    console.log('🔄 Formulário resetado para novo pagamento');
    setIsDialogOpen(true);
  };

  const handleInputChange = (name: string, value: string) => {
    console.log(`📝 Campo ${name} alterado para:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 FormData atual:', formData);
    console.log('🔍 Validação:', {
      paciente_id: formData.paciente_id,
      medico_id: formData.medico_id,
      valor: formData.valor,
      metodo_pagamento: formData.metodo_pagamento
    });
    
    if (!formData.paciente_id || !formData.medico_id || !formData.valor || !formData.metodo_pagamento) {
      toast.error('Paciente, médico, valor e método são obrigatórios');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Atualizando pagamento...' : 'Registrando pagamento...');

    try {
      const payload = {
        paciente_id: parseInt(formData.paciente_id),
        medico_id: parseInt(formData.medico_id),
        valor: parseFloat(formData.valor),
        metodo_pagamento: formData.metodo_pagamento,
        status: formData.status,
        observacoes: formData.observacoes || null,
      };

      if (editingId) {
        await api.put(`/financeiro/pagamentos/${editingId}`, payload);
        toast.dismiss(loadingToast);
        toast.success('Pagamento atualizado com sucesso!');
      } else {
        await api.post('/financeiro/pagamentos', payload);
        toast.dismiss(loadingToast);
        toast.success('Pagamento registrado com sucesso!');
      }
      
      setIsDialogOpen(false);
      await carregarDados();
    } catch (error: any) {
      console.error('Erro ao salvar pagamento:', error);
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao salvar pagamento';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao salvar pagamento');
    }
  };

  const handleEdit = (id: number) => {
    const pagamento = pagamentos.find(p => p.id === id);
    if (pagamento) {
      setEditingId(id);
      setFormData({
        paciente_id: pagamento.paciente_id?.toString() || '',
        medico_id: pagamento.medico_id?.toString() || '',
        valor: pagamento.valor?.toString() || '',
        metodo_pagamento: pagamento.metodo_pagamento || '',
        status: pagamento.status || 'pago',
        observacoes: pagamento.observacoes || '',
      });
      console.log('✏️ Editando pagamento:', pagamento);
      console.log('📝 FormData para edição:', {
        paciente_id: pagamento.paciente_id?.toString() || '',
        medico_id: pagamento.medico_id?.toString() || '',
        valor: pagamento.valor?.toString() || '',
        metodo_pagamento: pagamento.metodo_pagamento || pagamento.metodo || '',
        status: pagamento.status || 'pago',
        observacoes: pagamento.observacoes || '',
      });
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pagamento?')) {
      try {
        await api.delete(`/financeiro/pagamentos/${id}`);
        toast.success('Pagamento excluído com sucesso!');
        await carregarDados();
      } catch (error: any) {
        console.error('Erro ao excluir pagamento:', error);
        toast.error('Erro ao excluir pagamento');
      }
    }
  };

  const handleEditDespesa = (id: number) => {
    const despesa = despesas.find(d => d.id === id);
    if (despesa) {
      setEditingDespesaId(id);
      setDespesaFormData({
        descricao: despesa.descricao,
        categoria: despesa.categoria,
        valor: despesa.valor.toString(),
        data_vencimento: despesa.data_vencimento || '',
        status: despesa.status,
        fornecedor: despesa.fornecedor || '',
        observacoes: despesa.observacoes || '',
      });
      setIsDespesaDialogOpen(true);
    }
  };

  const handleDeleteDespesa = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await api.delete(`/despesas/${id}`);
        toast.success('Despesa excluída com sucesso!');
        await carregarDados();
      } catch (error: any) {
        console.error('Erro ao excluir despesa:', error);
        toast.error('Erro ao excluir despesa');
      }
    }
  };

  const handleSaveDespesa = async () => {
    try {
      const loadingToast = toast.loading('Salvando despesa...');
      
      const payload = {
        ...despesaFormData,
        valor: parseFloat(despesaFormData.valor),
        data_vencimento: despesaFormData.data_vencimento || null,
      };

      if (editingDespesaId) {
        await api.put(`/despesas/${editingDespesaId}`, payload);
        toast.dismiss(loadingToast);
        toast.success('Despesa atualizada com sucesso!');
      } else {
        await api.post('/despesas', payload);
        toast.dismiss(loadingToast);
        toast.success('Despesa criada com sucesso!');
      }
      
      setIsDespesaDialogOpen(false);
      setEditingDespesaId(null);
      setDespesaFormData({
        descricao: '',
        categoria: 'outros',
        valor: '',
        data_vencimento: '',
        status: 'pendente',
        fornecedor: '',
        observacoes: '',
      });
      await carregarDados();
    } catch (error: any) {
      console.error('Erro ao salvar despesa:', error);
      toast.dismiss();
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao salvar despesa';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao salvar despesa');
    }
  };

  return (
    <MainLayout 
      title="Financeiro" 
      subtitle="Controle financeiro da clínica"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="filtroAno">Ano</Label>
                <Select value={filtroAno} onValueChange={setFiltroAno}>
                  <SelectTrigger id="filtroAno">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filtroMes">Mês</Label>
                <Select value={filtroMes} onValueChange={setFiltroMes}>
                  <SelectTrigger id="filtroMes">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filtroStatusPagamento">Status Recebimentos</Label>
                <Select value={filtroStatusPagamento} onValueChange={setFiltroStatusPagamento}>
                  <SelectTrigger id="filtroStatusPagamento">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filtroStatusDespesa">Status Despesas</Label>
                <Select value={filtroStatusDespesa} onValueChange={setFiltroStatusDespesa}>
                  <SelectTrigger id="filtroStatusDespesa">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita do Mês</p>
                  <p className="text-2xl font-bold mt-2">
                    R$ {pagamentos
                      .filter(p => p.status === 'pago')
                      .reduce((sum, p) => sum + Number(p.valor), 0)
                      .toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {pagamentos.filter(p => p.status === 'pago').length} recebimentos
                  </p>
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
                  <p className="text-2xl font-bold mt-2">
                    R$ {despesas
                      .reduce((sum, d) => sum + Number(d.valor), 0)
                      .toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {despesas.length} despesas
                  </p>
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
                  <p className="text-2xl font-bold mt-2">
                    R$ {pagamentos
                      .filter(p => p.status === 'pendente')
                      .reduce((sum, p) => sum + Number(p.valor), 0)
                      .toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pagamentos.filter(p => p.status === 'pendente').length} recebimentos
                  </p>
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
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className="text-2xl font-bold mt-2">
                    R$ {(pagamentos
                      .filter(p => p.status === 'pago')
                      .reduce((sum, p) => sum + Number(p.valor), 0) - 
                      despesas.reduce((sum, d) => sum + Number(d.valor), 0))
                      .toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Lucro líquido</p>
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
              <div className="grid grid-cols-1 gap-2 mt-4">
                {metodosData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
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

        {/* Receita por Médico - Tabela Compacta */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Receita por Médico</CardTitle>
          </CardHeader>
          <CardContent>
            {receitaPorMedico.length > 0 ? (
              <div className="space-y-4">
                {/* Tabela Compacta */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Médico</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">Receita</th>
                        <th className="text-center py-2 px-3 text-sm font-medium text-muted-foreground">Consultas</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">Média</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receitaPorMedico
                        .sort((a, b) => b.receita - a.receita)
                        .map((item, index) => (
                        <tr key={index} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {item.medico.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                              <span className="text-sm font-medium">{item.medico}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="font-semibold text-green-600">
                              R$ {item.receita.toLocaleString('pt-BR')}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <Badge variant="outline" className="text-xs">
                              {item.consultas}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="text-xs text-muted-foreground">
                              R$ {item.consultas > 0 ? (item.receita / item.consultas).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Resumo Compacto */}
                <div className="bg-accent/30 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Total:</span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">
                        R$ {receitaPorMedico.reduce((sum, item) => sum + item.receita, 0).toLocaleString('pt-BR')}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {receitaPorMedico.reduce((sum, item) => sum + item.consultas, 0)} consultas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Nenhuma receita encontrada</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Despesas */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Despesas</CardTitle>
              <Button onClick={() => {
                setEditingDespesaId(null);
                setDespesaFormData({
                  descricao: '',
                  categoria: 'outros',
                  valor: '',
                  data_vencimento: '',
                  status: 'pendente',
                  fornecedor: '',
                  observacoes: '',
                });
                setIsDespesaDialogOpen(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {despesas.length > 0 ? (
              <div className="space-y-4">
                {despesas.map((despesa) => (
                  <div key={despesa.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{despesa.descricao}</h4>
                          <p className="text-sm text-muted-foreground">
                            {despesa.categoria} • {despesa.fornecedor && `${despesa.fornecedor} • `}
                            {despesa.data_vencimento && `Vence: ${new Date(despesa.data_vencimento).toLocaleDateString('pt-BR')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-red-600">
                          R$ {Number(despesa.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant={despesa.status === 'pago' ? 'default' : 'secondary'}>
                          {despesa.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDespesa(despesa.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDespesa(despesa.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Resumo das Despesas */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-800">Total de Despesas:</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-red-600">
                        R$ {despesas.reduce((sum, d) => sum + Number(d.valor), 0).toLocaleString('pt-BR')}
                      </span>
                      <p className="text-sm text-red-600">
                        {despesas.filter(d => d.status === 'pendente').length} pendentes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Receipt className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Nenhuma despesa registrada</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Recebimentos */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recebimentos Recentes</CardTitle>
              <Button onClick={handleRegistrarPagamento}>
                <Plus className="w-4 h-4 mr-2" />
                Registrar Recebimento
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por paciente ou método..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="filtroMedico">Filtrar por Médico</Label>
                  <Select
                    value={filtroMedico}
                    onValueChange={setFiltroMedico}
                  >
                    <SelectTrigger id="filtroMedico">
                      <SelectValue placeholder="Todos os médicos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os médicos</SelectItem>
                      {medicos.map(medico => (
                        <SelectItem key={medico.id} value={medico.id.toString()}>
                          {medico.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {filteredPagamentos.map((pagamento) => (
                <div 
                  key={pagamento.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{pagamento.paciente_nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {pagamento.medico_nome ? `Dr(a). ${pagamento.medico_nome} • ` : 
                         pagamento.medico_id ? `Médico ID: ${pagamento.medico_id} • ` : ''}
                        {pagamento.metodo} • {pagamento.data}
                      </p>
                      {pagamento.data_pagamento && (
                        <p className="text-xs text-green-600">
                          Pago em: {new Date(pagamento.data_pagamento).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">R$ {Number(pagamento.valor).toFixed(2)}</p>
                      <Badge className={pagamento.status === 'pago' ? 'badge-pago' : 'badge-pendente'}>
                        {pagamento.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(pagamento.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(pagamento.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Resumo dos Recebimentos */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-800">Total de Recebimentos:</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600">
                      R$ {pagamentos
                        .filter(p => p.status === 'pago')
                        .reduce((sum, p) => sum + Number(p.valor), 0)
                        .toLocaleString('pt-BR')}
                    </span>
                    <p className="text-sm text-green-600">
                      {pagamentos.filter(p => p.status === 'pendente').length} pendentes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal para Registrar/Editar Pagamento */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Editar Pagamento' : 'Registrar Pagamento'}
              </DialogTitle>
              <DialogDescription>
                {editingId ? 'Atualize os dados do pagamento.' : 'Preencha os dados do pagamento.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                {/* Paciente */}
                <div className="space-y-2">
                  <Label htmlFor="paciente_id">Paciente *</Label>
                  <Select 
                    value={formData.paciente_id} 
                    onValueChange={(value) => handleInputChange('paciente_id', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map(paciente => (
                        <SelectItem key={paciente.id} value={paciente.id.toString()}>
                          {paciente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Médico */}
                <div className="space-y-2">
                  <Label htmlFor="medico_id">Médico *</Label>
                  <Select 
                    value={formData.medico_id} 
                    onValueChange={(value) => handleInputChange('medico_id', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicos.map(medico => (
                        <SelectItem key={medico.id} value={medico.id.toString()}>
                          {medico.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor (R$) *</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.valor}
                    onChange={(e) => handleInputChange('valor', e.target.value)}
                    required
                  />
                </div>

                {/* Método */}
                <div className="space-y-2">
                  <Label htmlFor="metodo_pagamento">Método de Pagamento *</Label>
                  <Select 
                    value={formData.metodo_pagamento} 
                    onValueChange={(value) => handleInputChange('metodo_pagamento', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao_credito">Cartão Crédito</SelectItem>
                      <SelectItem value="cartao_debito">Cartão Débito</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="transferencia">Transferência</SelectItem>
                      <SelectItem value="convenio">Convênio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Observações adicionais..."
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? 'Atualizar' : 'Registrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de Despesa */}
        <Dialog open={isDespesaDialogOpen} onOpenChange={setIsDespesaDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingDespesaId ? 'Editar Despesa' : 'Nova Despesa'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={despesaFormData.descricao}
                  onChange={(e) => setDespesaFormData({ ...despesaFormData, descricao: e.target.value })}
                  placeholder="Ex: Aluguel do consultório"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={despesaFormData.categoria} onValueChange={(value) => setDespesaFormData({ ...despesaFormData, categoria: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluguel">Aluguel</SelectItem>
                    <SelectItem value="salarios">Salários</SelectItem>
                    <SelectItem value="equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="medicamentos">Medicamentos</SelectItem>
                    <SelectItem value="limpeza">Limpeza</SelectItem>
                    <SelectItem value="energia">Energia</SelectItem>
                    <SelectItem value="agua">Água</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="internet">Internet</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={despesaFormData.valor}
                  onChange={(e) => setDespesaFormData({ ...despesaFormData, valor: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                <Input
                  id="data_vencimento"
                  type="date"
                  value={despesaFormData.data_vencimento}
                  onChange={(e) => setDespesaFormData({ ...despesaFormData, data_vencimento: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={despesaFormData.status} onValueChange={(value) => setDespesaFormData({ ...despesaFormData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={despesaFormData.fornecedor}
                  onChange={(e) => setDespesaFormData({ ...despesaFormData, fornecedor: e.target.value })}
                  placeholder="Ex: Imobiliária Central"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={despesaFormData.observacoes}
                  onChange={(e) => setDespesaFormData({ ...despesaFormData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDespesaDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveDespesa}>
                {editingDespesaId ? 'Atualizar' : 'Criar'} Despesa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
