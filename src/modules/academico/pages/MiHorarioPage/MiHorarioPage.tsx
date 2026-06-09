import { Badge, Card, LoadingState, PageHeader } from '@/shared/ui'
import { extraerMensajeError } from '@/lib/apiClient'
import { useMiHorario } from '../../hooks/useHorarios'
import { ClasesTable } from '../../components/ClasesTable'
import type { GrupoHorario } from '../../types'

/**
 * CU06/CU10 — Horario del usuario autenticado.
 * - Docente: cada grupo que dicta con su nombre, turno, aula y horario.
 * - Postulante: su boleta de horario del grupo asignado.
 */
export function MiHorarioPage() {
  const { data, isLoading, isError, error } = useMiHorario()

  const esPostulante = data?.rol === 'Postulante'
  const grupos = data?.grupos ?? []

  return (
    <div className="flex flex-col">
      <PageHeader
        title={esPostulante ? 'Boleta de horario' : 'Mi horario'}
        subtitle={
          esPostulante
            ? 'Tu grupo asignado, aula y horario de clases del curso preuniversitario'
            : 'Los grupos que dictas con su aula y horario de clases'
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <Card className="py-12 text-center text-sm text-rose-600 dark:text-rose-400">
          {extraerMensajeError(error, 'No se pudo cargar tu horario.')}
        </Card>
      ) : grupos.length === 0 ? (
        <Card className="py-12 text-center text-sm text-slate-400">
          {esPostulante
            ? 'Aún no tienes un grupo asignado. Cuando la administración te asigne a un grupo, aquí verás tu boleta de horario.'
            : 'Aún no tienes grupos asignados.'}
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map((g) => (
            <GrupoCard key={g.id_grupo} grupo={g} />
          ))}
        </div>
      )}
    </div>
  )
}

function GrupoCard({ grupo }: { grupo: GrupoHorario }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
        <div className="flex items-center gap-2.5">
          <Badge tone="brand">{grupo.sigla}</Badge>
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{grupo.nombre}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {grupo.turno && <Badge tone="neutral">Turno {grupo.turno}</Badge>}
          <Badge tone="neutral">
            {grupo.aula
              ? `${grupo.aula.nombre}${grupo.aula.ubicacion ? ` · ${grupo.aula.ubicacion}` : ''}`
              : 'Aula por asignar'}
          </Badge>
        </div>
      </div>
      <ClasesTable clases={grupo.clases} />
    </Card>
  )
}
