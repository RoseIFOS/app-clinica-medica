import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Check, X, Clock, Send, AlertCircle } from 'lucide-react';

const lembretesMock = [
  { id: 1, paciente: 'Maria da Silva', telefone: '(11) 99999-9999', consulta: '20/10/2025 09:00', status: 'enviado', data: '18/10/2025 10:30' },
  { id: 2, paciente: 'José Santos', telefone: '(11) 98888-8888', consulta: '20/10/2025 10:00', status: 'enviado', data: '18/10/2025 10:31' },
  { id: 3, paciente: 'Ana Oliveira', telefone: '(11) 97777-7777', consulta: '21/10/2025 11:00', status: 'pendente', data: '-' },
  { id: 4, paciente: 'Pedro Lima', telefone: '(11) 96666-6666', consulta: '19/10/2025 14:00', status: 'falhou', data: '17/10/2025 15:20' },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'enviado':
      return <Check className="w-4 h-4 text-green-600" />;
    case 'falhou':
      return <X className="w-4 h-4 text-red-600" />;
    case 'pendente':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    default:
      return null;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'enviado':
      return <Badge className="bg-green-100 text-green-700 border-green-200">Enviado</Badge>;
    case 'falhou':
      return <Badge className="bg-red-100 text-red-700 border-red-200">Falhou</Badge>;
    case 'pendente':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pendente</Badge>;
    default:
      return null;
  }
}

export default function Lembretes() {
  return (
    <MainLayout 
      title="Lembretes WhatsApp" 
      subtitle="Gerencie os lembretes de consultas"
    >
      <div className="space-y-6">
        {/* WhatsApp Status */}
        <Card className="card-shadow bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">WhatsApp Conectado</h3>
                  <p className="text-sm text-muted-foreground">Sistema pronto para enviar lembretes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Enviados</p>
                  <p className="text-3xl font-bold text-primary mt-2">234</p>
                </div>
                <Send className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enviados Hoje</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">12</p>
                </div>
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Falhas</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">2</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="card-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Button className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Enviar Lembretes Agora
              </Button>
              <Button variant="outline" className="flex-1">
                Reenviar Lembretes Falhados
              </Button>
              <Button variant="outline" className="flex-1">
                Configurações de Envio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lembretes List */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Histórico de Lembretes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lembretesMock.map((lembrete) => (
                <div 
                  key={lembrete.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getStatusIcon(lembrete.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{lembrete.paciente}</p>
                        {getStatusBadge(lembrete.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">
                          <MessageCircle className="w-3 h-3 inline mr-1" />
                          {lembrete.telefone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Consulta: {lembrete.consulta}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {lembrete.data !== '-' ? `Enviado em ${lembrete.data}` : 'Aguardando envio'}
                    </p>
                    {lembrete.status === 'falhou' && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Reenviar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="card-shadow bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Sobre os Lembretes Automáticos</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Os lembretes são enviados automaticamente 2 dias antes da consulta. 
                  Você pode reenviar lembretes falhados ou enviar lembretes manualmente a qualquer momento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
