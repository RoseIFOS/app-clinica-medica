import { Settings, Users, Clock, Bell } from 'lucide-react'

export function Configuracoes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Configurações</h1>
        <p className="text-secondary-600">Gerencie configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Médicos</h3>
                <p className="text-sm text-secondary-600">Gerenciar médicos e especialidades</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success-100 rounded-lg">
                <Clock className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Horários</h3>
                <p className="text-sm text-secondary-600">Configurar horários de atendimento</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Bell className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Notificações</h3>
                <p className="text-sm text-secondary-600">Configurar lembretes WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
