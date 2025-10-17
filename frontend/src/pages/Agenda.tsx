import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

// Mock data para agenda
const consultasAgenda = [
  { id: 1, horario: '09:00', paciente: 'Maria da Silva', medico: 'Dr. João Silva', tipo: 'Retorno', status: 'confirmada' },
  { id: 2, horario: '09:30', paciente: null, medico: 'Dr. João Silva', tipo: null, status: 'disponivel' },
  { id: 3, horario: '10:00', paciente: 'José Santos', medico: 'Dr. João Silva', tipo: 'Primeira Consulta', status: 'agendada' },
  { id: 4, horario: '10:30', paciente: null, medico: 'Dr. João Silva', tipo: null, status: 'disponivel' },
  { id: 5, horario: '11:00', paciente: 'Ana Oliveira', medico: 'Dra. Maria Costa', tipo: 'Exame', status: 'confirmada' },
  { id: 6, horario: '11:30', paciente: null, medico: 'Dra. Maria Costa', tipo: null, status: 'disponivel' },
  { id: 7, horario: '14:00', paciente: 'Pedro Lima', medico: 'Dr. João Silva', tipo: 'Retorno', status: 'agendada' },
  { id: 8, horario: '14:30', paciente: null, medico: 'Dr. João Silva', tipo: null, status: 'disponivel' },
];

const medicos = [
  { id: 1, nome: 'Dr. João Silva', especialidade: 'Clínico Geral', cor: '#10B981' },
  { id: 2, nome: 'Dra. Maria Costa', especialidade: 'Cardiologista', cor: '#3B82F6' },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmada':
      return 'badge-confirmada';
    case 'agendada':
      return 'badge-agendada';
    case 'cancelada':
      return 'badge-cancelada';
    case 'realizada':
      return 'badge-realizada';
    default:
      return '';
  }
}

export default function Agenda() {
  return (
    <MainLayout 
      title="Agenda" 
      subtitle="Gerencie os agendamentos de consultas"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-lg">Segunda, 17 de Outubro de 2025</span>
                </div>
                <Button variant="outline" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Hoje</p>
                <p className="text-3xl font-bold text-primary mt-2">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Confirmadas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">8</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">4</p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Horários Livres</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">16</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Médicos Tabs */}
        <div className="flex gap-2 flex-wrap">
          <Button variant="default">Todos os Médicos</Button>
          {medicos.map((medico) => (
            <Button key={medico.id} variant="outline">
              {medico.nome}
            </Button>
          ))}
        </div>

        {/* Agenda Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {medicos.map((medico) => (
            <Card key={medico.id} className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: medico.cor }}
                      ></div>
                      <span>{medico.nome}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      {medico.especialidade}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {consultasAgenda
                    .filter(c => c.medico === medico.nome)
                    .map((consulta) => (
                      <div
                        key={consulta.id}
                        className={`p-4 rounded-lg border transition-all ${
                          consulta.status === 'disponivel'
                            ? 'border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer'
                            : 'border-border bg-card hover:shadow-md cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2 min-w-[60px]">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold">{consulta.horario}</span>
                            </div>
                            {consulta.paciente ? (
                              <div className="flex-1">
                                <p className="font-medium">{consulta.paciente}</p>
                                <p className="text-sm text-muted-foreground">{consulta.tipo}</p>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">Horário disponível</p>
                            )}
                          </div>
                          {consulta.status !== 'disponivel' && (
                            <Badge className={getStatusColor(consulta.status)}>
                              {consulta.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legenda */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Legenda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="badge-agendada">Agendada</Badge>
                <span className="text-sm text-muted-foreground">Aguardando confirmação</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="badge-confirmada">Confirmada</Badge>
                <span className="text-sm text-muted-foreground">Paciente confirmou presença</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="badge-realizada">Realizada</Badge>
                <span className="text-sm text-muted-foreground">Consulta concluída</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="badge-cancelada">Cancelada</Badge>
                <span className="text-sm text-muted-foreground">Consulta cancelada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
