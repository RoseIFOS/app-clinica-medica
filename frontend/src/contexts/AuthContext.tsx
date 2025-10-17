import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  nome: string;
  role: 'admin' | 'medico' | 'recepcionista';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users para desenvolvimento (usado quando API não está disponível)
const MOCK_USERS = [
  { id: 1, email: 'admin@clinica.com', password: 'admin123', nome: 'Administrador', role: 'admin' as const },
  { id: 2, email: 'dr.silva@clinica.com', password: 'medico123', nome: 'Dr. Silva', role: 'medico' as const },
  { id: 3, email: 'recep@clinica.com', password: 'recepcionista123', nome: 'Recepcionista', role: 'recepcionista' as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [useApiAuth, setUseApiAuth] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const userJson = localStorage.getItem('user');
    
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }

  async function login(email: string, password: string) {
    // Tentar login com API primeiro
    if (useApiAuth) {
      try {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token, user: userData } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Login realizado com sucesso!');
        return;
      } catch (error: any) {
        console.warn('API auth failed, falling back to mock auth');
        setUseApiAuth(false);
      }
    }

    // Fallback para autenticação mock (quando API não disponível)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (!mockUser) {
      toast.error('Credenciais inválidas');
      throw new Error('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('token', 'mock-token-' + Date.now());
    toast.success('Login realizado com sucesso!');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
