import { apiClient } from '@/lib/apiClient'
import type { EstadoGestion, Gestion, GestionPayload } from '../types'

export const gestionesService = {
  async listar(): Promise<Gestion[]> {
    const { data } = await apiClient.get<{ data: Gestion[] }>('/gestiones')
    return data.data
  },

  async crear(payload: GestionPayload): Promise<Gestion> {
    const { data } = await apiClient.post<{ data: Gestion }>('/gestiones', payload)
    return data.data
  },

  async actualizar(id: number, payload: GestionPayload): Promise<Gestion> {
    const { data } = await apiClient.put<{ data: Gestion }>(`/gestiones/${id}`, payload)
    return data.data
  },

  /** CU19 — Control de estado de la gestión (ACTIVA / CERRADA). */
  async cambiarEstado(id: number, estado: EstadoGestion): Promise<Gestion> {
    const { data } = await apiClient.patch<{ data: Gestion }>(`/gestiones/${id}/estado`, { estado })
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/gestiones/${id}`)
  },
}
