import { apiClient } from '@/lib/apiClient'
import type {
  Paginated,
  Usuario,
  UsuarioCreatePayload,
  UsuarioUpdatePayload,
} from '../types'

export interface ListarUsuariosParams {
  page?: number
  per_page?: number
  buscar?: string
}

export const usuariosService = {
  async listar(params: ListarUsuariosParams = {}): Promise<Paginated<Usuario>> {
    const { data } = await apiClient.get<Paginated<Usuario>>('/usuarios', { params })
    return data
  },

  async obtener(id: number): Promise<Usuario> {
    const { data } = await apiClient.get<{ data: Usuario }>(`/usuarios/${id}`)
    return data.data
  },

  async crear(payload: UsuarioCreatePayload): Promise<Usuario> {
    const { data } = await apiClient.post<{ data: Usuario }>('/usuarios', payload)
    return data.data
  },

  async actualizar(id: number, payload: UsuarioUpdatePayload): Promise<Usuario> {
    const { data } = await apiClient.put<{ data: Usuario }>(`/usuarios/${id}`, payload)
    return data.data
  },

  async alternarEstado(id: number): Promise<Usuario> {
    const { data } = await apiClient.patch<{ data: Usuario }>(`/usuarios/${id}/estado`)
    return data.data
  },

  /** CU02 — Activa en lote a todas las cuentas inhabilitadas. */
  async activarTodos(): Promise<{ message: string; activados: number }> {
    const { data } = await apiClient.post('/usuarios/activar-todos')
    return data
  },

  /**
   * Flujo de ingreso sin pago: habilita el acceso de un postulante aprobado
   * (ELEGIBLE). Genera credenciales, activa la cuenta y asigna grupo. El id es
   * el id de usuario (= id de postulante por la especialización 1:1).
   */
  async habilitarPostulante(id: number): Promise<{
    usuario: Usuario
    credenciales: { usuario: string; contrasena: string; esta_activo: boolean }
    grupo: { id_grupo: number; sigla: string; nombre: string; turno: string } | null
    estado_academico: string
  }> {
    const { data } = await apiClient.post(`/postulantes/${id}/habilitar`)
    return data
  },
}
