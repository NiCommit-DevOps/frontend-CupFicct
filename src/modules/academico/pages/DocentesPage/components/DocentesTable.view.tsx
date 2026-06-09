import { Badge, Button } from '@/shared/ui'
import type { Docente } from '@/modules/academico/types'

interface Props {
  docentes: Docente[]
  onVer: (d: Docente) => void
  onEditar: (d: Docente) => void
  onEliminar: (d: Docente) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  eliminandoId: number | null
}

export function DocentesTable({
  docentes,
  onVer,
  onEditar,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  eliminandoId,
}: Props) {
  if (docentes.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No se encontraron docentes.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Docente</th>
            <th className="px-4 py-3 font-medium">Profesión</th>
            <th className="px-4 py-3 font-medium">Carga</th>
            <th className="px-4 py-3 font-medium">Materias</th>
            <th className="px-4 py-3 font-medium">Postgrados</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {docentes.map((d) => (
            <tr key={d.id_docente} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-700 dark:text-slate-200">
                  {d.usuario ? `${d.usuario.nombres} ${d.usuario.apellidos}` : `Docente #${d.id_docente}`}
                </div>
                <div className="text-xs text-slate-400">{d.usuario?.correo ?? '—'}</div>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {d.profesion ?? '—'}
                {d.especialidad && (
                  <div className="text-xs text-slate-400">{d.especialidad}</div>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {d.carga_horaria != null ? `${d.carga_horaria} h` : '—'}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {d.materias && d.materias.length > 0 ? (
                    d.materias.map((m) => (
                      <Badge key={m.id_materia} tone="brand">
                        {m.nombre}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {d.tiene_maestria && <Badge tone="success">Maestría</Badge>}
                  {d.tiene_diplomado && <Badge tone="neutral">Diplomado</Badge>}
                  {!d.tiene_maestria && !d.tiene_diplomado && <span className="text-slate-300">—</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* "Ver" siempre visible (sin gate de permisos). */}
                  <Button variant="ghost" size="sm" onClick={() => onVer(d)}>
                    Ver
                  </Button>
                  {puedeEditar && (
                    <Button variant="ghost" size="sm" onClick={() => onEditar(d)}>
                      Editar
                    </Button>
                  )}
                  {puedeEliminar && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={eliminandoId === d.id_docente}
                      onClick={() => onEliminar(d)}
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
