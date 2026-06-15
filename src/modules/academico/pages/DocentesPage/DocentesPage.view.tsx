import { Badge, Card, DetailModal, LoadingState, PageHeader } from '@/shared/ui'
import type { Materia, Docente, DocenteGrupo } from '@/modules/academico/types'
import type { Carrera } from '@/modules/examenes/types'
import type { Convocatoria } from '@/modules/administrativo/types'
import type { FiltroGestionConvocatoria } from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import { DocentesToolbar } from './components/DocentesToolbar.view'
import { DocentesTable } from './components/DocentesTable.view'
import { DocenteFormModal, type DocenteFormValues } from './components/DocenteFormModal.view'

// Etiquetas legibles para el sexo.
const sexoLabel: Record<string, string> = { M: 'Masculino', F: 'Femenino', Otro: 'Otro' }

interface Props {
  docentes: Docente[]
  isLoading: boolean
  materias: Materia[]
  carreras: Carrera[]
  convocatorias: Convocatoria[]
  grupos: DocenteGrupo[]
  buscar: string
  onBuscarChange: (v: string) => void
  filtro: FiltroGestionConvocatoria
  onFiltroChange: (f: FiltroGestionConvocatoria) => void
  // permisos
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
  // modal
  modalOpen: boolean
  editando: Docente | null
  viendo: Docente | null
  onNuevo: () => void
  onEditar: (d: Docente) => void
  onVer: (d: Docente) => void
  onCerrarVer: () => void
  onCerrarModal: () => void
  onSubmit: (values: DocenteFormValues) => void
  guardando: boolean
  errorForm: string | null
  // eliminar
  onEliminar: (d: Docente) => void
  eliminandoId: number | null
}

export function DocentesPageView(props: Props) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Docentes"
        subtitle="Plantel docente, especialidades y áreas de conocimiento (CU10)"
      />

      <Card>
        <div className="border-b border-slate-200/60 p-4 dark:border-slate-700/40">
          <DocentesToolbar
            buscar={props.buscar}
            onBuscarChange={props.onBuscarChange}
            filtro={props.filtro}
            onFiltroChange={props.onFiltroChange}
            onNuevo={props.onNuevo}
            puedeCrear={props.puedeCrear}
          />
        </div>

        {props.isLoading ? (
          <LoadingState />
        ) : (
          <DocentesTable
            docentes={props.docentes}
            onVer={props.onVer}
            onEditar={props.onEditar}
            onEliminar={props.onEliminar}
            puedeEditar={props.puedeEditar}
            puedeEliminar={props.puedeEliminar}
            eliminandoId={props.eliminandoId}
          />
        )}
      </Card>

      <DocenteFormModal
        open={props.modalOpen}
        onClose={props.onCerrarModal}
        onSubmit={props.onSubmit}
        loading={props.guardando}
        error={props.errorForm}
        materias={props.materias}
        carreras={props.carreras}
        convocatorias={props.convocatorias}
        grupos={props.grupos}
        docente={props.editando}
      />

      {/* Modal de solo lectura ("Ver"): datos personales (vía usuario) + perfil docente. */}
      <DetailModal
        open={props.viendo != null}
        onClose={props.onCerrarVer}
        title="Detalle del docente"
        fields={
          props.viendo
            ? [
                { label: 'Nombres', value: props.viendo.usuario?.nombres },
                { label: 'Apellidos', value: props.viendo.usuario?.apellidos },
                { label: 'CI', value: props.viendo.usuario?.ci },
                { label: 'Correo', value: props.viendo.usuario?.correo },
                { label: 'Teléfono 1', value: props.viendo.usuario?.telefono1 },
                { label: 'Teléfono 2', value: props.viendo.usuario?.telefono2 },
                { label: 'Fecha de nacimiento', value: props.viendo.usuario?.fecha_nacimiento },
                {
                  label: 'Sexo',
                  value: props.viendo.usuario?.sexo
                    ? sexoLabel[props.viendo.usuario.sexo] ?? props.viendo.usuario.sexo
                    : '',
                },
                { label: 'Profesión', value: props.viendo.profesion },
                { label: 'Especialidad', value: props.viendo.especialidad },
                {
                  label: 'Carga horaria',
                  value: props.viendo.carga_horaria != null ? `${props.viendo.carga_horaria} h` : '',
                },
                {
                  label: 'Postgrados',
                  value:
                    props.viendo.tiene_maestria || props.viendo.tiene_diplomado ? (
                      <div className="flex flex-wrap gap-1">
                        {props.viendo.tiene_maestria && <Badge tone="success">Maestría</Badge>}
                        {props.viendo.tiene_diplomado && <Badge tone="neutral">Diplomado</Badge>}
                      </div>
                    ) : (
                      ''
                    ),
                },
                {
                  label: 'Carreras y áreas que dicta',
                  full: true,
                  value:
                    props.viendo.asignaciones && props.viendo.asignaciones.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {props.viendo.asignaciones.map((a) => (
                          <div key={a.id_carrera} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">
                              {a.carrera ?? `Carrera #${a.id_carrera}`}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {a.materias.map((m) => (
                                <Badge key={m.id_materia} tone="brand">
                                  {m.nombre}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ''
                    ),
                },
                {
                  label: 'Convocatorias asignadas',
                  full: true,
                  value:
                    props.viendo.convocatorias && props.viendo.convocatorias.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {props.viendo.convocatorias.map((c) => (
                          <Badge key={c.id_convocatoria} tone="neutral">
                            {c.nombre}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      ''
                    ),
                },
                {
                  label: 'Grupos asignados',
                  full: true,
                  value:
                    props.viendo.grupos && props.viendo.grupos.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {props.viendo.grupos.map((g) => (
                          <Badge key={g.id_grupo} tone="brand">
                            {g.sigla} · {g.nombre}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      ''
                    ),
                },
                {
                  label: 'Estado',
                  value: props.viendo.usuario ? (
                    props.viendo.usuario.esta_activo ? (
                      <Badge tone="success">Activo</Badge>
                    ) : (
                      <Badge tone="danger">Inhabilitado</Badge>
                    )
                  ) : (
                    ''
                  ),
                },
              ]
            : []
        }
      />
    </div>
  )
}
