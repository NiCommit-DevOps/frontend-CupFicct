import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { Button, Input, Spinner } from '@/shared/ui'
import { PublicNavbar } from '@/modules/postulacion/components/PublicNavbar.view'
import { PublicFooter } from '@/modules/postulacion/components/PublicFooter.view'
import type { DeudaInscripcion, ResultadoPago } from '../../types'

interface Props {
  ci: string
  onCiChange: (ci: string) => void
  onBuscar: () => void
  buscando: boolean
  errorBusqueda: string | null
  deuda: DeudaInscripcion | null
  resultado: ResultadoPago | null
  errorPago: string | null
  onErrorPago: (msg: string | null) => void
  configCargando: boolean
  clientId: string | null
  currency: string
  onCrearOrden: () => Promise<string>
  onAprobarPago: (orderId: string) => Promise<void>
}

const formatoBs = (monto: number) =>
  new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(monto)

export function PaymentSearchPageView(props: Props) {
  const { deuda, resultado } = props

  return (
    <div className="flex min-h-screen flex-col bg-panel-bgLight text-slate-600 dark:bg-panel-bgDark dark:text-slate-300">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        {resultado ? (
          <ExitoPago resultado={resultado} />
        ) : (
          <>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver al inicio
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Pago de inscripción</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Habilitación de servicios de cobros para personas externas. Ingresa tu número de carnet
              (CI) para consultar el cupo de inscripción pendiente.
            </p>

            <BuscadorDeuda {...props} />

            {deuda && <DetalleDeuda {...props} deuda={deuda} />}
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}

/* ----------------------------- Buscador por CI ---------------------------- */

function BuscadorDeuda({ ci, onCiChange, onBuscar, buscando, errorBusqueda }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onBuscar()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-brand-100 bg-panel-light p-6 shadow-sm dark:border-brand-800/60 dark:bg-panel-dark"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Número de carnet (CI)"
            value={ci}
            onChange={(e) => onCiChange(e.target.value)}
            placeholder="Ej. 12345678"
            autoFocus
          />
        </div>
        <Button type="submit" loading={buscando} className="sm:w-40">
          Buscar deuda
        </Button>
      </div>

      {errorBusqueda && (
        <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
          {errorBusqueda}
        </div>
      )}
    </form>
  )
}

/* --------------------------- Detalle + pasarela --------------------------- */

function DetalleDeuda({ deuda, errorPago, onErrorPago, configCargando, clientId, currency, onCrearOrden, onAprobarPago }: Props & { deuda: DeudaInscripcion }) {
  const [procesando, setProcesando] = useState(false)

  if (deuda.pagado) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-sm text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-300">
        <p className="font-semibold">Esta inscripción ya fue pagada.</p>
        <p className="mt-1">No hay deudas pendientes para el carnet {deuda.postulante.ci}.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-brand-100 bg-panel-light shadow-sm dark:border-brand-800/60 dark:bg-panel-dark">
      <div className="border-b border-slate-200/60 px-6 py-4 dark:border-slate-700/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pago pendiente</p>
        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
          {deuda.postulante.nombres} {deuda.postulante.apellidos}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          CI {deuda.postulante.ci} · Trámite {deuda.postulante.codigo_tramite}
        </p>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm text-slate-600 dark:text-slate-300">{deuda.concepto}</span>
        <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-300">
          {formatoBs(deuda.monto)} {deuda.moneda}
        </span>
      </div>

      <div className="border-t border-slate-200/60 px-6 py-5 dark:border-slate-700/40">
        <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
          Selecciona tu método de pago:
        </p>

        {errorPago && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
            {errorPago}
          </div>
        )}

        {configCargando || !clientId ? (
          <div className="flex items-center gap-3 py-4 text-sm text-slate-400">
            <Spinner /> Cargando pasarela de pago…
          </div>
        ) : (
          <PayPalScriptProvider
            options={{ clientId, currency, intent: 'capture' }}
          >
            <PayPalButtons
              style={{ layout: 'vertical', shape: 'rect', label: 'pay' }}
              disabled={procesando}
              createOrder={async () => {
                onErrorPago(null)
                return onCrearOrden()
              }}
              onApprove={async (data) => {
                setProcesando(true)
                try {
                  await onAprobarPago(data.orderID)
                } finally {
                  setProcesando(false)
                }
              }}
              onError={() => onErrorPago('Ocurrió un error con PayPal. Intenta nuevamente.')}
              onCancel={() => onErrorPago('Cancelaste el pago. Puedes intentarlo otra vez cuando quieras.')}
            />
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  )
}

/* ------------------------------ Pago exitoso ------------------------------ */

function ExitoPago({ resultado }: { resultado: ResultadoPago }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/40 bg-white p-8 text-center shadow-xl dark:border-emerald-500/30 dark:bg-panel-dark">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">¡Pago realizado con éxito!</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{resultado.message}</p>

      <div className="mt-6 space-y-3 text-left">
        <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Comprobante</p>
          <p className="mt-0.5 break-all font-mono text-sm text-slate-700 dark:text-slate-200">
            {resultado.pago.transaccion_id}
          </p>
        </div>

        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-300">
            Tus credenciales de acceso
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            Usuario: <span className="font-semibold">{resultado.credenciales.usuario}</span>
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Contraseña: <span className="font-semibold">{resultado.credenciales.contrasena}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Guárdalas: con ellas podrás iniciar sesión y ver tu historial de pagos.
          </p>
        </div>

        {resultado.grupo && (
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Grupo asignado</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {resultado.grupo.sigla} — {resultado.grupo.nombre}
              {resultado.grupo.turno ? ` (${resultado.grupo.turno})` : ''}
            </p>
          </div>
        )}
      </div>

      <Link
        to="/login"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        Iniciar sesión
      </Link>
    </div>
  )
}
