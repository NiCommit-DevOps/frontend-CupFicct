import { Button } from '@/shared/ui'
import type { Grupo, PostulanteElegible } from '@/modules/academico/types'

interface Props {
  postulantes: PostulanteElegible[]
  grupos: Grupo[]
  puedeAsignar: boolean
  onCambiarAsignacion: (idInscripcion: number, idGrupo: number | null) => void
  asignando: boolean
  onAsignarLote: () => void
  onRebalancear: () => void
  procesandoLote: boolean
  procesandoRebalanceo: boolean
  aviso: string | null
  errorAccion: string | null
}

export function AsignacionPanel({
  postulantes,
  grupos,
  puedeAsignar,
  onCambiarAsignacion,
  asignando,
  onAsignarLote,
  onRebalancear,
  procesandoLote,
  procesandoRebalanceo,
  aviso,
  errorAccion,
}: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 border-b border-slate-200/60 p-4 dark:border-slate-700/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Asignación de postulantes
          </h3>
          <p className="text-xs text-slate-400">
            Postulantes con estado ELEGIBLE. {postulantes.length} en total.
          </p>
        </div>
        {puedeAsignar && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" loading={procesandoLote} onClick={onAsignarLote}>
              Asignar automáticamente
            </Button>
            <Button variant="secondary" size="sm" loading={procesandoRebalanceo} onClick={onRebalancear}>
              Rebalancear
            </Button>
          </div>
        )}
      </div>

      {(aviso || errorAccion) && (
        <div className="px-4 pt-3">
          {aviso && (
            <div className="rounded-xl bg-brand-50 px-4 py-2.5 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              {aviso}
            </div>
          )}
          {errorAccion && (
            <div className="mt-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              {errorAccion}
            </div>
          )}
        </div>
      )}

      {postulantes.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
          No hay postulantes ELEGIBLE. Marca postulantes como ELEGIBLE desde el padrón de Postulantes (CU04).
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                <th className="px-4 py-3 font-medium">Trámite</th>
                <th className="px-4 py-3 font-medium">Postulante</th>
                <th className="px-4 py-3 font-medium">Turno pref.</th>
                <th className="px-4 py-3 font-medium">Carrera</th>
                <th className="px-4 py-3 font-medium">Grupo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {postulantes.map((p) => (
                <tr key={p.id_inscripcion} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                    {p.postulante?.codigo_tramite ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700 dark:text-slate-200">
                      {p.postulante ? `${p.postulante.nombres} ${p.postulante.apellidos}` : `#${p.id_inscripcion}`}
                    </div>
                    <div className="text-xs text-slate-400">{p.postulante?.ci}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.turno_preferencia ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {p.carreras.map((c) => c.nombre).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      disabled={!puedeAsignar || asignando}
                      value={p.id_grupo ?? ''}
                      onChange={(e) =>
                        onCambiarAsignacion(p.id_inscripcion, e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full max-w-[16rem] rounded-xl border border-slate-200/60 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-60 dark:border-slate-700/40 dark:bg-panel-dark dark:text-slate-100"
                    >
                      <option value="">— Sin grupo —</option>
                      {grupos.map((g) => {
                        const lleno = g.cupo_disponible <= 0 && g.id_grupo !== p.id_grupo
                        return (
                          <option key={g.id_grupo} value={g.id_grupo} disabled={lleno}>
                            {g.sigla} · {g.turno} ({g.cupo_usado}/{g.capacidad_max})
                            {lleno ? ' — lleno' : ''}
                          </option>
                        )
                      })}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
