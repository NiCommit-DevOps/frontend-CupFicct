import { apiClient } from '@/lib/apiClient'
import type { DashboardData } from '../types'

export const dashboardService = {
  async metricas(idConvocatoria?: number): Promise<DashboardData> {
    const { data } = await apiClient.get<DashboardData>('/dashboard', {
      params: idConvocatoria ? { id_convocatoria: idConvocatoria } : undefined,
    })
    return data
  },
}
