import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const credenciais = [
    { perfil: 'Admin', email: 'admin@clinica.com', senha: 'admin123' },
    { perfil: 'Médico', email: 'dr.silva@clinica.com', senha: 'medico123' },
    { perfil: 'Recepcionista', email: 'recep@clinica.com', senha: 'recepcionista123' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Activity className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Clínica Médica</h1>
              <p className="text-muted-foreground">Sistema de Gestão Completo</p>
            </div>
          </div>

          <div className="space-y-4 p-6 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground">Funcionalidades</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Gestão completa de pacientes
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Agendamento de consultas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Prontuários eletrônicos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Controle financeiro
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                Lembretes via WhatsApp
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Acesse sua conta</CardTitle>
              <CardDescription>
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Credenciais de Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Credenciais de Teste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {credenciais.map((cred) => (
                  <button
                    key={cred.email}
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.senha);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{cred.perfil}</p>
                        <p className="text-xs text-muted-foreground">{cred.email}</p>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{cred.senha}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
