import { useState } from 'react'
import { useHistorialPagos } from '../../hooks/usePagos'
import { PaymentHistoryPageView } from './PaymentHistoryPage.view'

/** CU05 — Historial de pagos del usuario (módulo del Sidebar). */
export function PaymentHistoryPage() {
  const [page, setPage] = useState(1)
  const [estado, setEstado] = useState('')

  const historial = useHistorialPagos({
    page,
    per_page: 10,
    estado: estado || undefined,
  })

  return (
    <PaymentHistoryPageView
      data={historial.data}
      isLoading={historial.isLoading}
      page={page}
      onPageChange={setPage}
      estado={estado}
      onEstadoChange={(value) => {
        setEstado(value)
        setPage(1)
      }}
    />
  )
}
