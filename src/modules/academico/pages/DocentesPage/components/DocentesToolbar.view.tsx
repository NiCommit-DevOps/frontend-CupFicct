import { Button, Input } from '@/shared/ui'
import {
  GestionConvocatoriaFilter,
  type FiltroGestionConvocatoria,
} from '@/modules/administrativo/components/GestionConvocatoriaFilter'

interface Props {
  buscar: string
  onBuscarChange: (v: string) => void
  filtro: FiltroGestionConvocatoria
  onFiltroChange: (f: FiltroGestionConvocatoria) => void
  onNuevo: () => void
  puedeCrear: boolean
}

export function DocentesToolbar({
  buscar,
  onBuscarChange,
  filtro,
  onFiltroChange,
  onNuevo,
  puedeCrear,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, CI o correo…"
            value={buscar}
            onChange={(e) => onBuscarChange(e.target.value)}
          />
        </div>

        {puedeCrear && (
          <Button
            onClick={onNuevo}
            leftIcon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
            }
          >
            Nuevo docente
          </Button>
        )}
      </div>

      <GestionConvocatoriaFilter value={filtro} onChange={onFiltroChange} />
    </div>
  )
}
