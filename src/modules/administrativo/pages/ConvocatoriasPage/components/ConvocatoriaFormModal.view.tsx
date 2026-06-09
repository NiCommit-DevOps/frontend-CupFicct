import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import type { Convocatoria, Gestion } from '@/modules/administrativo/types'

export interface ConvocatoriaFormValues {
  id_gestion: number | null
  nombre: string
  fecha_limite_inscripcion: string
}

const VACIO: ConvocatoriaFormValues = {
  id_gestion: null,
  nombre: '',
  fecha_limite_inscripcion: '',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: ConvocatoriaFormValues) => void
  loading: boolean
  error: string | null
  gestiones: Gestion[]
  convocatoria: Convocatoria | null
  /** Gestión preseleccionada al aperturar desde un filtro activo. */
  gestionPorDefecto?: number | null
}

export function ConvocatoriaFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  gestiones,
  convocatoria,
  gestionPorDefecto,
}: Props) {
  const editando = convocatoria != null
  const [values, setValues] = useState<ConvocatoriaFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      convocatoria
        ? {
            id_gestion: convocatoria.id_gestion,
            nombre: convocatoria.nombre,
            fecha_limite_inscripcion: convocatoria.fecha_limite_inscripcion,
          }
        : { ...VACIO, id_gestion: gestionPorDefecto ?? null },
    )
  }, [open, convocatoria, gestionPorDefecto])

  const set = <K extends keyof ConvocatoriaFormValues>(key: K, value: ConvocatoriaFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ ...values, nombre: values.nombre.trim() })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar convocatoria' : 'Aperturar convocatoria'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button form="convocatoria-form" type="submit" loading={loading}>
            {editando ? 'Guardar' : 'Aperturar'}
          </Button>
        </>
      }
    >
      <form id="convocatoria-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Gestión"
          value={values.id_gestion ?? ''}
          onChange={(e) => set('id_gestion', e.target.value ? Number(e.target.value) : null)}
          disabled={editando}
          required
        >
          <option value="">— Seleccionar gestión —</option>
          {gestiones.map((g) => (
            <option key={g.id_gestion} value={g.id_gestion}>
              {g.nombre}
              {g.estado === 'CERRADA' ? ' (cerrada)' : ''}
            </option>
          ))}
        </Select>
        <Input
          label="Nombre de la convocatoria"
          value={values.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder="Ej: Primer PSA 2026"
          required
          autoFocus
        />
        <Input
          label="Fecha límite de inscripción"
          type="date"
          value={values.fecha_limite_inscripcion}
          onChange={(e) => set('fecha_limite_inscripcion', e.target.value)}
          required
        />

        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
