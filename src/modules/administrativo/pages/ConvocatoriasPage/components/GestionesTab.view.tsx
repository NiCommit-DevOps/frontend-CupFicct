import { Badge, Button } from '@/shared/ui'
import type { Gestion } from '@/modules/administrativo/types'

interface Props {
  gestiones: Gestion[]
  onVer: (g: Gestion) => void
  onEditar: (g: Gestion) => void
  onActivar: (g: Gestion) => void
  onEliminar: (g: Gestion) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  cambiandoEstadoId: number | null
  eliminandoId: number | null
}

export function GestionesTab({
  gestiones,
  onVer,
  onEditar,
  onActivar,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  cambiandoEstadoId,
  eliminandoId,
}: Props) {
  if (gestiones.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No hay gestiones registradas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Gestión</th>
            <th className="px-4 py-3 font-medium">Periodo</th>
            <th className="px-4 py-3 font-medium">Convocatorias</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {gestiones.map((g) => (
            <tr key={g.id_gestion} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{g.nombre}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {g.fecha_inicio} → {g.fecha_fin}
              </td>
              <td className="px-4 py-3">
                <Badge tone="neutral">{g.convocatorias_count ?? 0}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={g.estado === 'ACTIVA' ? 'success' : 'neutral'}>
                  {g.estado === 'ACTIVA' ? 'Activa' : 'Cerrada'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* "Ver" siempre visible (solo lectura, sin permisos) */}
                  <Button variant="ghost" size="sm" onClick={() => onVer(g)}>
                    Ver
                  </Button>
                  {puedeEditar && g.estado === 'CERRADA' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={cambiandoEstadoId === g.id_gestion}
                      onClick={() => onActivar(g)}
                    >
                      Activar
                    </Button>
                  )}
                  {puedeEditar && (
                    <Button variant="ghost" size="sm" onClick={() => onEditar(g)}>
                      Editar
                    </Button>
                  )}
                  {puedeEliminar && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={eliminandoId === g.id_gestion}
                      onClick={() => onEliminar(g)}
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
  )
}
