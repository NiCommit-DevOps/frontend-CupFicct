import { useQuery } from '@tanstack/react-query'
import { pagosService, type ListarPagosParams } from '../services/pagos.service'
import type { ReportePagosFiltros } from '../types'

/** Configuración pública del botón de PayPal. */
export function usePagoConfig() {
  return useQuery({
    queryKey: ['pagos', 'config'],
    queryFn: pagosService.config,
    staleTime: 5 * 60_000,
    retry: false,
  })
}

/** Historial de pagos (propio o global según permisos del usuario). */
export function useHistorialPagos(params: ListarPagosParams) {
  return useQuery({
    queryKey: ['pagos', 'historial', params],
    queryFn: () => pagosService.listar(params),
  })
}

/** CU15 — Reporte de conciliación de caja y recaudación (staff). */
export function useReportePagos(filtros: ReportePagosFiltros) {
  return useQuery({
    queryKey: ['pagos', 'reporte', filtros],
    queryFn: () => pagosService.reporte(filtros),
  })
}
