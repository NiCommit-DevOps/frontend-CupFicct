import { Button, Card, LoadingState, PageHeader } from '@/shared/ui'
import {
  GestionConvocatoriaFilter,
  type FiltroGestionConvocatoria,
} from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import type { CorteData } from '../../types'

interface Props {
  filtro: FiltroGestionConvocatoria
  onFiltroChange: (f: FiltroGestionConvocatoria) => void
  hayConvocatoria: boolean
  data?: CorteData
  isLoading: boolean
  puedeEjecutar: boolean
  ejecutando: boolean
  onEjecutar: () => void
  error: string | null
}

function Kpi({ etiqueta, valor, tono }: { etiqueta: string; valor: number; tono: string }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiqueta}</p>
      <p className={`mt-1 text-2xl font-extrabold ${tono}`}>{valor}</p>
    </Card>
  )
}

export function CortePageView(props: Props) {
  const r = props.data?.resumen

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Corte de admisión"
        subtitle="Asigna ADMITIDO por nota y cupos (1ª/2ª opción); el resto queda APROBADO_SIN_CUPO (CU07)."
        actions={
          props.puedeEjecutar && props.hayConvocatoria ? (
            <Button loading={props.ejecutando} onClick={props.onEjecutar}>
              Ejecutar corte
            </Button>
          ) : undefined
        }
      />

      <Card className="mb-6">
        <div className="p-4">
          <GestionConvocatoriaFilter value={props.filtro} onChange={props.onFiltroChange} />
        </div>
      </Card>

      {props.error && (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
          {props.error}
        </div>
      )}

      {!props.hayConvocatoria ? (
        <Card className="py-16 text-center text-sm text-slate-400">
          Selecciona una convocatoria para ver y ejecutar el corte.
        </Card>
      ) : props.isLoading || !r ? (
        <LoadingState />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Kpi etiqueta="Admitidos" valor={r.admitidos} tono="text-emerald-600 dark:text-emerald-400" />
            <Kpi etiqueta="Aprob. sin cupo" valor={r.aprobados_sin_cupo} tono="text-amber-600 dark:text-amber-400" />
            <Kpi etiqueta="Reprobados" valor={r.reprobados} tono="text-rose-600 dark:text-rose-400" />
            <Kpi etiqueta="Aprob. sin asignar" valor={r.aprobados} tono="text-slate-700 dark:text-slate-200" />
            <Kpi etiqueta="Pend. de examen" valor={r.pendientes_examen} tono="text-slate-500 dark:text-slate-400" />
          </div>

          <Card>
            <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Cupos por carrera</h2>
            </div>
            {props.data!.por_carrera.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">
                No hay carreras con cupos configurados para esta convocatoria.
              </p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                    <th className="px-4 py-3 font-medium">Carrera</th>
                    <th className="px-4 py-3 text-right font-medium">Cupos</th>
                    <th className="px-4 py-3 text-right font-medium">Admitidos</th>
                    <th className="px-4 py-3 text-right font-medium">Disponibles</th>
                  </tr>
                </thead>
                <tbody>
                  {props.data!.por_carrera.map((c) => (
                    <tr key={c.id_carrera} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{c.carrera}</td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{c.cupos}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">{c.admitidos}</td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{Math.max(0, c.cupos - c.admitidos)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
