import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { tokenStorage } from '@/lib/tokenStorage'
import { authService } from '@/modules/acceso/services'
import type { Usuario } from '@/modules/acceso/types'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  usuario: Usuario | null
  status: AuthStatus
  login: (login: string, password: string, tipo?: string) => Promise<Usuario>
  logout: () => Promise<void>
  setUsuario: (usuario: Usuario) => void
  tienePermiso: (codigo: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  // Al cargar la app, si hay token intenta restaurar la sesión.
  useEffect(() => {
    const token = tokenStorage.get()
    if (!token) {
      setStatus('unauthenticated')
      return
    }
    authService
      .me()
      .then((u) => {
        setUsuario(u)
        setStatus('authenticated')
      })
      .catch(() => {
        tokenStorage.clear()
        setStatus('unauthenticated')
      })
  }, [])

  const login = useCallback(async (loginValue: string, password: string, tipo?: string) => {
    const res = await authService.login(loginValue, password, tipo)
    tokenStorage.set(res.access_token)
    setUsuario(res.usuario)
    setStatus('authenticated')
    return res.usuario
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // El token igual se descarta localmente.
    }
    tokenStorage.clear()
    setUsuario(null)
    setStatus('unauthenticated')
  }, [])

  const tienePermiso = useCallback(
    (codigo: string) => usuario?.permisos?.includes(codigo) ?? false,
    [usuario],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ usuario, status, login, logout, setUsuario, tienePermiso }),
    [usuario, status, login, logout, tienePermiso],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return ctx
}
