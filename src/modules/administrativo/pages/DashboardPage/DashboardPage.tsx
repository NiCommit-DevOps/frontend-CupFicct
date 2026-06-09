import { useState } from 'react'
import { Card, LoadingState, PageHeader } from '@/shared/ui'
import {
  GestionConvocatoriaFilter,
  type FiltroGestionConvocatoria,
} from '../../components/GestionConvocatoriaFilter'
import { useDashboard } from '../../hooks/useDashboard'
import type { DashboardChartItem } from '../../types'

const bs = (v: number) => `${new Intl.NumberFormat('es-BO', { minimumFractionDigits: 2 }).format(v)} Bs`

function Kpi({ etiqueta, valor, tono }: { etiqueta: string; valor: string; tono?: string }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{etiqueta}</p>
      <p className={`mt-1 text-2xl font-extrabold ${tono ?? 'text-slate-800 dark:text-slate-100'}`}>{valor}</p>
    </Card>
  )
}

function BarChart({ items, color }: { items: DashboardChartItem[]; color: string }) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Sin datos.</p>
  }
  const max = Math.max(...items.map((i) => i.total), 1)
  return (
    <div className="flex flex-col gap-2.5 p-4">
      {items.map((i) => (
        <div key={i.etiqueta} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-sm text-slate-600 dark:text-slate-300" title={i.etiqueta}>
            {i.etiqueta}
          </span>
          <div className="h-5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${(i.total / max) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">{i.total}</span>
        </div>
      ))}
    </div>
  )
}

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  ELEGIBLE: 'Habilitado',
  APROBADO: 'Aprobado',
  ADMITIDO: 'Admitido',
  APROBADO_SIN_CUPO: 'Aprob. sin cupo',
  REPROBADO: 'Reprobado',
}

export function DashboardPage() {
  const [filtro, setFiltro] = useState<FiltroGestionConvocatoria>({ id_gestion: null, id_convocatoria: null })
  const { data, isLoading } = useDashboard(filtro.id_convocatoria)

  const estadoItems: DashboardChartItem[] = data
    ? Object.entries(data.por_estado).map(([k, v]) => ({ etiqueta: ESTADO_LABEL[k] ?? k, total: v }))
    : []

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Dashboard"
        subtitle="Métricas del proceso de admisión en tiempo real (CU13)"
      />

      <Card className="mb-6">
        <div className="p-4">
          <GestionConvocatoriaFilter value={filtro} onChange={setFiltro} />
          <p className="mt-2 text-xs text-slate-400">
            Sin filtro se muestran las métricas globales de todas las convocatorias.
          </p>
        </div>
      </Card>

      {isLoading || !data ? (
        <LoadingState />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi etiqueta="Total inscritos" valor={String(data.kpis.total_inscritos)} tono="text-brand-600 dark:text-brand-300" />
            <Kpi etiqueta="Total aprobados" valor={String(data.kpis.total_aprobados)} tono="text-emerald-600 dark:text-emerald-400" />
            <Kpi etiqueta="Total reprobados" valor={String(data.kpis.total_reprobados)} tono="text-rose-600 dark:text-rose-400" />
            <Kpi etiqueta="Grupos habilitados" valor={String(data.kpis.total_grupos_habilitados)} tono="text-indigo-600 dark:text-indigo-400" />
            <Kpi etiqueta="% Aprobación" valor={`${data.kpis.porcentaje_aprobacion}%`} tono="text-emerald-600 dark:text-emerald-400" />
            <Kpi etiqueta="Tasa de ausentismo" valor={`${data.kpis.tasa_ausentismo}%`} tono="text-amber-600 dark:text-amber-400" />
            <Kpi etiqueta="Recaudado" valor={bs(data.kpis.recaudado_bs)} tono="text-slate-800 dark:text-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Carreras más solicitadas</h2>
              </div>
              <BarChart items={data.carreras_solicitadas} color="bg-brand-500" />
            </Card>

            <Card>
              <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Procedencia de postulantes</h2>
              </div>
              <BarChart items={data.procedencia} color="bg-accent-500" />
            </Card>

            <Card className="lg:col-span-2">
              <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Distribución por estado</h2>
              </div>
              <BarChart items={estadoItems} color="bg-emerald-500" />
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
