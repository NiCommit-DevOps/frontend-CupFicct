import { apiClient } from '@/lib/apiClient'
import { descargarBlob } from '@/lib/imprimir'
import type {
  ActaData,
  CertificadoFila,
  DocenteGrupoFila,
  EstadisticasData,
  FiltroLista,
  ListaData,
  PadronData,
} from '../types'

export const reportesService = {
  async acta(idConvocatoria: number): Promise<ActaData> {
    const { data } = await apiClient.get<ActaData>('/reportes/acta', {
      params: { id_convocatoria: idConvocatoria },
    })
    return data
  },

  async padron(idConvocatoria: number): Promise<PadronData> {
    const { data } = await apiClient.get<PadronData>('/reportes/padron', {
      params: { id_convocatoria: idConvocatoria },
    })
    return data
  },

  async certificados(termino: string): Promise<CertificadoFila[]> {
    const { data } = await apiClient.get<{ data: CertificadoFila[] }>('/reportes/certificados', {
      params: { buscar: termino },
    })
    return data.data
  },

  /** Lista general / aprobados / reprobados. */
  async lista(idConvocatoria: number, filtro: FiltroLista): Promise<ListaData> {
    const { data } = await apiClient.get<ListaData>('/reportes/lista', {
      params: { id_convocatoria: idConvocatoria, filtro },
    })
    return data
  },

  /** Promedios generales, estadísticas por materia y grupos con más aprobados. */
  async estadisticas(idConvocatoria: number): Promise<EstadisticasData> {
    const { data } = await apiClient.get<EstadisticasData>('/reportes/estadisticas', {
      params: { id_convocatoria: idConvocatoria },
    })
    return data
  },

  /** Docentes por grupo. */
  async docentesPorGrupo(): Promise<DocenteGrupoFila[]> {
    const { data } = await apiClient.get<{ data: DocenteGrupoFila[] }>('/reportes/docentes-grupos')
    return data.data
  },

  /** Descarga CSV del acta (lo abre Excel). */
  async descargarActaCsv(idConvocatoria: number): Promise<void> {
    const res = await apiClient.get('/reportes/acta/csv', {
      params: { id_convocatoria: idConvocatoria },
      responseType: 'blob',
    })
    descargarBlob(res.data as Blob, 'acta_admitidos.csv')
  },

  async descargarPadronCsv(idConvocatoria: number): Promise<void> {
    const res = await apiClient.get('/reportes/padron/csv', {
      params: { id_convocatoria: idConvocatoria },
      responseType: 'blob',
    })
    descargarBlob(res.data as Blob, 'padron_academico.csv')
  },
}
