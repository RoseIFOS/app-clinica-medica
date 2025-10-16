import { DollarSign, TrendingUp, Plus } from 'lucide-react'

export function Financeiro() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Financeiro</h1>
          <p className="text-secondary-600">Controle de pagamentos e receitas</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Pagamento
        </button>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="h-96 flex items-center justify-center bg-secondary-50 rounded-lg">
            <div className="text-center">
              <DollarSign className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-500">Módulo financeiro será implementado em breve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
