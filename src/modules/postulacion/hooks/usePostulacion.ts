import { useMutation, useQuery } from '@tanstack/react-query'
import { postulacionService } from '../services/postulacion.service'
import type { PostulacionPayload } from '../types'

/** Convocatoria pública vigente + catálogos del formulario. */
export function useConvocatoriaPublica() {
  return useQuery({
    queryKey: ['postulacion', 'convocatoria'],
    queryFn: postulacionService.convocatoria,
    staleTime: 60_000,
    retry: false,
  })
}

/** Envío de la solicitud de postulación. */
export function useRegistrarPostulacion() {
  return useMutation({
    mutationFn: (payload: PostulacionPayload) => postulacionService.registrar(payload),
  })
}
