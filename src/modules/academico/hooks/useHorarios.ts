import { useQuery } from '@tanstack/react-query'
import { horariosService } from '../services'

const KEY = ['horarios'] as const

/** Horario general por turno (sección Horario en Materias). */
export function useHorarioGeneral(enabled = true) {
  return useQuery({
    queryKey: [...KEY, 'general'],
    queryFn: () => horariosService.general(),
    enabled,
  })
}

/** "Mi horario" del usuario autenticado (docente o postulante). */
export function useMiHorario() {
  return useQuery({
    queryKey: [...KEY, 'mio'],
    queryFn: () => horariosService.mio(),
  })
}
