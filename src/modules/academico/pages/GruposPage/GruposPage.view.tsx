import { Button, Card, DetailModal, LoadingState, PageHeader } from '@/shared/ui'
import type { AsignacionData, Grupo, GrupoCatalogos } from '@/modules/academico/types'
import { GruposTable } from './components/GruposTable.view'
import { GrupoFormModal, type GrupoFormValues } from './components/GrupoFormModal.view'
import { AsignacionPanel } from './components/AsignacionPanel.view'
import { ResumenAsignacionView } from './components/ResumenAsignacion.view'

interface Props {
  grupos: Grupo[]
  isLoading: boolean
  asignacion?: AsignacionData
  asignacionLoading: boolean
  catalogos?: GrupoCatalogos
  // permisos
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
  puedeAsignar: boolean
  // creación automática de grupos
  onCrearGrupos: () => void
  creandoGrupos: boolean
  hayElegibles: boolean
  // modal grupo
  modalOpen: boolean
  editando: Grupo | null
  viendo: Grupo | null
  onNuevo: () => void
  onVer: (g: Grupo) => void
  onCerrarVer: () => void
  onEditar: (g: Grupo) => void
  onCerrarModal: () => void
  onSubmit: (values: GrupoFormValues) => void
  guardando: boolean
  errorForm: string | null
  onEliminar: (g: Grupo) => void
  eliminandoId: number | null
  // asignación
  onCambiarAsignacion: (idInscripcion: number, idGrupo: number | null) => void
  asignando: boolean
  onAsignarLote: () => void
  onRebalancear: () => void
  procesandoLote: boolean
  procesandoRebalanceo: boolean
  aviso: string | null
  errorAccion: string | null
}

export function GruposPageView(props: Props) {
  const iconPlus = (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  )
  const iconGrupos = (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 10-2.8-4M5 11a3 3 0 102.8-4" />
    </svg>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Grupos de examen"
        subtitle={
          props.asignacion?.convocatoria
            ? `Convocatoria activa: ${props.asignacion.convocatoria.nombre} · grupos y asignación de postulantes habilitados (CU09)`
            : 'No hay una convocatoria activa. Aperture una para gestionar sus grupos (CU09)'
        }
      />

      {/* Cálculo automático: total de inscritos, grupos necesarios y estudiantes por grupo. */}
      {!props.asignacionLoading && props.asignacion?.resumen && (
        <ResumenAsignacionView resumen={props.asignacion.resumen} />
      )}

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200/60 p-4 dark:border-slate-700/40">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Grupos</h3>
          {props.puedeCrear && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={props.onCrearGrupos}
                loading={props.creandoGrupos}
                disabled={!props.hayElegibles}
                title={
                  props.hayElegibles
                    ? 'Crea automáticamente los grupos necesarios (máx. 70 c/u) y reparte a los inscritos'
                    : 'No hay postulantes habilitados (ELEGIBLE) todavía'
                }
                leftIcon={iconGrupos}
              >
                Crear grupos
              </Button>
              <Button onClick={props.onNuevo} leftIcon={iconPlus}>
                Nuevo grupo
              </Button>
            </div>
          )}
        </div>
        {props.isLoading ? (
          <LoadingState />
        ) : (
          <GruposTable
            grupos={props.grupos}
            onVer={props.onVer}
            onEditar={props.onEditar}
            onEliminar={props.onEliminar}
            puedeEditar={props.puedeEditar}
            puedeEliminar={props.puedeEliminar}
            eliminandoId={props.eliminandoId}
          />
        )}
      </Card>

      <Card>
        {props.asignacionLoading ? (
          <LoadingState />
        ) : (
          <AsignacionPanel
            postulantes={props.asignacion?.postulantes ?? []}
            grupos={props.asignacion?.grupos ?? props.grupos}
            puedeAsignar={props.puedeAsignar}
            onCambiarAsignacion={props.onCambiarAsignacion}
            asignando={props.asignando}
            onAsignarLote={props.onAsignarLote}
            onRebalancear={props.onRebalancear}
            procesandoLote={props.procesandoLote}
            procesandoRebalanceo={props.procesandoRebalanceo}
            aviso={props.aviso}
            errorAccion={props.errorAccion}
          />
        )}
      </Card>

      <GrupoFormModal
        open={props.modalOpen}
        onClose={props.onCerrarModal}
        onSubmit={props.onSubmit}
        loading={props.guardando}
        error={props.errorForm}
        catalogos={props.catalogos}
        grupo={props.editando}
      />

      {/* Modal de SOLO LECTURA: muestra el detalle completo del grupo. */}
      <DetailModal
        open={props.viendo !== null}
        onClose={props.onCerrarVer}
        title="Detalle del grupo"
        fields={
          props.viendo
            ? [
                { label: 'Sigla', value: props.viendo.sigla },
                { label: 'Nombre', value: props.viendo.nombre },
                { label: 'Turno', value: props.viendo.turno },
                { label: 'Capacidad máxima', value: props.viendo.capacidad_max },
                { label: 'Cupo usado', value: props.viendo.cupo_usado },
                { label: 'Cupo disponible', value: props.viendo.cupo_disponible },
                {
                  label: 'Aula',
                  value: props.viendo.aula
                    ? `${props.viendo.aula.nombre} (cap. ${props.viendo.aula.capacidad})`
                    : null,
                  full: true,
                },
              ]
            : []
        }
      />
    </div>
  )
}
