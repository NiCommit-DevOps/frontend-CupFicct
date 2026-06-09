import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Spinner } from '@/shared/ui'

interface ProtectedRouteProps {
  children: ReactNode
  /** Código de permiso requerido (campo "modulo"). Si se omite, basta con estar autenticado. */
  permiso?: string
}

export function ProtectedRoute({ children, permiso }: ProtectedRouteProps) {
  const { status, tienePermiso } = useAuth()

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-panel-bgLight dark:bg-panel-bgDark">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (permiso && !tienePermiso(permiso)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Acceso denegado</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No tienes el permiso <code className="text-brand-500">{permiso}</code> para ver esta sección.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
