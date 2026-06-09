import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import type { Sexo } from '@/modules/acceso/types'
import { useActualizarContacto, useCambiarPassword, usePerfilActual } from '../../hooks/usePerfil'
import { PerfilPageView } from './PerfilPage.view'

type Msg = { tipo: 'ok' | 'error'; texto: string } | null

export function PerfilPage() {
  const { usuario: usuarioSesion, setUsuario } = useAuth()

  // Datos frescos del backend (permisos actualizados, etc.). Si aún no llegan,
  // se usa el usuario de la sesión como respaldo.
  const perfilQuery = usePerfilActual()
  const usuario = perfilQuery.data ?? usuarioSesion

  // Sincroniza el contexto de auth (menú, tienePermiso) con los datos frescos.
  useEffect(() => {
    if (perfilQuery.data) setUsuario(perfilQuery.data)
  }, [perfilQuery.data, setUsuario])

  const [nombres, setNombres] = useState(usuario?.nombres ?? '')
  const [apellidos, setApellidos] = useState(usuario?.apellidos ?? '')
  const [fechaNacimiento, setFechaNacimiento] = useState(usuario?.fecha_nacimiento ?? '')
  const [sexo, setSexo] = useState<Sexo | ''>(usuario?.sexo ?? '')
  const [correo, setCorreo] = useState(usuario?.correo ?? '')
  const [telefono1, setTelefono1] = useState(usuario?.telefono1 ?? '')
  const [telefono2, setTelefono2] = useState(usuario?.telefono2 ?? '')
  const [contactoMsg, setContactoMsg] = useState<Msg>(null)

  const [actual, setActual] = useState('')
  const [nueva, setNueva] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [passwordMsg, setPasswordMsg] = useState<Msg>(null)

  const contacto = useActualizarContacto()
  const password = useCambiarPassword()

  if (!usuario) return null

  const submitContacto = (e: FormEvent) => {
    e.preventDefault()
    setContactoMsg(null)
    contacto.mutate(
      {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
        fecha_nacimiento: fechaNacimiento || null,
        sexo: sexo || null,
        correo: correo.trim(),
        telefono1: telefono1.trim() || null,
        telefono2: telefono2.trim() || null,
      },
      {
        onSuccess: (actualizado) => {
          setUsuario({ ...usuario, ...actualizado })
          setContactoMsg({ tipo: 'ok', texto: 'Datos actualizados correctamente.' })
        },
        onError: (err) => setContactoMsg({ tipo: 'error', texto: extraerMensajeError(err) }),
      },
    )
  }

  const submitPassword = (e: FormEvent) => {
    e.preventDefault()
    setPasswordMsg(null)

    if (nueva !== confirmacion) {
      setPasswordMsg({ tipo: 'error', texto: 'La confirmación no coincide con la nueva contraseña.' })
      return
    }

    password.mutate(
      {
        contrasena_actual: actual,
        contrasena_nueva: nueva,
        contrasena_nueva_confirmation: confirmacion,
      },
      {
        onSuccess: () => {
          setActual('')
          setNueva('')
          setConfirmacion('')
          setPasswordMsg({ tipo: 'ok', texto: 'Contraseña actualizada correctamente.' })
        },
        onError: (err) => setPasswordMsg({ tipo: 'error', texto: extraerMensajeError(err) }),
      },
    )
  }

  return (
    <PerfilPageView
      usuario={usuario}
      nombres={nombres}
      apellidos={apellidos}
      fechaNacimiento={fechaNacimiento}
      sexo={sexo}
      correo={correo}
      telefono1={telefono1}
      telefono2={telefono2}
      onNombresChange={setNombres}
      onApellidosChange={setApellidos}
      onFechaNacimientoChange={setFechaNacimiento}
      onSexoChange={setSexo}
      onCorreoChange={setCorreo}
      onTelefono1Change={setTelefono1}
      onTelefono2Change={setTelefono2}
      onSubmitContacto={submitContacto}
      guardandoContacto={contacto.isPending}
      contactoMsg={contactoMsg}
      actual={actual}
      nueva={nueva}
      confirmacion={confirmacion}
      onActualChange={setActual}
      onNuevaChange={setNueva}
      onConfirmacionChange={setConfirmacion}
      onSubmitPassword={submitPassword}
      guardandoPassword={password.isPending}
      passwordMsg={passwordMsg}
    />
  )
}
