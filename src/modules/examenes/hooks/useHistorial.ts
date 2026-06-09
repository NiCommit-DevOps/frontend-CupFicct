import { useQuery } from '@tanstack/react-query'
import { historialService } from '../services'

/** CU16 — Búsqueda de historial (solo se ejecuta con un término enviado). */
export function useHistorial(termino: string) {
  return useQuery({
    queryKey: ['historial', termino],
    queryFn: () => historialService.buscar(termino),
    enabled: termino.trim().length > 0,
  })
}
