import { apiClient } from '@/lib/apiClient'
import type { MiHorario, TurnoHorario } from '../types'

export const horariosService = {
  /** Horario general por turno (sección Horario de la página de Materias). */
  async general(): Promise<TurnoHorario[]> {
    const { data } = await apiClient.get<{ data: TurnoHorario[] }>('/horarios')
    return data.data
  },

  /** Horario del usuario autenticado: grupos del docente o boleta del postulante. */
  async mio(): Promise<MiHorario> {
    const { data } = await apiClient.get<MiHorario>('/mi-horario')
    return data
  },
}
