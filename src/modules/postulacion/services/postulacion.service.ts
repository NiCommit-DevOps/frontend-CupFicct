import { apiClient } from '@/lib/apiClient'
import type { PostulacionData, PostulacionPayload, PostulacionResultado } from '../types'

export const postulacionService = {
  /** Convocatoria pública vigente (por fecha) + catálogos del formulario. */
  async convocatoria(): Promise<PostulacionData> {
    const { data } = await apiClient.get<PostulacionData>('/public/postulacion/convocatoria')
    return data
  },

  /** Envía la solicitud de postulación (queda PENDIENTE, sin cuenta ni pago). */
  async registrar(payload: PostulacionPayload): Promise<PostulacionResultado> {
    // Multipart para poder adjuntar el documento del título de bachiller.
    const form = new FormData()
    for (const [clave, valor] of Object.entries(payload)) {
      if (valor === null || valor === undefined || valor === '') continue
      form.append(clave, valor instanceof File ? valor : String(valor))
    }
    const { data } = await apiClient.post<PostulacionResultado>('/public/postulacion', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
