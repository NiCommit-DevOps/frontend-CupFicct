import { useQuery } from '@tanstack/react-query'
import { permisosService } from '../services'

export function useMatrizPermisos() {
  return useQuery({
    queryKey: ['permisos', 'matriz'],
    queryFn: () => permisosService.matriz(),
    staleTime: 5 * 60_000,
  })
}
