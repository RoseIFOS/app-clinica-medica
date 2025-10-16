import { api } from './api'
import { User } from '../types'

interface LoginResponse {
  user: User
  token: string
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', { email, password })
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/api/auth/logout')
  },
}
