import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, X, Edit, Trash2, CheckCircle2, XCircle, Grid3X3, List, Eye, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Consulta {
  id: number;
  paciente_id: number;
  medico_id: number;
  data_hora: string;
  duracao: number;
  tipo: string;
  status: string;
  observacoes?: string;
  paciente_nome?: string;
  medico_nome?: string;
}

interface Medico {
  id: number;
  nome: string;
  especialidade?: string;
}

interface Paciente {
  id: number;
  nome: string;
}

interface ConsultaFormData {
  paciente_id: string;
  medico_id: string;
  data: string;
  hora: string;
  duracao: string;
  tipo: string;
  observacoes: string;
}

export default function Agenda() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filtroMedico, setFiltroMedico] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  
  const [formData, setFormData] = useState<ConsultaFormData>({
    paciente_id: '',
    medico_id: '',
    data: '',
    hora: '',
    duracao: '30',
    tipo: 'primeira_consulta',
    observacoes: '',
  });

  const [stats, setStats] = useState({
    total: 0,
    confirmadas: 0,
    pendentes: 0,
    livres: 0,
  });

  useEffect(() => {
    carregarDados();
  }, [currentDate, filtroMedico, filtroStatus]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Formatar data para API (usar timezone local)
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dataStr = `${year}-${month}-${day}`;
      
      console.log('📅 Data selecionada:', currentDate);
      console.log('📅 Data formatada para API:', dataStr);
      
      // Carregar consultas do dia
      const params: any = { 
        data_inicio: dataStr,
        data_fim: dataStr
      };
      if (filtroMedico && filtroMedico !== 'all') params.medico_id = filtroMedico;
      if (filtroStatus && filtroStatus !== 'all') params.status = filtroStatus;
      
      const [consultasRes, medicosRes, pacientesRes] = await Promise.all([
        api.get('/consultas', { params }),
        api.get('/medicos'),
        api.get('/pacientes'),
      ]);
      
      // A API retorna { items: [], total: number, skip: number, limit: number }
      const consultasArray = consultasRes.data.items || consultasRes.data || [];
      const medicosArray = medicosRes.data.items || medicosRes.data || [];
      const pacientesArray = pacientesRes.data.items || pacientesRes.data || [];
      
      console.log('📅 Consultas carregadas:', consultasArray);
      console.log('👨‍⚕️ Médicos carregados:', medicosArray);
      console.log('📅 Data atual:', currentDate.toISOString().split('T')[0]);
      console.log('🔍 Parâmetros enviados:', params);
      
      // Log detalhado das consultas
      consultasArray.forEach((consulta, index) => {
        const consultaDate = new Date(consulta.data_hora);
        console.log(`📋 Consulta ${index + 1}:`, {
          id: consulta.id,
          paciente_id: consulta.paciente_id,
          medico_id: consulta.medico_id,
          data_hora: consulta.data_hora,
          data_formatada: consultaDate.toISOString().split('T')[0],
          hora: consultaDate.toTimeString().slice(0, 5),
          status: consulta.status,
          paciente_nome: consulta.paciente_nome,
          medico_nome: consulta.medico_nome
        });
      });
      
      setConsultas(consultasArray);
      setMedicos(medicosArray);
      setPacientes(pacientesArray);
      
      // Calcular stats
      const totalSlots = medicosArray.length * 20; // 20 horários por médico
      const ocupados = consultasArray.length;
      const livres = totalSlots - ocupados;
      
      setStats({
        total: consultasArray.length,
        confirmadas: consultasArray.filter((c: Consulta) => c.status === 'confirmada').length,
        pendentes: consultasArray.filter((c: Consulta) => c.status === 'agendada').length,
        livres: Math.max(0, livres),
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      paciente_id: '',
      medico_id: '',
      data: '',
      hora: '',
      duracao: '30',
      tipo: 'primeira_consulta',
      observacoes: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (consulta?: Consulta, time?: string, medicoId?: number) => {
    if (consulta) {
      const dataHora = new Date(consulta.data_hora);
      setEditingId(consulta.id);
      setFormData({
        paciente_id: consulta.paciente_id?.toString() || '',
        medico_id: consulta.medico_id?.toString() || '',
        data: dataHora.toISOString().split('T')[0],
        hora: dataHora.toTimeString().slice(0, 5),
        duracao: consulta.duracao?.toString() || '30',
        tipo: consulta.tipo || 'primeira_consulta',
        observacoes: consulta.observacoes || '',
      });
    } else {
      resetForm();
      // Pré-preencher com a data atual e horário/médico se fornecidos
      setFormData(prev => ({
        ...prev,
        data: currentDate.toISOString().split('T')[0],
        hora: time || '',
        medico_id: medicoId ? medicoId.toString() : '',
      }));
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paciente_id || !formData.medico_id || !formData.data || !formData.hora) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Atualizando consulta...' : 'Agendando consulta...');

    try {
      const dataHora = `${formData.data}T${formData.hora}:00`;
      
      const payload = {
        paciente_id: parseInt(formData.paciente_id),
        medico_id: parseInt(formData.medico_id),
        data_hora: dataHora,
        duracao: parseInt(formData.duracao),
        tipo: formData.tipo,
        observacoes: formData.observacoes || null,
        status: 'agendada',
      };

      if (editingId) {
        await api.put(`/consultas/${editingId}`, payload);
        toast.dismiss(loadingToast);
        toast.success('Consulta atualizada com sucesso!');
      } else {
        await api.post('/consultas/', payload);
        toast.dismiss(loadingToast);
        toast.success('Consulta agendada com sucesso!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      await carregarDados();
    } catch (error: any) {
      console.error('Erro ao salvar consulta:', error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.detail || 'Erro ao salvar consulta');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/consultas/${deletingId}`);
      toast.success('Consulta cancelada com sucesso!');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await carregarDados();
    } catch (error: any) {
      console.error('Erro ao cancelar consulta:', error);
      toast.error(error.response?.data?.detail || 'Erro ao cancelar consulta');
    }
  };

  const handleChangeStatus = async (id: number, novoStatus: string) => {
    try {
      await api.patch(`/consultas/${id}/status`, { status: novoStatus });
      toast.success(`Consulta ${novoStatus === 'confirmada' ? 'confirmada' : 'realizada'} com sucesso!`);
      await carregarDados();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      toast.error(error.response?.data?.detail || 'Erro ao atualizar status');
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      agendada: { variant: 'default', label: 'Agendada' },
      confirmada: { variant: 'secondary', label: 'Confirmada' },
      realizada: { variant: 'outline', label: 'Realizada' },
      cancelada: { variant: 'destructive', label: 'Cancelada' },
    };
    
    const config = variants[status] || variants.agendada;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getTipoBadge = (tipo: string) => {
    const labels: Record<string, string> = {
      primeira_consulta: 'Primeira Consulta',
      retorno: 'Retorno',
      exame: 'Exame',
    };
    
    return <Badge variant="outline">{labels[tipo] || tipo}</Badge>;
  };

  // Gerar horários disponíveis (08:00 às 18:00, blocos de 30min)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Verificar se um horário está ocupado (apenas para a data atual)
  const isTimeSlotOccupied = (medicoId: number, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    
    const isOccupied = consultas.some(consulta => {
      const consultaDate = new Date(consulta.data_hora);
      const consultaDateStr = consultaDate.toISOString().split('T')[0];
      const currentDateStr = currentDate.toISOString().split('T')[0];
      
      const matches = consulta.medico_id === medicoId && 
             consultaDateStr === currentDateStr &&
             consultaDate.getHours() === hours && 
             consultaDate.getMinutes() === minutes;
      
      if (matches) {
        console.log('🎯 Consulta encontrada:', {
          consulta,
          medicoId,
          time,
          consultaDate: consultaDate.toISOString(),
          consultaDateStr,
          currentDateStr,
          hours,
          minutes
        });
      }
      
      return matches;
    });
    
    if (isOccupied) {
      console.log(`✅ Horário ${time} ocupado para médico ${medicoId}`);
    }
    
    return isOccupied;
  };

  // Obter todas as consultas do médico (independente da data)
  const getConsultasDoMedico = (medicoId: number) => {
    return consultas.filter(consulta => consulta.medico_id === medicoId);
  };

  // Obter consulta em um horário específico
  const getConsultaAtTime = (medicoId: number, time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return consultas.find(consulta => {
      const consultaDate = new Date(consulta.data_hora);
      const consultaDateStr = consultaDate.toISOString().split('T')[0];
      const currentDateStr = currentDate.toISOString().split('T')[0];
      
      return consulta.medico_id === medicoId && 
             consultaDateStr === currentDateStr &&
             consultaDate.getHours() === hours && 
             consultaDate.getMinutes() === minutes;
    });
  };

  return (
    <MainLayout 
      title="Agenda" 
      subtitle="Gerencie os agendamentos de consultas"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => changeDate(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg capitalize">{formatDate(currentDate)}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => changeDate(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
                    Hoje
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('calendar')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Calendário
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4 mr-2" />
                      Lista
                    </Button>
                  </div>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-4">
                <div className="w-full md:w-64">
                  <Select value={filtroMedico} onValueChange={setFiltroMedico}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por médico" />
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

                <div className="w-full md:w-64">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="realizada">Realizada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Hoje</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.confirmadas}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.pendentes}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Horários Livres</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">{stats.livres}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Consultas do Dia */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Consultas do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : viewMode === 'calendar' ? (
              // Visão Calendário
              <div className="space-y-6">
                {medicos.map((medico) => (
                  <div key={medico.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">{medico.nome}</h3>
                      <Badge variant="outline">{medico.especialidade}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2">
                      {timeSlots.map((time) => {
                        const isOccupied = isTimeSlotOccupied(medico.id, time);
                        const consulta = getConsultaAtTime(medico.id, time);
                        
                        return (
                          <div
                            key={time}
                            className={`
                              p-3 rounded-lg border text-center transition-all
                              ${isOccupied 
                                ? 'bg-red-50 border-red-200 hover:bg-red-100 cursor-not-allowed' 
                                : 'bg-green-50 border-green-200 hover:bg-green-100 hover:shadow-md cursor-pointer'
                              }
                            `}
                            title={isOccupied ? 'Horário ocupado' : 'Clique para agendar consulta'}
                            onClick={() => !isOccupied && handleOpenDialog(undefined, time, medico.id)}
                          >
                            <div className="text-sm font-medium text-gray-700">{time}</div>
                            {isOccupied && consulta ? (
                              <div className="mt-1">
                                <div className="text-xs text-red-600 font-medium truncate">
                                  {consulta.paciente_nome}
                                </div>
                                <Badge 
                                  variant={consulta.status === 'confirmada' ? 'default' : 'secondary'}
                                  className="text-xs mt-1"
                                >
                                  {consulta.status}
                                </Badge>
                              </div>
                            ) : (
                              <div className="text-xs text-green-600 mt-1 font-medium flex items-center justify-center gap-1">
                                <Plus className="w-3 h-3" />
                                Agendar
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : consultas.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma consulta agendada para este dia</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultas.map((consulta) => (
                    <TableRow key={consulta.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {formatTime(consulta.data_hora)}
                        </div>
                      </TableCell>
                      <TableCell>{consulta.paciente_nome || `Paciente #${consulta.paciente_id}`}</TableCell>
                      <TableCell>{consulta.medico_nome || `Médico #${consulta.medico_id}`}</TableCell>
                      <TableCell>{getTipoBadge(consulta.tipo)}</TableCell>
                      <TableCell>{getStatusBadge(consulta.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">{consulta.observacoes || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {consulta.status === 'agendada' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleChangeStatus(consulta.id, 'confirmada')}
                              title="Confirmar"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          {consulta.status === 'confirmada' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleChangeStatus(consulta.id, 'realizada')}
                              title="Marcar como realizada"
                            >
                              <CheckCircle2 className="w-4 h-4 text-blue-600" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenDialog(consulta)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeletingId(consulta.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Cancelar"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Agendar/Editar Consulta */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Consulta' : 'Agendar Consulta'}</DialogTitle>
            <DialogDescription>
              Preencha os dados da consulta. Todos os campos são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Paciente */}
              <div className="space-y-2 md:col-span-2">
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
              <div className="space-y-2 md:col-span-2">
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
                        {medico.nome} {medico.especialidade && `- ${medico.especialidade}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  required
                />
              </div>

              {/* Hora */}
              <div className="space-y-2">
                <Label htmlFor="hora">Horário *</Label>
                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                  required
                />
              </div>

              {/* Duração */}
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (minutos) *</Label>
                <Select 
                  value={formData.duracao} 
                  onValueChange={(value) => handleInputChange('duracao', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo */}
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Consulta *</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleInputChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primeira_consulta">Primeira Consulta</SelectItem>
                    <SelectItem value="retorno">Retorno</SelectItem>
                    <SelectItem value="exame">Exame</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Observações */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Observações sobre a consulta"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingId ? 'Atualizar' : <><Plus className="w-4 h-4 mr-2" />Agendar</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cancelar Consulta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
