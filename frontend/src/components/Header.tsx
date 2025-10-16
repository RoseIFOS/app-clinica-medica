import { useAuth } from '../contexts/AuthContext'
import { LogOut, User } from 'lucide-react'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-secondary-900">
              Bem-vindo, {user?.nome}
            </h2>
            <p className="text-sm text-secondary-500">
              {user?.role === 'ADMIN' && 'Administrador'}
              {user?.role === 'MEDICO' && `Médico - ${user?.especialidade}`}
              {user?.role === 'RECEPCIONISTA' && 'Recepcionista'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-secondary-600 hover:text-error-600 hover:bg-error-50 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
