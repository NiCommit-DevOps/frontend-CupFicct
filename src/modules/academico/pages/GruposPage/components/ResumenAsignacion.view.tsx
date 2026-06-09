import type { ResumenAsignacion } from '@/modules/academico/types'

interface Props {
  resumen: ResumenAsignacion
}

function Tarjeta({ label, valor, detalle, tone = 'brand' }: { label: string; valor: string | number; detalle?: string; tone?: 'brand' | 'neutral' | 'warn' }) {
  const tones = {
    brand: 'text-brand-600 dark:text-brand-400',
    neutral: 'text-slate-700 dark:text-slate-200',
    warn: 'text-amber-600 dark:text-amber-400',
  }
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-panel-light p-5 dark:border-slate-700/40 dark:bg-panel-dark">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${tones[tone]}`}>{valor}</p>
      {detalle && <p className="mt-1 text-xs text-slate-400">{detalle}</p>}
    </div>
  )
}

export function ResumenAsignacionView({ resumen }: Props) {
  const dist = resumen.estudiantes_por_grupo
  // Resumen del reparto parejo: si todos los grupos llevan lo mismo, un número;
  // si no, el rango (ej. "70 / 1").
  const distintos = Array.from(new Set(dist))
  const porGrupoTexto =
    dist.length === 0 ? '—' : distintos.length === 1 ? `${distintos[0]}` : `${Math.max(...dist)} / ${Math.min(...dist)}`

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta label="Total inscritos (elegibles)" valor={resumen.total_inscritos} detalle="Postulantes con estado ELEGIBLE" />
        <Tarjeta
          label="Grupos necesarios"
          valor={resumen.grupos_necesarios}
          detalle={`Capacidad ${resumen.capacidad_grupo} por grupo`}
        />
        <Tarjeta label="Estudiantes por grupo" valor={porGrupoTexto} detalle="Reparto parejo automático" tone="neutral" />
        <Tarjeta
          label="Grupos creados"
          valor={`${resumen.grupos_creados}`}
          detalle={`${resumen.asignados} asignados · ${resumen.sin_asignar} sin grupo`}
          tone={resumen.grupos_creados < resumen.grupos_necesarios ? 'warn' : 'neutral'}
        />
      </div>

      {resumen.grupos_creados < resumen.grupos_necesarios && (
        <div className="rounded-xl bg-amber-50 px-4 py-2.5 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          Se necesitan {resumen.grupos_necesarios} grupos para {resumen.total_inscritos} inscritos, pero solo hay{' '}
          {resumen.grupos_creados} creados. Crea {resumen.grupos_necesarios - resumen.grupos_creados} grupo(s) más.
        </div>
      )}

      {dist.length > 0 && (
        <p className="text-xs text-slate-400">
          Distribución sugerida:{' '}
          {dist.map((n, i) => `G${i + 1}: ${n}`).join(' · ')}
        </p>
      )}
    </div>
  )
}
