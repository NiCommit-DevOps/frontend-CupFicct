import { Button, Card, DetailModal, LoadingState, PageHeader } from '@/shared/ui'
import type { Aula } from '@/modules/academico/types'
import { AulasTable } from './components/AulasTable.view'
import { AulaFormModal, type AulaFormValues } from './components/AulaFormModal.view'

interface Props {
  aulas: Aula[]
  isLoading: boolean
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
  modalOpen: boolean
  aulaEditando: Aula | null
  viendo: Aula | null
  onVer: (a: Aula) => void
  onCerrarVer: () => void
  onNueva: () => void
  onEditar: (a: Aula) => void
  onCerrarModal: () => void
  onSubmit: (values: AulaFormValues) => void
  guardando: boolean
  error: string | null
  onEliminar: (a: Aula) => void
  eliminandoId: number | null
}

export function AulasPageView(props: Props) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Aulas y recursos físicos"
        subtitle="Inventario de ambientes para los exámenes (CU17)"
        actions={
          props.puedeCrear ? (
            <Button
              onClick={props.onNueva}
              leftIcon={
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              }
            >
              Nueva aula
            </Button>
          ) : undefined
        }
      />

      <Card>
        {props.isLoading ? (
          <LoadingState />
        ) : (
          <AulasTable
            aulas={props.aulas}
            onVer={props.onVer}
            onEditar={props.onEditar}
            onEliminar={props.onEliminar}
            puedeEditar={props.puedeEditar}
            puedeEliminar={props.puedeEliminar}
            eliminandoId={props.eliminandoId}
          />
        )}
      </Card>

      <AulaFormModal
        open={props.modalOpen}
        onClose={props.onCerrarModal}
        onSubmit={props.onSubmit}
        loading={props.guardando}
        error={props.error}
        aula={props.aulaEditando}
      />

      {/* Modal de solo lectura ("Ver"): muestra los datos del aula sin edición. */}
      <DetailModal
        open={props.viendo !== null}
        onClose={props.onCerrarVer}
        title="Detalle del aula"
        fields={
          props.viendo
            ? [
                { label: 'Nombre', value: props.viendo.nombre },
                { label: 'Capacidad', value: `${props.viendo.capacidad} estudiantes` },
                { label: 'Ubicación', value: props.viendo.ubicacion, full: true },
                { label: 'Módulo', value: props.viendo.modulo },
                { label: 'Piso', value: props.viendo.piso },
                { label: 'Número', value: props.viendo.numero },
              ]
            : []
        }
      />
    </div>
  )
}
