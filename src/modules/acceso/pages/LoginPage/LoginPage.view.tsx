import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/shared/ui'
import { UagrmLogo } from './components/UagrmLogo.view'
import { ProfileChooser, type TipoCuenta } from './components/ProfileChooser.view'
import { LoginForm } from './components/LoginForm.view'

interface LoginPageViewProps {
  tipo: TipoCuenta | null
  onSelectTipo: (t: TipoCuenta) => void
  onVolver: () => void
  login: string
  password: string
  onLoginChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  loading: boolean
  error: string | null
}

export function LoginPageView({
  tipo,
  onSelectTipo,
  onVolver,
  login,
  password,
  onLoginChange,
  onPasswordChange,
  onSubmit,
  loading,
  error,
}: LoginPageViewProps) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-panel-bgLight px-4 py-10 dark:bg-panel-bgDark">
      {/* Volver a la landing: solo en la pantalla de selección de perfil. */}
      {tipo === null && (
        <Link
          to="/"
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      )}

      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <UagrmLogo />

      <div className="mt-10 w-full max-w-3xl">
        {tipo === null ? (
          <ProfileChooser onSelect={onSelectTipo} />
        ) : (
          <div className="flex flex-col items-center">
            <LoginForm
              tipo={tipo}
              login={login}
              password={password}
              onLoginChange={onLoginChange}
              onPasswordChange={onPasswordChange}
              onSubmit={onSubmit}
              onVolver={onVolver}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </div>
    </div>
  )
}
