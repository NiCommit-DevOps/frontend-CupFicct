import type { ClaseHorario } from '../types'

/** Tabla de clases (materia · días · horario) reutilizada en Materias y Mi horario. */
export function ClasesTable({ clases }: { clases: ClaseHorario[] }) {
  if (clases.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-slate-400">
        Sin horario definido para este turno.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
            <th className="px-4 py-3 font-medium">Materia</th>
            <th className="px-4 py-3 font-medium">Días</th>
            <th className="px-4 py-3 font-medium">Horario</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {clases.map((c) => (
            <tr key={c.id_materia} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
              <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{c.materia ?? '—'}</td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{c.dias}</td>
              <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                {c.hora_inicio} – {c.hora_fin}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
