import { api } from './api'
import { Paciente, PaginatedResponse } from '../types'

export const pacienteService = {
  async getPacientes(page = 1, perPage = 10, search = ''): Promise<PaginatedResponse<Paciente>> {
    const response = await api.get('/api/pacientes', {
      params: { page, per_page: perPage, search }
    })
    return response.data
  },

  async getPaciente(id: number): Promise<Paciente> {
    const response = await api.get(`/api/pacientes/${id}`)
    return response.data
  },

  async createPaciente(paciente: Omit<Paciente, 'id' | 'created_at' | 'updated_at'>): Promise<Paciente> {
    const response = await api.post('/api/pacientes', paciente)
    return response.data
  },

  async updatePaciente(id: number, paciente: Partial<Paciente>): Promise<Paciente> {
    const response = await api.put(`/api/pacientes/${id}`, paciente)
    return response.data
  },

  async deletePaciente(id: number): Promise<void> {
    await api.delete(`/api/pacientes/${id}`)
  },

  async getHistoricoPaciente(id: number): Promise<any> {
    const response = await api.get(`/api/pacientes/${id}/historico`)
    return response.data
  },
}
