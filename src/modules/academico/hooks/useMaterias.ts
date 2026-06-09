import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { materiasService } from '../services'
import type { MateriaPayload } from '../types'

const KEY = ['materias'] as const

export function useMaterias(buscar?: string, enabled = true) {
  return useQuery({
    queryKey: [...KEY, buscar ?? ''],
    queryFn: () => materiasService.listar(buscar),
    enabled,
  })
}

export function useCrearMateria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: MateriaPayload) => materiasService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarMateria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MateriaPayload }) =>
      materiasService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarMateria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => materiasService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
