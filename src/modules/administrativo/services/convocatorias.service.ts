import { apiClient } from '@/lib/apiClient'
import type {
  Convocatoria,
  ConvocatoriaCreatePayload,
  ConvocatoriaUpdatePayload,
  CupoCarrera,
  CupoCarreraPayload,
  EstadoConvocatoria,
} from '../types'

export const convocatoriasService = {
  async listar(idGestion?: number | null): Promise<Convocatoria[]> {
    const { data } = await apiClient.get<{ data: Convocatoria[] }>('/convocatorias', {
      params: idGestion ? { id_gestion: idGestion } : undefined,
    })
    return data.data
  },

  /** CU19 — Aperturar Convocatoria. */
  async crear(payload: ConvocatoriaCreatePayload): Promise<Convocatoria> {
    const { data } = await apiClient.post<{ data: Convocatoria }>('/convocatorias', payload)
    return data.data
  },

  async actualizar(id: number, payload: ConvocatoriaUpdatePayload): Promise<Convocatoria> {
    const { data } = await apiClient.put<{ data: Convocatoria }>(`/convocatorias/${id}`, payload)
    return data.data
  },

  /** CU19 — Control de Estados del Proceso. */
  async cambiarEstado(id: number, estado: EstadoConvocatoria): Promise<Convocatoria> {
    const { data } = await apiClient.patch<{ data: Convocatoria }>(`/convocatorias/${id}/estado`, {
      estado,
    })
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/convocatorias/${id}`)
  },

  /** CU08/CU19 — Cupos por carrera de una convocatoria. */
  async cupos(idConvocatoria: number): Promise<CupoCarrera[]> {
    const { data } = await apiClient.get<{ data: CupoCarrera[] }>(
      `/convocatorias/${idConvocatoria}/cupos`,
    )
    return data.data
  },

  async guardarCupos(idConvocatoria: number, cupos: CupoCarreraPayload[]): Promise<CupoCarrera[]> {
    const { data } = await apiClient.put<{ data: CupoCarrera[] }>(
      `/convocatorias/${idConvocatoria}/cupos`,
      { cupos },
    )
    return data.data
  },
}
