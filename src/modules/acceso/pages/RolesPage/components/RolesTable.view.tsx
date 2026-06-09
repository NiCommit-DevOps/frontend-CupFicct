import { Badge, Button } from '@/shared/ui'
import type { Rol } from '@/modules/acceso/types'

interface Props {
  roles: Rol[]
  onVer: (rol: Rol) => void
  onEditar: (rol: Rol) => void
  onPermisos: (rol: Rol) => void
  onEliminar: (rol: Rol) => void
  puedeEditar: boolean
  puedePermisos: boolean
  puedeEliminar: boolean
  eliminandoId: number | null
}

export function RolesTable({
  roles,
  onVer,
  onEditar,
  onPermisos,
  onEliminar,
  puedeEditar,
  puedePermisos,
  puedeEliminar,
  eliminandoId,
}: Props) {
  if (roles.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No hay roles registrados.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Permisos asignados</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {roles.map((rol) => (
            <tr key={rol.id_rol} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{rol.nombre}</td>
              <td className="px-4 py-3">
                <Badge tone="neutral">{rol.permisos_count ?? 0} permiso(s)</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onVer(rol)}>
                    Ver
                  </Button>
                  {puedePermisos && (
                    <Button variant="secondary" size="sm" onClick={() => onPermisos(rol)}>
                      Permisos
                    </Button>
                  )}
                  {puedeEditar && (
                    <Button variant="ghost" size="sm" onClick={() => onEditar(rol)}>
                      Editar
                    </Button>
                  )}
                  {puedeEliminar && (
                    <Button
                      variant="danger"
                      size="sm"
                      loading={eliminandoId === rol.id_rol}
                      onClick={() => onEliminar(rol)}
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
