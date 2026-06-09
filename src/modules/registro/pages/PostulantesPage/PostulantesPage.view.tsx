import { Badge, Button, Card, DetailModal, LoadingState, Modal, PageHeader } from '@/shared/ui'
import type { InscripcionCatalogos, Postulante, ResultadoImportacion } from '@/modules/registro/types'
import type { FiltroGestionConvocatoria } from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import { PostulantesToolbar } from './components/PostulantesToolbar.view'
import { PostulantesTable } from './components/PostulantesTable.view'
import { estadoLabel, estadoTone } from './components/estados'
import { PostulanteFormModal, type PostulanteFormValues } from './components/PostulanteFormModal.view'

/** Etiqueta legible para el sexo. */
const sexoLabel: Record<string, string> = { M: 'Masculino', F: 'Femenino', Otro: 'Otro' }

interface Props {
  postulantes: Postulante[]
  isLoading: boolean
  catalogos?: InscripcionCatalogos
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
  editando: Postulante | null
  viendo: Postulante | null
  onNuevo: () => void
  onEditar: (p: Postulante) => void
  onVer: (p: Postulante) => void
  onVerTitulo: (id: number) => void
  onCerrarVer: () => void
  onCerrarModal: () => void
  onSubmit: (values: PostulanteFormValues) => void
  guardando: boolean
  errorForm: string | null
  // eliminar
  onEliminar: (p: Postulante) => void
  eliminandoId: number | null
  // estado (CU09) — Aprobar / Rechazar
  onCambiarEstado: (p: Postulante, estado: string) => void
  cambiandoEstado: { id: number; estado: string } | null
  // activación (testing)
  onActivar?: (p: Postulante) => void
  activandoId?: number | null
  // CU14 — carga masiva
  onImportar: (archivo: File) => void
  importando: boolean
  resultadoImport: ResultadoImportacion | null
  onCerrarResultado: () => void
  // CU04 — aprobación masiva
  onAprobarTodos: () => void
  aprobandoTodos: boolean
}

export function PostulantesPageView(props: Props) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Postulantes"
        subtitle="Padrón de aspirantes inscritos al proceso de admisión (CU04)"
      />

      <Card>
        <div className="border-b border-slate-200/60 p-4 dark:border-slate-700/40">
          <PostulantesToolbar
            buscar={props.buscar}
            onBuscarChange={props.onBuscarChange}
            filtro={props.filtro}
            onFiltroChange={props.onFiltroChange}
            onNuevo={props.onNuevo}
            puedeCrear={props.puedeCrear}
            puedeEditar={props.puedeEditar}
            onImportar={props.onImportar}
            importando={props.importando}
            onAprobarTodos={props.onAprobarTodos}
            aprobandoTodos={props.aprobandoTodos}
          />
        </div>

        {props.isLoading ? (
          <LoadingState />
        ) : (
          <PostulantesTable
            postulantes={props.postulantes}
            onEditar={props.onEditar}
            onVer={props.onVer}
            onEliminar={props.onEliminar}
            puedeEditar={props.puedeEditar}
            puedeEliminar={props.puedeEliminar}
            eliminandoId={props.eliminandoId}
            onCambiarEstado={props.onCambiarEstado}
            cambiandoEstado={props.cambiandoEstado}
            onActivar={props.onActivar}
            activandoId={props.activandoId}
          />
        )}
      </Card>

      <PostulanteFormModal
        open={props.modalOpen}
        onClose={props.onCerrarModal}
        onSubmit={props.onSubmit}
        loading={props.guardando}
        error={props.errorForm}
        catalogos={props.catalogos}
        postulante={props.editando}
      />

      {/* Modal de solo lectura: muestra todos los datos del postulante. */}
      <DetailModal
        open={props.viendo != null}
        onClose={props.onCerrarVer}
        title="Detalle del postulante"
        fields={
          props.viendo
            ? (() => {
                const p = props.viendo
                const u = p.usuario
                const insc = p.inscripcion
                const estado = insc?.estado_academico ?? ''
                return [
                  { label: 'Código de trámite', value: p.codigo_tramite },
                  {
                    label: 'Estado',
                    value: estado ? (
                      <Badge tone={estadoTone[estado] ?? 'neutral'}>{estadoLabel[estado] ?? estado}</Badge>
                    ) : (
                      ''
                    ),
                  },
                  { label: 'Nombres', value: u?.nombres },
                  { label: 'Apellidos', value: u?.apellidos },
                  { label: 'CI', value: u?.ci },
                  { label: 'Correo', value: u?.correo },
                  { label: 'Teléfono 1', value: u?.telefono1 },
                  { label: 'Teléfono 2', value: u?.telefono2 },
                  { label: 'Fecha de nacimiento', value: u?.fecha_nacimiento },
                  { label: 'Sexo', value: u?.sexo ? sexoLabel[u.sexo] ?? u.sexo : '' },
                  { label: 'Procedencia', value: p.procedencia },
                  { label: 'Unidad educativa', value: p.unidad_educativa?.nombre },
                  { label: 'Dirección', value: p.direccion, full: true },
                  {
                    label: 'Título de bachiller',
                    value:
                      p.titulo_bachiller && p.tiene_titulo_archivo ? (
                        <button
                          type="button"
                          onClick={() => props.onVerTitulo(p.id_postulante)}
                          className="font-medium text-brand-600 hover:underline dark:text-brand-300"
                        >
                          Sí — Ver documento
                        </button>
                      ) : p.titulo_bachiller ? (
                        'Sí'
                      ) : (
                        'No'
                      ),
                  },
                  { label: 'Año de egreso', value: p.anio_egreso },
                  { label: 'Carreras', value: insc?.carreras.map((c) => c.nombre).join(', '), full: true },
                  { label: 'Turno de preferencia', value: insc?.turno_preferencia },
                  { label: 'Convocatoria', value: insc?.convocatoria?.nombre },
                  { label: 'Fecha de inscripción', value: insc?.fecha_inscripcion },
                  { label: 'Otros', value: p.otros, full: true },
                ]
              })()
            : []
        }
      />

      {/* CU14 — Resultado de la carga masiva */}
      <Modal
        open={props.resultadoImport != null}
        onClose={props.onCerrarResultado}
        title="Resultado de la carga masiva"
        footer={
          <Button type="button" onClick={props.onCerrarResultado}>
            Entendido
          </Button>
        }
      >
        {props.resultadoImport && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl bg-emerald-50 px-4 py-3 text-center dark:bg-emerald-500/10">
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {props.resultadoImport.creados}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Registrados</p>
              </div>
              <div className="flex-1 rounded-xl bg-rose-50 px-4 py-3 text-center dark:bg-rose-500/10">
                <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                  {props.resultadoImport.errores.length}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Con error</p>
              </div>
              <div className="flex-1 rounded-xl bg-slate-50 px-4 py-3 text-center dark:bg-slate-800/40">
                <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">
                  {props.resultadoImport.total}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total filas</p>
              </div>
            </div>

            {props.resultadoImport.errores.length > 0 && (
              <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200/60 dark:border-slate-700/40">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                      <th className="px-3 py-2 font-medium">Fila</th>
                      <th className="px-3 py-2 font-medium">CI</th>
                      <th className="px-3 py-2 font-medium">Motivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {props.resultadoImport.errores.map((e, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-slate-500">{e.fila}</td>
                        <td className="px-3 py-2 text-slate-500">{e.ci || '—'}</td>
                        <td className="px-3 py-2 text-rose-600 dark:text-rose-400">{e.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
