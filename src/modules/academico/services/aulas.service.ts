import { apiClient } from '@/lib/apiClient'
import type { Aula, AulaPayload } from '../types'

export const aulasService = {
  async listar(): Promise<Aula[]> {
    const { data } = await apiClient.get<{ data: Aula[] }>('/aulas')
    return data.data
  },

  async crear(payload: AulaPayload): Promise<Aula> {
    const { data } = await apiClient.post<{ data: Aula }>('/aulas', payload)
    return data.data
  },

  async actualizar(id: number, payload: AulaPayload): Promise<Aula> {
    const { data } = await apiClient.put<{ data: Aula }>(`/aulas/${id}`, payload)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/aulas/${id}`)
  },
}
