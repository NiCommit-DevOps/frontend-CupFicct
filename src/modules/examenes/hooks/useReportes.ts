import { useQuery } from '@tanstack/react-query'
import { reportesService } from '../services'
import type { FiltroLista } from '../types'

export function useActa(idConvocatoria: number | null) {
  return useQuery({
    queryKey: ['reporte-acta', idConvocatoria],
    queryFn: () => reportesService.acta(idConvocatoria as number),
    enabled: idConvocatoria != null,
  })
}

export function usePadron(idConvocatoria: number | null) {
  return useQuery({
    queryKey: ['reporte-padron', idConvocatoria],
    queryFn: () => reportesService.padron(idConvocatoria as number),
    enabled: idConvocatoria != null,
  })
}

export function useCertificados(termino: string) {
  return useQuery({
    queryKey: ['reporte-certificados', termino],
    queryFn: () => reportesService.certificados(termino),
    enabled: termino.trim().length > 0,
  })
}

export function useLista(idConvocatoria: number | null, filtro: FiltroLista) {
  return useQuery({
    queryKey: ['reporte-lista', idConvocatoria, filtro],
    queryFn: () => reportesService.lista(idConvocatoria as number, filtro),
    enabled: idConvocatoria != null,
  })
}

export function useEstadisticas(idConvocatoria: number | null) {
  return useQuery({
    queryKey: ['reporte-estadisticas', idConvocatoria],
    queryFn: () => reportesService.estadisticas(idConvocatoria as number),
    enabled: idConvocatoria != null,
  })
}

export function useDocentesPorGrupo(enabled: boolean) {
  return useQuery({
    queryKey: ['reporte-docentes-grupos'],
    queryFn: () => reportesService.docentesPorGrupo(),
    enabled,
  })
}
