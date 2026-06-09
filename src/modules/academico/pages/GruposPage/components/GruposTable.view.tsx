import { Badge, Button } from '@/shared/ui'
import type { Grupo } from '@/modules/academico/types'

interface Props {
  grupos: Grupo[]
  onVer: (g: Grupo) => void
  onEditar: (g: Grupo) => void
  onEliminar: (g: Grupo) => void
  puedeEditar: boolean
  puedeEliminar: boolean
  eliminandoId: number | null
}

export function GruposTable({ grupos, onVer, onEditar, onEliminar, puedeEditar, puedeEliminar, eliminandoId }: Props) {
  if (grupos.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        No hay grupos registrados.
      </div>
    )
  }

  // "Ver" siempre está disponible, por lo que la columna de acciones es permanente.
  const acciones = true

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Sigla</th>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Turno</th>
            <th className="px-4 py-3 font-medium">Aula</th>
            <th className="px-4 py-3 font-medium">Cupo</th>
            {acciones && <th className="px-4 py-3 text-right font-medium">Acciones</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {grupos.map((g) => {
            const lleno = g.cupo_disponible <= 0
            return (
              <tr key={g.id_grupo} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="px-4 py-3 font-mono font-medium text-slate-700 dark:text-slate-200">{g.sigla}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{g.nombre}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{g.turno ?? '—'}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {g.aula ? `${g.aula.nombre} (${g.aula.capacidad})` : '—'}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={lleno ? 'danger' : 'success'}>
                    {g.cupo_usado}/{g.capacidad_max}
                  </Badge>
                </td>
                {acciones && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {/* "Ver" siempre visible: solo lectura, sin restricción de permisos. */}
                      <Button variant="ghost" size="sm" onClick={() => onVer(g)}>
                        Ver
                      </Button>
                      {puedeEditar && (
                        <Button variant="ghost" size="sm" onClick={() => onEditar(g)}>
                          Editar
                        </Button>
                      )}
                      {puedeEliminar && (
                        <Button
                          variant="danger"
                          size="sm"
                          loading={eliminandoId === g.id_grupo}
                          onClick={() => onEliminar(g)}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
