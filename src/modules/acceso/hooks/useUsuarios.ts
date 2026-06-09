import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usuariosService, type ListarUsuariosParams } from '../services'
import type { UsuarioCreatePayload, UsuarioUpdatePayload } from '../types'

const KEY = ['usuarios'] as const

export function useUsuarios(params: ListarUsuariosParams) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => usuariosService.listar(params),
  })
}

export function useCrearUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UsuarioCreatePayload) => usuariosService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UsuarioUpdatePayload }) =>
      usuariosService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useAlternarEstadoUsuario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuariosService.alternarEstado(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** Flujo de ingreso sin pago: habilita el acceso de un postulante aprobado. */
export function useHabilitarPostulante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => usuariosService.habilitarPostulante(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** CU02 — Activar a todas las cuentas inhabilitadas. */
export function useActivarTodosUsuarios() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => usuariosService.activarTodos(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
