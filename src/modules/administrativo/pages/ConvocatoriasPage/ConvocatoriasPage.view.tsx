import { Badge, Button, Card, DetailModal, LoadingState, PageHeader } from '@/shared/ui'
import {
  ESTADOS_CONVOCATORIA,
  type Convocatoria,
  type EstadoConvocatoria,
  type Gestion,
} from '@/modules/administrativo/types'
import { GestionesTab } from './components/GestionesTab.view'
import { ConvocatoriasTab } from './components/ConvocatoriasTab.view'
import { GestionFormModal, type GestionFormValues } from './components/GestionFormModal.view'
import {
  ConvocatoriaFormModal,
  type ConvocatoriaFormValues,
} from './components/ConvocatoriaFormModal.view'
import { CuposConvocatoriaModal } from './components/CuposConvocatoriaModal.view'

export type Tab = 'gestiones' | 'convocatorias'

interface Props {
  tab: Tab
  onTabChange: (t: Tab) => void

  // datos
  gestiones: Gestion[]
  convocatorias: Convocatoria[]
  cargandoGestiones: boolean
  cargandoConvocatorias: boolean

  // permisos UI
  puedeCrearGestion: boolean
  puedeEditarGestion: boolean
  puedeEliminarGestion: boolean
  puedeCrearConvocatoria: boolean
  puedeEditarConvocatoria: boolean
  puedeEliminarConvocatoria: boolean

  // filtro convocatorias
  filtroGestion: number | null
  onFiltroGestion: (id: number | null) => void

  // gestion: acciones
  onNuevaGestion: () => void
  onVerGestion: (g: Gestion) => void
  viendoGestion: Gestion | null
  onCerrarVerGestion: () => void
  onEditarGestion: (g: Gestion) => void
  onActivarGestion: (g: Gestion) => void
  onEliminarGestion: (g: Gestion) => void
  cambiandoEstadoGestionId: number | null
  eliminandoGestionId: number | null

  // gestion: modal
  gestionModalOpen: boolean
  gestionEditando: Gestion | null
  onCerrarGestionModal: () => void
  onSubmitGestion: (values: GestionFormValues) => void
  guardandoGestion: boolean
  errorGestion: string | null

  // convocatoria: acciones
  onNuevaConvocatoria: () => void
  onVerConvocatoria: (c: Convocatoria) => void
  viendoConvocatoria: Convocatoria | null
  onCerrarVerConvocatoria: () => void
  onEditarConvocatoria: (c: Convocatoria) => void
  onCuposConvocatoria: (c: Convocatoria) => void
  cuposConvocatoria: Convocatoria | null
  onCerrarCupos: () => void
  onCambiarEstadoConvocatoria: (c: Convocatoria, estado: EstadoConvocatoria) => void
  onEliminarConvocatoria: (c: Convocatoria) => void
  cambiandoEstadoConvocatoriaId: number | null
  eliminandoConvocatoriaId: number | null

  // convocatoria: modal
  convocatoriaModalOpen: boolean
  convocatoriaEditando: Convocatoria | null
  onCerrarConvocatoriaModal: () => void
  onSubmitConvocatoria: (values: ConvocatoriaFormValues) => void
  guardandoConvocatoria: boolean
  errorConvocatoria: string | null
}

// Tono del Badge según estado de convocatoria (consistente con la tabla)
const TONO_ESTADO_CONVOCATORIA: Record<EstadoConvocatoria, 'success' | 'brand' | 'neutral'> = {
  ABIERTA: 'success',
  PROCESO_EVALUACION: 'brand',
  CONCLUIDA: 'neutral',
}

const tabClass = (active: boolean) =>
  `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-brand-500 text-white'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

export function ConvocatoriasPageView(props: Props) {
  const enGestiones = props.tab === 'gestiones'

  const accion = enGestiones
    ? props.puedeCrearGestion && (
        <Button onClick={props.onNuevaGestion}>Nueva gestión</Button>
      )
    : props.puedeCrearConvocatoria && (
        <Button onClick={props.onNuevaConvocatoria}>Aperturar convocatoria</Button>
      )

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Convocatorias"
        subtitle="Gestiones y convocatorias del proceso de admisión (CU19)"
        actions={accion || undefined}
      />

      <div className="mb-4 flex gap-2">
        <button className={tabClass(enGestiones)} onClick={() => props.onTabChange('gestiones')}>
          Gestiones
        </button>
        <button className={tabClass(!enGestiones)} onClick={() => props.onTabChange('convocatorias')}>
          Convocatorias
        </button>
      </div>

      <Card>
        {enGestiones ? (
          props.cargandoGestiones ? (
            <LoadingState />
          ) : (
            <GestionesTab
              gestiones={props.gestiones}
              onVer={props.onVerGestion}
              onEditar={props.onEditarGestion}
              onActivar={props.onActivarGestion}
              onEliminar={props.onEliminarGestion}
              puedeEditar={props.puedeEditarGestion}
              puedeEliminar={props.puedeEliminarGestion}
              cambiandoEstadoId={props.cambiandoEstadoGestionId}
              eliminandoId={props.eliminandoGestionId}
            />
          )
        ) : props.cargandoConvocatorias ? (
          <LoadingState />
        ) : (
          <ConvocatoriasTab
            convocatorias={props.convocatorias}
            gestiones={props.gestiones}
            filtroGestion={props.filtroGestion}
            onFiltroChange={props.onFiltroGestion}
            onVer={props.onVerConvocatoria}
            onEditar={props.onEditarConvocatoria}
            onCupos={props.onCuposConvocatoria}
            onCambiarEstado={props.onCambiarEstadoConvocatoria}
            onEliminar={props.onEliminarConvocatoria}
            puedeEditar={props.puedeEditarConvocatoria}
            puedeEliminar={props.puedeEliminarConvocatoria}
            cambiandoEstadoId={props.cambiandoEstadoConvocatoriaId}
            eliminandoId={props.eliminandoConvocatoriaId}
          />
        )}
      </Card>

      <GestionFormModal
        open={props.gestionModalOpen}
        onClose={props.onCerrarGestionModal}
        onSubmit={props.onSubmitGestion}
        loading={props.guardandoGestion}
        error={props.errorGestion}
        gestion={props.gestionEditando}
      />

      <ConvocatoriaFormModal
        open={props.convocatoriaModalOpen}
        onClose={props.onCerrarConvocatoriaModal}
        onSubmit={props.onSubmitConvocatoria}
        loading={props.guardandoConvocatoria}
        error={props.errorConvocatoria}
        gestiones={props.gestiones}
        convocatoria={props.convocatoriaEditando}
        gestionPorDefecto={props.filtroGestion}
      />

      {/* CU08/CU19 — Cupos por carrera de la convocatoria */}
      <CuposConvocatoriaModal
        convocatoria={props.cuposConvocatoria}
        onClose={props.onCerrarCupos}
        puedeEditar={props.puedeEditarConvocatoria}
      />

      {/* Detalle (solo lectura) de gestión */}
      <DetailModal
        open={props.viendoGestion !== null}
        onClose={props.onCerrarVerGestion}
        title="Detalle de la gestión"
        fields={
          props.viendoGestion
            ? [
                { label: 'Nombre', value: props.viendoGestion.nombre },
                { label: 'Fecha de inicio', value: props.viendoGestion.fecha_inicio },
                { label: 'Fecha de fin', value: props.viendoGestion.fecha_fin },
                {
                  label: 'Estado',
                  value: (
                    <Badge tone={props.viendoGestion.estado === 'ACTIVA' ? 'success' : 'neutral'}>
                      {props.viendoGestion.estado === 'ACTIVA' ? 'Activa' : 'Cerrada'}
                    </Badge>
                  ),
                },
                {
                  label: 'Convocatorias',
                  value: props.viendoGestion.convocatorias_count ?? 0,
                },
              ]
            : []
        }
      />

      {/* Detalle (solo lectura) de convocatoria */}
      <DetailModal
        open={props.viendoConvocatoria !== null}
        onClose={props.onCerrarVerConvocatoria}
        title="Detalle de la convocatoria"
        fields={
          props.viendoConvocatoria
            ? [
                { label: 'Nombre', value: props.viendoConvocatoria.nombre },
                {
                  label: 'Gestión',
                  value: props.viendoConvocatoria.gestion?.nombre,
                },
                {
                  label: 'Fecha de creación',
                  value: props.viendoConvocatoria.fecha_creacion,
                },
                {
                  label: 'Límite de inscripción',
                  value: props.viendoConvocatoria.fecha_limite_inscripcion,
                },
                {
                  label: 'Estado',
                  value: (
                    <Badge tone={TONO_ESTADO_CONVOCATORIA[props.viendoConvocatoria.estado]}>
                      {ESTADOS_CONVOCATORIA.find(
                        (op) => op.value === props.viendoConvocatoria!.estado,
                      )?.label ?? props.viendoConvocatoria.estado}
                    </Badge>
                  ),
                },
              ]
            : []
        }
      />
    </div>
  )
}
