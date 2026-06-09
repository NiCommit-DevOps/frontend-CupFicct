import { extraerMensajeError } from '@/lib/apiClient'
import { useConvocatoriaPublica, useRegistrarPostulacion } from '../../hooks/usePostulacion'
import { PostulacionPageView } from './PostulacionPage.view'

/**
 * Página pública del formulario de postulación (ruta `/postular`).
 * Si no hay convocatoria abierta, la vista muestra el aviso correspondiente.
 */
export function PostulacionPage() {
  const { data, isLoading } = useConvocatoriaPublica()
  const mutation = useRegistrarPostulacion()

  return (
    <PostulacionPageView
      datos={data}
      loading={isLoading}
      submitting={mutation.isPending}
      error={mutation.isError ? extraerMensajeError(mutation.error, 'No se pudo enviar la postulación.') : null}
      codigoTramite={mutation.data?.codigo_tramite ?? null}
      onSubmit={(payload) => mutation.mutate(payload)}
    />
  )
}
