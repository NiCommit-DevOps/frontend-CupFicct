import { Badge, Button } from '@/shared/ui'
import type { Carrera } from '@/modules/examenes/types'

interface Props {
  carreras: Carrera[]
  onVer: (c: Carrera) => void
  onEditar: (c: Carrera) => void
  onEliminar: (c: Carrera) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  eliminandoId: number | null
}

export function CarrerasTable({
  carreras,
  onVer,
  onEditar,
  onEliminar,
  puedeEditar,
  puedeEliminar,
  eliminandoId,
}: Props) {
  if (carreras.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No hay carreras registradas.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Carrera</th>
            <th className="px-4 py-3 font-medium">Código</th>
            <th className="px-4 py-3 font-medium">Modalidad</th>
            <th className="px-4 py-3 font-medium">Área</th>
            <th className="px-4 py-3 font-medium">Plan</th>
            <th className="px-4 py-3 font-medium">Cupos</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {carreras.map((c) => (
            <tr key={c.id_carrera} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{c.nombre}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{c.codigo}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{c.modalidad ?? '—'}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{c.area ?? '—'}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{c.plan ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge tone="brand">{c.cupos} plazas</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {/* "Ver" siempre visible: solo lectura, sin permisos. */}
                  <Button variant="ghost" size="sm" onClick={() => onVer(c)}>
                    Ver
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
                      loading={eliminandoId === c.id_carrera}
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
  )
}
