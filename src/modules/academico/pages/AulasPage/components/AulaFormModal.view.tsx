import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import { AULA_MAX, AULA_MODULO, type Aula } from '@/modules/academico/types'

export interface AulaFormValues {
  piso: string
  numero: string
  capacidad: string
}

const VACIO: AulaFormValues = {
  piso: '1',
  numero: '1',
  capacidad: '70',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: AulaFormValues) => void
  loading: boolean
  error: string | null
  aula: Aula | null
}

export function AulaFormModal({ open, onClose, onSubmit, loading, error, aula }: Props) {
  const editando = aula != null
  const [values, setValues] = useState<AulaFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      aula
        ? {
            piso: String(aula.piso ?? 1),
            numero: String(aula.numero ?? 1),
            capacidad: String(aula.capacidad),
          }
        : VACIO,
    )
  }, [open, aula])

  const set = <K extends keyof AulaFormValues>(key: K, value: AulaFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  // Vista previa del nombre/ubicación que generará el backend.
  const pisoNum = Number(values.piso)
  const numeroNum = Number(values.numero)
  const nombrePreview =
    pisoNum > 0 && numeroNum > 0 ? `Aula ${AULA_MODULO}-${pisoNum}${numeroNum}` : '—'
  const ubicacionPreview = pisoNum > 0 ? `Piso ${pisoNum}` : '—'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar aula' : 'Nueva aula'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button form="aula-form" type="submit" loading={loading}>
            {editando ? 'Guardar' : 'Crear'}
          </Button>
        </>
      }
    >
      <form id="aula-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="Módulo" value={AULA_MODULO} readOnly disabled />
          <Input
            label="Piso"
            type="number"
            min={1}
            max={50}
            value={values.piso}
            onChange={(e) => set('piso', e.target.value)}
            required
            autoFocus
          />
          <Select label="Nº de aula" value={values.numero} onChange={(e) => set('numero', e.target.value)}>
            {Array.from({ length: AULA_MAX }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Capacidad (estudiantes)"
          type="number"
          min={1}
          value={values.capacidad}
          onChange={(e) => set('capacidad', e.target.value)}
          required
        />

        <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm dark:bg-brand-500/10">
          <p className="text-slate-600 dark:text-slate-300">
            Nombre: <span className="font-semibold text-brand-700 dark:text-brand-300">{nombrePreview}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-300">
            Ubicación: <span className="font-medium">{ubicacionPreview}</span>
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
