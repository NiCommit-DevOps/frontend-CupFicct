import { Button, Card, DetailModal, LoadingState, PageHeader } from '@/shared/ui'
import type { Carrera, CarreraCatalogos } from '@/modules/examenes/types'
import { CarrerasTable } from './components/CarrerasTable.view'
import { CarreraFormModal, type CarreraFormValues } from './components/CarreraFormModal.view'

interface Props {
  carreras: Carrera[]
  isLoading: boolean
  catalogos: CarreraCatalogos
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
  modalOpen: boolean
  carreraEditando: Carrera | null
  viendo: Carrera | null
  onNueva: () => void
  onVer: (c: Carrera) => void
  onEditar: (c: Carrera) => void
  onCerrarModal: () => void
  onCerrarVer: () => void
  onSubmit: (values: CarreraFormValues) => void
  guardando: boolean
  error: string | null
  onEliminar: (c: Carrera) => void
  eliminandoId: number | null
}

export function CarrerasPageView(props: Props) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Carreras"
        subtitle="Oferta académica y cupos estándar por carrera (CU08)"
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
              Nueva carrera
            </Button>
          ) : undefined
        }
      />

      <Card>
        {props.isLoading ? (
          <LoadingState />
        ) : (
          <CarrerasTable
            carreras={props.carreras}
            onVer={props.onVer}
            onEditar={props.onEditar}
            onEliminar={props.onEliminar}
            puedeEditar={props.puedeEditar}
            puedeEliminar={props.puedeEliminar}
            eliminandoId={props.eliminandoId}
          />
        )}
      </Card>

      <CarreraFormModal
        open={props.modalOpen}
        onClose={props.onCerrarModal}
        onSubmit={props.onSubmit}
        loading={props.guardando}
        error={props.error}
        carrera={props.carreraEditando}
        catalogos={props.catalogos}
      />

      {/* Modal de solo lectura ("Ver"): muestra los atributos de la carrera. */}
      <DetailModal
        open={props.viendo != null}
        onClose={props.onCerrarVer}
        title="Detalle de la carrera"
        fields={
          props.viendo
            ? [
                { label: 'Nombre', value: props.viendo.nombre, full: true },
                { label: 'Código', value: props.viendo.codigo },
                { label: 'Modalidad', value: props.viendo.modalidad },
                { label: 'Área', value: props.viendo.area },
                { label: 'Plan', value: props.viendo.plan },
                { label: 'Cupos', value: `${props.viendo.cupos} plazas` },
              ]
            : []
        }
      />
    </div>
  )
}
