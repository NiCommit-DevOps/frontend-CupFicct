import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import { defaultPassword } from '@/lib/defaultPassword'
import type { Rol, Sexo, Usuario } from '@/modules/acceso/types'

export interface UsuarioFormValues {
  id_rol: number | null
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1: string
  telefono2: string
  fecha_nacimiento: string
  sexo: Sexo | ''
  contrasena: string
}

const VACIO: UsuarioFormValues = {
  id_rol: null,
  ci: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono1: '',
  telefono2: '',
  fecha_nacimiento: '',
  sexo: '',
  contrasena: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: UsuarioFormValues) => void
  loading: boolean
  error: string | null
  roles: Rol[]
  usuario: Usuario | null
}

export function UsuarioFormModal({ open, onClose, onSubmit, loading, error, roles, usuario }: Props) {
  const editando = usuario != null
  const [values, setValues] = useState<UsuarioFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      usuario
        ? {
            id_rol: usuario.rol?.id_rol ?? null,
            ci: usuario.ci,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            telefono1: usuario.telefono1 ?? '',
            telefono2: usuario.telefono2 ?? '',
            fecha_nacimiento: usuario.fecha_nacimiento ?? '',
            sexo: usuario.sexo ?? '',
            contrasena: '',
          }
        : VACIO,
    )
  }, [open, usuario])

  const set = <K extends keyof UsuarioFormValues>(key: K, value: UsuarioFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  // Si el rol seleccionado es Docente, su contraseña sigue el patrón por defecto.
  const rolSeleccionado = roles.find((r) => r.id_rol === values.id_rol)
  const esDocente = rolSeleccionado?.nombre === 'Docente'
  const passwordDocente = esDocente ? defaultPassword(values.apellidos, values.ci) : ''

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar usuario' : 'Nuevo usuario'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button form="usuario-form" type="submit" loading={loading}>
            {editando ? 'Guardar cambios' : 'Registrar'}
          </Button>
        </>
      }
    >
      <form id="usuario-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" autoComplete="off">
        <Input label="Nombres" value={values.nombres} onChange={(e) => set('nombres', e.target.value)} required autoComplete="off" />
        <Input label="Apellidos" value={values.apellidos} onChange={(e) => set('apellidos', e.target.value)} required autoComplete="off" />
        <Input label="CI" value={values.ci} onChange={(e) => set('ci', e.target.value)} required autoComplete="off" />
        <Input label="Correo" type="email" value={values.correo} onChange={(e) => set('correo', e.target.value)} required autoComplete="off" />
        <Input label="Teléfono 1" value={values.telefono1} onChange={(e) => set('telefono1', e.target.value)} autoComplete="off" />
        <Input label="Teléfono 2" value={values.telefono2} onChange={(e) => set('telefono2', e.target.value)} autoComplete="off" />
        <Input
          label="Fecha de nacimiento"
          type="date"
          value={values.fecha_nacimiento}
          onChange={(e) => set('fecha_nacimiento', e.target.value)}
          required
        />
        <Select label="Sexo" value={values.sexo} onChange={(e) => set('sexo', e.target.value as Sexo | '')}>
          <option value="">— Seleccionar —</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="Otro">Otro</option>
        </Select>
        <Select
          label="Rol"
          value={values.id_rol ?? ''}
          onChange={(e) => set('id_rol', e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">— Sin rol —</option>
          {roles.map((rol) => (
            <option key={rol.id_rol} value={rol.id_rol}>
              {rol.nombre}
            </option>
          ))}
        </Select>
        <Input
          label={editando ? 'Contraseña (dejar en blanco para mantener)' : 'Contraseña'}
          type="password"
          value={values.contrasena}
          onChange={(e) => set('contrasena', e.target.value)}
          placeholder="••••••••"
          required={!editando}
          autoComplete="new-password"
        />

        {passwordDocente && (
          <div className="sm:col-span-2 rounded-xl bg-brand-50 px-4 py-2.5 text-sm dark:bg-brand-500/10">
            <p className="text-slate-600 dark:text-slate-300">
              Contraseña por defecto del docente:{' '}
              <span className="font-semibold text-brand-700 dark:text-brand-300">{passwordDocente}</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Es la contraseña inicial generada al crear el docente. Si la cambió, ya no coincide
              (las contraseñas se guardan cifradas y no pueden mostrarse). Deja el campo vacío para mantenerla.
            </p>
          </div>
        )}

        {error && (
          <div className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
