import { useState, type FormEvent } from 'react'
import { Badge, Button, Card, Input, LoadingState, PageHeader } from '@/shared/ui'
import {
  GestionConvocatoriaFilter,
  type FiltroGestionConvocatoria,
} from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import { imprimirDocumento, esc } from '@/lib/imprimir'
import { reportesService } from '../../services'
import {
  useActa,
  usePadron,
  useCertificados,
  useLista,
  useEstadisticas,
  useDocentesPorGrupo,
  useComparativaGestiones,
} from '../../hooks/useReportes'
import type {
  ActaData,
  CertificadoFila,
  ComparativaGestion,
  DocentesReporte,
  EstadisticasData,
  FiltroLista,
  ListaData,
  PadronData,
} from '../../types'

type Tab = 'acta' | 'padron' | 'lista' | 'estadisticas' | 'docentes' | 'comparativa' | 'certificados'

const num = (v: number | null) => (v != null ? v.toFixed(2) : '—')

const tabClass = (active: boolean) =>
  `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
    active ? 'bg-brand-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

export function ReportesPage() {
  const [tab, setTab] = useState<Tab>('acta')
  const [filtro, setFiltro] = useState<FiltroGestionConvocatoria>({ id_gestion: null, id_convocatoria: null })
  const [filtroLista, setFiltroLista] = useState<FiltroLista>('todos')
  const [inputCert, setInputCert] = useState('')
  const [terminoCert, setTerminoCert] = useState('')
  const [descargando, setDescargando] = useState(false)

  const actaQuery = useActa(tab === 'acta' ? filtro.id_convocatoria : null)
  const padronQuery = usePadron(tab === 'padron' ? filtro.id_convocatoria : null)
  const listaQuery = useLista(tab === 'lista' ? filtro.id_convocatoria : null, filtroLista)
  const estadisticasQuery = useEstadisticas(tab === 'estadisticas' ? filtro.id_convocatoria : null)
  const docentesQuery = useDocentesPorGrupo(tab === 'docentes')
  const comparativaQuery = useComparativaGestiones(tab === 'comparativa')
  const certQuery = useCertificados(terminoCert)

  // Pestañas que requieren seleccionar una convocatoria.
  const requiereConvocatoria = tab === 'acta' || tab === 'padron' || tab === 'lista' || tab === 'estadisticas'

  const descargarCsv = async (fn: () => Promise<void>) => {
    setDescargando(true)
    try {
      await fn()
    } finally {
      setDescargando(false)
    }
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Generar reportes"
        subtitle="Actas oficiales, padrón académico y certificados de calificación (CU12)"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button className={tabClass(tab === 'acta')} onClick={() => setTab('acta')}>Acta de admitidos</button>
        <button className={tabClass(tab === 'padron')} onClick={() => setTab('padron')}>Padrón académico</button>
        <button className={tabClass(tab === 'lista')} onClick={() => setTab('lista')}>Postulantes</button>
        <button className={tabClass(tab === 'estadisticas')} onClick={() => setTab('estadisticas')}>Estadísticas</button>
        <button className={tabClass(tab === 'docentes')} onClick={() => setTab('docentes')}>Docentes por grupo</button>
        <button className={tabClass(tab === 'comparativa')} onClick={() => setTab('comparativa')}>Comparativa gestiones</button>
        <button className={tabClass(tab === 'certificados')} onClick={() => setTab('certificados')}>Certificados</button>
      </div>

      {requiereConvocatoria ? (
        <Card className="mb-6">
          <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <GestionConvocatoriaFilter value={filtro} onChange={setFiltro} />
              {tab === 'lista' && (
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Resultado</span>
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    value={filtroLista}
                    onChange={(e) => setFiltroLista(e.target.value as FiltroLista)}
                  >
                    <option value="todos">Todos</option>
                    <option value="aprobados">Aprobados</option>
                    <option value="reprobados">Reprobados</option>
                  </select>
                </label>
              )}
            </div>
            {filtro.id_convocatoria != null && (
              <div className="flex gap-2">
                {(tab === 'acta' || tab === 'padron') && (
                  <Button
                    variant="secondary"
                    loading={descargando}
                    onClick={() =>
                      descargarCsv(() =>
                        tab === 'acta'
                          ? reportesService.descargarActaCsv(filtro.id_convocatoria!)
                          : reportesService.descargarPadronCsv(filtro.id_convocatoria!),
                      )
                    }
                  >
                    Descargar CSV
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (tab === 'acta' && actaQuery.data) imprimirActa(actaQuery.data)
                    if (tab === 'padron' && padronQuery.data) imprimirPadron(padronQuery.data)
                    if (tab === 'lista' && listaQuery.data) imprimirLista(listaQuery.data)
                    if (tab === 'estadisticas' && estadisticasQuery.data) imprimirEstadisticas(estadisticasQuery.data)
                  }}
                >
                  Imprimir / PDF
                </Button>
              </div>
            )}
          </div>
        </Card>
      ) : tab === 'docentes' ? (
        <Card className="mb-6">
          <div className="flex items-center justify-between p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Docentes por grupo (con % de aprobados) y ranking del docente con mayor aprobación.
            </p>
            <Button onClick={() => docentesQuery.data && imprimirDocentes(docentesQuery.data)}>
              Imprimir / PDF
            </Button>
          </div>
        </Card>
      ) : tab === 'comparativa' ? (
        <Card className="mb-6">
          <div className="flex items-center justify-between p-4">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Rendimiento académico comparado entre todas las gestiones.
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                loading={descargando}
                onClick={() => descargarCsv(() => reportesService.descargarComparativaCsv())}
              >
                Descargar CSV
              </Button>
              <Button onClick={() => comparativaQuery.data && imprimirComparativa(comparativaQuery.data)}>
                Imprimir / PDF
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-6">
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              setTerminoCert(inputCert.trim())
            }}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <Input
                label="CI o código de trámite"
                value={inputCert}
                onChange={(e) => setInputCert(e.target.value)}
                placeholder="Ej. 12345678 o 100023"
              />
            </div>
            <Button type="submit" loading={certQuery.isFetching} className="sm:w-40">
              Buscar
            </Button>
          </form>
        </Card>
      )}

      {tab === 'acta' && <SeccionActa filtro={filtro} query={actaQuery} />}
      {tab === 'padron' && <SeccionPadron filtro={filtro} query={padronQuery} />}
      {tab === 'lista' && <SeccionLista filtro={filtro} query={listaQuery} />}
      {tab === 'estadisticas' && <SeccionEstadisticas filtro={filtro} query={estadisticasQuery} />}
      {tab === 'docentes' && <SeccionDocentes query={docentesQuery} />}
      {tab === 'comparativa' && <SeccionComparativa query={comparativaQuery} />}
      {tab === 'certificados' && <SeccionCertificados termino={terminoCert} query={certQuery} />}
    </div>
  )
}

/* ------------------------- Lista de postulantes -------------------------- */

const filtroLabel: Record<FiltroLista, string> = {
  todos: 'Lista general de postulantes',
  aprobados: 'Postulantes aprobados',
  reprobados: 'Postulantes reprobados',
}

function SeccionLista({ filtro, query }: { filtro: FiltroGestionConvocatoria; query: ReturnType<typeof useLista> }) {
  if (filtro.id_convocatoria == null) {
    return <Card className="py-16 text-center text-sm text-slate-400">Selecciona una convocatoria.</Card>
  }
  if (query.isLoading || !query.data) return <LoadingState />
  const lista = query.data

  return (
    <Card>
      <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {filtroLabel[lista.filtro]} · {lista.convocatoria} · {lista.total} postulante(s)
        </h2>
      </div>
      {lista.filas.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">Sin postulantes para este filtro.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                <th className="px-3 py-2.5 font-medium">Código</th>
                <th className="px-3 py-2.5 font-medium">Postulante</th>
                <th className="px-3 py-2.5 font-medium">Carrera 1ª opción</th>
                <th className="px-3 py-2.5 text-center font-medium">Prom.</th>
                <th className="px-3 py-2.5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {lista.filas.map((f) => (
                <tr key={f.id_inscripcion}>
                  <td className="px-3 py-2.5 text-slate-500">{f.codigo_tramite}</td>
                  <td className="px-3 py-2.5 text-slate-700 dark:text-slate-200">
                    {f.nombres} {f.apellidos}
                    <span className="block text-xs text-slate-400">CI {f.ci}</span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{f.carrera_1 ?? '—'}</td>
                  <td className="px-3 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-100">{num(f.promedio_final)}</td>
                  <td className="px-3 py-2.5"><Badge tone="neutral">{f.estado_academico}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

/* ----------------------------- Estadísticas ------------------------------ */

function SeccionEstadisticas({
  filtro,
  query,
}: {
  filtro: FiltroGestionConvocatoria
  query: ReturnType<typeof useEstadisticas>
}) {
  if (filtro.id_convocatoria == null) {
    return <Card className="py-16 text-center text-sm text-slate-400">Selecciona una convocatoria.</Card>
  }
  if (query.isLoading || !query.data) return <LoadingState />
  const e = query.data
  const pg = e.promedios_generales
  const gh = e.grupos_habilitados

  return (
    <div className="flex flex-col gap-6">
      {/* Cantidad de grupos habilitados */}
      <Card>
        <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cantidad de grupos habilitados</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 p-4">
          <Kpi label="Total grupos" value={String(gh.total)} />
          <Kpi label="Mañana" value={String(gh.manana)} />
          <Kpi label="Tarde" value={String(gh.tarde)} />
        </div>
      </Card>

      {/* Promedios generales */}
      <Card>
        <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Promedios generales</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6">
          <Kpi label="Con nota" value={String(pg.total_con_nota)} />
          <Kpi label="Promedio" value={pg.promedio_general.toFixed(2)} />
          <Kpi label="Máximo" value={pg.promedio_maximo.toFixed(2)} />
          <Kpi label="Mínimo" value={pg.promedio_minimo.toFixed(2)} />
          <Kpi label="Aprobados" value={String(pg.aprobados)} />
          <Kpi label="Reprobados" value={String(pg.reprobados)} />
        </div>
      </Card>

      {/* Estadísticas por materia */}
      <Card>
        <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Estadísticas por materia</h2>
        </div>
        {e.por_materia.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">Aún no hay respuestas registradas.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                <th className="px-4 py-2.5 font-medium">Materia</th>
                <th className="px-4 py-2.5 text-center font-medium">Notas registradas</th>
                <th className="px-4 py-2.5 text-center font-medium">Promedio</th>
                <th className="px-4 py-2.5 text-center font-medium">Aprobadas</th>
                <th className="px-4 py-2.5 text-right font-medium">% aprobación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {e.por_materia.map((m) => (
                <tr key={m.materia}>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{m.materia}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{m.registradas}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{m.promedio.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{m.aprobadas}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-100">{m.porcentaje_aprobacion.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Grupos con mayor cantidad de aprobados */}
      <Card>
        <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Grupos con mayor cantidad de aprobados</h2>
        </div>
        {e.grupos_top_aprobados.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">No hay grupos registrados.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                <th className="px-4 py-2.5 font-medium">Grupo</th>
                <th className="px-4 py-2.5 text-center font-medium">Inscritos</th>
                <th className="px-4 py-2.5 text-right font-medium">Aprobados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {e.grupos_top_aprobados.map((g) => (
                <tr key={g.id_grupo}>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{g.sigla} · {g.nombre}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.inscritos}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-100">{g.aprobados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/40">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}

/* --------------------------- Docentes por grupo -------------------------- */

function SeccionDocentes({ query }: { query: ReturnType<typeof useDocentesPorGrupo> }) {
  if (query.isLoading || !query.data) return <LoadingState />
  const { grupos, ranking } = query.data
  if (grupos.length === 0) {
    return <Card className="py-16 text-center text-sm text-slate-400">No hay grupos registrados en la convocatoria activa.</Card>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Ranking de docentes por % de aprobados (encabezado: el de mayor %). */}
      <Card>
        <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Ranking de docentes por % de aprobados
          </h2>
        </div>
        {ranking.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">Aún no hay docentes con grupos.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                <th className="px-4 py-2.5 font-medium">#</th>
                <th className="px-4 py-2.5 font-medium">Docente</th>
                <th className="px-4 py-2.5 font-medium">Grupos</th>
                <th className="px-4 py-2.5 text-center font-medium">Inscritos</th>
                <th className="px-4 py-2.5 text-center font-medium">Aprobados</th>
                <th className="px-4 py-2.5 text-right font-medium">% aprobados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ranking.map((d, i) => (
                <tr key={d.id_docente} className={i === 0 ? 'bg-brand-50 dark:bg-brand-500/10' : ''}>
                  <td className="px-4 py-2.5 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">
                    {i === 0 && <Badge tone="success">Mayor %</Badge>} {d.nombre}
                    {d.profesion ? <span className="block text-xs text-slate-400">{d.profesion}</span> : null}
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{d.grupos || '—'}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{d.inscritos}</td>
                  <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{d.aprobados}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-100">{d.porcentaje.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Detalle por grupo. */}
      <div className="flex flex-col gap-3">
        {grupos.map((g) => (
          <Card key={g.id_grupo} className="p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-brand-600 dark:text-brand-300">
                {g.sigla} · {g.nombre} {g.turno ? `(${g.turno})` : ''}
              </h3>
              <p className="text-xs text-slate-400">
                {g.inscritos} inscrito(s) · {g.aprobados} aprobado(s) · {g.porcentaje.toFixed(1)}% aprobación
              </p>
            </div>
            {g.docentes.length === 0 ? (
              <p className="text-sm text-slate-400">Sin docentes asignados.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {g.docentes.map((d) => (
                  <Badge key={d.id_docente} tone="brand">
                    {d.nombre}{d.profesion ? ` · ${d.profesion}` : ''}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ----------------------- Comparativa entre gestiones --------------------- */

function SeccionComparativa({ query }: { query: ReturnType<typeof useComparativaGestiones> }) {
  if (query.isLoading || !query.data) return <LoadingState />
  const gestiones = query.data
  if (gestiones.length === 0) {
    return <Card className="py-16 text-center text-sm text-slate-400">No hay gestiones registradas.</Card>
  }

  return (
    <Card>
      <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Rendimiento académico entre gestiones
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
              <th className="px-4 py-2.5 font-medium">Gestión</th>
              <th className="px-4 py-2.5 text-center font-medium">Inscritos</th>
              <th className="px-4 py-2.5 text-center font-medium">Con nota</th>
              <th className="px-4 py-2.5 text-center font-medium">Aprobados</th>
              <th className="px-4 py-2.5 text-center font-medium">Reprobados</th>
              <th className="px-4 py-2.5 text-center font-medium">Admitidos</th>
              <th className="px-4 py-2.5 text-center font-medium">Promedio</th>
              <th className="px-4 py-2.5 text-right font-medium">% aprobación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {gestiones.map((g) => (
              <tr key={g.id_gestion}>
                <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">{g.gestion}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.total_inscritos}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.con_nota}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.aprobados}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.reprobados}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.admitidos}</td>
                <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-300">{g.promedio_general.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-100">{g.porcentaje_aprobacion.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* ------------------------------- Acta ------------------------------------ */

function SeccionActa({ filtro, query }: { filtro: FiltroGestionConvocatoria; query: ReturnType<typeof useActa> }) {
  if (filtro.id_convocatoria == null) {
    return <Card className="py-16 text-center text-sm text-slate-400">Selecciona una convocatoria.</Card>
  }
  if (query.isLoading || !query.data) return <LoadingState />
  const acta = query.data

  return (
    <Card>
      <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {acta.convocatoria} · {acta.total} admitido(s)
        </h2>
        <p className="mt-1 flex flex-wrap gap-2 text-xs">
          <Badge tone="success">1ª preferencia: {acta.resumen.primera}</Badge>
          <Badge tone="neutral">2ª preferencia: {acta.resumen.segunda}</Badge>
          {acta.resumen.otra > 0 && <Badge tone="neutral">Otra: {acta.resumen.otra}</Badge>}
        </p>
      </div>
      {acta.por_carrera.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No hay admitidos en esta convocatoria.</p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {acta.por_carrera.map((g) => (
            <div key={g.carrera} className="p-4">
              <h3 className="mb-2 font-semibold text-brand-600 dark:text-brand-300">{g.carrera}</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-1.5 pr-4 font-medium">Código</th>
                    <th className="py-1.5 pr-4 font-medium">CI</th>
                    <th className="py-1.5 pr-4 font-medium">Postulante</th>
                    <th className="py-1.5 pr-4 text-center font-medium">Preferencia</th>
                    <th className="py-1.5 text-right font-medium">Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {g.admitidos.map((a) => (
                    <tr key={a.codigo_tramite} className="border-t border-slate-100 dark:border-slate-800/60">
                      <td className="py-1.5 pr-4 text-slate-500">{a.codigo_tramite}</td>
                      <td className="py-1.5 pr-4 text-slate-500">{a.ci}</td>
                      <td className="py-1.5 pr-4 text-slate-700 dark:text-slate-200">{a.nombres} {a.apellidos}</td>
                      <td className="py-1.5 pr-4 text-center">
                        <Badge tone={a.preferencia_orden === 1 ? 'success' : 'neutral'}>{a.preferencia}</Badge>
                      </td>
                      <td className="py-1.5 text-right font-semibold text-slate-700 dark:text-slate-200">{num(a.promedio_final)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

/* ------------------------------ Padrón ----------------------------------- */

function SeccionPadron({ filtro, query }: { filtro: FiltroGestionConvocatoria; query: ReturnType<typeof usePadron> }) {
  if (filtro.id_convocatoria == null) {
    return <Card className="py-16 text-center text-sm text-slate-400">Selecciona una convocatoria.</Card>
  }
  if (query.isLoading || !query.data) return <LoadingState />
  const padron = query.data

  return (
    <Card>
      <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {padron.convocatoria} · {padron.total} inscrito(s)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
              <th className="px-3 py-2.5 font-medium">Código</th>
              <th className="px-3 py-2.5 font-medium">Postulante</th>
              <th className="px-3 py-2.5 text-center font-medium">N1</th>
              <th className="px-3 py-2.5 text-center font-medium">N2</th>
              <th className="px-3 py-2.5 text-center font-medium">N3</th>
              <th className="px-3 py-2.5 text-center font-medium">Prom.</th>
              <th className="px-3 py-2.5 font-medium">Estado</th>
              <th className="px-3 py-2.5 font-medium">Carrera admitida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {padron.filas.map((f) => (
              <tr key={f.id_inscripcion}>
                <td className="px-3 py-2.5 text-slate-500">{f.codigo_tramite}</td>
                <td className="px-3 py-2.5 text-slate-700 dark:text-slate-200">
                  {f.nombres} {f.apellidos}
                  <span className="block text-xs text-slate-400">CI {f.ci}</span>
                </td>
                <td className="px-3 py-2.5 text-center text-slate-600 dark:text-slate-300">{num(f.notas['1'])}</td>
                <td className="px-3 py-2.5 text-center text-slate-600 dark:text-slate-300">{num(f.notas['2'])}</td>
                <td className="px-3 py-2.5 text-center text-slate-600 dark:text-slate-300">{num(f.notas['3'])}</td>
                <td className="px-3 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-100">{num(f.promedio_final)}</td>
                <td className="px-3 py-2.5"><Badge tone="neutral">{f.estado_academico}</Badge></td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{f.carrera_admitida ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* --------------------------- Certificados -------------------------------- */

function SeccionCertificados({ termino, query }: { termino: string; query: ReturnType<typeof useCertificados> }) {
  if (termino === '') {
    return <Card className="py-16 text-center text-sm text-slate-400">Busca un postulante por CI o código.</Card>
  }
  if (query.isLoading) return <LoadingState />
  const filas = query.data ?? []
  if (filas.length === 0) {
    return <Card className="py-16 text-center text-sm text-slate-400">Sin resultados para "{termino}".</Card>
  }

  return (
    <div className="flex flex-col gap-3">
      {filas.map((c) => (
        <Card key={c.id_inscripcion} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{c.nombres} {c.apellidos}</p>
            <p className="text-xs text-slate-400">
              CI {c.ci} · Trámite {c.codigo_tramite} · {c.convocatoria ?? '—'}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Promedio <span className="font-semibold">{num(c.promedio_final)}</span> ·{' '}
              <Badge tone="neutral">{c.estado_academico}</Badge>
            </p>
          </div>
          <Button variant="secondary" onClick={() => imprimirCertificado(c)}>
            Imprimir certificado
          </Button>
        </Card>
      ))}
    </div>
  )
}

/* --------------------- Constructores de impresión ------------------------ */

function imprimirActa(acta: ActaData) {
  const cuerpo = acta.por_carrera
    .map(
      (g) => `<h2>${esc(g.carrera)}</h2>
      <table><thead><tr><th>Código</th><th>CI</th><th>Apellidos</th><th>Nombres</th><th>Preferencia</th><th class="num">Promedio</th></tr></thead>
      <tbody>${g.admitidos
        .map(
          (a) =>
            `<tr><td>${esc(a.codigo_tramite)}</td><td>${esc(a.ci)}</td><td>${esc(a.apellidos)}</td><td>${esc(a.nombres)}</td><td>${esc(a.preferencia)}</td><td class="num">${a.promedio_final != null ? a.promedio_final.toFixed(2) : ''}</td></tr>`,
        )
        .join('')}</tbody></table>`,
    )
    .join('')

  imprimirDocumento(
    'Acta de Admitidos',
    `<h1>Acta Oficial de Admitidos</h1>
     <p class="sub">${esc(acta.gestion ?? '')} · ${esc(acta.convocatoria)} · ${acta.total} admitido(s) · 1ª: ${acta.resumen.primera} · 2ª: ${acta.resumen.segunda}${acta.resumen.otra > 0 ? ` · Otra: ${acta.resumen.otra}` : ''}</p>${cuerpo}`,
  )
}

function imprimirPadron(padron: PadronData) {
  const filas = padron.filas
    .map(
      (f) =>
        `<tr><td>${esc(f.codigo_tramite)}</td><td>${esc(f.ci)}</td><td>${esc(f.apellidos)} ${esc(f.nombres)}</td>
        <td class="num">${f.notas['1'] ?? ''}</td><td class="num">${f.notas['2'] ?? ''}</td><td class="num">${f.notas['3'] ?? ''}</td>
        <td class="num">${f.promedio_final != null ? f.promedio_final.toFixed(2) : ''}</td><td>${esc(f.estado_academico)}</td><td>${esc(f.carrera_admitida ?? '')}</td></tr>`,
    )
    .join('')

  imprimirDocumento(
    'Padrón Académico',
    `<h1>Padrón Académico</h1>
     <p class="sub">${esc(padron.gestion ?? '')} · ${esc(padron.convocatoria)} · ${padron.total} inscrito(s)</p>
     <table><thead><tr><th>Código</th><th>CI</th><th>Postulante</th><th class="num">N1</th><th class="num">N2</th><th class="num">N3</th><th class="num">Prom.</th><th>Estado</th><th>Carrera admitida</th></tr></thead>
     <tbody>${filas}</tbody></table>`,
  )
}

function imprimirLista(lista: ListaData) {
  const filas = lista.filas
    .map(
      (f) =>
        `<tr><td>${esc(f.codigo_tramite)}</td><td>${esc(f.ci)}</td><td>${esc(f.apellidos)} ${esc(f.nombres)}</td>
        <td>${esc(f.carrera_1 ?? '')}</td><td class="num">${f.promedio_final != null ? f.promedio_final.toFixed(2) : ''}</td><td>${esc(f.estado_academico)}</td></tr>`,
    )
    .join('')

  imprimirDocumento(
    filtroLabel[lista.filtro],
    `<h1>${esc(filtroLabel[lista.filtro])}</h1>
     <p class="sub">${esc(lista.gestion ?? '')} · ${esc(lista.convocatoria)} · ${lista.total} postulante(s)</p>
     <table><thead><tr><th>Código</th><th>CI</th><th>Postulante</th><th>Carrera</th><th class="num">Promedio</th><th>Estado</th></tr></thead>
     <tbody>${filas}</tbody></table>`,
  )
}

function imprimirEstadisticas(e: EstadisticasData) {
  const pg = e.promedios_generales
  const gh = e.grupos_habilitados
  const materias = e.por_materia
    .map((m) => `<tr><td>${esc(m.materia)}</td><td class="num">${m.registradas}</td><td class="num">${m.promedio.toFixed(2)}</td><td class="num">${m.aprobadas}</td><td class="num">${m.porcentaje_aprobacion.toFixed(1)}%</td></tr>`)
    .join('')
  const grupos = e.grupos_top_aprobados
    .map((g) => `<tr><td>${esc(g.sigla)} · ${esc(g.nombre)}</td><td class="num">${g.inscritos}</td><td class="num">${g.aprobados}</td></tr>`)
    .join('')

  imprimirDocumento(
    'Estadísticas',
    `<h1>Estadísticas del proceso</h1>
     <p class="sub">${esc(e.gestion ?? '')} · ${esc(e.convocatoria)}</p>
     <h2>Cantidad de grupos habilitados</h2>
     <table><tbody>
       <tr><td>Total grupos</td><td class="num">${gh.total}</td></tr>
       <tr><td>Mañana</td><td class="num">${gh.manana}</td></tr>
       <tr><td>Tarde</td><td class="num">${gh.tarde}</td></tr>
     </tbody></table>
     <h2>Promedios generales</h2>
     <table><tbody>
       <tr><td>Con nota</td><td class="num">${pg.total_con_nota}</td></tr>
       <tr><td>Promedio general</td><td class="num">${pg.promedio_general.toFixed(2)}</td></tr>
       <tr><td>Promedio máximo</td><td class="num">${pg.promedio_maximo.toFixed(2)}</td></tr>
       <tr><td>Promedio mínimo</td><td class="num">${pg.promedio_minimo.toFixed(2)}</td></tr>
       <tr><td>Aprobados</td><td class="num">${pg.aprobados}</td></tr>
       <tr><td>Reprobados</td><td class="num">${pg.reprobados}</td></tr>
     </tbody></table>
     <h2>Estadísticas por materia</h2>
     <table><thead><tr><th>Materia</th><th class="num">Notas</th><th class="num">Promedio</th><th class="num">Aprobadas</th><th class="num">% aprobación</th></tr></thead><tbody>${materias}</tbody></table>
     <h2>Grupos con mayor cantidad de aprobados</h2>
     <table><thead><tr><th>Grupo</th><th class="num">Inscritos</th><th class="num">Aprobados</th></tr></thead><tbody>${grupos}</tbody></table>`,
  )
}

function imprimirDocentes(rep: DocentesReporte) {
  const ranking = rep.ranking
    .map(
      (d, i) =>
        `<tr><td class="num">${i + 1}</td><td>${esc(d.nombre)}${d.profesion ? ` · ${esc(d.profesion)}` : ''}</td><td>${esc(d.grupos)}</td><td class="num">${d.inscritos}</td><td class="num">${d.aprobados}</td><td class="num">${d.porcentaje.toFixed(1)}%</td></tr>`,
    )
    .join('')

  const grupos = rep.grupos
    .map(
      (g) =>
        `<tr><td>${esc(g.sigla)} · ${esc(g.nombre)}</td><td>${esc(g.turno ?? '')}</td><td class="num">${g.inscritos}</td><td class="num">${g.aprobados}</td><td class="num">${g.porcentaje.toFixed(1)}%</td>
        <td>${g.docentes.length > 0 ? g.docentes.map((d) => esc(d.nombre)).join(', ') : '—'}</td></tr>`,
    )
    .join('')

  imprimirDocumento(
    'Docentes por grupo',
    `<h1>Docentes por grupo</h1>
     <h2>Ranking de docentes por % de aprobados</h2>
     <table><thead><tr><th class="num">#</th><th>Docente</th><th>Grupos</th><th class="num">Inscritos</th><th class="num">Aprobados</th><th class="num">% aprobados</th></tr></thead>
     <tbody>${ranking}</tbody></table>
     <h2>Detalle por grupo</h2>
     <table><thead><tr><th>Grupo</th><th>Turno</th><th class="num">Inscritos</th><th class="num">Aprobados</th><th class="num">%</th><th>Docentes</th></tr></thead>
     <tbody>${grupos}</tbody></table>`,
  )
}

function imprimirComparativa(gestiones: ComparativaGestion[]) {
  const filas = gestiones
    .map(
      (g) =>
        `<tr><td>${esc(g.gestion)}</td><td class="num">${g.total_inscritos}</td><td class="num">${g.con_nota}</td><td class="num">${g.aprobados}</td><td class="num">${g.reprobados}</td><td class="num">${g.admitidos}</td><td class="num">${g.promedio_general.toFixed(2)}</td><td class="num">${g.porcentaje_aprobacion.toFixed(1)}%</td></tr>`,
    )
    .join('')

  imprimirDocumento(
    'Comparativa entre gestiones',
    `<h1>Rendimiento académico entre gestiones</h1>
     <table><thead><tr><th>Gestión</th><th class="num">Inscritos</th><th class="num">Con nota</th><th class="num">Aprobados</th><th class="num">Reprobados</th><th class="num">Admitidos</th><th class="num">Promedio</th><th class="num">% aprobación</th></tr></thead>
     <tbody>${filas}</tbody></table>`,
  )
}

function imprimirCertificado(c: CertificadoFila) {
  const campo = (label: string, valor: string) => `<div class="campo"><b>${label}</b><span>${esc(valor)}</span></div>`
  imprimirDocumento(
    'Certificado de Calificación',
    `<div class="cert">
      <h1 style="text-align:center">Certificado de Calificación</h1>
      <p class="sub" style="text-align:center">${esc(c.gestion ?? '')} · ${esc(c.convocatoria ?? '')}</p>
      ${campo('Postulante', `${c.nombres ?? ''} ${c.apellidos ?? ''}`)}
      ${campo('CI', c.ci ?? '')}
      ${campo('Código de trámite', String(c.codigo_tramite ?? ''))}
      ${campo('Examen 1', c.notas['1'] != null ? c.notas['1']!.toFixed(2) : '—')}
      ${campo('Examen 2', c.notas['2'] != null ? c.notas['2']!.toFixed(2) : '—')}
      ${campo('Examen 3', c.notas['3'] != null ? c.notas['3']!.toFixed(2) : '—')}
      ${campo('Promedio final', c.promedio_final != null ? c.promedio_final.toFixed(2) : '—')}
      ${campo('Estado', c.estado_academico)}
      ${campo('Carrera admitida', c.carrera_admitida ?? '—')}
    </div>`,
  )
}
