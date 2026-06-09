import { apiClient } from '@/lib/apiClient'
import type {
  NotaItem,
  ResultadoFila,
  ResultadoImportacionNotas,
  ResultadosData,
  ResultadosFiltros,
} from '../types'

export const resultadosService = {
  async listar(filtros: ResultadosFiltros = {}): Promise<ResultadosData> {
    const { data } = await apiClient.get<{ data: ResultadosData }>('/examenes/resultados-staff', {
      params: filtros,
    })
    return data.data
  },

  /** Registra/edita las notas por materia de un postulante. */
  async guardarNotas(idInscripcion: number, notas: NotaItem[]): Promise<ResultadoFila> {
    const { data } = await apiClient.put<{ data: ResultadoFila }>(
      `/examenes/inscripciones/${idInscripcion}/notas`,
      { notas },
    )
    return data.data
  },

  /** CU06 — Carga masiva de notas desde un archivo CSV/Excel, cruzando por CI. */
  async importar(archivo: File, idConvocatoria: number): Promise<ResultadoImportacionNotas> {
    const form = new FormData()
    form.append('archivo', archivo)
    form.append('id_convocatoria', String(idConvocatoria))
    const { data } = await apiClient.post<ResultadoImportacionNotas>('/examenes/notas/importar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
