import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { resultadosService } from '../services'
import type { NotaItem, ResultadosFiltros } from '../types'

const KEY = ['resultados-examenes'] as const

export function useResultadosExamenes(filtros: ResultadosFiltros) {
  return useQuery({
    queryKey: [...KEY, filtros],
    queryFn: () => resultadosService.listar(filtros),
    // Solo consulta cuando hay una convocatoria seleccionada.
    enabled: filtros.id_convocatoria != null,
  })
}

export function useGuardarNotas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, notas }: { id: number; notas: NotaItem[] }) =>
      resultadosService.guardarNotas(id, notas),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useImportarNotas() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ archivo, idConvocatoria }: { archivo: File; idConvocatoria: number }) =>
      resultadosService.importar(archivo, idConvocatoria),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
