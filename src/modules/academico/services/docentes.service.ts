import { apiClient } from '@/lib/apiClient'
import type { Docente, DocenteCreatePayload, DocenteUpdatePayload } from '../types'

export interface ListarDocentesParams {
  buscar?: string
  id_gestion?: number
  id_convocatoria?: number
}

export const docentesService = {
  async listar(params: ListarDocentesParams = {}): Promise<Docente[]> {
    const { data } = await apiClient.get<{ data: Docente[] }>('/docentes', { params })
    return data.data
  },

  async obtener(id: number): Promise<Docente> {
    const { data } = await apiClient.get<{ data: Docente }>(`/docentes/${id}`)
    return data.data
  },

  async crear(payload: DocenteCreatePayload): Promise<Docente> {
    const { data } = await apiClient.post<{ data: Docente }>('/docentes', payload)
    return data.data
  },

  async actualizar(id: number, payload: DocenteUpdatePayload): Promise<Docente> {
    const { data } = await apiClient.put<{ data: Docente }>(`/docentes/${id}`, payload)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/docentes/${id}`)
  },
}
