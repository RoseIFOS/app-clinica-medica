import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Eye, Edit, FileText, User, Calendar } from 'lucide-react';

const prontuariosMock = [
  {
    id: 1,
    paciente: 'Maria da Silva',
    data: '15/10/2025',
    medico: 'Dr. João Silva',
    diagnostico: 'Cefaleia tensional',
    status: 'completo'
  },
  {
    id: 2,
    paciente: 'José Santos',
    data: '14/10/2025',
    medico: 'Dr. João Silva',
    diagnostico: 'Hipertensão arterial',
    status: 'completo'
  },
  {
    id: 3,
    paciente: 'Ana Oliveira',
    data: '13/10/2025',
    medico: 'Dra. Maria Costa',
    diagnostico: 'Check-up anual',
    status: 'rascunho'
  },
];

export default function Prontuarios() {
  return (
    <MainLayout 
      title="Prontuários" 
      subtitle="Gerencie os prontuários médicos"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar prontuários..."
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Prontuário
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total de Prontuários</p>
                <p className="text-3xl font-bold text-primary mt-2">340</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">45</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Rascunhos</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">3</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prontuários List */}
        <div className="grid gap-4">
          {prontuariosMock.map((prontuario) => (
            <Card key={prontuario.id} className="card-shadow hover:card-shadow-lg transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{prontuario.paciente}</h3>
                        <Badge variant={prontuario.status === 'completo' ? 'default' : 'secondary'}>
                          {prontuario.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{prontuario.medico}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{prontuario.data}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Diagnóstico:</span> {prontuario.diagnostico}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Templates */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {['Consulta Inicial', 'Retorno', 'Exame de Rotina', 'Prescrição', 'Atestado', 'Solicitação de Exames'].map((template) => (
                <div key={template} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="font-medium">{template}</span>
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
