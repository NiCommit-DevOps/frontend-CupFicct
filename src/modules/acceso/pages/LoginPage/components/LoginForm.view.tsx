import type { FormEvent } from 'react'
import { Button, Input } from '@/shared/ui'
import { TIPO_LABELS, type TipoCuenta } from './ProfileChooser.view'

interface Props {
  tipo: TipoCuenta
  login: string
  password: string
  onLoginChange: (v: string) => void
  onPasswordChange: (v: string) => void
  onSubmit: (e: FormEvent) => void
  onVolver: () => void
  loading: boolean
  error: string | null
}

export function LoginForm({
  tipo,
  login,
  password,
  onLoginChange,
  onPasswordChange,
  onSubmit,
  onVolver,
  loading,
  error,
}: Props) {
  return (
    <div className="mt-2 w-full max-w-sm">
      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-panel-light shadow-sm dark:border-slate-700/40 dark:bg-panel-dark">
        <div className="border-b border-slate-200/60 bg-slate-50 py-3 text-center text-sm text-slate-500 dark:border-slate-700/40 dark:bg-slate-800/40 dark:text-slate-400">
          Inicio de sesión
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-6 py-6" autoComplete="off">
          <h2 className="text-center text-xl font-bold text-slate-800 dark:text-slate-100">
            {TIPO_LABELS[tipo].form}
          </h2>

          <Input
            type="text"
            name="login"
            autoComplete="username"
            placeholder="Usuario, registro, CI o correo"
            value={login}
            onChange={(e) => onLoginChange(e.target.value)}
            required
          />
          <Input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
          />

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}

          <Button type="submit" loading={loading} className="mt-1 w-full">
            Iniciar Sesión
          </Button>

          {/* Enlace decorativo (sin acción por ahora) */}
          <button
            type="button"
            className="text-center text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
            onClick={(e) => e.preventDefault()}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={onVolver}
        className="mx-auto mt-5 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Cambiar tipo de cuenta
      </button>
    </div>
  )
}
