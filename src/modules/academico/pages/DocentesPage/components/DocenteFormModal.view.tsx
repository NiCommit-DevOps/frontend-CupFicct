import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import { defaultPassword } from '@/lib/defaultPassword'
import type { Sexo } from '@/modules/acceso/types'
import type { Materia, Docente, DocenteGrupo } from '@/modules/academico/types'
import type { Convocatoria } from '@/modules/administrativo/types'

/** Tope de grupos por docente (regla del negocio: de 1 a 4 grupos). */
const MAX_GRUPOS = 4

/** Una fila del repetidor: una carrera (texto libre) con sus áreas (materias). */
export interface CarreraForm {
  carrera: string
  areas: number[]
}

export interface DocenteFormValues {
  // Datos del usuario base (solo en alta).
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1: string
  telefono2: string
  fecha_nacimiento: string
  sexo: Sexo | ''
  // Perfil docente.
  profesion: string
  carga_horaria: string
  especialidad: string
  tiene_maestria: boolean
  tiene_diplomado: boolean
  // Carreras (texto libre) con sus áreas; la unión define qué puede enseñar.
  carreras: CarreraForm[]
  // Materias que desea enseñar (subconjunto de la unión de áreas).
  materias: number[]
  convocatorias: number[]
  grupos: number[]
}

const VACIO: DocenteFormValues = {
  ci: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono1: '',
  telefono2: '',
  fecha_nacimiento: '',
  sexo: '',
  profesion: '',
  carga_horaria: '',
  especialidad: '',
  tiene_maestria: false,
  tiene_diplomado: false,
  carreras: [],
  materias: [],
  convocatorias: [],
  grupos: [],
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: DocenteFormValues) => void
  loading: boolean
  error: string | null
  materias: Materia[]
  convocatorias: Convocatoria[]
  grupos: DocenteGrupo[]
  docente: Docente | null
}

export function DocenteFormModal({ open, onClose, onSubmit, loading, error, materias, convocatorias, grupos, docente }: Props) {
  const editando = docente != null
  const [values, setValues] = useState<DocenteFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      docente
        ? {
            ci: docente.usuario?.ci ?? '',
            nombres: docente.usuario?.nombres ?? '',
            apellidos: docente.usuario?.apellidos ?? '',
            correo: docente.usuario?.correo ?? '',
            telefono1: docente.usuario?.telefono1 ?? '',
            telefono2: docente.usuario?.telefono2 ?? '',
            fecha_nacimiento: docente.usuario?.fecha_nacimiento ?? '',
            sexo: docente.usuario?.sexo ?? '',
            profesion: docente.profesion ?? '',
            carga_horaria: docente.carga_horaria != null ? String(docente.carga_horaria) : '',
            especialidad: docente.especialidad ?? '',
            tiene_maestria: docente.tiene_maestria,
            tiene_diplomado: docente.tiene_diplomado,
            carreras:
              docente.carreras?.map((c) => ({
                carrera: c.carrera,
                areas: c.areas.map((a) => a.id_materia),
              })) ?? [],
            materias: docente.materias?.map((m) => m.id_materia) ?? [],
            convocatorias: docente.convocatorias?.map((c) => c.id_convocatoria) ?? [],
            grupos: docente.grupos?.map((g) => g.id_grupo) ?? [],
          }
        : {
            ...VACIO,
            // En alta, preselecciona las convocatorias abiertas (proceso vigente).
            convocatorias: convocatorias.filter((c) => c.estado === 'ABIERTA').map((c) => c.id_convocatoria),
          },
    )
  }, [open, docente, convocatorias])

  const set = <K extends keyof DocenteFormValues>(key: K, value: DocenteFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  // --- Repetidor de carreras (texto libre) + sus áreas (materias) ---
  const agregarCarrera = () =>
    setValues((prev) => ({ ...prev, carreras: [...prev.carreras, { carrera: '', areas: [] }] }))

  const quitarCarrera = (index: number) =>
    setValues((prev) => ({ ...prev, carreras: prev.carreras.filter((_, i) => i !== index) }))

  const setCarreraNombre = (index: number, nombre: string) =>
    setValues((prev) => ({
      ...prev,
      carreras: prev.carreras.map((c, i) => (i === index ? { ...c, carrera: nombre } : c)),
    }))

  const toggleArea = (index: number, idMateria: number) =>
    setValues((prev) => ({
      ...prev,
      carreras: prev.carreras.map((c, i) =>
        i === index
          ? {
              ...c,
              areas: c.areas.includes(idMateria)
                ? c.areas.filter((a) => a !== idMateria)
                : [...c.areas, idMateria],
            }
          : c,
      ),
    }))

  // Unión de áreas de todas las carreras = materias que el docente PUEDE enseñar.
  const union = useMemo(() => {
    const s = new Set<number>()
    values.carreras.forEach((c) => c.areas.forEach((a) => s.add(a)))
    return s
  }, [values.carreras])

  // Si una materia "que desea enseñar" deja de estar en la unión, se descarta.
  useEffect(() => {
    setValues((prev) => {
      const filtradas = prev.materias.filter((m) => union.has(m))
      return filtradas.length === prev.materias.length ? prev : { ...prev, materias: filtradas }
    })
  }, [union])

  const toggleMateriaEnsena = (id: number) =>
    setValues((prev) => {
      if (!union.has(id)) return prev
      return {
        ...prev,
        materias: prev.materias.includes(id)
          ? prev.materias.filter((m) => m !== id)
          : [...prev.materias, id],
      }
    })

  const toggleConvocatoria = (id: number) =>
    setValues((prev) => ({
      ...prev,
      convocatorias: prev.convocatorias.includes(id)
        ? prev.convocatorias.filter((c) => c !== id)
        : [...prev.convocatorias, id],
    }))

  // Regla del negocio: un docente puede dictar de 1 a 4 grupos.
  const toggleGrupo = (id: number) =>
    setValues((prev) => {
      if (prev.grupos.includes(id)) {
        return { ...prev, grupos: prev.grupos.filter((g) => g !== id) }
      }
      if (prev.grupos.length >= MAX_GRUPOS) return prev
      return { ...prev, grupos: [...prev.grupos, id] }
    })

  // Vista previa de la contraseña por defecto que generará el backend.
  const passwordPreview = defaultPassword(values.apellidos, values.ci) || '—'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar docente' : 'Nuevo docente'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button form="docente-form" type="submit" loading={loading}>
            {editando ? 'Guardar cambios' : 'Registrar'}
          </Button>
        </>
      }
    >
      <form id="docente-form" onSubmit={handleSubmit} className="flex flex-col gap-5" autoComplete="off">
        {/* Datos personales */}
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Datos personales
          </legend>
          <Input label="Nombres" value={values.nombres} onChange={(e) => set('nombres', e.target.value)} required disabled={editando} autoComplete="off" />
          <Input label="Apellidos" value={values.apellidos} onChange={(e) => set('apellidos', e.target.value)} required disabled={editando} autoComplete="off" />
          <Input label="CI" value={values.ci} onChange={(e) => set('ci', e.target.value)} required disabled={editando} autoComplete="off" />
          <Input label="Correo" type="email" value={values.correo} onChange={(e) => set('correo', e.target.value)} required disabled={editando} autoComplete="off" />
          {!editando && (
            <>
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
              <div className="sm:col-span-2 rounded-xl bg-brand-50 px-4 py-3 text-sm dark:bg-brand-500/10">
                <p className="text-slate-600 dark:text-slate-300">
                  Contraseña por defecto:{' '}
                  <span className="font-semibold text-brand-700 dark:text-brand-300">{passwordPreview}</span>
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Se genera automáticamente con las iniciales de los apellidos y el CI. El docente podrá cambiarla luego.
                </p>
              </div>
            </>
          )}
        </fieldset>

        {editando && (
          <p className="-mt-2 text-xs text-slate-400">
            Los datos personales se editan desde el módulo de Usuarios (CU02).
          </p>
        )}

        {/* Perfil docente */}
        <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Perfil docente
          </legend>
          <p className="sm:col-span-2 -mt-1 text-xs text-slate-400">
            Requisitos de contratación: ser profesional del área y contar con maestría y diplomado en educación superior.
          </p>
          <Input label="Profesión" value={values.profesion} onChange={(e) => set('profesion', e.target.value)} required />
          <Input
            label="Carga horaria (h)"
            type="number"
            min={0}
            value={values.carga_horaria}
            onChange={(e) => set('carga_horaria', e.target.value)}
          />
          <Input
            label="Especialidad"
            className="sm:col-span-2"
            value={values.especialidad}
            onChange={(e) => set('especialidad', e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
              checked={values.tiene_maestria}
              onChange={(e) => set('tiene_maestria', e.target.checked)}
              required
            />
            Tiene maestría
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
              checked={values.tiene_diplomado}
              onChange={(e) => set('tiene_diplomado', e.target.checked)}
              required
            />
            Tiene diplomado
          </label>
        </fieldset>

        {/* Carreras (texto libre) y sus áreas. La unión de áreas = lo que puede enseñar. */}
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Carreras y áreas (profesión del docente)
          </legend>
          <p className="-mt-1 text-xs text-slate-400">
            Escribe la carrera del docente y marca sus áreas. La unión de todas las áreas define
            las materias que podrá enseñar.
          </p>

          {values.carreras.length === 0 && (
            <p className="text-sm text-slate-400">
              Aún no agregaste carreras. Usa "Agregar carrera".
            </p>
          )}

          {values.carreras.map((bloque, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border border-slate-200/60 p-3 dark:border-slate-700/40"
            >
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    label="Carrera"
                    placeholder="Ej. Ing. Informática"
                    value={bloque.carrera}
                    onChange={(e) => setCarreraNombre(index, e.target.value)}
                  />
                </div>
                <Button variant="danger" size="sm" type="button" onClick={() => quitarCarrera(index)}>
                  Quitar
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-400">Áreas</span>
                {materias.length === 0 ? (
                  <p className="text-sm text-slate-400">No hay materias registradas.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {materias.map((m) => (
                      <label
                        key={m.id_materia}
                        className="flex items-center gap-2 rounded-xl border border-slate-200/60 px-3 py-2 text-sm text-slate-600 dark:border-slate-700/40 dark:text-slate-300"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                          checked={bloque.areas.includes(m.id_materia)}
                          onChange={() => toggleArea(index, m.id_materia)}
                        />
                        {m.nombre}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div>
            <Button variant="secondary" size="sm" type="button" onClick={agregarCarrera}>
              + Agregar carrera
            </Button>
          </div>
        </fieldset>

        {/* Materias que desea enseñar (solo dentro de la unión de áreas). */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Materias que desea enseñar
          </legend>
          {union.size === 0 ? (
            <p className="text-sm text-slate-400">
              Primero marca las áreas en alguna carrera; solo podrás elegir materias dentro de esas áreas.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {materias.map((m) => {
                const habilitada = union.has(m.id_materia)
                return (
                  <label
                    key={m.id_materia}
                    className={`flex items-center gap-2 rounded-xl border border-slate-200/60 px-3 py-2 text-sm text-slate-600 dark:border-slate-700/40 dark:text-slate-300 ${
                      habilitada ? '' : 'opacity-40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                      checked={values.materias.includes(m.id_materia)}
                      disabled={!habilitada}
                      onChange={() => toggleMateriaEnsena(m.id_materia)}
                    />
                    {m.nombre}
                  </label>
                )
              })}
            </div>
          )}
        </fieldset>

        {/* Convocatorias en las que participa */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Convocatorias asignadas
          </legend>
          {convocatorias.length === 0 ? (
            <p className="text-sm text-slate-400">No hay convocatorias registradas.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {convocatorias.map((c) => (
                <label
                  key={c.id_convocatoria}
                  className="flex items-center gap-2 rounded-xl border border-slate-200/60 px-3 py-2 text-sm text-slate-600 dark:border-slate-700/40 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                    checked={values.convocatorias.includes(c.id_convocatoria)}
                    onChange={() => toggleConvocatoria(c.id_convocatoria)}
                  />
                  {c.nombre}
                </label>
              ))}
            </div>
          )}
        </fieldset>

        {/* Grupos asignados (de 1 a 4 grupos por docente) */}
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Grupos asignados ({values.grupos.length}/{MAX_GRUPOS})
          </legend>
          {grupos.length === 0 ? (
            <p className="text-sm text-slate-400">No hay grupos registrados.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {grupos.map((g) => {
                const seleccionado = values.grupos.includes(g.id_grupo)
                const bloqueado = !seleccionado && values.grupos.length >= MAX_GRUPOS
                return (
                  <label
                    key={g.id_grupo}
                    className={`flex items-center gap-2 rounded-xl border border-slate-200/60 px-3 py-2 text-sm text-slate-600 dark:border-slate-700/40 dark:text-slate-300 ${
                      bloqueado ? 'opacity-40' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500"
                      checked={seleccionado}
                      disabled={bloqueado}
                      onChange={() => toggleGrupo(g.id_grupo)}
                    />
                    {g.sigla} · {g.nombre}
                  </label>
                )
              })}
            </div>
          )}
          <p className="text-xs text-slate-400">Un docente puede dictar de 1 a 4 grupos.</p>
        </fieldset>

        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
