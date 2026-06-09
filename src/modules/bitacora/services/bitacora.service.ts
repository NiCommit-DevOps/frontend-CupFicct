import { apiClient } from '@/lib/apiClient'
import type { BitacoraFiltros, BitacoraListResponse } from '../types'

export const bitacoraService = {
  /** CU11 — Listado paginado de la bitácora con filtros forenses. */
  async listar(filtros: BitacoraFiltros = {}): Promise<BitacoraListResponse> {
    const { data } = await apiClient.get<BitacoraListResponse>('/bitacora', { params: filtros })
    return data
  },
}
