import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services'

export function useDashboard(idConvocatoria: number | null) {
  return useQuery({
    queryKey: ['dashboard', idConvocatoria],
    queryFn: () => dashboardService.metricas(idConvocatoria ?? undefined),
    staleTime: 30_000,
  })
}
