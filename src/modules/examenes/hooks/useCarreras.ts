import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { carrerasService } from '../services'
import type { CarreraPayload } from '../types'

const KEY = ['carreras'] as const

export function useCarreras() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => carrerasService.listar(),
  })
}

export function useCatalogosCarrera() {
  return useQuery({
    queryKey: [...KEY, 'catalogos'],
    queryFn: () => carrerasService.catalogos(),
    staleTime: 5 * 60_000,
  })
}

export function useCrearCarrera() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CarreraPayload) => carrerasService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarCarrera() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CarreraPayload }) =>
      carrerasService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarCarrera() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => carrerasService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
