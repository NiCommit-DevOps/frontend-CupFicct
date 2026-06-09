import { Button, Card, DetailModal, LoadingState, PageHeader } from '@/shared/ui'
import type { MatrizPermisos, Rol } from '@/modules/acceso/types'
import { RolesTable } from './components/RolesTable.view'
import { RolFormModal } from './components/RolFormModal.view'
import { PermisosModal } from './components/PermisosModal.view'

interface Props {
  roles: Rol[]
  isLoading: boolean
  // permisos de UI
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
  puedePermisos: boolean
  // modal rol
  rolModalOpen: boolean
  rolEditando: Rol | null
  viendo: Rol | null
  onNuevoRol: () => void
  onEditarRol: (r: Rol) => void
  onVer: (r: Rol) => void
  onCerrarVer: () => void
  onCerrarRolModal: () => void
  onSubmitRol: (nombre: string) => void
  guardandoRol: boolean
  errorRol: string | null
  // eliminar
  onEliminarRol: (r: Rol) => void
  eliminandoId: number | null
  // modal permisos
  permisosModalOpen: boolean
  rolPermisos: Rol | null
  matriz: MatrizPermisos
  permisosIniciales: number[]
  cargandoPermisos: boolean
  onAbrirPermisos: (r: Rol) => void
  onCerrarPermisos: () => void
  onGuardarPermisos: (ids: number[]) => void
  guardandoPermisos: boolean
  errorPermisos: string | null
}

export function RolesPageView(props: Props) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Roles y permisos"
        subtitle="Jerarquías de seguridad del sistema (CU03)"
        actions={
          props.puedeCrear ? (
            <Button
              onClick={props.onNuevoRol}
              leftIcon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              }
            >
              Nuevo rol
            </Button>
          ) : undefined
        }
      />

      <Card>
        {props.isLoading ? (
          <LoadingState />
        ) : (
          <RolesTable
            roles={props.roles}
            onVer={props.onVer}
            onEditar={props.onEditarRol}
            onPermisos={props.onAbrirPermisos}
            onEliminar={props.onEliminarRol}
            puedeEditar={props.puedeEditar}
            puedePermisos={props.puedePermisos}
            puedeEliminar={props.puedeEliminar}
            eliminandoId={props.eliminandoId}
          />
        )}
      </Card>

      <RolFormModal
        open={props.rolModalOpen}
        onClose={props.onCerrarRolModal}
        onSubmit={props.onSubmitRol}
        loading={props.guardandoRol}
        error={props.errorRol}
        rol={props.rolEditando}
      />

      <PermisosModal
        open={props.permisosModalOpen}
        onClose={props.onCerrarPermisos}
        rolNombre={props.rolPermisos?.nombre ?? ''}
        matriz={props.matriz}
        permisosIniciales={props.permisosIniciales}
        cargando={props.cargandoPermisos}
        guardando={props.guardandoPermisos}
        error={props.errorPermisos}
        onGuardar={props.onGuardarPermisos}
      />

      <DetailModal
        open={props.viendo != null}
        onClose={props.onCerrarVer}
        title="Detalle del rol"
        fields={
          props.viendo
            ? [
                { label: 'Nombre', value: props.viendo.nombre },
                {
                  label: 'Cantidad de permisos',
                  value: props.viendo.permisos_count ?? props.viendo.permisos?.length ?? 0,
                },
                {
                  label: 'Permisos asignados',
                  value: props.viendo.permisos?.length
                    ? props.viendo.permisos.map((p) => p.modulo).join(', ')
                    : '',
                  full: true,
                },
              ]
            : []
        }
      />
    </div>
  )
}
