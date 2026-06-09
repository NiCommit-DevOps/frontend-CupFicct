import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postulantesService, type ListarPostulantesParams } from '../services'
import type { PostulanteCreatePayload, PostulanteUpdatePayload } from '../types'

const KEY = ['postulantes'] as const

/** Catálogos para el formulario de alta (convocatoria vigente, carreras, unidades, turnos). */
export function usePostulantesCatalogos(enabled = true) {
  return useQuery({
    queryKey: ['postulantes-catalogos'],
    queryFn: () => postulantesService.catalogos(),
    enabled,
  })
}

export function usePostulantes(params: ListarPostulantesParams = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => postulantesService.listar(params),
  })
}

export function useCrearPostulante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: PostulanteCreatePayload) => postulantesService.crear(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** CU14 — Carga masiva de postulantes desde archivo. */
export function useImportarPostulantes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (archivo: File) => postulantesService.importar(archivo),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

/** CU04 — Aprobar a todos los postulantes pendientes. */
export function useAprobarTodosPostulantes() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => postulantesService.aprobarTodos(),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActualizarPostulante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PostulanteUpdatePayload }) =>
      postulantesService.actualizar(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useEliminarPostulante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => postulantesService.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useCambiarEstadoPostulante() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      postulantesService.cambiarEstado(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useActivarPostulanteSinPago() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => postulantesService.activarSinPago(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
