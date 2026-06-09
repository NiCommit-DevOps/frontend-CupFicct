import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { convocatoriasService } from '../services'
import type {
  ConvocatoriaCreatePayload,
  ConvocatoriaUpdatePayload,
  CupoCarreraPayload,
  EstadoConvocatoria,
} from '../types'

const KEY = ['convocatorias'] as const

export function useConvocatorias(idGestion?: number | null) {
  return useQuery({
    queryKey: [...KEY, idGestion ?? 'todas'],
    queryFn: () => convocatoriasService.listar(idGestion),
  })
}

export function useCrearConvocatoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConvocatoriaCreatePayload) => convocatoriasService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarConvocatoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ConvocatoriaUpdatePayload }) =>
      convocatoriasService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useCambiarEstadoConvocatoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoConvocatoria }) =>
      convocatoriasService.cambiarEstado(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarConvocatoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => convocatoriasService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** CU08/CU19 — Cupos por carrera de una convocatoria. */
export function useCuposConvocatoria(idConvocatoria: number | null) {
  return useQuery({
    queryKey: [...KEY, 'cupos', idConvocatoria],
    queryFn: () => convocatoriasService.cupos(idConvocatoria as number),
    enabled: idConvocatoria != null,
  })
}

export function useGuardarCupos() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, cupos }: { id: number; cupos: CupoCarreraPayload[] }) =>
      convocatoriasService.guardarCupos(id, cupos),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: [...KEY, 'cupos', vars.id] }),
  })
}

