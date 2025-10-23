import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Star,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clínica Médica</h1>
                <p className="text-sm text-gray-600">Sistema de Gestão Completo</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Acessar Sistema
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Shield className="w-4 h-4 mr-2" />
              Sistema Seguro e Confiável
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gestão Médica
              <span className="text-green-600"> Inteligente</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transforme sua clínica com nossa plataforma completa de gestão médica. 
              Agendamentos, prontuários, financeiro e muito mais em um só lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/login'}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold"
              >
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar sua clínica de forma eficiente e profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Gestão de Pacientes</h3>
                <p className="text-gray-600 mb-6">
                  Cadastro completo, histórico médico, documentos e informações de contato em um só lugar.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Prontuários eletrônicos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Histórico completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Documentos digitais
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Agendamento Inteligente</h3>
                <p className="text-gray-600 mb-6">
                  Sistema de agendamento completo com calendário visual e controle de horários.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Calendário visual
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Controle de horários
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lembretes automáticos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Prontuários Digitais</h3>
                <p className="text-gray-600 mb-6">
                  Prontuários eletrônicos seguros e organizados para cada paciente.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Acesso seguro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Histórico completo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Backup automático
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Controle Financeiro</h3>
                <p className="text-gray-600 mb-6">
                  Gestão completa de receitas, despesas e relatórios financeiros.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Relatórios detalhados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Controle de pagamentos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Análise de receita
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lembretes WhatsApp</h3>
                <p className="text-gray-600 mb-6">
                  Envio automático de lembretes via WhatsApp para pacientes.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Lembretes automáticos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Redução de faltas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Comunicação eficiente
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Segurança Total</h3>
                <p className="text-gray-600 mb-6">
                  Proteção completa dos dados com criptografia e backup automático.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Criptografia avançada
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Backup automático
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    LGPD compliant
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-4">Confiança em Números</h2>
            <p className="text-xl text-green-100">
              Milhares de profissionais já confiam em nossa plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-green-100">Clínicas Ativas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-green-100">Pacientes Cadastrados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-green-100">Uptime Garantido</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-green-100">Suporte Técnico</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Depoimentos de profissionais que transformaram suas clínicas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "O sistema revolucionou nossa clínica. Agendamentos mais organizados, 
                  prontuários digitais e controle financeiro excelente."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">DS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Dr. Silva</div>
                    <div className="text-sm text-gray-500">Clínica CardioLife</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Interface intuitiva e funcionalidades completas. Nossa equipe se 
                  adaptou rapidamente e a produtividade aumentou significativamente."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">MS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Maria Santos</div>
                    <div className="text-sm text-gray-500">Clínica MedCenter</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Excelente suporte técnico e sistema muito estável. Os lembretes 
                  via WhatsApp reduziram drasticamente as faltas dos pacientes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">JO</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">João Oliveira</div>
                    <div className="text-sm text-gray-500">Clínica Saúde+</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para transformar sua clínica?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Junte-se a centenas de profissionais que já revolucionaram sua gestão médica
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/login'}
                className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
              >
                Falar com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Clínica Médica</h3>
                  <p className="text-sm text-gray-400">Sistema de Gestão</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                A plataforma mais completa para gestão de clínicas médicas. 
                Segura, intuitiva e eficiente.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Funcionalidades</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gestão de Pacientes</li>
                <li>Agendamentos</li>
                <li>Prontuários Eletrônicos</li>
                <li>Controle Financeiro</li>
                <li>Lembretes WhatsApp</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Documentação</li>
                <li>Treinamentos</li>
                <li>Suporte 24/7</li>
                <li>Comunidade</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>contato@clinicamedica.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Clínica Médica. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
