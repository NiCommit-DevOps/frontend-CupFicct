import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { rolesService } from '../services'
import type { RolPayload } from '../types'

const KEY = ['roles'] as const

export function useRoles() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => rolesService.listar(),
  })
}

export function useRol(id: number | null) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => rolesService.obtener(id as number),
    enabled: id != null,
  })
}

export function useCrearRol() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RolPayload) => rolesService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarRol() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RolPayload }) =>
      rolesService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarRol() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => rolesService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useSincronizarPermisos() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, permisos }: { id: number; permisos: number[] }) =>
      rolesService.sincronizarPermisos(id, permisos),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
