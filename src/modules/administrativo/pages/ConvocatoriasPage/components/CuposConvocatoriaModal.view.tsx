import { useEffect, useState } from 'react'
import { Button, Modal, Spinner } from '@/shared/ui'
import { extraerMensajeError } from '@/lib/apiClient'
import { useCuposConvocatoria, useGuardarCupos } from '../../../hooks/useConvocatorias'
import type { Convocatoria } from '../../../types'

interface Props {
  convocatoria: Convocatoria | null
  onClose: () => void
  puedeEditar: boolean
}

/**
 * CU08/CU19 — Editor de cupos por carrera para una convocatoria.
 * Autocontenido: consulta y guarda sus propios datos.
 */
export function CuposConvocatoriaModal({ convocatoria, onClose, puedeEditar }: Props) {
  const idConvocatoria = convocatoria?.id_convocatoria ?? null
  const cuposQuery = useCuposConvocatoria(idConvocatoria)
  const guardar = useGuardarCupos()

  // Estado editable: id_carrera -> cupos (string para el input controlado).
  const [valores, setValores] = useState<Record<number, string>>({})

  useEffect(() => {
    if (cuposQuery.data) {
      setValores(
        Object.fromEntries(cuposQuery.data.map((c) => [c.id_carrera, String(c.cupos)])),
      )
    }
  }, [cuposQuery.data])

  useEffect(() => {
    if (convocatoria) guardar.reset()
  }, [convocatoria]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuardar = () => {
    if (!idConvocatoria) return
    const payload = (cuposQuery.data ?? []).map((c) => ({
      id_carrera: c.id_carrera,
      cupos: Math.max(0, Number(valores[c.id_carrera] ?? 0) || 0),
    }))
    guardar.mutate({ id: idConvocatoria, cupos: payload }, { onSuccess: onClose })
  }

  const error = guardar.isError ? extraerMensajeError(guardar.error) : null

  return (
    <Modal
      open={convocatoria !== null}
      onClose={onClose}
      title={convocatoria ? `Cupos · ${convocatoria.nombre}` : ''}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cerrar
          </Button>
          {puedeEditar && (
            <Button type="button" loading={guardar.isPending} onClick={handleGuardar}>
              Guardar cupos
            </Button>
          )}
        </>
      }
    >
      {cuposQuery.isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Plazas ofertadas por carrera para esta convocatoria. El corte de admisión (CU07) usará
            estos valores.
          </p>

          <div className="overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/40">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40 dark:bg-white/5">
                  <th className="px-4 py-2.5 font-medium">Carrera</th>
                  <th className="px-4 py-2.5 text-right font-medium">Cupos</th>
                </tr>
              </thead>
              <tbody>
                {(cuposQuery.data ?? []).map((c) => (
                  <tr key={c.id_carrera} className="border-b border-slate-100 last:border-0 dark:border-slate-800/60">
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">
                      {c.carrera}
                      <span className="ml-2 text-xs text-slate-400">{c.codigo}</span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input
                        type="number"
                        min={0}
                        disabled={!puedeEditar}
                        value={valores[c.id_carrera] ?? ''}
                        onChange={(e) =>
                          setValores((prev) => ({ ...prev, [c.id_carrera]: e.target.value }))
                        }
                        className="w-24 rounded-lg border border-slate-200/60 bg-white px-2.5 py-1.5 text-right text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-slate-700/40 dark:bg-panel-dark dark:text-slate-100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(cuposQuery.data ?? []).length === 0 && (
            <p className="py-6 text-center text-sm text-slate-400">
              No hay carreras registradas. Crea carreras en "Cupos por carrera" primero.
            </p>
          )}

          {error && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
              {error}
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
