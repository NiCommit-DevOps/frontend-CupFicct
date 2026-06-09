import axios, { AxiosError } from 'axios'
import { tokenStorage } from './tokenStorage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/** Inyecta el Bearer token JWT en cada petición. */
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/** Ante un 401 (token expirado/ inválido) limpia la sesión y redirige al login. */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && tokenStorage.get()) {
      tokenStorage.clear()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

/** Extrae un mensaje legible desde una respuesta de error de Laravel. */
export function extraerMensajeError(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined
    if (data?.errors) {
      const primera = Object.values(data.errors)[0]
      if (primera?.[0]) return primera[0]
    }
    if (data?.message) return data.message
  }
  return fallback
}
