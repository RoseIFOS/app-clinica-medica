import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data
const pacientesMock = [
  {
    id: 1,
    nome: 'Maria da Silva',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    email: 'maria@email.com',
    dataNascimento: '15/01/1990',
    convenio: 'Particular',
  },
  {
    id: 2,
    nome: 'José Santos',
    cpf: '987.654.321-00',
    telefone: '(11) 98888-8888',
    email: 'jose@email.com',
    dataNascimento: '22/05/1985',
    convenio: 'Unimed',
  },
  {
    id: 3,
    nome: 'Ana Oliveira',
    cpf: '456.789.123-00',
    telefone: '(11) 97777-7777',
    email: 'ana@email.com',
    dataNascimento: '10/11/1995',
    convenio: 'Particular',
  },
];

export default function Pacientes() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPacientes = pacientesMock.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.cpf.includes(searchTerm) ||
    paciente.telefone.includes(searchTerm)
  );

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
              <Button className="w-full md:w-auto">
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
                <p className="text-3xl font-bold text-primary mt-2">150</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Novos este Mês</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">15</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Consultas Agendadas</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">42</p>
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
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{paciente.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{paciente.dataNascimento}</TableCell>
                    <TableCell>
                      <Badge variant={paciente.convenio === 'Particular' ? 'default' : 'secondary'}>
                        {paciente.convenio}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
