import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
  data_nascimento?: string;
  whatsapp?: string;
  endereco?: string;
  convenio?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  numero_carteirinha?: string;
}

interface PacienteFormData {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  convenio: string;
  endereco: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  cep: string;
  numero_carteirinha: string;
}

export default function Pacientes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingPaciente, setViewingPaciente] = useState<Paciente | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    novos_mes: 0,
    consultas_agendadas: 0,
  });
  
  const [formData, setFormData] = useState<PacienteFormData>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    convenio: '',
    endereco: '',
    whatsapp: '',
    cidade: '',
    estado: '',
    cep: '',
    numero_carteirinha: '',
  });

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm) ||
    paciente.telefone.includes(searchTerm)
  );

  // Carregar pacientes da API
  const carregarPacientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pacientes');
      console.log('📋 Pacientes carregados:', response.data);
      
      // A API retorna { items: [], total: number, skip: number, limit: number }
      if (response.data.items) {
        setPacientes(response.data.items);
        setStats({
          total: response.data.total || response.data.items.length,
          novos_mes: response.data.novos_mes || 0,
          consultas_agendadas: response.data.consultas_agendadas || 0,
        });
      } else if (Array.isArray(response.data)) {
        setPacientes(response.data);
        setStats({
          total: response.data.length,
          novos_mes: 0,
          consultas_agendadas: 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  // Carregar ao montar o componente
  useEffect(() => {
    carregarPacientes();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      data_nascimento: '',
      convenio: '',
      endereco: '',
      whatsapp: '',
      cidade: '',
      estado: '',
      cep: '',
      numero_carteirinha: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (paciente?: Paciente) => {
    if (paciente) {
      // Modo edição
      setEditingId(paciente.id);
      setFormData({
        nome: paciente.nome || '',
        cpf: paciente.cpf || '',
        telefone: paciente.telefone || '',
        email: paciente.email || '',
        data_nascimento: paciente.data_nascimento || '',
        convenio: paciente.convenio || '',
        endereco: paciente.endereco || '',
        whatsapp: paciente.whatsapp || '',
        cidade: paciente.cidade || '',
        estado: paciente.estado || '',
        cep: paciente.cep || '',
        numero_carteirinha: paciente.numero_carteirinha || '',
      });
    } else {
      // Modo criação
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Iniciando cadastro/edição...', formData);
    
    // Validação básica
    if (!formData.nome || !formData.cpf || !formData.telefone) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Atualizando paciente...' : 'Cadastrando paciente...');

    try {
      const payload = {
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email || null,
        data_nascimento: formData.data_nascimento || null,
        whatsapp: formData.whatsapp || null,
        endereco: formData.endereco || null,
        convenio: formData.convenio || 'Particular',
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        cep: formData.cep || null,
        numero_carteirinha: formData.numero_carteirinha || null,
      };

      if (editingId) {
        // Atualizar paciente existente
        await api.put(`/pacientes/${editingId}`, payload);
        toast.dismiss(loadingToast);
        toast.success('Paciente atualizado com sucesso!');
      } else {
        // Criar novo paciente
        await api.post('/pacientes', payload);
        toast.dismiss(loadingToast);
        toast.success('Paciente cadastrado com sucesso!');
      }
      
      // Resetar formulário e fechar dialog
      resetForm();
      setIsDialogOpen(false);
      
      // Recarregar lista de pacientes
      await carregarPacientes();
    } catch (error: any) {
      console.error('❌ Erro ao salvar:', error);
      toast.dismiss(loadingToast);
      
      const errorMsg = error.response?.data?.detail || error.message || 'Erro ao salvar paciente';
      toast.error(errorMsg);
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await api.get(`/pacientes/${id}`);
      setViewingPaciente(response.data);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Erro ao carregar paciente:', error);
      toast.error('Erro ao carregar detalhes do paciente');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(`/pacientes/${deletingId}`);
      toast.success('Paciente removido com sucesso!');
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      await carregarPacientes();
    } catch (error: any) {
      console.error('Erro ao deletar paciente:', error);
      toast.error(error.response?.data?.detail || 'Erro ao remover paciente');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <MainLayout 
      title="Pacientes" 
      subtitle="Gerencie os pacientes da clínica"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                className="w-full md:w-auto"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Novos este Mês</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.novos_mes}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Consultas Agendadas</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.consultas_agendadas}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patients Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Pacientes</CardTitle>
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
                      <TableHead>CPF</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Data Nascimento</TableHead>
                      <TableHead>Convênio</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPacientes.map((paciente) => (
                      <TableRow key={paciente.id} className="hover:bg-accent/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-semibold text-sm">
                                {paciente.nome.split(' ')[0].charAt(0)}
                                {paciente.nome.split(' ')[1]?.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium">{paciente.nome}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{paciente.cpf}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3 text-muted-foreground" />
                              <span>{paciente.telefone}</span>
                            </div>
                            {paciente.email && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span>{paciente.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(paciente.data_nascimento)}</TableCell>
                        <TableCell>
                          <Badge variant={paciente.convenio === 'Particular' ? 'default' : 'secondary'}>
                            {paciente.convenio || 'Particular'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleView(paciente.id)}
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDialog(paciente)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setDeletingId(paciente.id);
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

                {filteredPacientes.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Nenhum paciente encontrado</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Criar/Editar Paciente */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
            <DialogDescription>
              Preencha os dados do paciente. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Nome Completo */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  name="nome"
                  placeholder="Nome completo do paciente"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  name="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={handleInputChange}
                />
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* WhatsApp */}
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Convênio */}
              <div className="space-y-2">
                <Label htmlFor="convenio">Convênio</Label>
                <Input
                  id="convenio"
                  name="convenio"
                  placeholder="Ex: Unimed, Particular"
                  value={formData.convenio}
                  onChange={handleInputChange}
                />
              </div>

              {/* Número Carteirinha */}
              <div className="space-y-2">
                <Label htmlFor="numero_carteirinha">Número da Carteirinha</Label>
                <Input
                  id="numero_carteirinha"
                  name="numero_carteirinha"
                  placeholder="Número do convênio"
                  value={formData.numero_carteirinha}
                  onChange={handleInputChange}
                />
              </div>

              {/* Endereço */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  placeholder="Rua, número, bairro"
                  value={formData.endereco}
                  onChange={handleInputChange}
                />
              </div>

              {/* CEP */}
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={handleInputChange}
                />
              </div>

              {/* Cidade */}
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  placeholder="UF"
                  value={formData.estado}
                  onChange={handleInputChange}
                  maxLength={2}
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

      {/* Dialog Visualizar Paciente */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Paciente</DialogTitle>
            <DialogDescription>
              Informações completas do paciente
            </DialogDescription>
          </DialogHeader>

          {viewingPaciente && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-base">{viewingPaciente.nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CPF</p>
                  <p className="text-base font-mono">{viewingPaciente.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data de Nascimento</p>
                  <p className="text-base">{formatDate(viewingPaciente.data_nascimento)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                  <p className="text-base">{viewingPaciente.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                  <p className="text-base">{viewingPaciente.whatsapp || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base">{viewingPaciente.email || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Convênio</p>
                  <p className="text-base">{viewingPaciente.convenio || 'Particular'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Número da Carteirinha</p>
                  <p className="text-base">{viewingPaciente.numero_carteirinha || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                  <p className="text-base">{viewingPaciente.endereco || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cidade</p>
                  <p className="text-base">{viewingPaciente.cidade || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <p className="text-base">{viewingPaciente.estado || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CEP</p>
                  <p className="text-base">{viewingPaciente.cep || '-'}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>
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
              Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.
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
