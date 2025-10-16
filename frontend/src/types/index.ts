export interface User {
  id: number
  email: string
  nome: string
  role: 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA'
  crm?: string
  especialidade?: string
  created_at: string
  updated_at?: string
}

export interface Paciente {
  id: number
  nome: string
  cpf: string
  data_nascimento: string
  telefone: string
  whatsapp: string
  email: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  convenio?: string
  numero_carteirinha?: string
  created_at: string
  updated_at?: string
}

export interface Consulta {
  id: number
  paciente_id: number
  medico_id: number
  data_hora: string
  duracao: number
  tipo: 'PRIMEIRA_CONSULTA' | 'RETORNO' | 'EXAME'
  status: 'AGENDADA' | 'CONFIRMADA' | 'REALIZADA' | 'CANCELADA'
  observacoes?: string
  created_at: string
  updated_at?: string
  paciente?: Paciente
  medico?: User
}

export interface Prontuario {
  id: number
  paciente_id: number
  consulta_id: number
  medico_id: number
  data: string
  anamnese: string
  diagnostico: string
  prescricao: string
  exames_solicitados?: string
  observacoes?: string
  created_at: string
  updated_at?: string
  paciente?: Paciente
  consulta?: Consulta
  medico?: User
}

export interface Pagamento {
  id: number
  paciente_id: number
  consulta_id: number
  valor: number
  metodo_pagamento: 'DINHEIRO' | 'CARTAO' | 'PIX' | 'CONVENIO'
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO'
  data_vencimento?: string
  data_pagamento?: string
  observacoes?: string
  created_at: string
  updated_at?: string
  paciente?: Paciente
  consulta?: Consulta
}

export interface HorarioDisponivel {
  id: number
  medico_id: number
  dia_semana: string
  hora_inicio: string
  hora_fim: string
  ativo: boolean
  medico?: User
}

export interface LembreteWhatsApp {
  id: number
  paciente_id: number
  consulta_id: number
  mensagem: string
  data_envio_programada: string
  data_enviado?: string
  status: 'PENDENTE' | 'ENVIADO' | 'FALHOU' | 'CANCELADO'
  tentativas: number
  erro?: string
  created_at: string
  updated_at?: string
  paciente?: Paciente
  consulta?: Consulta
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
