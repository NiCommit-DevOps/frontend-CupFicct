import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gestionesService } from '../services'
import type { EstadoGestion, GestionPayload } from '../types'

const KEY = ['gestiones'] as const

export function useGestiones() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => gestionesService.listar(),
  })
}

export function useCrearGestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: GestionPayload) => gestionesService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarGestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GestionPayload }) =>
      gestionesService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useCambiarEstadoGestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoGestion }) =>
      gestionesService.cambiarEstado(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarGestion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => gestionesService.eliminar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      qc.invalidateQueries({ queryKey: ['convocatorias'] })
    },
  })
}
