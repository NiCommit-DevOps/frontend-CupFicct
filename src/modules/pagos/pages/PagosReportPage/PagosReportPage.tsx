import { useMemo, useState } from 'react'
import { useReportePagos } from '../../hooks/usePagos'
import type { ReportePagosFiltros } from '../../types'
import { PagosReportPageView } from './PagosReportPage.view'

/** CU15 — Reportes de Pagos: conciliación de caja y recaudación total. */
export function PagosReportPage() {
  const [filtros, setFiltros] = useState<ReportePagosFiltros>({})

  // Solo se envían al backend los filtros con valor (evita params vacíos).
  const filtrosActivos = useMemo<ReportePagosFiltros>(() => {
    const limpio: ReportePagosFiltros = {}
    if (filtros.desde) limpio.desde = filtros.desde
    if (filtros.hasta) limpio.hasta = filtros.hasta
    if (filtros.estado) limpio.estado = filtros.estado
    if (filtros.metodo) limpio.metodo = filtros.metodo
    if (filtros.id_convocatoria) limpio.id_convocatoria = filtros.id_convocatoria
    return limpio
  }, [filtros])

  const reporte = useReportePagos(filtrosActivos)

  return (
    <PagosReportPageView
      data={reporte.data}
      isLoading={reporte.isLoading}
      filtros={filtros}
      onFiltroChange={(cambio) => setFiltros((prev) => ({ ...prev, ...cambio }))}
      onLimpiar={() => setFiltros({})}
    />
  )
}
