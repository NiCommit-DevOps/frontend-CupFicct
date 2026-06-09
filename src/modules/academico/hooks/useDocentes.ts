import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { docentesService, type ListarDocentesParams } from '../services'
import type { DocenteCreatePayload, DocenteUpdatePayload } from '../types'

const KEY = ['docentes'] as const

export function useDocentes(params: ListarDocentesParams = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => docentesService.listar(params),
  })
}

export function useCrearDocente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: DocenteCreatePayload) => docentesService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarDocente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DocenteUpdatePayload }) =>
      docentesService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarDocente() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => docentesService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
