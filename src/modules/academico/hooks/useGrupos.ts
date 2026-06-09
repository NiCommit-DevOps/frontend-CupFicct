import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { gruposService } from '../services'
import type { GrupoPayload } from '../types'

const KEY = ['grupos'] as const
const ASIGNACION_KEY = ['grupos-asignacion'] as const

export function useGrupos() {
  return useQuery({ queryKey: KEY, queryFn: () => gruposService.listar() })
}

export function useGruposCatalogos(enabled = true) {
  return useQuery({
    queryKey: ['grupos-catalogos'],
    queryFn: () => gruposService.catalogos(),
    enabled,
  })
}

export function useAsignacion() {
  return useQuery({ queryKey: ASIGNACION_KEY, queryFn: () => gruposService.asignacion() })
}

/** Invalida tanto la lista de grupos como el panel de asignación. */
function useInvalidar() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: KEY })
    qc.invalidateQueries({ queryKey: ASIGNACION_KEY })
  }
}

export function useCrearGrupo() {
  const invalidar = useInvalidar()
  return useMutation({
    mutationFn: (payload: GrupoPayload) => gruposService.crear(payload),
    onSuccess: invalidar,
  })
}

export function useActualizarGrupo() {
  const invalidar = useInvalidar()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: GrupoPayload }) =>
      gruposService.actualizar(id, payload),
    onSuccess: invalidar,
  })
}

export function useEliminarGrupo() {
  const invalidar = useInvalidar()
  return useMutation({
    mutationFn: (id: number) => gruposService.eliminar(id),
    onSuccess: invalidar,
  })
}

export function useAsignarGrupo() {
  const invalidar = useInvalidar()
  return useMutation({
    mutationFn: ({ idInscripcion, idGrupo }: { idInscripcion: number; idGrupo: number }) =>
      gruposService.asignar(idInscripcion, idGrupo),
    onSuccess: invalidar,
  })
}

export function useDesasignarGrupo() {
  const invalidar = useInvalidar()
  return useMutation({
    mutationFn: (idInscripcion: number) => gruposService.desasignar(idInscripcion),
    onSuccess: invalidar,
  })
}

export function useCrearGruposAutomatico() {
  const invalidar = useInvalidar()
  return useMutation({ mutationFn: () => gruposService.crearAutomatico(), onSuccess: invalidar })
}

export function useAsignarLote() {
  const invalidar = useInvalidar()
  return useMutation({ mutationFn: () => gruposService.asignarLote(), onSuccess: invalidar })
}

export function useRebalancear() {
  const invalidar = useInvalidar()
  return useMutation({ mutationFn: () => gruposService.rebalancear(), onSuccess: invalidar })
}
