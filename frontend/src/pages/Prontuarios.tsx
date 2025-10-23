import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Eye, Edit, FileText, Download, Printer } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface Prontuario {
  id: number;
  paciente_id: number;
  consulta_id?: number;
  medico_id: number;
  data: string;
  anamnese?: string;
  diagnostico?: string;
  prescricao?: string;
  exames_solicitados?: string;
  observacoes?: string;
  paciente_nome?: string;
  medico_nome?: string;
}

interface ProntuarioFormData {
  paciente_id: string;
  consulta_id: string;
  medico_id: string;
  anamnese: string;
  diagnostico: string;
  prescricao: string;
  exames_solicitados: string;
  observacoes: string;
}

interface Paciente {
  id: number;
  nome: string;
}

interface Medico {
  id: number;
  nome: string;
}

export default function Prontuarios() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingProntuario, setViewingProntuario] = useState<Prontuario | null>(null);
  const [filtroPaciente, setFiltroPaciente] = useState<string>('');

  const [formData, setFormData] = useState<ProntuarioFormData>({
    paciente_id: '',
    consulta_id: '',
    medico_id: '',
    anamnese: '',
    diagnostico: '',
    prescricao: '',
    exames_solicitados: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarDados();
  }, [filtroPaciente]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      const params: any = {};
      if (filtroPaciente && filtroPaciente !== 'all') params.paciente_id = filtroPaciente;
      
      const [prontuariosRes, pacientesRes, medicosRes] = await Promise.all([
        api.get('/prontuarios', { params }),
        api.get('/pacientes'),
        api.get('/medicos'),
      ]);
      
      // A API retorna { items: [], total: number, skip: number, limit: number }
      setProntuarios(prontuariosRes.data.items || prontuariosRes.data || []);
      setPacientes(pacientesRes.data.items || pacientesRes.data || []);
      setMedicos(medicosRes.data.items || medicosRes.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar prontuários');
    } finally {
      setLoading(false);
    }
  };

  const filteredProntuarios = prontuarios.filter(prontuario =>
    (prontuario.paciente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prontuario.medico_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prontuario.diagnostico?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      paciente_id: '',
      consulta_id: '',
      medico_id: '',
      anamnese: '',
      diagnostico: '',
      prescricao: '',
      exames_solicitados: '',
      observacoes: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (prontuario?: Prontuario) => {
    if (prontuario) {
      setEditingId(prontuario.id);
      setFormData({
        paciente_id: prontuario.paciente_id.toString(),
        consulta_id: prontuario.consulta_id?.toString() || '',
        medico_id: prontuario.medico_id.toString(),
        anamnese: prontuario.anamnese || '',
        diagnostico: prontuario.diagnostico || '',
        prescricao: prontuario.prescricao || '',
        exames_solicitados: prontuario.exames_solicitados || '',
        observacoes: prontuario.observacoes || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.paciente_id || !formData.medico_id) {
      toast.error('Paciente e médico são obrigatórios');
      return;
    }

    const loadingToast = toast.loading(editingId ? 'Atualizando prontuário...' : 'Criando prontuário...');

    try {
      const payload = {
        paciente_id: parseInt(formData.paciente_id),
        consulta_id: formData.consulta_id ? parseInt(formData.consulta_id) : null,
        medico_id: parseInt(formData.medico_id),
        data: new Date().toISOString(), // Data atual
        anamnese: formData.anamnese || '',
        diagnostico: formData.diagnostico || '',
        prescricao: formData.prescricao || null,
        exames_solicitados: formData.exames_solicitados || null,
        observacoes: formData.observacoes || null,
      };

      if (editingId) {
        await api.put(`/prontuarios/${editingId}`, payload);
        toast.dismiss(loadingToast);
        toast.success('Prontuário atualizado com sucesso!');
      } else {
        await api.post('/prontuarios', payload);
        toast.dismiss(loadingToast);
        toast.success('Prontuário criado com sucesso!');
      }
      
      resetForm();
      setIsDialogOpen(false);
      await carregarDados();
    } catch (error: any) {
      console.error('Erro ao salvar prontuário:', error);
      toast.dismiss(loadingToast);
      const errorMessage = error.response?.data?.detail || error.message || 'Erro ao salvar prontuário';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Erro ao salvar prontuário');
    }
  };

  const handleView = async (id: number) => {
    try {
      const response = await api.get(`/prontuarios/${id}`);
      setViewingProntuario(response.data);
      setIsViewDialogOpen(true);
    } catch (error) {
      console.error('Erro ao carregar prontuário:', error);
      toast.error('Erro ao carregar detalhes do prontuário');
    }
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      toast.loading('Gerando PDF...');
      const response = await api.get(`/prontuarios/${id}/pdf`, {
        responseType: 'blob',
      });
      
      // Criar URL do blob e fazer download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prontuario_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.dismiss();
      toast.error('Erro ao gerar PDF');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <MainLayout 
      title="Prontuários" 
      subtitle="Gerencie os prontuários médicos"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar prontuários..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Prontuário
                </Button>
              </div>

              {/* Filtro por Paciente */}
              <div className="w-full md:w-64">
                <Select value={filtroPaciente} onValueChange={setFiltroPaciente}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os pacientes</SelectItem>
                    {pacientes.map(paciente => (
                      <SelectItem key={paciente.id} value={paciente.id.toString()}>
                        {paciente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Prontuários</p>
                <p className="text-3xl font-bold text-primary mt-2">{prontuarios.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pacientes Atendidos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {new Set(prontuarios.map(p => p.paciente_id)).size}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {prontuarios.filter(p => {
                    const date = new Date(p.data);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prontuários Table */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Prontuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : filteredProntuarios.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum prontuário encontrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProntuarios.map((prontuario) => (
                    <TableRow key={prontuario.id} className="hover:bg-accent/50">
                      <TableCell className="font-medium">{formatDate(prontuario.data)}</TableCell>
                      <TableCell>{prontuario.paciente_nome || `Paciente #${prontuario.paciente_id}`}</TableCell>
                      <TableCell>{prontuario.medico_nome || `Médico #${prontuario.medico_id}`}</TableCell>
                      <TableCell className="max-w-md truncate">
                        {prontuario.diagnostico || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleView(prontuario.id)}
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenDialog(prontuario)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownloadPDF(prontuario.id)}
                            title="Baixar PDF"
                          >
                            <Download className="w-4 h-4" />
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

      {/* Dialog Criar/Editar Prontuário */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Prontuário' : 'Novo Prontuário'}</DialogTitle>
            <DialogDescription>
              Preencha os dados do prontuário médico.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
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

              {/* Anamnese */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="anamnese">Anamnese</Label>
                <Textarea
                  id="anamnese"
                  name="anamnese"
                  placeholder="Histórico do paciente, queixas principais..."
                  value={formData.anamnese}
                  onChange={(e) => handleInputChange('anamnese', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Diagnóstico */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Textarea
                  id="diagnostico"
                  name="diagnostico"
                  placeholder="Diagnóstico clínico..."
                  value={formData.diagnostico}
                  onChange={(e) => handleInputChange('diagnostico', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Prescrição */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="prescricao">Prescrição</Label>
                <Textarea
                  id="prescricao"
                  name="prescricao"
                  placeholder="Medicamentos prescritos, dosagens..."
                  value={formData.prescricao}
                  onChange={(e) => handleInputChange('prescricao', e.target.value)}
                  rows={4}
                />
              </div>

              {/* Exames Solicitados */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="exames_solicitados">Exames Solicitados</Label>
                <Textarea
                  id="exames_solicitados"
                  name="exames_solicitados"
                  placeholder="Exames complementares solicitados..."
                  value={formData.exames_solicitados}
                  onChange={(e) => handleInputChange('exames_solicitados', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Observações */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  name="observacoes"
                  placeholder="Observações adicionais..."
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
                {editingId ? 'Atualizar' : <><Plus className="w-4 h-4 mr-2" />Criar</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Visualizar Prontuário */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Prontuário Médico</DialogTitle>
            <DialogDescription>
              Visualização completa do prontuário
            </DialogDescription>
          </DialogHeader>

          {viewingProntuario && (
            <div className="space-y-6">
              {/* Cabeçalho */}
              <div className="grid gap-4 md:grid-cols-3 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                  <p className="text-base font-semibold">{viewingProntuario.paciente_nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Médico</p>
                  <p className="text-base font-semibold">{viewingProntuario.medico_nome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p className="text-base font-semibold">{formatDate(viewingProntuario.data)}</p>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="space-y-4">
                {viewingProntuario.anamnese && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Anamnese</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingProntuario.anamnese}</p>
                  </div>
                )}

                {viewingProntuario.diagnostico && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Diagnóstico</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingProntuario.diagnostico}</p>
                  </div>
                )}

                {viewingProntuario.prescricao && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Prescrição</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingProntuario.prescricao}</p>
                  </div>
                )}

                {viewingProntuario.exames_solicitados && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Exames Solicitados</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingProntuario.exames_solicitados}</p>
                  </div>
                )}

                {viewingProntuario.observacoes && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Observações</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{viewingProntuario.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => viewingProntuario && handleDownloadPDF(viewingProntuario.id)}
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar PDF
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
