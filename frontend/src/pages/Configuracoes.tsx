import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Settings2, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const medicosMock = [
  { id: 1, nome: 'Dr. João Silva', crm: '123456', especialidade: 'Clínico Geral', email: 'dr.silva@clinica.com', status: 'ativo' },
  { id: 2, nome: 'Dra. Maria Costa', crm: '789012', especialidade: 'Cardiologista', email: 'dra.costa@clinica.com', status: 'ativo' },
];

const usuariosMock = [
  { id: 1, nome: 'Admin Sistema', email: 'admin@clinica.com', role: 'admin', status: 'ativo' },
  { id: 2, nome: 'Recepcionista', email: 'recep@clinica.com', role: 'recepcionista', status: 'ativo' },
];

const horariosAtendimento = [
  { dia: 'Segunda-feira', inicio: '08:00', fim: '18:00' },
  { dia: 'Terça-feira', inicio: '08:00', fim: '18:00' },
  { dia: 'Quarta-feira', inicio: '08:00', fim: '18:00' },
  { dia: 'Quinta-feira', inicio: '08:00', fim: '18:00' },
  { dia: 'Sexta-feira', inicio: '08:00', fim: '17:00' },
];

export default function Configuracoes() {
  return (
    <MainLayout 
      title="Configurações" 
      subtitle="Configure o sistema da clínica"
    >
      <div className="space-y-6">
        {/* Médicos */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle>Médicos</CardTitle>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Médico
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CRM</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicosMock.map((medico) => (
                  <TableRow key={medico.id}>
                    <TableCell className="font-medium">{medico.nome}</TableCell>
                    <TableCell>{medico.crm}</TableCell>
                    <TableCell>{medico.especialidade}</TableCell>
                    <TableCell>{medico.email}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {medico.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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
          </CardContent>
        </Card>

        {/* Horários de Atendimento */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <CardTitle>Horários de Atendimento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {horariosAtendimento.map((horario) => (
                <div key={horario.dia} className="grid grid-cols-3 gap-4 items-center p-4 rounded-lg border border-border">
                  <Label className="font-medium">{horario.dia}</Label>
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue={horario.inicio} className="w-32" />
                    <span className="text-muted-foreground">até</span>
                    <Input type="time" defaultValue={horario.fim} className="w-32" />
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">Salvar</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usuários do Sistema */}
        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <CardTitle>Usuários do Sistema</CardTitle>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosMock.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {usuario.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {usuario.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
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
          </CardContent>
        </Card>

        {/* Configurações Gerais */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinica-nome">Nome da Clínica</Label>
                  <Input id="clinica-nome" defaultValue="Clínica Médica" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinica-telefone">Telefone</Label>
                  <Input id="clinica-telefone" defaultValue="(11) 3333-3333" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinica-endereco">Endereço</Label>
                <Input id="clinica-endereco" defaultValue="Rua Exemplo, 123 - São Paulo, SP" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracao-consulta">Duração Padrão da Consulta (minutos)</Label>
                  <Input id="duracao-consulta" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="antecedencia-lembrete">Antecedência de Lembrete (dias)</Label>
                  <Input id="antecedencia-lembrete" type="number" defaultValue="2" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Salvar Configurações</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
