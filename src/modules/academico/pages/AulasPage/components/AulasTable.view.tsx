import { Badge, Button } from '@/shared/ui'
import type { Aula } from '@/modules/academico/types'

interface Props {
  aulas: Aula[]
  onVer: (a: Aula) => void
  onEditar: (a: Aula) => void
  onEliminar: (a: Aula) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  eliminandoId: number | null
}

export function AulasTable({
  aulas,
  onVer,
  onEditar,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  eliminandoId,
}: Props) {
  if (aulas.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No hay aulas registradas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Aula</th>
            <th className="px-4 py-3 font-medium">Ubicación</th>
            <th className="px-4 py-3 font-medium">Capacidad</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {aulas.map((a) => (
            <tr key={a.id_aula} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{a.nombre}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{a.ubicacion ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge tone="neutral">{a.capacidad} estudiantes</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* "Ver" siempre visible (solo lectura, sin gate de permisos) */}
                  <Button variant="ghost" size="sm" onClick={() => onVer(a)}>
                    Ver
                  </Button>
                  {puedeEditar && (
                    <Button variant="ghost" size="sm" onClick={() => onEditar(a)}>
                      Editar
                    </Button>
                  )}
                  {puedeEliminar && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={eliminandoId === a.id_aula}
                      onClick={() => onEliminar(a)}
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
