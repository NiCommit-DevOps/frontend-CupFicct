import { Badge, Button } from '@/shared/ui'
import type { Usuario } from '@/modules/acceso/types'

interface Props {
  usuarios: Usuario[]
  onEditar: (usuario: Usuario) => void
  onVer: (usuario: Usuario) => void
  onToggleEstado: (usuario: Usuario) => void
  puedeEditar: boolean
  puedeToggle: boolean
  toggleandoId: number | null
}

export function UsuariosTable({
  usuarios,
  onEditar,
  onVer,
  onToggleEstado,
  puedeEditar,
  puedeToggle,
  toggleandoId,
}: Props) {
  if (usuarios.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        No se encontraron usuarios.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Usuario</th>
            <th className="px-4 py-3 font-medium">CI</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 text-right font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {usuarios.map((u) => (
            <tr key={u.id_usuario} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-700 dark:text-slate-200">
                  {u.nombres} {u.apellidos}
                </div>
                <div className="text-xs text-slate-400">{u.correo}</div>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{u.ci}</td>
              <td className="px-4 py-3">
                {u.rol ? <Badge tone="brand">{u.rol.nombre}</Badge> : <span className="text-slate-300">—</span>}
              </td>
              <td className="px-4 py-3">
                {u.esta_activo ? (
                  <Badge tone="success">Activo</Badge>
                ) : (
                  <Badge tone="danger">Inhabilitado</Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onVer(u)}>
                    Ver
                  </Button>
                  {puedeEditar && (
                    <Button variant="ghost" size="sm" onClick={() => onEditar(u)}>
                      Editar
                    </Button>
                  )}
                  {puedeToggle && (
                    <Button
                      variant={u.esta_activo ? 'secondary' : 'primary'}
                      size="sm"
                      loading={toggleandoId === u.id_usuario}
                      onClick={() => onToggleEstado(u)}
                    >
                      {u.esta_activo ? 'Inhabilitar' : 'Activar'}
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
