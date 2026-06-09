import { apiClient } from '@/lib/apiClient'
import type { MisResultados } from '../types'

export const examenAlumnoService = {
  /** Notas por materia de los 3 exámenes + promedio/estado del postulante. */
  async misResultados(): Promise<MisResultados> {
    const { data } = await apiClient.get<MisResultados>('/examenes/resultados')
    return data
  },
}
