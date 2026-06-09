import { apiClient } from '@/lib/apiClient'
import type { MatrizPermisos } from '../types'

export const permisosService = {
  /** CU03 — Inventario de permisos agrupado por componente lógico (modulo). */
  async matriz(): Promise<MatrizPermisos> {
    const { data } = await apiClient.get<{ data: MatrizPermisos }>('/permisos')
    return data.data
  },
}
