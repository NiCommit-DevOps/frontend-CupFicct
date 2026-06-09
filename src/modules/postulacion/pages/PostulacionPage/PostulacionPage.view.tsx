import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Select, Spinner } from '@/shared/ui'
import { PublicNavbar } from '../../components/PublicNavbar.view'
import { PublicFooter } from '../../components/PublicFooter.view'
import type { PostulacionData, PostulacionPayload } from '../../types'

export interface PostulacionFormValues {
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1: string
  telefono2: string
  fecha_nacimiento: string
  sexo: string
  direccion: string
  id_unidad: string
  procedencia: string
  anio_egreso: string
  titulo_archivo: File | null
  otros: string
  id_carrera: string
  id_carrera_2: string
  turno_preferencia: string
}

const VACIO: PostulacionFormValues = {
  ci: '', nombres: '', apellidos: '', correo: '', telefono1: '', telefono2: '',
  fecha_nacimiento: '', sexo: '', direccion: '', id_unidad: '', procedencia: '',
  anio_egreso: '', titulo_archivo: null, otros: '', id_carrera: '', id_carrera_2: '', turno_preferencia: '',
}

interface Props {
  datos?: PostulacionData
  loading: boolean
  submitting: boolean
  error: string | null
  codigoTramite: number | null
  onSubmit: (payload: PostulacionPayload) => void
}

export function PostulacionPageView({ datos, loading, submitting, error, codigoTramite, onSubmit }: Props) {
  const [values, setValues] = useState<PostulacionFormValues>(VACIO)
  const set = <K extends keyof PostulacionFormValues>(key: K, value: PostulacionFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const convocatoria = datos?.convocatoria ?? null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({
      ci: values.ci.trim(),
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      correo: values.correo.trim(),
      telefono1: values.telefono1.trim(),
      telefono2: values.telefono2.trim() || null,
      fecha_nacimiento: values.fecha_nacimiento,
      sexo: values.sexo,
      direccion: values.direccion.trim(),
      id_unidad: Number(values.id_unidad),
      procedencia: values.procedencia.trim(),
      titulo_archivo: values.titulo_archivo,
      anio_egreso: values.anio_egreso ? Number(values.anio_egreso) : null,
      otros: values.otros.trim() || null,
      id_carrera: Number(values.id_carrera),
      id_carrera_2: values.id_carrera_2 ? Number(values.id_carrera_2) : null,
      turno_preferencia: values.turno_preferencia,
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-panel-bgLight text-slate-600 dark:bg-panel-bgDark dark:text-slate-300">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner className="h-8 w-8" />
          </div>
        ) : codigoTramite != null ? (
          /* Pantalla de éxito */
          <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/40 bg-white p-8 text-center shadow-xl dark:border-emerald-500/30 dark:bg-panel-dark">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">¡Postulación enviada!</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Tu solicitud quedó registrada. Espera la confirmación por correo electrónico del administrador o coordinador académico. Una vez aprobado, recibirás instrucciones para proceder con el pago de inscripción.
            </p>
            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-4 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tu código de trámite</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">{codigoTramite}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Guárdalo: lo necesitarás para dar seguimiento a tu trámite.</p>
            </div>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Volver al inicio
            </Link>
          </div>
        ) : !convocatoria ? (
          /* Sin convocatoria abierta */
          <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700/50 dark:bg-panel-dark">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">No hay convocatorias abiertas</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              En este momento no hay un proceso de admisión con inscripciones abiertas. Vuelve a
              consultar cuando se habilite una nueva convocatoria.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          /* Formulario de postulación */
          <>
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-white">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Volver al inicio
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Formulario de Postulación</h1>
            <div className="mt-3 rounded-xl border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm">
              <span className="text-slate-600 dark:text-slate-300">Convocatoria: </span>
              <span className="font-semibold text-brand-600 dark:text-brand-300">{convocatoria.nombre}</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-8" autoComplete="off">
              {/* Datos personales */}
              <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Datos personales</legend>
                <Input label="Nombres" value={values.nombres} onChange={(e) => set('nombres', e.target.value)} required />
                <Input label="Apellidos" value={values.apellidos} onChange={(e) => set('apellidos', e.target.value)} required />
                <Input label="CI" value={values.ci} onChange={(e) => set('ci', e.target.value)} required />
                <Input label="Correo" type="email" value={values.correo} onChange={(e) => set('correo', e.target.value)} required />
                <Input label="Teléfono" value={values.telefono1} onChange={(e) => set('telefono1', e.target.value)} required />
                <Input label="Teléfono 2 (opcional)" value={values.telefono2} onChange={(e) => set('telefono2', e.target.value)} />
                <Input label="Fecha de nacimiento" type="date" value={values.fecha_nacimiento} onChange={(e) => set('fecha_nacimiento', e.target.value)} required />
                <Select label="Sexo" value={values.sexo} onChange={(e) => set('sexo', e.target.value)} required>
                  <option value="">— Seleccionar —</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="Otro">Otro</option>
                </Select>
                <Input label="Dirección" className="sm:col-span-2" value={values.direccion} onChange={(e) => set('direccion', e.target.value)} required />
              </fieldset>

              {/* Datos educativos */}
              <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Datos educativos</legend>
                <Select label="Colegio de procedencia" value={values.id_unidad} onChange={(e) => set('id_unidad', e.target.value)} required>
                  <option value="">— Seleccionar —</option>
                  {datos?.unidades.map((u) => (
                    <option key={u.id_unidad} value={u.id_unidad}>{u.nombre}</option>
                  ))}
                </Select>
                <Input label="Ciudad" value={values.procedencia} onChange={(e) => set('procedencia', e.target.value)} required />
                <Input label="Año de egreso (opcional)" type="number" min={1950} max={new Date().getFullYear()} value={values.anio_egreso} onChange={(e) => set('anio_egreso', e.target.value)} />
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    Título de bachiller (PDF o imagen)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-600 hover:file:bg-brand-500/20 dark:text-slate-300 dark:file:text-brand-300"
                    onChange={(e) => set('titulo_archivo', e.target.files?.[0] ?? null)}
                  />
                  <span className="text-xs text-slate-400">
                    {values.titulo_archivo
                      ? `Documento seleccionado: ${values.titulo_archivo.name}`
                      : 'Adjunta tu título de bachiller (opcional). Si lo subes, quedará registrado como "Sí".'}
                  </span>
                </div>
              </fieldset>

              {/* Carrera y turno */}
              <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Carrera y turno</legend>
                <Select label="Carrera (1ª opción)" value={values.id_carrera} onChange={(e) => set('id_carrera', e.target.value)} required>
                  <option value="">— Seleccionar —</option>
                  {datos?.carreras.map((c) => (
                    <option key={c.id_carrera} value={c.id_carrera}>{c.nombre}</option>
                  ))}
                </Select>
                <Select label="Carrera (2ª opción, opcional)" value={values.id_carrera_2} onChange={(e) => set('id_carrera_2', e.target.value)}>
                  <option value="">— Ninguna —</option>
                  {(datos?.carreras ?? [])
                    .filter((c) => String(c.id_carrera) !== values.id_carrera)
                    .map((c) => (
                      <option key={c.id_carrera} value={c.id_carrera}>{c.nombre}</option>
                    ))}
                </Select>
                <Select label="Turno de preferencia" value={values.turno_preferencia} onChange={(e) => set('turno_preferencia', e.target.value)} required>
                  <option value="">— Seleccionar —</option>
                  {(datos?.turnos ?? []).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
                <Input label="Observaciones u otros datos (opcional)" className="sm:col-span-2" value={values.otros} onChange={(e) => set('otros', e.target.value)} />
              </fieldset>

              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:text-amber-300">
                El pago de inscripción <span className="font-semibold">se realiza a través de la pasarela de pago</span> una vez que el administrador o coordinador académico apruebe tu solicitud. Recibirás un correo electrónico con las instrucciones.
              </div>

              {error && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
                  {error}
                </div>
              )}

              <Button type="submit" loading={submitting} className="w-full py-3.5 text-base">
                Enviar postulación
              </Button>
            </form>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  )
}
