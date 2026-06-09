import { apiClient } from '@/lib/apiClient'
import type { Rol, RolPayload } from '../types'

export const rolesService = {
  async listar(): Promise<Rol[]> {
    const { data } = await apiClient.get<{ data: Rol[] }>('/roles')
    return data.data
  },

  async obtener(id: number): Promise<Rol> {
    const { data } = await apiClient.get<{ data: Rol }>(`/roles/${id}`)
    return data.data
  },

  async crear(payload: RolPayload): Promise<Rol> {
    const { data } = await apiClient.post<{ data: Rol }>('/roles', payload)
    return data.data
  },

  async actualizar(id: number, payload: RolPayload): Promise<Rol> {
    const { data } = await apiClient.put<{ data: Rol }>(`/roles/${id}`, payload)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/roles/${id}`)
  },

  /** CU03 — Sincronización masiva de permisos del rol. */
  async sincronizarPermisos(id: number, permisos: number[]): Promise<Rol> {
    const { data } = await apiClient.put<{ data: Rol }>(`/roles/${id}/permisos`, { permisos })
    return data.data
  },
}
