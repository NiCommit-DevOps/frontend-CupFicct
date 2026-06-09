import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import { LoginPageView } from './LoginPage.view'
import type { TipoCuenta } from './components/ProfileChooser.view'

export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()

  // Paso 1: selector de tipo de cuenta · Paso 2 (tipo != null): formulario.
  const [tipo, setTipo] = useState<TipoCuenta | null>(null)
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    // El backend valida que el rol de la cuenta corresponda a la pestaña (tipo);
    // si no coincide, responde 422 y no emite token.
    mutationFn: () => login(loginValue, password, tipo ?? undefined),
    // El aterrizaje real lo decide HomeRedirect según los permisos del usuario.
    onSuccess: () => navigate('/inicio', { replace: true }),
  })

  if (status === 'authenticated') {
    return <Navigate to="/inicio" replace />
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate()
  }

  const volver = () => {
    setTipo(null)
    setLoginValue('')
    setPassword('')
    mutation.reset()
  }

  return (
    <LoginPageView
      tipo={tipo}
      onSelectTipo={setTipo}
      onVolver={volver}
      login={loginValue}
      password={password}
      onLoginChange={setLoginValue}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      error={
        mutation.isError ? extraerMensajeError(mutation.error, 'No se pudo iniciar sesión.') : null
      }
    />
  )
}
