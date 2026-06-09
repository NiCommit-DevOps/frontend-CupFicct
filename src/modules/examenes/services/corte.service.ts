import { apiClient } from '@/lib/apiClient'
import type { CorteData } from '../types'

export const corteService = {
  /** Estado actual del proceso de admisión de una convocatoria. */
  async estado(idConvocatoria: number): Promise<CorteData> {
    const { data } = await apiClient.get<CorteData>(`/convocatorias/${idConvocatoria}/corte`)
    return data
  },

  /** Ejecuta (o re-ejecuta) el corte de admisión por cupos. */
  async ejecutar(idConvocatoria: number): Promise<CorteData> {
    const { data } = await apiClient.post<CorteData>(`/convocatorias/${idConvocatoria}/corte`)
    return data
  },
}
