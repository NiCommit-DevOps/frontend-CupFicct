import { apiClient } from '@/lib/apiClient'
import type { HistorialFila } from '../types'

export const historialService = {
  /** CU16 — Busca historial por CI o código de trámite (gestiones concluidas). */
  async buscar(termino: string): Promise<HistorialFila[]> {
    const { data } = await apiClient.get<{ data: HistorialFila[] }>('/historial', {
      params: { buscar: termino },
    })
    return data.data
  },
}
