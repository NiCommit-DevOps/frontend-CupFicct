import { apiClient } from '@/lib/apiClient'
import type {
  AsignacionData,
  AsignacionResumen,
  Grupo,
  GrupoCatalogos,
  GrupoPayload,
} from '../types'

export const gruposService = {
  async listar(): Promise<Grupo[]> {
    const { data } = await apiClient.get<{ data: Grupo[] }>('/grupos')
    return data.data
  },

  async catalogos(): Promise<GrupoCatalogos> {
    const { data } = await apiClient.get<GrupoCatalogos>('/grupos/catalogos')
    return data
  },

  async asignacion(): Promise<AsignacionData> {
    const { data } = await apiClient.get<{
      convocatoria: AsignacionData['convocatoria']
      grupos: Grupo[] | { data: Grupo[] }
      postulantes: AsignacionData['postulantes']
      resumen: AsignacionData['resumen']
    }>('/grupos/asignacion')
    // El recurso anidado puede venir como arreglo o envuelto en { data }.
    const grupos = Array.isArray(data.grupos) ? data.grupos : data.grupos.data
    return { convocatoria: data.convocatoria ?? null, grupos, postulantes: data.postulantes, resumen: data.resumen }
  },

  async crear(payload: GrupoPayload): Promise<Grupo> {
    const { data } = await apiClient.post<{ data: Grupo }>('/grupos', payload)
    return data.data
  },

  async actualizar(id: number, payload: GrupoPayload): Promise<Grupo> {
    const { data } = await apiClient.put<{ data: Grupo }>(`/grupos/${id}`, payload)
    return data.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/grupos/${id}`)
  },

  async asignar(idInscripcion: number, idGrupo: number): Promise<void> {
    await apiClient.post('/grupos/asignar', { id_inscripcion: idInscripcion, id_grupo: idGrupo })
  },

  async desasignar(idInscripcion: number): Promise<void> {
    await apiClient.post('/grupos/desasignar', { id_inscripcion: idInscripcion })
  },

  /** CU09 — Crea automáticamente los grupos (techo(inscritos/70)) y asigna a los elegibles. */
  async crearAutomatico(): Promise<AsignacionResumen> {
    const { data } = await apiClient.post<AsignacionResumen>('/grupos/crear-automatico')
    return data
  },

  async asignarLote(): Promise<AsignacionResumen> {
    const { data } = await apiClient.post<AsignacionResumen>('/grupos/asignar-lote')
    return data
  },

  async rebalancear(): Promise<AsignacionResumen> {
    const { data } = await apiClient.post<AsignacionResumen>('/grupos/rebalancear')
    return data
  },
}
