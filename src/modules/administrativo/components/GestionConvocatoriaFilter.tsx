import { Select } from '@/shared/ui'
import { useGestiones } from '../hooks/useGestiones'
import { useConvocatorias } from '../hooks/useConvocatorias'

export interface FiltroGestionConvocatoria {
  id_gestion: number | null
  id_convocatoria: number | null
}

interface Props {
  value: FiltroGestionConvocatoria
  onChange: (value: FiltroGestionConvocatoria) => void
}

/**
 * Filtro en cascada Gestión → Convocatoria, reutilizable por cualquier listado.
 * Obtiene sus propias opciones (gestiones y convocatorias de la gestión elegida).
 */
export function GestionConvocatoriaFilter({ value, onChange }: Props) {
  const gestionesQuery = useGestiones()
  // Las convocatorias se acotan a la gestión seleccionada (o todas si no hay).
  const convocatoriasQuery = useConvocatorias(value.id_gestion)

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="w-full sm:w-52">
        <Select
          label="Gestión"
          value={value.id_gestion ?? ''}
          onChange={(e) =>
            // Al cambiar de gestión se reinicia la convocatoria.
            onChange({
              id_gestion: e.target.value ? Number(e.target.value) : null,
              id_convocatoria: null,
            })
          }
        >
          <option value="">Todas las gestiones</option>
          {(gestionesQuery.data ?? []).map((g) => (
            <option key={g.id_gestion} value={g.id_gestion}>{g.nombre}</option>
          ))}
        </Select>
      </div>

      <div className="w-full sm:w-56">
        <Select
          label="Convocatoria"
          value={value.id_convocatoria ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              id_convocatoria: e.target.value ? Number(e.target.value) : null,
            })
          }
        >
          <option value="">Todas las convocatorias</option>
          {(convocatoriasQuery.data ?? []).map((c) => (
            <option key={c.id_convocatoria} value={c.id_convocatoria}>{c.nombre}</option>
          ))}
        </Select>
      </div>
    </div>
  )
}
