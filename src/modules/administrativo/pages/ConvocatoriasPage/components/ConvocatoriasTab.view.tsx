import { Badge, Button, Select } from '@/shared/ui'
import {
  ESTADOS_CONVOCATORIA,
  type Convocatoria,
  type EstadoConvocatoria,
  type Gestion,
} from '@/modules/administrativo/types'

const TONO_ESTADO: Record<EstadoConvocatoria, 'success' | 'brand' | 'neutral'> = {
  ABIERTA: 'success',
  PROCESO_EVALUACION: 'brand',
  CONCLUIDA: 'neutral',
}

interface Props {
  convocatorias: Convocatoria[]
  gestiones: Gestion[]
  filtroGestion: number | null
  onFiltroChange: (id: number | null) => void
  onVer: (c: Convocatoria) => void
  onEditar: (c: Convocatoria) => void
  onCupos: (c: Convocatoria) => void
  onCambiarEstado: (c: Convocatoria, estado: EstadoConvocatoria) => void
  onEliminar: (c: Convocatoria) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  cambiandoEstadoId: number | null
  eliminandoId: number | null
}

export function ConvocatoriasTab({
  convocatorias,
  gestiones,
  filtroGestion,
  onFiltroChange,
  onVer,
  onEditar,
  onCupos,
  onCambiarEstado,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  cambiandoEstadoId,
  eliminandoId,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full px-4 pt-4 sm:max-w-sm">
        <Select
          label="Filtrar por gestión"
          value={filtroGestion ?? ''}
          onChange={(e) => onFiltroChange(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Todas las gestiones</option>
          {gestiones.map((g) => (
            <option key={g.id_gestion} value={g.id_gestion}>
              {g.nombre}
            </option>
          ))}
        </Select>
      </div>

      {convocatorias.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
          No hay convocatorias registradas.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                <th className="px-4 py-3 font-medium">Convocatoria</th>
                <th className="px-4 py-3 font-medium">Gestión</th>
                <th className="px-4 py-3 font-medium">Límite inscripción</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {convocatorias.map((c) => (
                <tr
                  key={c.id_convocatoria}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{c.nombre}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {c.gestion?.nombre ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {c.fecha_limite_inscripcion}
                  </td>
                  <td className="px-4 py-3">
                    {puedeEditar ? (
                      <Select
                        value={c.estado}
                        disabled={cambiandoEstadoId === c.id_convocatoria}
                        onChange={(e) => onCambiarEstado(c, e.target.value as EstadoConvocatoria)}
                        className="!py-1.5 text-xs"
                      >
                        {ESTADOS_CONVOCATORIA.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Badge tone={TONO_ESTADO[c.estado]}>
                        {ESTADOS_CONVOCATORIA.find((op) => op.value === c.estado)?.label ?? c.estado}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {/* "Ver" siempre visible (solo lectura, sin permisos) */}
                      <Button variant="ghost" size="sm" onClick={() => onVer(c)}>
                        Ver
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onCupos(c)}>
                        Cupos
                      </Button>
                      {puedeEditar && (
                        <Button variant="ghost" size="sm" onClick={() => onEditar(c)}>
                          Editar
                        </Button>
                      )}
                      {puedeEliminar && (
                        <Button
                          variant="danger"
                          size="sm"
                          loading={eliminandoId === c.id_convocatoria}
                          onClick={() => onEliminar(c)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
