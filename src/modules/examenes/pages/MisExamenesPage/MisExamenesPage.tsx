import { Badge, Card, LoadingState, PageHeader } from '@/shared/ui'
import { extraerMensajeError } from '@/lib/apiClient'
import { useMisResultados } from '../../hooks/useExamenAlumno'

const nota = (v: number | null) => (v != null ? v.toFixed(2) : '—')

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === 'APROBADO' || estado === 'ADMITIDO') return <Badge tone="success">{estado}</Badge>
  if (estado === 'REPROBADO') return <Badge tone="danger">REPROBADO</Badge>
  return <Badge tone="neutral">{estado}</Badge>
}

/**
 * CU06 — Vista de solo lectura del postulante: sus notas por materia en cada
 * examen, su promedio y su estado. Las notas las carga el staff manualmente.
 */
export function MisExamenesPage() {
  const { data, isLoading, isError, error } = useMisResultados()

  return (
    <div className="flex flex-col">
      <PageHeader title="Mis exámenes" subtitle="Consulta de tus notas por materia, promedio y estado (CU06)" />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <Card className="py-12 text-center text-sm text-rose-600 dark:text-rose-400">
          {extraerMensajeError(error, 'No se pudieron cargar tus exámenes.')}
        </Card>
      ) : !data ? null : (
        <div className="flex flex-col gap-6">
          {/* Resumen */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Promedio final</p>
              <p className="mt-1 text-2xl font-extrabold text-brand-600 dark:text-brand-300">{nota(data.promedio_final)}</p>
            </Card>
            <Card className="flex flex-col justify-center p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Estado</p>
              <p className="mt-1"><EstadoBadge estado={data.estado_academico} /></p>
            </Card>
          </div>

          {/* Grilla de notas: materias x exámenes */}
          <Card>
            <div className="border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notas por materia</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                    <th className="px-4 py-3 font-medium">Materia</th>
                    {data.examenes.map((e) => (
                      <th key={e.numero_examen} className="px-4 py-3 text-center font-medium">Examen {e.numero_examen}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.materias.map((m) => (
                    <tr key={m.id_materia}>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{m.nombre}</td>
                      {data.examenes.map((e) => {
                        const valor = e.materias.find((x) => x.id_materia === m.id_materia)?.nota ?? null
                        const reprobada = valor != null && valor < 60
                        return (
                          <td
                            key={e.numero_examen}
                            className={`px-4 py-3 text-center ${reprobada ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}
                          >
                            {nota(valor)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Promedio examen</td>
                    {data.examenes.map((e) => (
                      <td key={e.numero_examen} className="px-4 py-3 text-center font-semibold text-slate-800 dark:text-slate-100">
                        {nota(e.promedio)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <p className="text-xs text-slate-400">
            Las notas son cargadas por la administración académica. Si repruebas una materia (nota &lt; 60) en
            cualquier examen, tu estado pasa a REPROBADO.
          </p>
        </div>
      )}
    </div>
  )
}
