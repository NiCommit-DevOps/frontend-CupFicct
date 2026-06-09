import { useConvocatoriaPublica } from '../../hooks/usePostulacion'
import { LandingPageView } from './LandingPage.view'

/**
 * Landing pública de la FICCT (ruta `/`). Lo primero que ve cualquier visitante.
 * La sección "Convocatoria" solo se muestra si hay una convocatoria abierta cuya
 * ventana de inscripción incluye la fecha de hoy; desde ahí el postulante pasa al
 * formulario público.
 */
export function LandingPage() {
  const { data, isLoading } = useConvocatoriaPublica()

  return <LandingPageView convocatoria={data?.convocatoria ?? null} loading={isLoading} />
}
