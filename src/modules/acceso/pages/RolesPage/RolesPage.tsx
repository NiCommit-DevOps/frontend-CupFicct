import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useRoles,
  useRol,
  useCrearRol,
  useActualizarRol,
  useEliminarRol,
  useSincronizarPermisos,
} from '../../hooks/useRoles'
import { useMatrizPermisos } from '../../hooks/usePermisos'
import type { Rol } from '../../types'
import { RolesPageView } from './RolesPage.view'

export function RolesPage() {
  const { tienePermiso } = useAuth()

  const [rolModalOpen, setRolModalOpen] = useState(false)
  const [rolEditando, setRolEditando] = useState<Rol | null>(null)
  const [permisosModalOpen, setPermisosModalOpen] = useState(false)
  const [rolPermisos, setRolPermisos] = useState<Rol | null>(null)
  const [viendo, setViendo] = useState<Rol | null>(null)

  const rolesQuery = useRoles()
  const matrizQuery = useMatrizPermisos()
  const detalleQuery = useRol(permisosModalOpen ? (rolPermisos?.id_rol ?? null) : null)

  const crear = useCrearRol()
  const actualizar = useActualizarRol()
  const eliminar = useEliminarRol()
  const sincronizar = useSincronizarPermisos()

  // --- Rol (crear/editar) ---
  const abrirNuevoRol = () => {
    setRolEditando(null)
    crear.reset()
    actualizar.reset()
    setRolModalOpen(true)
  }
  const abrirEditarRol = (rol: Rol) => {
    setRolEditando(rol)
    crear.reset()
    actualizar.reset()
    setRolModalOpen(true)
  }
  const cerrarRolModal = () => setRolModalOpen(false)

  // --- Ver (solo lectura) ---
  const abrirVer = (rol: Rol) => setViendo(rol)
  const cerrarVer = () => setViendo(null)

  const submitRol = (nombre: string) => {
    if (rolEditando) {
      actualizar.mutate(
        { id: rolEditando.id_rol, payload: { nombre } },
        { onSuccess: cerrarRolModal },
      )
    } else {
      crear.mutate({ nombre }, { onSuccess: cerrarRolModal })
    }
  }

  const eliminarRol = (rol: Rol) => {
    if (window.confirm(`¿Eliminar el rol "${rol.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminar.mutate(rol.id_rol)
    }
  }

  // --- Permisos ---
  const abrirPermisos = (rol: Rol) => {
    setRolPermisos(rol)
    sincronizar.reset()
    setPermisosModalOpen(true)
  }
  const cerrarPermisos = () => setPermisosModalOpen(false)

  const guardarPermisos = (ids: number[]) => {
    if (!rolPermisos) return
    sincronizar.mutate(
      { id: rolPermisos.id_rol, permisos: ids },
      { onSuccess: cerrarPermisos },
    )
  }

  const mutacionRol = rolEditando ? actualizar : crear

  return (
    <RolesPageView
      roles={rolesQuery.data ?? []}
      isLoading={rolesQuery.isLoading}
      puedeCrear={tienePermiso('roles.store')}
      puedeEditar={tienePermiso('roles.update')}
      puedeEliminar={tienePermiso('roles.destroy')}
      puedePermisos={tienePermiso('roles.permisos')}
      rolModalOpen={rolModalOpen}
      rolEditando={rolEditando}
      viendo={viendo}
      onNuevoRol={abrirNuevoRol}
      onEditarRol={abrirEditarRol}
      onVer={abrirVer}
      onCerrarVer={cerrarVer}
      onCerrarRolModal={cerrarRolModal}
      onSubmitRol={submitRol}
      guardandoRol={mutacionRol.isPending}
      errorRol={mutacionRol.isError ? extraerMensajeError(mutacionRol.error) : null}
      onEliminarRol={eliminarRol}
      eliminandoId={eliminar.isPending ? (eliminar.variables as number) : null}
      permisosModalOpen={permisosModalOpen}
      rolPermisos={rolPermisos}
      matriz={matrizQuery.data ?? {}}
      permisosIniciales={detalleQuery.data?.permisos?.map((p) => p.id_permiso) ?? []}
      cargandoPermisos={detalleQuery.isLoading || matrizQuery.isLoading}
      onAbrirPermisos={abrirPermisos}
      onCerrarPermisos={cerrarPermisos}
      onGuardarPermisos={guardarPermisos}
      guardandoPermisos={sincronizar.isPending}
      errorPermisos={sincronizar.isError ? extraerMensajeError(sincronizar.error) : null}
    />
  )
}
