import { useRef } from 'react'
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
  puedeEditar: boolean
  // CU14 — carga masiva
  onImportar: (archivo: File) => void
  importando: boolean
  // CU04 — aprobación masiva
  onAprobarTodos: () => void
  aprobandoTodos: boolean
}

export function PostulantesToolbar({
  buscar,
  onBuscarChange,
  filtro,
  onFiltroChange,
  onNuevo,
  puedeCrear,
  puedeEditar,
  onImportar,
  importando,
  onAprobarTodos,
  aprobandoTodos,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const seleccionarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (archivo) onImportar(archivo)
    e.target.value = '' // permite recargar el mismo archivo
  }

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
            placeholder="Buscar por trámite, nombre, CI o correo…"
            value={buscar}
            onChange={(e) => onBuscarChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {puedeEditar && (
            <Button variant="secondary" onClick={onAprobarTodos} loading={aprobandoTodos}>
              Aprobar todos
            </Button>
          )}

          {puedeCrear && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={seleccionarArchivo}
              />
              <Button variant="secondary" onClick={() => fileRef.current?.click()} loading={importando}>
                Cargar Excel
              </Button>

              <Button
                onClick={onNuevo}
                leftIcon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                }
              >
                Nuevo postulante
              </Button>
            </>
          )}
        </div>
      </div>

      <GestionConvocatoriaFilter value={filtro} onChange={onFiltroChange} />
    </div>
  )
}
