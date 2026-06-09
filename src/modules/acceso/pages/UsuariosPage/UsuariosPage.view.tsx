import { Badge, Card, DetailModal, LoadingState, PageHeader, Pagination } from '@/shared/ui'
import type { Paginated, Rol, Usuario } from '@/modules/acceso/types'
import { UsuariosToolbar } from './components/UsuariosToolbar.view'
import { UsuariosTable } from './components/UsuariosTable.view'
import { UsuarioFormModal, type UsuarioFormValues } from './components/UsuarioFormModal.view'

const sexoLabel: Record<string, string> = { M: 'Masculino', F: 'Femenino', Otro: 'Otro' }

interface Props {
  data?: Paginated<Usuario>
  isLoading: boolean
  roles: Rol[]
  buscar: string
  onBuscarChange: (v: string) => void
  page: number
  onPageChange: (page: number) => void
  // permisos
  puedeCrear: boolean
  puedeEditar: boolean
  puedeToggle: boolean
  // modal
  modalOpen: boolean
  editando: Usuario | null
  viendo: Usuario | null
  onNuevo: () => void
  onEditar: (u: Usuario) => void
  onVer: (u: Usuario) => void
  onCerrarVer: () => void
  onCerrarModal: () => void
  onSubmit: (values: UsuarioFormValues) => void
  guardando: boolean
  errorForm: string | null
  // toggle
  onToggleEstado: (u: Usuario) => void
  toggleandoId: number | null
  // CU02 — activación masiva
  onActivarTodos: () => void
  activandoTodos: boolean
}

export function UsuariosPageView(props: Props) {
  const { data, isLoading } = props

  return (
    <div className="flex flex-col">
      <PageHeader title="Usuarios" subtitle="Gestión del personal administrativo y docente (CU02)" />

      <Card>
        <div className="border-b border-slate-200/60 p-4 dark:border-slate-700/40">
          <UsuariosToolbar
            buscar={props.buscar}
            onBuscarChange={props.onBuscarChange}
            onNuevo={props.onNuevo}
            puedeCrear={props.puedeCrear}
            puedeActivarTodos={props.puedeToggle}
            onActivarTodos={props.onActivarTodos}
            activandoTodos={props.activandoTodos}
          />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <UsuariosTable
              usuarios={data?.data ?? []}
              onEditar={props.onEditar}
              onVer={props.onVer}
              onToggleEstado={props.onToggleEstado}
              puedeEditar={props.puedeEditar}
              puedeToggle={props.puedeToggle}
              toggleandoId={props.toggleandoId}
            />
            {data && (
              <div className="border-t border-slate-200/60 dark:border-slate-700/40">
                <Pagination
                  page={data.meta.current_page}
                  lastPage={data.meta.last_page}
                  total={data.meta.total}
                  onPageChange={props.onPageChange}
                />
              </div>
            )}
          </>
        )}
      </Card>

      <UsuarioFormModal
        open={props.modalOpen}
        onClose={props.onCerrarModal}
        onSubmit={props.onSubmit}
        loading={props.guardando}
        error={props.errorForm}
        roles={props.roles}
        usuario={props.editando}
      />

      <DetailModal
        open={props.viendo != null}
        onClose={props.onCerrarVer}
        title="Detalle del usuario"
        fields={
          props.viendo
            ? [
                { label: 'Nombres', value: props.viendo.nombres },
                { label: 'Apellidos', value: props.viendo.apellidos },
                { label: 'CI', value: props.viendo.ci },
                { label: 'Correo', value: props.viendo.correo },
                { label: 'Teléfono 1', value: props.viendo.telefono1 },
                { label: 'Teléfono 2', value: props.viendo.telefono2 },
                { label: 'Fecha de nacimiento', value: props.viendo.fecha_nacimiento },
                { label: 'Sexo', value: props.viendo.sexo ? sexoLabel[props.viendo.sexo] ?? props.viendo.sexo : '' },
                { label: 'Rol', value: props.viendo.rol?.nombre },
                {
                  label: 'Estado',
                  value: props.viendo.esta_activo ? (
                    <Badge tone="success">Activo</Badge>
                  ) : (
                    <Badge tone="danger">Inhabilitado</Badge>
                  ),
                },
              ]
            : []
        }
      />
    </div>
  )
}
