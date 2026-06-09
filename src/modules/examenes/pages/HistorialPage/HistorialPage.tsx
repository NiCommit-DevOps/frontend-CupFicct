import { useState, type FormEvent } from 'react'
import { Badge, Button, Card, Input, LoadingState, PageHeader } from '@/shared/ui'
import { useHistorial } from '../../hooks/useHistorial'

const nota = (v: number | null) => (v != null ? v.toFixed(2) : '—')

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, 'success' | 'danger' | 'neutral' | 'brand'> = {
    ADMITIDO: 'success',
    APROBADO: 'brand',
    APROBADO_SIN_CUPO: 'neutral',
    REPROBADO: 'danger',
  }
  return <Badge tone={map[estado] ?? 'neutral'}>{estado}</Badge>
}

export function HistorialPage() {
  const [input, setInput] = useState('')
  const [termino, setTermino] = useState('')

  const historialQuery = useHistorial(termino)
  const filas = historialQuery.data ?? []

  const buscar = (e: FormEvent) => {
    e.preventDefault()
    setTermino(input.trim())
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Historial académico"
        subtitle="Consulta de resultados de gestiones concluidas por CI o código de trámite (CU16)"
      />

      <Card className="mb-6">
        <form onSubmit={buscar} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="CI o código de trámite"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ej. 12345678 o 100023"
            />
          </div>
          <Button type="submit" loading={historialQuery.isFetching} className="sm:w-40">
            Buscar
          </Button>
        </form>
      </Card>

      {termino === '' ? (
        <Card className="py-16 text-center text-sm text-slate-400">
          Ingresa un CI o código de trámite para consultar el historial.
        </Card>
      ) : historialQuery.isLoading ? (
        <LoadingState />
      ) : filas.length === 0 ? (
        <Card className="py-16 text-center text-sm text-slate-400">
          No se encontraron registros en gestiones concluidas para "{termino}".
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                  <th className="px-4 py-3 font-medium">Postulante</th>
                  <th className="px-4 py-3 font-medium">Gestión / Convocatoria</th>
                  <th className="px-4 py-3 text-center font-medium">N1</th>
                  <th className="px-4 py-3 text-center font-medium">N2</th>
                  <th className="px-4 py-3 text-center font-medium">N3</th>
                  <th className="px-4 py-3 text-center font-medium">Prom.</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Carrera admitida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filas.map((f) => (
                  <tr key={f.id_inscripcion} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                      {f.postulante ? `${f.postulante.nombres} ${f.postulante.apellidos}` : `#${f.id_inscripcion}`}
                      <span className="block text-xs text-slate-400">
                        CI {f.postulante?.ci ?? '—'} · Trámite {f.codigo_tramite ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {f.gestion ?? '—'}
                      <span className="block text-xs text-slate-400">{f.convocatoria ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{nota(f.notas['1'])}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{nota(f.notas['2'])}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{nota(f.notas['3'])}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800 dark:text-slate-100">{nota(f.promedio_final)}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={f.estado_academico} /></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{f.carrera_admitida ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
