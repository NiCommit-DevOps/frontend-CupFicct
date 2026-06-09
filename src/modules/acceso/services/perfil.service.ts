import { apiClient } from '@/lib/apiClient'
import type { Sexo, Usuario } from '../types'

export interface ActualizarContactoPayload {
  nombres?: string
  apellidos?: string
  fecha_nacimiento?: string | null
  sexo?: Sexo | null
  correo?: string
  telefono1?: string | null
  telefono2?: string | null
}

export interface CambiarPasswordPayload {
  contrasena_actual: string
  contrasena_nueva: string
  contrasena_nueva_confirmation: string
}

export const perfilService = {
  async obtener(): Promise<Usuario> {
    const { data } = await apiClient.get<{ data: Usuario }>('/perfil')
    return data.data
  },

  async actualizarContacto(payload: ActualizarContactoPayload): Promise<Usuario> {
    const { data } = await apiClient.put<{ data: Usuario }>('/perfil', payload)
    return data.data
  },

  async cambiarPassword(payload: CambiarPasswordPayload): Promise<void> {
    await apiClient.put('/perfil/password', payload)
  },
}
