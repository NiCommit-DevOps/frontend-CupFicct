import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import type { FiltroGestionConvocatoria } from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import { useCorteEstado, useEjecutarCorte } from '../../hooks/useCorte'
import { CortePageView } from './CortePage.view'

export function CortePage() {
  const { tienePermiso } = useAuth()
  const puedeEjecutar = tienePermiso('admision.ejecutar')

  const [filtro, setFiltro] = useState<FiltroGestionConvocatoria>({ id_gestion: null, id_convocatoria: null })

  const estadoQuery = useCorteEstado(filtro.id_convocatoria)
  const ejecutar = useEjecutarCorte()

  const onEjecutar = () => {
    if (!filtro.id_convocatoria) return
    if (
      !window.confirm(
        'Esto recalculará la admisión por cupos (1ª y 2ª opción). Reemplaza cualquier corte anterior de esta convocatoria. ¿Ejecutar?',
      )
    ) {
      return
    }
    ejecutar.mutate(filtro.id_convocatoria)
  }

  return (
    <CortePageView
      filtro={filtro}
      onFiltroChange={setFiltro}
      hayConvocatoria={filtro.id_convocatoria != null}
      data={estadoQuery.data}
      isLoading={estadoQuery.isLoading}
      puedeEjecutar={puedeEjecutar}
      ejecutando={ejecutar.isPending}
      onEjecutar={onEjecutar}
      error={ejecutar.isError ? extraerMensajeError(ejecutar.error) : null}
    />
  )
}
