import { Badge, Card, LoadingState, PageHeader, Pagination, Select } from '@/shared/ui'
import type { Paginated } from '@/modules/acceso/types'
import type { EstadoPago, Pago } from '../../types'

interface Props {
  data?: Paginated<Pago>
  isLoading: boolean
  page: number
  onPageChange: (page: number) => void
  estado: string
  onEstadoChange: (estado: string) => void
}

const toneEstado: Record<EstadoPago, 'success' | 'neutral' | 'danger'> = {
  APROBADO: 'success',
  PENDIENTE: 'neutral',
  RECHAZADO: 'danger',
}

const formatoMonto = (monto: number, moneda: string) =>
  `${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(monto)} ${moneda}`

const formatoFecha = (fecha: string | null) => {
  if (!fecha) return '—'
  const d = new Date(fecha.replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? fecha : d.toLocaleString('es-BO')
}

export function PaymentHistoryPageView({ data, isLoading, onPageChange, estado, onEstadoChange }: Props) {
  const pagos = data?.data ?? []

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Historial de pagos"
        subtitle="Transacciones del cupo de inscripción y otros cobros."
      />

      <Card>
        <div className="flex items-center gap-3 border-b border-slate-200/60 p-4 dark:border-slate-700/40">
          <div className="w-48">
            <Select value={estado} onChange={(e) => onEstadoChange(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="APROBADO">Aprobado</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="RECHAZADO">Rechazado</option>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : pagos.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Aún no tienes pagos registrados.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Concepto</th>
                    <th className="px-4 py-3 font-medium">Método</th>
                    <th className="px-4 py-3 font-medium">Comprobante</th>
                    <th className="px-4 py-3 font-medium">Monto</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr
                      key={pago.id_pago}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                    >
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {formatoFecha(pago.fecha)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        Cupo de inscripción
                        {pago.inscripcion?.postulante && (
                          <span className="block text-xs text-slate-400">
                            {pago.inscripcion.postulante.nombres} {pago.inscripcion.postulante.apellidos}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{pago.metodo}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {pago.transaccion_id ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">
                        {formatoMonto(pago.monto, pago.moneda)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={toneEstado[pago.estado] ?? 'neutral'}>{pago.estado}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && (
              <Pagination
                page={data.meta.current_page}
                lastPage={data.meta.last_page}
                total={data.meta.total}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}
