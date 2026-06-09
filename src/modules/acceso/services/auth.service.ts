import { apiClient } from '@/lib/apiClient'
import type { LoginResponse, Usuario, UsuarioCreatePayload } from '../types'

export const authService = {
  async login(login: string, password: string, tipo?: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', { login, password, tipo })
    return data
  },

  async register(payload: UsuarioCreatePayload): Promise<Usuario> {
    const { data } = await apiClient.post<{ data: Usuario }>('/auth/register', payload)
    return data.data
  },

  async me(): Promise<Usuario> {
    const { data } = await apiClient.get<{ data: Usuario }>('/auth/me')
    return data.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },
}
