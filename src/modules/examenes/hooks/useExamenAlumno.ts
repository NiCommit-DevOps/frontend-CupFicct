import { useQuery } from '@tanstack/react-query'
import { examenAlumnoService } from '../services'

export function useMisResultados() {
  return useQuery({
    queryKey: ['mis-examenes'],
    queryFn: () => examenAlumnoService.misResultados(),
  })
}
