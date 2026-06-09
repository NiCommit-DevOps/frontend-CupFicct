import { useMemo, useState } from 'react'
import { useBitacora } from '../../hooks/useBitacora'
import type { Bitacora, BitacoraFiltros } from '../../types'
import { BitacoraPageView } from './BitacoraPage.view'

/** CU11 — Visor de auditoría restringido (solo Administrador). */
export function BitacoraPage() {
  const [filtros, setFiltros] = useState<BitacoraFiltros>({})
  const [page, setPage] = useState(1)
  const [detalle, setDetalle] = useState<Bitacora | null>(null)

  const params = useMemo<BitacoraFiltros>(() => {
    const limpio: BitacoraFiltros = { page, per_page: 15 }
    if (filtros.tabla) limpio.tabla = filtros.tabla
    if (filtros.operacion) limpio.operacion = filtros.operacion
    if (filtros.desde) limpio.desde = filtros.desde
    if (filtros.hasta) limpio.hasta = filtros.hasta
    return limpio
  }, [filtros, page])

  const bitacora = useBitacora(params)

  return (
    <BitacoraPageView
      data={bitacora.data}
      isLoading={bitacora.isLoading}
      filtros={filtros}
      onFiltroChange={(cambio) => {
        setFiltros((prev) => ({ ...prev, ...cambio }))
        setPage(1)
      }}
      onLimpiar={() => {
        setFiltros({})
        setPage(1)
      }}
      onPageChange={setPage}
      detalle={detalle}
      onVerDetalle={setDetalle}
      onCerrarDetalle={() => setDetalle(null)}
    />
  )
}
