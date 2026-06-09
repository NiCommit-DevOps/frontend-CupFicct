import { useMutation, useQuery } from '@tanstack/react-query'
import {
  perfilService,
  type ActualizarContactoPayload,
  type CambiarPasswordPayload,
} from '../services'

/** Datos frescos del perfil del usuario en sesión (incluye permisos actuales). */
export function usePerfilActual() {
  return useQuery({
    queryKey: ['perfil-actual'],
    queryFn: () => perfilService.obtener(),
  })
}

export function useActualizarContacto() {
  return useMutation({
    mutationFn: (payload: ActualizarContactoPayload) => perfilService.actualizarContacto(payload),
  })
}

export function useCambiarPassword() {
  return useMutation({
    mutationFn: (payload: CambiarPasswordPayload) => perfilService.cambiarPassword(payload),
  })
}
