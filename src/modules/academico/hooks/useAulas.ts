import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { aulasService } from '../services'
import type { AulaPayload } from '../types'

const KEY = ['aulas'] as const

export function useAulas() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => aulasService.listar(),
  })
}

export function useCrearAula() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AulaPayload) => aulasService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarAula() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AulaPayload }) =>
      aulasService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarAula() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => aulasService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
