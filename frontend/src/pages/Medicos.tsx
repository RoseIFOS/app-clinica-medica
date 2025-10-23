import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Plus, Search, Edit, Trash2, Clock, User, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Medico {
  id: number;
  nome: string;
  email: string;
  crm?: string;
  especialidade?: string;
  telefone?: string;
}

interface Horario {
  id: number;
  medico_id: number;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

interface MedicoFormData {
  nome: string;
  email: string;
  senha: string;
  crm: string;
  especialidade: string;
  telefone: string;
}

interface HorarioFormData {
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
  ativo: boolean;
}

const DIAS_SEMANA = [
  { id: 0, nome: 'Domingo' },
  { id: 1, nome: 'Segunda-feira' },
  { id: 2, nome: 'Terça-feira' },
  { id: 3, nome: 'Quarta-feira' },
  { id: 4, nome: 'Quinta-feira' },
  { id: 5, nome: 'Sexta-feira' },
  { id: 6, nome: 'Sábado' },
];

export default function Medicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHorariosDialogOpen, setIsHorariosDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedMedicoId, setSelectedMedicoId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<MedicoFormData>({
    nome: '',
    email: '',
    senha: '',
    crm: '',
    especialidade: '',
    telefone: '',
  });

  useEffect(() => {
    carregarMedicos();
  }, []);

  const carregarMedicos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/medicos');
      // A API retorna { items: [], total: number, skip: number, limit: number }
      setMedicos(response.data.items || response.data || []);
    } catch (error) {
      console.error('Erro ao carregar médicos:', error);
      toast.error('Erro ao carregar médicos');
    } finally {
      setLoading(false);
    }
  };

  const carregarHorarios = async (medicoId: number) => {
    try {
      const response = await api.get(`/medicos/${medicoId}/horarios`);
      setHorarios(response.data.horarios || response.data || []);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      toast.error('Erro ao carregar horários');
    }
  };

  const filteredMedicos = medicos.filter(medico =>
    medico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.especialidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medico.crm?.includes(searchTerm)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      crm: '',
      especialidade: '',
      telefone: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (medico?: Medico) => {
    if (medico) {
      setEditingId(medico.id);
      setFormData({
        nome: medico.nome,
        email: medico.email,
        senha: '', // Não carregar senha
        crm: medico.crm || '',
        especialidade: medico.especialidade || '',
        telefone: medico.telefone || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    if (!editingId && !formData.senha) {
      toast.error('Senha é obrigatória para novo médico');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Atualizando médico...' : 'Cadastrando médico...');

    try {
      const payload: any = {
        nome: formData.nome,
        email: formData.email,
        crm: formData.crm || '',
        especialidade: formData.especialidade || '',
      };

      // Incluir senha apenas se fornecida
      if (formData.senha) {
        payload.password = formData.senha;
      }

      if (editingId) {
        await api.put(`/medicos/${editingId}`, payload);
        toast.dismiss(loadingToast);
        toast.success('Médico atualizado com sucesso!');
      } else {
        await api.post('/medicos', payload);
        toast.dismiss(loadingToast);
        toast.success('Médico cadastrado com sucesso!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      await carregarMedicos();
    } catch (error: any) {
      console.error('Erro ao salvar médico:', error);
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao salvar médico';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao salvar médico');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/medicos/${deletingId}`);
      toast.success('Médico removido com sucesso!');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await carregarMedicos();
    } catch (error: any) {
      console.error('Erro ao deletar médico:', error);
      toast.error(error.response?.data?.detail || 'Erro ao remover médico');
    }
  };

  const handleOpenHorarios = async (medicoId: number) => {
    setSelectedMedicoId(medicoId);
    await carregarHorarios(medicoId);
    setIsHorariosDialogOpen(true);
  };

  const handleToggleHorario = async (horario: Horario) => {
    try {
      await api.put(`/medicos/${horario.medico_id}/horarios/${horario.id}`, {
        ...horario,
        ativo: !horario.ativo,
      });
      toast.success('Horário atualizado!');
      if (selectedMedicoId) {
        await carregarHorarios(selectedMedicoId);
      }
    } catch (error: any) {
      console.error('Erro ao atualizar horário:', error);
      toast.error('Erro ao atualizar horário');
    }
  };

  const handleAddHorario = async (diaSemana: number) => {
    if (!selectedMedicoId) return;

    try {
      await api.post(`/medicos/${selectedMedicoId}/horarios`, {
        dia_semana: diaSemana,
        hora_inicio: '09:00',
        hora_fim: '17:00',
        ativo: true,
      });
      toast.success('Horário adicionado!');
      await carregarHorarios(selectedMedicoId);
    } catch (error: any) {
      console.error('Erro ao adicionar horário:', error);
      toast.error('Erro ao adicionar horário');
    }
  };

  return (
    <MainLayout 
      title="Médicos" 
      subtitle="Gerencie os médicos da clínica"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CRM ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Médico
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Médicos</p>
                <p className="text-3xl font-bold text-primary mt-2">{medicos.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Especialidades</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {new Set(medicos.map(m => m.especialidade).filter(Boolean)).size}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{medicos.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Médicos Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CRM</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicos.map((medico) => (
                      <TableRow key={medico.id} className="hover:bg-accent/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-medium">{medico.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{medico.crm || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {medico.especialidade || 'Não informado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {medico.telefone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <span>{medico.telefone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span>{medico.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenHorarios(medico.id)}
                              title="Horários"
                            >
                              <Clock className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDialog(medico)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingId(medico.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredMedicos.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum médico encontrado</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Criar/Editar Médico */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Médico' : 'Novo Médico'}</DialogTitle>
            <DialogDescription>
              Preencha os dados do médico. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome completo do médico"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha {!editingId && '*'}</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  placeholder={editingId ? "Deixe em branco para manter" : "Senha de acesso"}
                  value={formData.senha}
                  onChange={handleInputChange}
                  required={!editingId}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crm">CRM</Label>
                <Input
                  id="crm"
                  name="crm"
                  placeholder="000000"
                  value={formData.crm}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  name="especialidade"
                  placeholder="Ex: Cardiologia, Clínico Geral"
                  value={formData.especialidade}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleInputChange}
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
                {editingId ? 'Atualizar' : <><Plus className="w-4 h-4 mr-2" />Cadastrar</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Horários */}
      <Dialog open={isHorariosDialogOpen} onOpenChange={setIsHorariosDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Horários de Atendimento</DialogTitle>
            <DialogDescription>
              Configure os horários de atendimento do médico
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {DIAS_SEMANA.map((dia) => {
              const horariosDia = horarios.filter(h => h.dia_semana === dia.id);
              
              return (
                <div key={dia.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{dia.nome}</h4>
                    {horariosDia.length === 0 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAddHorario(dia.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    )}
                  </div>

                  {horariosDia.length > 0 ? (
                    <div className="space-y-2">
                      {horariosDia.map((horario) => (
                        <div key={horario.id} className="flex items-center gap-4">
                          <span className="text-sm">
                            {horario.hora_inicio} - {horario.hora_fim}
                          </span>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={horario.ativo}
                              onCheckedChange={() => handleToggleHorario(horario)}
                            />
                            <span className="text-sm text-muted-foreground">
                              {horario.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum horário configurado</p>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsHorariosDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este médico? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}

