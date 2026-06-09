import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import { GRUPO_TURNOS, type Grupo, type GrupoCatalogos } from '@/modules/academico/types'

export interface GrupoFormValues {
  sigla: string
  nombre: string
  turno: string
  capacidad_max: string
  id_aula: string
}

const VACIO: GrupoFormValues = {
  sigla: '',
  nombre: '',
  turno: 'Mañana',
  capacidad_max: '70',
  id_aula: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: GrupoFormValues) => void
  loading: boolean
  error: string | null
  catalogos?: GrupoCatalogos
  grupo: Grupo | null
}

export function GrupoFormModal({ open, onClose, onSubmit, loading, error, catalogos, grupo }: Props) {
  const editando = grupo != null
  const [values, setValues] = useState<GrupoFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      grupo
        ? {
            sigla: grupo.sigla,
            nombre: grupo.nombre,
            turno: grupo.turno ?? 'Mañana',
            capacidad_max: String(grupo.capacidad_max),
            id_aula: grupo.aula ? String(grupo.aula.id_aula) : '',
          }
        : VACIO,
    )
  }, [open, grupo])

  const set = <K extends keyof GrupoFormValues>(key: K, value: GrupoFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar grupo' : 'Nuevo grupo'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button form="grupo-form" type="submit" loading={loading}>
            {editando ? 'Guardar cambios' : 'Registrar'}
          </Button>
        </>
      }
    >
      <form id="grupo-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" autoComplete="off">
        <Input label="Sigla" value={values.sigla} onChange={(e) => set('sigla', e.target.value)} required placeholder="G1" autoComplete="off" />
        <Input label="Nombre" value={values.nombre} onChange={(e) => set('nombre', e.target.value)} required autoComplete="off" />
        <Select label="Turno" value={values.turno} onChange={(e) => set('turno', e.target.value)} required>
          {GRUPO_TURNOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Input
          label="Capacidad máxima"
          type="number"
          min={1}
          value={values.capacidad_max}
          onChange={(e) => set('capacidad_max', e.target.value)}
          required
        />
        <Select label="Aula (opcional)" className="sm:col-span-2" value={values.id_aula} onChange={(e) => set('id_aula', e.target.value)}>
          <option value="">— Sin aula asignada —</option>
          {catalogos?.aulas.map((a) => (
            <option key={a.id_aula} value={a.id_aula}>
              {a.nombre} (capacidad {a.capacidad})
            </option>
          ))}
        </Select>
        <p className="sm:col-span-2 -mt-1 text-xs text-slate-400">
          Si eliges un aula, su capacidad debe ser mayor o igual a la capacidad del grupo.
        </p>

        {error && (
          <div className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
