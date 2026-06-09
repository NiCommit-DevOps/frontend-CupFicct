import { apiClient } from '@/lib/apiClient'
import type { Carrera, CarreraCatalogos, CarreraPayload } from '../types'

export const carrerasService = {
  async listar(): Promise<Carrera[]> {
    const { data } = await apiClient.get<{ data: Carrera[] }>('/carreras')
    return data.data
  },

  async catalogos(): Promise<CarreraCatalogos> {
    const { data } = await apiClient.get<CarreraCatalogos>('/carreras/catalogos')
    return data
  },

  async crear(payload: CarreraPayload): Promise<Carrera> {
    const { data } = await apiClient.post<{ data: Carrera }>('/carreras', payload)
    return data.data
  },

  async actualizar(id: number, payload: CarreraPayload): Promise<Carrera> {
    const { data } = await apiClient.put<{ data: Carrera }>(`/carreras/${id}`, payload)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/carreras/${id}`)
  },
}
