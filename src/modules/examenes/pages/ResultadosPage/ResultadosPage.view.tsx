import { useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Input, LoadingState, Modal, PageHeader } from '@/shared/ui'
import {
  GestionConvocatoriaFilter,
  type FiltroGestionConvocatoria,
} from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import type { MateriaOption, ResultadoFila, ResultadoImportacionNotas } from '../../types'

interface Props {
  materias: MateriaOption[]
  filas: ResultadoFila[]
  isLoading: boolean
  hayConvocatoria: boolean
  filtro: FiltroGestionConvocatoria
  onFiltroChange: (f: FiltroGestionConvocatoria) => void
  buscar: string
  onBuscarChange: (v: string) => void
  puedeEditar: boolean
  editando: ResultadoFila | null
  onEditar: (f: ResultadoFila) => void
  onCerrarEditar: () => void
  onGuardar: (fila: ResultadoFila, valores: Record<string, string>) => void
  guardando: boolean
  error: string | null
  onImportar: (archivo: File) => void
  importando: boolean
  resultadoImport: ResultadoImportacionNotas | null
  onCerrarResultado: () => void
}

const nota = (v: number | null) => (v != null ? v.toFixed(2) : '—')

function EstadoBadge({ estado }: { estado: string }) {
  if (estado === 'APROBADO' || estado === 'ADMITIDO') return <Badge tone="success">{estado}</Badge>
  if (estado === 'REPROBADO') return <Badge tone="danger">REPROBADO</Badge>
  return <Badge tone="neutral">{estado}</Badge>
}

export function ResultadosPageView(props: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const seleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (archivo) props.onImportar(archivo)
    e.target.value = '' // permite recargar el mismo archivo
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Registro de notas"
        subtitle="Carga manual o masiva (Excel) de la nota de cada materia en los 3 exámenes (CU06)"
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-200/60 p-4 lg:flex-row lg:items-end lg:justify-between dark:border-slate-700/40">
          <GestionConvocatoriaFilter value={props.filtro} onChange={props.onFiltroChange} />
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder="Buscar por nombre o CI…"
                value={props.buscar}
                onChange={(e) => props.onBuscarChange(e.target.value)}
              />
            </div>
            {props.puedeEditar && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="hidden"
                  onChange={seleccionarArchivo}
                />
                <Button
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                  loading={props.importando}
                  disabled={!props.hayConvocatoria}
                >
                  Cargar Excel
                </Button>
              </>
            )}
          </div>
        </div>

        {!props.hayConvocatoria ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Selecciona una convocatoria para ver los postulantes.
          </div>
        ) : props.isLoading ? (
          <LoadingState />
        ) : props.filas.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">
            No hay postulantes para los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                  <th className="px-4 py-3 font-medium">Postulante</th>
                  <th className="px-4 py-3 text-center font-medium">Examen 1</th>
                  <th className="px-4 py-3 text-center font-medium">Examen 2</th>
                  <th className="px-4 py-3 text-center font-medium">Examen 3</th>
                  <th className="px-4 py-3 text-center font-medium">Promedio</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  {props.puedeEditar && <th className="px-4 py-3 text-right font-medium" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {props.filas.map((f) => (
                  <tr key={f.id_inscripcion} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                      {f.postulante ? `${f.postulante.nombres} ${f.postulante.apellidos}` : `#${f.id_inscripcion}`}
                      {f.postulante && <span className="block text-xs text-slate-400">CI {f.postulante.ci}</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{nota(f.examenes['1']?.promedio ?? null)}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{nota(f.examenes['2']?.promedio ?? null)}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{nota(f.examenes['3']?.promedio ?? null)}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800 dark:text-slate-100">{nota(f.promedio_final)}</td>
                    <td className="px-4 py-3"><EstadoBadge estado={f.estado_academico} /></td>
                    {props.puedeEditar && (
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => props.onEditar(f)}>
                          Registrar notas
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <NotasEditModal
        materias={props.materias}
        fila={props.editando}
        onClose={props.onCerrarEditar}
        onGuardar={props.onGuardar}
        guardando={props.guardando}
        error={props.error}
      />

      {/* Resultado de la carga masiva de notas */}
      <Modal
        open={props.resultadoImport != null}
        onClose={props.onCerrarResultado}
        title="Resultado de la carga de notas"
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
                <p className="text-xs text-slate-500 dark:text-slate-400">Con notas cargadas</p>
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

function NotasEditModal({
  materias,
  fila,
  onClose,
  onGuardar,
  guardando,
  error,
}: {
  materias: MateriaOption[]
  fila: ResultadoFila | null
  onClose: () => void
  onGuardar: (fila: ResultadoFila, valores: Record<string, string>) => void
  guardando: boolean
  error: string | null
}) {
  const [valores, setValores] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!fila) return
    const init: Record<string, string> = {}
    for (const n of [1, 2, 3]) {
      const examen = fila.examenes[String(n)]
      for (const m of materias) {
        const v = examen?.materias?.[String(m.id_materia)]
        init[`${n}_${m.id_materia}`] = v != null ? String(v) : ''
      }
    }
    setValores(init)
  }, [fila, materias])

  const set = (n: number, idMateria: number, v: string) =>
    setValores((prev) => ({ ...prev, [`${n}_${idMateria}`]: v }))

  return (
    <Modal
      open={fila !== null}
      onClose={onClose}
      title={fila?.postulante ? `Notas · ${fila.postulante.nombres} ${fila.postulante.apellidos}` : 'Notas'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" loading={guardando} onClick={() => fila && onGuardar(fila, valores)}>
            Guardar notas
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Registra la nota (0-100) de cada materia en cada examen. El promedio y el estado se calculan
          automáticamente. <strong>Si el postulante reprueba una materia (nota &lt; 60) en cualquier examen, queda
          REPROBADO.</strong>
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-2 py-2 text-left font-medium">Materia</th>
                <th className="px-2 py-2 text-center font-medium">Examen 1</th>
                <th className="px-2 py-2 text-center font-medium">Examen 2</th>
                <th className="px-2 py-2 text-center font-medium">Examen 3</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((m) => (
                <tr key={m.id_materia}>
                  <td className="px-2 py-1.5 font-medium text-slate-600 dark:text-slate-300">{m.nombre}</td>
                  {[1, 2, 3].map((n) => (
                    <td key={n} className="px-2 py-1.5">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="0.01"
                        value={valores[`${n}_${m.id_materia}`] ?? ''}
                        onChange={(e) => set(n, m.id_materia, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
            {error}
          </div>
        )}
      </div>
    </Modal>
  )
}
