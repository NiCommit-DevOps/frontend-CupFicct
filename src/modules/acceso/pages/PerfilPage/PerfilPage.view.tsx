import type { FormEvent } from 'react'
import { Badge, Button, Card, Input, PageHeader } from '@/shared/ui'
import type { Sexo, Usuario } from '@/modules/acceso/types'

interface Props {
  usuario: Usuario
  // datos personales
  nombres: string
  apellidos: string
  fechaNacimiento: string
  sexo: Sexo | ''
  correo: string
  telefono1: string
  telefono2: string
  onNombresChange: (v: string) => void
  onApellidosChange: (v: string) => void
  onFechaNacimientoChange: (v: string) => void
  onSexoChange: (v: Sexo | '') => void
  onCorreoChange: (v: string) => void
  onTelefono1Change: (v: string) => void
  onTelefono2Change: (v: string) => void
  onSubmitContacto: (e: FormEvent) => void
  guardandoContacto: boolean
  contactoMsg: { tipo: 'ok' | 'error'; texto: string } | null
  // password
  actual: string
  nueva: string
  confirmacion: string
  onActualChange: (v: string) => void
  onNuevaChange: (v: string) => void
  onConfirmacionChange: (v: string) => void
  onSubmitPassword: (e: FormEvent) => void
  guardandoPassword: boolean
  passwordMsg: { tipo: 'ok' | 'error'; texto: string } | null
}

const SEXO_LABEL: Record<string, string> = { M: 'Masculino', F: 'Femenino', Otro: 'Otro' }

function Mensaje({ msg }: { msg: { tipo: 'ok' | 'error'; texto: string } | null }) {
  if (!msg) return null
  const styles =
    msg.tipo === 'ok'
      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
      : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
  return <div className={`rounded-xl px-4 py-2.5 text-sm ${styles}`}>{msg.texto}</div>
}

export function PerfilPageView(props: Props) {
  const { usuario } = props

  return (
    <div className="flex flex-col">
      <PageHeader title="Mi perfil" subtitle="Gestiona tus datos y credenciales (CU18)" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Datos personales */}
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-xl font-bold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
              {`${usuario.nombres[0] ?? ''}${usuario.apellidos[0] ?? ''}`.toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {usuario.nombres} {usuario.apellidos}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge tone="brand">{usuario.rol?.nombre ?? 'Sin rol'}</Badge>
                <span className="text-xs text-slate-400">CI: {usuario.ci}</span>
              </div>
            </div>
          </div>

          <form onSubmit={props.onSubmitContacto} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombres"
                value={props.nombres}
                onChange={(e) => props.onNombresChange(e.target.value)}
                required
              />
              <Input
                label="Apellidos"
                value={props.apellidos}
                onChange={(e) => props.onApellidosChange(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha de nacimiento"
                type="date"
                value={props.fechaNacimiento}
                onChange={(e) => props.onFechaNacimientoChange(e.target.value)}
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sexo</span>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  value={props.sexo}
                  onChange={(e) => props.onSexoChange(e.target.value as Sexo | '')}
                >
                  <option value="">Sin especificar</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </label>
            </div>
            <Input
              label="Correo"
              type="email"
              value={props.correo}
              onChange={(e) => props.onCorreoChange(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Teléfono 1"
                value={props.telefono1}
                onChange={(e) => props.onTelefono1Change(e.target.value)}
              />
              <Input
                label="Teléfono 2"
                value={props.telefono2}
                onChange={(e) => props.onTelefono2Change(e.target.value)}
              />
            </div>
            <Mensaje msg={props.contactoMsg} />
            <Button type="submit" loading={props.guardandoContacto} className="self-start">
              Guardar datos
            </Button>
          </form>
        </Card>

        {/* Contraseña */}
        <Card className="p-6">
          <h2 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">
            Cambiar contraseña
          </h2>
          <form onSubmit={props.onSubmitPassword} className="flex flex-col gap-4">
            <Input
              label="Contraseña actual"
              type="password"
              autoComplete="current-password"
              value={props.actual}
              onChange={(e) => props.onActualChange(e.target.value)}
              required
            />
            <Input
              label="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={props.nueva}
              onChange={(e) => props.onNuevaChange(e.target.value)}
              required
            />
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={props.confirmacion}
              onChange={(e) => props.onConfirmacionChange(e.target.value)}
              required
            />
            <Mensaje msg={props.passwordMsg} />
            <Button type="submit" loading={props.guardandoPassword} className="self-start">
              Actualizar contraseña
            </Button>
          </form>
        </Card>
      </div>

      {/* Información de la cuenta (solo lectura) */}
      <Card className="mt-6 p-6">
        <h2 className="mb-5 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Información de la cuenta
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Dato label="CI" valor={usuario.ci} />
          <Dato label="Rol" valor={usuario.rol?.nombre ?? 'Sin rol'} />
          <Dato
            label="Sexo"
            valor={usuario.sexo ? SEXO_LABEL[usuario.sexo] ?? usuario.sexo : '—'}
          />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Estado</span>
            <span>
              {usuario.esta_activo ? (
                <Badge tone="success">Activo</Badge>
              ) : (
                <Badge tone="danger">Inhabilitado</Badge>
              )}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{valor}</span>
    </div>
  )
}
