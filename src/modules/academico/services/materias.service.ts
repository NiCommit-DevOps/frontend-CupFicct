import { apiClient } from '@/lib/apiClient'
import type { Materia, MateriaPayload } from '../types'

export const materiasService = {
  async listar(buscar?: string): Promise<Materia[]> {
    const { data } = await apiClient.get<{ data: Materia[] }>('/materias', {
      params: buscar ? { buscar } : undefined,
    })
    return data.data
  },

  async crear(payload: MateriaPayload): Promise<Materia> {
    const { data } = await apiClient.post<{ data: Materia }>('/materias', payload)
    return data.data
  },

  async actualizar(id: number, payload: MateriaPayload): Promise<Materia> {
    const { data } = await apiClient.put<{ data: Materia }>(`/materias/${id}`, payload)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/materias/${id}`)
  },
}
