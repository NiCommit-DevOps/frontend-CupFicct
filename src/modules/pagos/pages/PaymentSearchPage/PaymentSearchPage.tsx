import { useState } from 'react'
import { extraerMensajeError } from '@/lib/apiClient'
import { pagosService } from '../../services/pagos.service'
import { usePagoConfig } from '../../hooks/usePagos'
import type { DeudaInscripcion, ResultadoPago } from '../../types'
import { PaymentSearchPageView } from './PaymentSearchPage.view'

/**
 * CU05 — Vista pública de búsqueda y pago del cupo de inscripción.
 *
 * Flujo: el postulante ingresa su carnet → se muestra la deuda → paga con el
 * botón inteligente de PayPal (orden y captura se resuelven en el backend) →
 * al confirmarse, el sistema lo habilita y se muestran sus credenciales.
 */
export function PaymentSearchPage() {
  const configQuery = usePagoConfig()

  const [ci, setCi] = useState('')
  const [deuda, setDeuda] = useState<DeudaInscripcion | null>(null)
  const [resultado, setResultado] = useState<ResultadoPago | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState<string | null>(null)
  const [errorPago, setErrorPago] = useState<string | null>(null)

  const buscar = async () => {
    const carnet = ci.trim()
    if (!carnet) return

    setBuscando(true)
    setErrorBusqueda(null)
    setErrorPago(null)
    setDeuda(null)
    try {
      setDeuda(await pagosService.buscar(carnet))
    } catch (error) {
      setErrorBusqueda(extraerMensajeError(error, 'No se pudo consultar la deuda.'))
    } finally {
      setBuscando(false)
    }
  }

  // Crea la orden en PayPal (el botón espera el order_id como string).
  const crearOrden = () => pagosService.crearOrden(ci.trim())

  // Captura tras la aprobación del comprador y guarda el resultado del negocio.
  const aprobarPago = async (orderId: string) => {
    setErrorPago(null)
    try {
      setResultado(await pagosService.capturar(ci.trim(), orderId))
    } catch (error) {
      setErrorPago(extraerMensajeError(error, 'El pago no pudo procesarse.'))
    }
  }

  return (
    <PaymentSearchPageView
      ci={ci}
      onCiChange={setCi}
      onBuscar={buscar}
      buscando={buscando}
      errorBusqueda={errorBusqueda}
      deuda={deuda}
      resultado={resultado}
      errorPago={errorPago}
      onErrorPago={setErrorPago}
      configCargando={configQuery.isLoading}
      clientId={configQuery.data?.client_id ?? null}
      currency={configQuery.data?.currency ?? 'USD'}
      onCrearOrden={crearOrden}
      onAprobarPago={aprobarPago}
    />
  )
}
