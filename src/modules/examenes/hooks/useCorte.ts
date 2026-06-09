import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { corteService } from '../services'

const KEY = ['corte-admision'] as const

export function useCorteEstado(idConvocatoria: number | null) {
  return useQuery({
    queryKey: [...KEY, idConvocatoria],
    queryFn: () => corteService.estado(idConvocatoria as number),
    enabled: idConvocatoria != null,
  })
}

export function useEjecutarCorte() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (idConvocatoria: number) => corteService.ejecutar(idConvocatoria),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
