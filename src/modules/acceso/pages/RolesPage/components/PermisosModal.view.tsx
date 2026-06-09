import { useEffect, useMemo, useState } from 'react'
import { Button, LoadingState, Modal } from '@/shared/ui'
import type { MatrizPermisos, Permiso } from '@/modules/acceso/types'

interface Props {
  open: boolean
  onClose: () => void
  rolNombre: string
  matriz: MatrizPermisos
  permisosIniciales: number[]
  cargando: boolean
  guardando: boolean
  error: string | null
  onGuardar: (ids: number[]) => void
}

export function PermisosModal({
  open,
  onClose,
  rolNombre,
  matriz,
  permisosIniciales,
  cargando,
  guardando,
  error,
  onGuardar,
}: Props) {
  const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set())

  // Reagrupa los permisos por componente lógico (prefijo antes del punto).
  const grupos = useMemo(() => {
    const todos: Permiso[] = Object.values(matriz).flat()
    const map = new Map<string, Permiso[]>()
    for (const p of todos) {
      const grupo = p.modulo.split('.')[0]
      if (!map.has(grupo)) map.set(grupo, [])
      map.get(grupo)!.push(p)
    }
    return Array.from(map.entries())
  }, [matriz])

  // Inicializa la selección cuando se abre el modal y ya llegó el detalle del rol.
  useEffect(() => {
    if (open && !cargando) {
      setSeleccionados(new Set(permisosIniciales))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cargando, permisosIniciales.join(',')])

  const toggle = (id: number) => {
    setSeleccionados((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleGrupo = (permisos: Permiso[]) => {
    const ids = permisos.map((p) => p.id_permiso)
    const todosMarcados = ids.every((id) => seleccionados.has(id))
    setSeleccionados((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (todosMarcados ? next.delete(id) : next.add(id)))
      return next
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Permisos · ${rolNombre}`}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={guardando} onClick={() => onGuardar(Array.from(seleccionados))}>
            Sincronizar permisos
          </Button>
        </>
      }
    >
      {cargando ? (
        <LoadingState label="Cargando permisos del rol…" />
      ) : (
        <div className="flex flex-col gap-5">
          {grupos.map(([grupo, permisos]) => {
            const todosMarcados = permisos.every((p) => seleccionados.has(p.id_permiso))
            return (
              <div key={grupo}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
                    {grupo}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleGrupo(permisos)}
                    className="text-xs font-medium text-brand-500 hover:text-brand-600"
                  >
                    {todosMarcados ? 'Quitar todos' : 'Marcar todos'}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {permisos.map((p) => (
                    <label
                      key={p.id_permiso}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/60 px-3 py-2 text-sm transition-colors hover:bg-slate-50 dark:border-slate-700/40 dark:hover:bg-slate-800/40"
                    >
                      <input
                        type="checkbox"
                        checked={seleccionados.has(p.id_permiso)}
                        onChange={() => toggle(p.id_permiso)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500/40 dark:border-slate-600"
                      />
                      <span className="flex flex-col">
                        <span className="text-slate-700 dark:text-slate-200">
                          {p.descripcion ?? p.modulo}
                        </span>
                        <span className="text-[11px] text-slate-400">{p.modulo}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
