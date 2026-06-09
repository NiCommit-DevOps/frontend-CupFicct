import type { Paginated } from '@/modules/acceso/types'

/** CU11 — Tipos del visor de bitácora de auditoría. */

export type OperacionBitacora = 'INSERT' | 'UPDATE' | 'DELETE'

export interface Bitacora {
  id_bitacora: number
  tabla: string
  operacion: OperacionBitacora
  registro_id: string | null
  datos_anteriores: Record<string, unknown> | null
  datos_nuevos: Record<string, unknown> | null
  ip_origen: string | null
  user_agent: string | null
  fecha: string | null
  usuario: {
    id_usuario: number
    nombres: string
    apellidos: string
    correo: string
  } | null
}

export interface BitacoraFiltros {
  tabla?: string
  operacion?: string
  desde?: string
  hasta?: string
  page?: number
  per_page?: number
}

/** La colección añade el catálogo de tablas auditadas presentes. */
export interface BitacoraListResponse extends Paginated<Bitacora> {
  tablas: string[]
}
