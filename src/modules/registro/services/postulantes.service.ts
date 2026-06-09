import { apiClient } from '@/lib/apiClient'
import type {
  InscripcionCatalogos,
  Postulante,
  PostulanteCreatePayload,
  PostulanteUpdatePayload,
  ResultadoImportacion,
} from '../types'

export interface ListarPostulantesParams {
  buscar?: string
  id_gestion?: number
  id_convocatoria?: number
}

/**
 * Arma un FormData con el payload del postulante (multipart, para poder adjuntar
 * el documento del título de bachiller). Omite valores nulos/vacíos y agrega el
 * archivo solo si existe.
 */
function construirFormData(payload: PostulanteCreatePayload): FormData {
  const form = new FormData()
  for (const [clave, valor] of Object.entries(payload)) {
    if (valor === null || valor === undefined || valor === '') continue
    if (valor instanceof File) {
      form.append(clave, valor)
    } else {
      form.append(clave, String(valor))
    }
  }
  return form
}

export const postulantesService = {
  async catalogos(): Promise<InscripcionCatalogos> {
    const { data } = await apiClient.get<InscripcionCatalogos>('/postulantes/catalogos')
    return data
  },

  async listar(params: ListarPostulantesParams = {}): Promise<Postulante[]> {
    const { data } = await apiClient.get<{ data: Postulante[] }>('/postulantes', { params })
    return data.data
  },

  async crear(payload: PostulanteCreatePayload): Promise<Postulante> {
    const { data } = await apiClient.post<{ data: Postulante }>('/postulantes', construirFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  async actualizar(id: number, payload: PostulanteUpdatePayload): Promise<Postulante> {
    // Method spoofing: multipart no viaja bien en PUT, se envía POST + _method=PUT.
    const form = construirFormData(payload)
    form.append('_method', 'PUT')
    const { data } = await apiClient.post<{ data: Postulante }>(`/postulantes/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  },

  /** Abre en una pestaña nueva el documento del título de bachiller (con auth). */
  async verTitulo(id: number): Promise<void> {
    const res = await apiClient.get(`/postulantes/${id}/titulo`, { responseType: 'blob' })
    const url = URL.createObjectURL(res.data as Blob)
    window.open(url, '_blank')
    // El navegador retiene la URL mientras la pestaña esté abierta; se libera luego.
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/postulantes/${id}`)
  },

  async cambiarEstado(id: number, estado: string): Promise<Postulante> {
    const { data } = await apiClient.patch<{ data: Postulante }>(`/postulantes/${id}/estado`, {
      estado_academico: estado,
    })
    return data.data
  },

  async activarSinPago(id: number): Promise<{
    postulante: Postulante
    credenciales: { usuario: string; contrasena: string; esta_activo: boolean }
    grupo: { id_grupo: number; sigla: string; nombre: string; turno: string } | null
    estado_academico: string
  }> {
    const { data } = await apiClient.post(`/postulantes/${id}/activar`)
    return data
  },

  /** CU04 — Aprueba en lote a todos los postulantes pendientes. */
  async aprobarTodos(): Promise<{ message: string; aprobados: number }> {
    const { data } = await apiClient.post('/postulantes/aprobar-todos')
    return data
  },

  /** CU14 — Carga masiva desde un archivo CSV/Excel. */
  async importar(archivo: File): Promise<ResultadoImportacion> {
    const form = new FormData()
    form.append('archivo', archivo)
    const { data } = await apiClient.post<ResultadoImportacion>('/postulantes/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
