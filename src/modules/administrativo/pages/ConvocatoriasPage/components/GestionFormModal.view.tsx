import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import type { EstadoGestion, Gestion } from '@/modules/administrativo/types'

export interface GestionFormValues {
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  estado: EstadoGestion
}

const VACIO: GestionFormValues = {
  nombre: '',
  fecha_inicio: '',
  fecha_fin: '',
  estado: 'ACTIVA',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: GestionFormValues) => void
  loading: boolean
  error: string | null
  gestion: Gestion | null
}

export function GestionFormModal({ open, onClose, onSubmit, loading, error, gestion }: Props) {
  const editando = gestion != null
  const [values, setValues] = useState<GestionFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      gestion
        ? {
            nombre: gestion.nombre,
            fecha_inicio: gestion.fecha_inicio,
            fecha_fin: gestion.fecha_fin,
            estado: gestion.estado,
          }
        : VACIO,
    )
  }, [open, gestion])

  const set = <K extends keyof GestionFormValues>(key: K, value: GestionFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ ...values, nombre: values.nombre.trim() })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar gestión' : 'Nueva gestión'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button form="gestion-form" type="submit" loading={loading}>
            {editando ? 'Guardar' : 'Crear'}
          </Button>
        </>
      }
    >
      <form id="gestion-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre de la gestión"
          className="sm:col-span-2"
          value={values.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder="Ej: Gestión 2026"
          required
          autoFocus
        />
        <Input
          label="Fecha de inicio"
          type="date"
          value={values.fecha_inicio}
          onChange={(e) => set('fecha_inicio', e.target.value)}
          required
        />
        <Input
          label="Fecha de fin"
          type="date"
          value={values.fecha_fin}
          onChange={(e) => set('fecha_fin', e.target.value)}
          required
        />
        <Select
          label="Estado"
          className="sm:col-span-2"
          value={values.estado}
          onChange={(e) => set('estado', e.target.value as EstadoGestion)}
        >
          <option value="ACTIVA">Activa</option>
          <option value="CERRADA">Cerrada</option>
        </Select>

        {values.estado === 'ACTIVA' && (
          <p className="sm:col-span-2 text-xs text-slate-400">
            Solo puede existir una gestión activa: al activar ésta, las demás se cerrarán automáticamente.
          </p>
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
