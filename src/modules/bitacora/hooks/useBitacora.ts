import { useQuery } from '@tanstack/react-query'
import { bitacoraService } from '../services/bitacora.service'
import type { BitacoraFiltros } from '../types'

/** CU11 — Visor de auditoría (solo lectura). */
export function useBitacora(filtros: BitacoraFiltros) {
  return useQuery({
    queryKey: ['bitacora', filtros],
    queryFn: () => bitacoraService.listar(filtros),
  })
}
