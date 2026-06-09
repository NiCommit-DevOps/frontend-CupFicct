import { Badge, Button, Card, Input, LoadingState, PageHeader, Select } from '@/shared/ui'
import type { EstadoPago, ReportePagos, ReportePagosFiltros } from '../../types'

interface Props {
  data?: ReportePagos
  isLoading: boolean
  filtros: ReportePagosFiltros
  onFiltroChange: (cambio: Partial<ReportePagosFiltros>) => void
  onLimpiar: () => void
}

const toneEstado: Record<EstadoPago, 'success' | 'neutral' | 'danger'> = {
  APROBADO: 'success',
  PENDIENTE: 'neutral',
  RECHAZADO: 'danger',
}

const bs = (monto: number) =>
  `${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(monto)} Bs`

export function PagosReportPageView({ data, isLoading, filtros, onFiltroChange, onLimpiar }: Props) {
  const catalogos = data?.catalogos

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Reportes de pagos"
        subtitle="Conciliación de caja y recaudación total por estado, método y convocatoria."
      />

      {/* Filtros de fiscalización */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input
            label="Desde"
            type="date"
            value={filtros.desde ?? ''}
            onChange={(e) => onFiltroChange({ desde: e.target.value })}
          />
          <Input
            label="Hasta"
            type="date"
            value={filtros.hasta ?? ''}
            onChange={(e) => onFiltroChange({ hasta: e.target.value })}
          />
          <Select
            label="Estado"
            value={filtros.estado ?? ''}
            onChange={(e) => onFiltroChange({ estado: e.target.value })}
          >
            <option value="">Todos</option>
            {(catalogos?.estados ?? []).map((es) => (
              <option key={es} value={es}>{es}</option>
            ))}
          </Select>
          <Select
            label="Método"
            value={filtros.metodo ?? ''}
            onChange={(e) => onFiltroChange({ metodo: e.target.value })}
          >
            <option value="">Todos</option>
            {(catalogos?.metodos ?? []).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
          <Select
            label="Convocatoria"
            value={filtros.id_convocatoria ? String(filtros.id_convocatoria) : ''}
            onChange={(e) =>
              onFiltroChange({ id_convocatoria: e.target.value ? Number(e.target.value) : undefined })
            }
          >
            <option value="">Todas</option>
            {(catalogos?.convocatorias ?? []).map((c) => (
              <option key={c.id_convocatoria} value={c.id_convocatoria}>{c.nombre}</option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end border-t border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
          <Button variant="ghost" size="sm" onClick={onLimpiar}>
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* KPIs de recaudación */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard etiqueta="Recaudación total" valor={bs(data?.resumen.total_recaudado ?? 0)} destacado />
            <KpiCard etiqueta="Transacciones" valor={String(data?.resumen.cantidad_total ?? 0)} />
            <KpiCard etiqueta="Pagos aprobados" valor={String(data?.resumen.cantidad_aprobados ?? 0)} />
            <KpiCard etiqueta="Ticket promedio" valor={bs(data?.resumen.promedio_aprobado ?? 0)} />
            <KpiCard etiqueta="Pendientes de pago" valor={String(data?.resumen.cantidad_pendientes_pago ?? 0)} alerta />
            <KpiCard etiqueta="Por cobrar" valor={bs(data?.resumen.monto_por_cobrar ?? 0)} alerta />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Conciliación por estado */}
            <Card>
              <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Por estado</h2>
              </div>
              <TablaGrupo
                filas={(data?.por_estado ?? []).map((f) => ({
                  clave: f.estado,
                  etiqueta: <Badge tone={toneEstado[f.estado] ?? 'neutral'}>{f.estado}</Badge>,
                  cantidad: f.cantidad,
                  monto: f.monto_total,
                }))}
              />
            </Card>

            {/* Conciliación por método */}
            <Card>
              <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Por método de pago</h2>
              </div>
              <TablaGrupo
                filas={(data?.por_metodo ?? []).map((f) => ({
                  clave: f.metodo,
                  etiqueta: <span className="text-slate-700 dark:text-slate-200">{f.metodo}</span>,
                  cantidad: f.cantidad,
                  monto: f.monto_total,
                }))}
              />
            </Card>
          </div>

          {/* Pendientes de pago: aprobados por el admin que aún no pagaron */}
          <Card className="mt-6">
            <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Pendientes de pago
              </h2>
              <span className="text-xs text-slate-400">
                Postulantes aprobados que aún no realizaron el pago
              </span>
            </div>
            {(data?.pendientes_pago ?? []).length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-400">
                No hay postulantes pendientes de pago.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                      <th className="px-4 py-3 font-medium">Código</th>
                      <th className="px-4 py-3 font-medium">Postulante</th>
                      <th className="px-4 py-3 font-medium">Convocatoria</th>
                      <th className="px-4 py-3 font-medium">Inscripción</th>
                      <th className="px-4 py-3 text-right font-medium">Monto adeudado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(data?.pendientes_pago ?? []).map((p) => (
                      <tr key={p.id_inscripcion} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 text-slate-500">{p.codigo_tramite ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                          {p.nombres} {p.apellidos}
                          <span className="block text-xs text-slate-400">CI {p.ci ?? '—'}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.convocatoria ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-500">{p.fecha_inscripcion ?? '—'}</td>
                        <td className="px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                          {bs(p.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

function KpiCard({
  etiqueta,
  valor,
  destacado,
  alerta,
}: {
  etiqueta: string
  valor: string
  destacado?: boolean
  alerta?: boolean
}) {
  const color = alerta
    ? 'text-amber-600 dark:text-amber-400'
    : destacado
      ? 'text-brand-600 dark:text-brand-300'
      : 'text-slate-800 dark:text-slate-100'
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiqueta}</p>
      <p className={`mt-1 text-2xl font-extrabold ${color}`}>{valor}</p>
    </Card>
  )
}

interface FilaGrupo {
  clave: string
  etiqueta: React.ReactNode
  cantidad: number
  monto: number
}

function TablaGrupo({ filas }: { filas: FilaGrupo[] }) {
  if (filas.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-slate-400">Sin datos para los filtros seleccionados.</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
          <th className="px-4 py-3 font-medium">Grupo</th>
          <th className="px-4 py-3 text-right font-medium">Cantidad</th>
          <th className="px-4 py-3 text-right font-medium">Monto total</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((f) => (
          <tr key={f.clave} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
            <td className="px-4 py-3">{f.etiqueta}</td>
            <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{f.cantidad}</td>
            <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">{bs(f.monto)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
