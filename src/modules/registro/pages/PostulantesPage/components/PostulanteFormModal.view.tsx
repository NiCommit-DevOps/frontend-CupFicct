import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import { defaultPassword } from '@/lib/defaultPassword'
import type { Sexo } from '@/modules/acceso/types'
import type { InscripcionCatalogos, Postulante } from '@/modules/registro/types'

export interface PostulanteFormValues {
  // Datos del usuario base.
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1: string
  telefono2: string
  fecha_nacimiento: string
  sexo: Sexo | ''
  direccion: string
  // Datos educativos.
  id_unidad: string
  procedencia: string
  anio_egreso: string
  /** Documento del título de bachiller (PDF o imagen); su presencia define el sí/no. */
  titulo_archivo: File | null
  otros: string
  // Solicitud de admisión.
  id_carrera: string
  id_carrera_2: string
  turno_preferencia: string
}

const VACIO: PostulanteFormValues = {
  ci: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono1: '',
  telefono2: '',
  fecha_nacimiento: '',
  sexo: '',
  direccion: '',
  id_unidad: '',
  procedencia: '',
  anio_egreso: '',
  titulo_archivo: null,
  otros: '',
  id_carrera: '',
  id_carrera_2: '',
  turno_preferencia: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: PostulanteFormValues) => void
  loading: boolean
  error: string | null
  catalogos?: InscripcionCatalogos
  postulante: Postulante | null
}

export function PostulanteFormModal({ open, onClose, onSubmit, loading, error, catalogos, postulante }: Props) {
  const editando = postulante != null
  const [values, setValues] = useState<PostulanteFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      postulante
        ? {
            ci: postulante.usuario?.ci ?? '',
            nombres: postulante.usuario?.nombres ?? '',
            apellidos: postulante.usuario?.apellidos ?? '',
            correo: postulante.usuario?.correo ?? '',
            telefono1: postulante.usuario?.telefono1 ?? '',
            telefono2: postulante.usuario?.telefono2 ?? '',
            fecha_nacimiento: postulante.usuario?.fecha_nacimiento ?? '',
            sexo: postulante.usuario?.sexo ?? '',
            direccion: postulante.direccion ?? '',
            id_unidad: postulante.unidad_educativa ? String(postulante.unidad_educativa.id_unidad) : '',
            procedencia: postulante.procedencia ?? '',
            anio_egreso: postulante.anio_egreso != null ? String(postulante.anio_egreso) : '',
            titulo_archivo: null,
            otros: postulante.otros ?? '',
            id_carrera: postulante.inscripcion?.carreras[0]
              ? String(postulante.inscripcion.carreras[0].id_carrera)
              : '',
            id_carrera_2: postulante.inscripcion?.carreras[1]
              ? String(postulante.inscripcion.carreras[1].id_carrera)
              : '',
            turno_preferencia: postulante.inscripcion?.turno_preferencia ?? '',
          }
        : VACIO,
    )
  }, [open, postulante])

  const set = <K extends keyof PostulanteFormValues>(key: K, value: PostulanteFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const convocatoria = catalogos?.convocatoria ?? null
  // Solo el alta requiere una convocatoria abierta; al editar la inscripción ya existe.
  const bloqueado = !editando && !convocatoria

  // Vista previa de la contraseña por defecto que generará el backend (solo al crear).
  const passwordPreview = defaultPassword(values.apellidos, values.ci) || '—'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Modificar postulante' : 'Nuevo postulante'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button form="postulante-form" type="submit" loading={loading} disabled={bloqueado}>
            {editando ? 'Guardar cambios' : 'Registrar'}
          </Button>
        </>
      }
    >
      {bloqueado ? (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          No hay una convocatoria abierta en una gestión activa. Abre una convocatoria (CU19) antes de
          inscribir postulantes.
        </div>
      ) : (
        <form id="postulante-form" onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
          {!editando && convocatoria && (
            <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm dark:bg-brand-500/10">
              <p className="text-slate-600 dark:text-slate-300">
                Convocatoria:{' '}
                <span className="font-semibold text-brand-700 dark:text-brand-300">{convocatoria.nombre}</span>
              </p>
              {convocatoria.fecha_limite_inscripcion && (
                <p className="text-xs text-slate-400">
                  Fecha límite de inscripción: {convocatoria.fecha_limite_inscripcion}
                </p>
              )}
            </div>
          )}

          {/* Datos personales */}
          <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Datos personales
            </legend>
            <Input label="Nombres" value={values.nombres} onChange={(e) => set('nombres', e.target.value)} required autoComplete="off" />
            <Input label="Apellidos" value={values.apellidos} onChange={(e) => set('apellidos', e.target.value)} required autoComplete="off" />
            <Input label="CI" value={values.ci} onChange={(e) => set('ci', e.target.value)} required autoComplete="off" />
            <Input label="Correo" type="email" value={values.correo} onChange={(e) => set('correo', e.target.value)} required autoComplete="off" />
            <Input label="Teléfono" value={values.telefono1} onChange={(e) => set('telefono1', e.target.value)} required autoComplete="off" />
            <Input label="Teléfono 2 (opcional)" value={values.telefono2} onChange={(e) => set('telefono2', e.target.value)} autoComplete="off" />
            <Input
              label="Fecha de nacimiento"
              type="date"
              value={values.fecha_nacimiento}
              onChange={(e) => set('fecha_nacimiento', e.target.value)}
              required
            />
            <Select label="Sexo" value={values.sexo} onChange={(e) => set('sexo', e.target.value as Sexo | '')} required>
              <option value="">— Seleccionar —</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="Otro">Otro</option>
            </Select>
            <Input label="Dirección" className="sm:col-span-2" value={values.direccion} onChange={(e) => set('direccion', e.target.value)} required autoComplete="off" />
            {!editando && (
              <div className="sm:col-span-2 rounded-xl bg-brand-50 px-4 py-3 text-sm dark:bg-brand-500/10">
                <p className="text-slate-600 dark:text-slate-300">
                  Contraseña por defecto:{' '}
                  <span className="font-semibold text-brand-700 dark:text-brand-300">{passwordPreview}</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Se genera automáticamente con las iniciales de los apellidos y el CI. El postulante podrá cambiarla luego.
                </p>
              </div>
            )}
            {editando && (
              <p className="sm:col-span-2 -mt-1 text-xs text-slate-400">
                La contraseña no se modifica aquí (la cambia el postulante desde su perfil, CU18).
              </p>
            )}
          </fieldset>

          {/* Datos educativos */}
          <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Datos educativos
            </legend>
            <Select label="Colegio de procedencia" value={values.id_unidad} onChange={(e) => set('id_unidad', e.target.value)} required>
              <option value="">— Seleccionar —</option>
              {catalogos?.unidades.map((u) => (
                <option key={u.id_unidad} value={u.id_unidad}>
                  {u.nombre}
                </option>
              ))}
            </Select>
            <Input label="Ciudad" value={values.procedencia} onChange={(e) => set('procedencia', e.target.value)} required autoComplete="off" />
            <Input
              label="Año de egreso (opcional)"
              type="number"
              min={1950}
              max={new Date().getFullYear()}
              value={values.anio_egreso}
              onChange={(e) => set('anio_egreso', e.target.value)}
            />
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Título de bachiller (PDF o imagen)
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:text-slate-300 dark:file:bg-brand-500/10 dark:file:text-brand-300"
                onChange={(e) => set('titulo_archivo', e.target.files?.[0] ?? null)}
              />
              <span className="text-xs text-slate-400">
                {values.titulo_archivo
                  ? `Se adjuntará: ${values.titulo_archivo.name}`
                  : editando && postulante?.tiene_titulo_archivo
                    ? 'Ya tiene un documento cargado. Sube uno nuevo solo si deseas reemplazarlo.'
                    : 'Si lo subes, el título de bachiller queda como "Sí"; si no, como "No".'}
              </span>
            </div>
          </fieldset>

          {/* Solicitud de admisión */}
          <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Carrera y turno
            </legend>
            <Select label="Carrera (1ª opción)" value={values.id_carrera} onChange={(e) => set('id_carrera', e.target.value)} required>
              <option value="">— Seleccionar —</option>
              {catalogos?.carreras.map((c) => (
                <option key={c.id_carrera} value={c.id_carrera}>
                  {c.nombre}
                </option>
              ))}
            </Select>
            <Select
              label="Carrera (2ª opción, opcional)"
              value={values.id_carrera_2}
              onChange={(e) => set('id_carrera_2', e.target.value)}
            >
              <option value="">— Ninguna —</option>
              {catalogos?.carreras
                .filter((c) => String(c.id_carrera) !== values.id_carrera)
                .map((c) => (
                  <option key={c.id_carrera} value={c.id_carrera}>
                    {c.nombre}
                  </option>
                ))}
            </Select>
            <Select label="Turno de preferencia" value={values.turno_preferencia} onChange={(e) => set('turno_preferencia', e.target.value)} required>
              <option value="">— Seleccionar —</option>
              {(catalogos?.turnos ?? []).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </fieldset>

          {/* Otros */}
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Otros
            </legend>
            <Input
              label="Observaciones u otros datos (opcional)"
              value={values.otros}
              onChange={(e) => set('otros', e.target.value)}
              autoComplete="off"
            />
          </fieldset>

          {error && (
            <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          )}
        </form>
      )}
    </Modal>
  )
}
