import { Badge, Button, Card, Input, LoadingState, Modal, PageHeader, Pagination, Select } from '@/shared/ui'
import type { Bitacora, BitacoraFiltros, OperacionBitacora } from '../../types'

interface Props {
  data?: {
    data: Bitacora[]
    meta: { current_page: number; last_page: number; total: number }
    tablas: string[]
  }
  isLoading: boolean
  filtros: BitacoraFiltros
  onFiltroChange: (cambio: Partial<BitacoraFiltros>) => void
  onLimpiar: () => void
  onPageChange: (page: number) => void
  detalle: Bitacora | null
  onVerDetalle: (b: Bitacora) => void
  onCerrarDetalle: () => void
}

const toneOperacion: Record<OperacionBitacora, 'success' | 'neutral' | 'danger'> = {
  INSERT: 'success',
  UPDATE: 'neutral',
  DELETE: 'danger',
}

const OPERACIONES: OperacionBitacora[] = ['INSERT', 'UPDATE', 'DELETE']

const formatoFecha = (fecha: string | null) => {
  if (!fecha) return '—'
  const d = new Date(fecha.replace(' ', 'T'))
  return Number.isNaN(d.getTime()) ? fecha : d.toLocaleString('es-BO')
}

const nombreUsuario = (b: Bitacora) =>
  b.usuario ? `${b.usuario.nombres} ${b.usuario.apellidos}` : 'Sistema / público'

export function BitacoraPageView(props: Props) {
  const { data, isLoading, filtros, onFiltroChange, onLimpiar, onPageChange, detalle } = props
  const registros = data?.data ?? []

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Bitácora de auditoría"
        subtitle="Registro indeleble de cambios en datos críticos (accesos, cupos y pagos)."
      />

      <Card>
        {/* Filtros forenses */}
        <div className="grid grid-cols-1 gap-4 border-b border-slate-200/60 p-4 sm:grid-cols-2 lg:grid-cols-5 dark:border-slate-700/40">
          <Select
            label="Tabla"
            value={filtros.tabla ?? ''}
            onChange={(e) => onFiltroChange({ tabla: e.target.value })}
          >
            <option value="">Todas</option>
            {(data?.tablas ?? []).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Select
            label="Operación"
            value={filtros.operacion ?? ''}
            onChange={(e) => onFiltroChange({ operacion: e.target.value })}
          >
            <option value="">Todas</option>
            {OPERACIONES.map((op) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </Select>
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
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={onLimpiar}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : registros.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            No hay registros de auditoría para los filtros seleccionados.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="px-4 py-3 font-medium">Operación</th>
                    <th className="px-4 py-3 font-medium">Tabla</th>
                    <th className="px-4 py-3 font-medium">Registro</th>
                    <th className="px-4 py-3 font-medium">Operador</th>
                    <th className="px-4 py-3 font-medium">IP</th>
                    <th className="px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {registros.map((b) => (
                    <tr key={b.id_bitacora} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">{formatoFecha(b.fecha)}</td>
                      <td className="px-4 py-3"><Badge tone={toneOperacion[b.operacion]}>{b.operacion}</Badge></td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-300">{b.tabla}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{b.registro_id ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{nombreUsuario(b)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{b.ip_origen ?? '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => props.onVerDetalle(b)}>
                          Ver
                        </Button>
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

      <DetalleBitacoraModal detalle={detalle} onClose={props.onCerrarDetalle} />
    </div>
  )
}

/* --------------------------- Visor antes/después -------------------------- */

function DetalleBitacoraModal({ detalle, onClose }: { detalle: Bitacora | null; onClose: () => void }) {
  return (
    <Modal
      open={detalle !== null}
      onClose={onClose}
      title={detalle ? `Auditoría #${detalle.id_bitacora} · ${detalle.operacion}` : ''}
      footer={
        <Button variant="secondary" onClick={onClose} type="button">
          Cerrar
        </Button>
      }
    >
      {detalle && (
        <div className="flex flex-col gap-4 text-sm">
          <dl className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Tabla" valor={detalle.tabla} />
            <Campo etiqueta="Registro" valor={detalle.registro_id ?? '—'} />
            <Campo etiqueta="Operador" valor={nombreUsuario(detalle)} />
            <Campo etiqueta="Fecha" valor={formatoFecha(detalle.fecha)} />
            <Campo etiqueta="IP de origen" valor={detalle.ip_origen ?? '—'} />
            <Campo etiqueta="Cliente" valor={detalle.user_agent ?? '—'} full />
          </dl>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <JsonBloque titulo="Datos anteriores" datos={detalle.datos_anteriores} />
            <JsonBloque titulo="Datos nuevos" datos={detalle.datos_nuevos} />
          </div>
        </div>
      )}
    </Modal>
  )
}

function Campo({ etiqueta, valor, full }: { etiqueta: string; valor: string; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiqueta}</dt>
      <dd className="mt-0.5 break-words text-slate-700 dark:text-slate-200">{valor}</dd>
    </div>
  )
}

function JsonBloque({ titulo, datos }: { titulo: string; datos: Record<string, unknown> | null }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{titulo}</p>
      <pre className="max-h-60 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-white/5 dark:text-slate-200">
        {datos ? JSON.stringify(datos, null, 2) : '—'}
      </pre>
    </div>
  )
}
