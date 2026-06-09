import { Badge, Button } from '@/shared/ui'
import type { Postulante } from '@/modules/registro/types'
import { estadoLabel, estadoTone } from './estados'

interface Props {
  postulantes: Postulante[]
  onEditar: (p: Postulante) => void
  onVer: (p: Postulante) => void
  onEliminar: (p: Postulante) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  eliminandoId: number | null
  onCambiarEstado: (p: Postulante, estado: string) => void
  cambiandoEstado: { id: number; estado: string } | null
  onActivar?: (p: Postulante) => void
  activandoId?: number | null
}

export function PostulantesTable({
  postulantes,
  onEditar,
  onVer,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  eliminandoId,
  onCambiarEstado,
  cambiandoEstado,
  onActivar,
  activandoId,
}: Props) {
  if (postulantes.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No se encontraron postulantes.
      </div>
    )
  }

  // La columna de acciones se muestra SIEMPRE porque "Ver" no tiene gate de permisos.
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Trámite</th>
            <th className="px-4 py-3 font-medium">Postulante</th>
            <th className="px-4 py-3 font-medium">Carrera</th>
            <th className="px-4 py-3 font-medium">Turno</th>
            <th className="px-4 py-3 font-medium">Convocatoria</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {postulantes.map((p) => {
            const insc = p.inscripcion
            const estado = insc?.estado_academico ?? '—'
            return (
              <tr key={p.id_postulante} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">{p.codigo_tramite}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-700 dark:text-slate-200">
                    {p.usuario ? `${p.usuario.nombres} ${p.usuario.apellidos}` : `#${p.id_postulante}`}
                  </div>
                  <div className="text-xs text-slate-400">
                    {p.usuario?.ci} · {p.usuario?.correo}
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {insc?.carreras.map((c) => c.nombre).join(', ') || '—'}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{insc?.turno_preferencia ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{insc?.convocatoria?.nombre ?? '—'}</td>
                <td className="px-4 py-3">
                  <Badge tone={estadoTone[estado] ?? 'neutral'}>{estadoLabel[estado] ?? estado}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {/* "Ver" siempre visible: solo lectura, sin gate de permisos. */}
                    <Button variant="ghost" size="sm" onClick={() => onVer(p)}>
                      Ver
                    </Button>
                    {puedeEditar && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={estado === 'ELEGIBLE'}
                        loading={cambiandoEstado?.id === p.id_postulante && cambiandoEstado.estado === 'ELEGIBLE'}
                        onClick={() => onCambiarEstado(p, 'ELEGIBLE')}
                      >
                        Aprobar
                      </Button>
                    )}
                    {puedeEditar && estado === 'PENDIENTE' && onActivar && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="!bg-amber-500 hover:!bg-amber-600 active:!bg-amber-700"
                        loading={activandoId === p.id_postulante}
                        onClick={() => onActivar(p)}
                        title="Activar sin pago (para pruebas)"
                      >
                        Activar
                      </Button>
                    )}
                    {puedeEditar && (
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={estado === 'REPROBADO'}
                        loading={cambiandoEstado?.id === p.id_postulante && cambiandoEstado.estado === 'REPROBADO'}
                        onClick={() => onCambiarEstado(p, 'REPROBADO')}
                      >
                        Rechazar
                      </Button>
                    )}
                    {puedeEditar && (
                      <Button variant="ghost" size="sm" onClick={() => onEditar(p)}>
                        Editar
                      </Button>
                    )}
                    {puedeEliminar && (
                      <Button
                        variant="danger"
                        size="sm"
                        loading={eliminandoId === p.id_postulante}
                        onClick={() => onEliminar(p)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
