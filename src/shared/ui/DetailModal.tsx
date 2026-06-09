import type { ReactNode } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface DetailField {
  /** Etiqueta del atributo. */
  label: string
  /** Valor a mostrar. Si es null/undefined/'' se muestra un guion. */
  value: ReactNode
  /** Ocupa el ancho completo (dos columnas) en pantallas grandes. */
  full?: boolean
}

interface Props {
  open: boolean
  onClose: () => void
  title: string
  fields: DetailField[]
}

/**
 * Modal de solo lectura para "Ver" un registro: misma envoltura que los modales
 * de edición, pero en lugar de un formulario muestra los atributos como pares
 * etiqueta/valor. Reutilizable por todos los CRUD del sistema.
 */
export function DetailModal({ open, onClose, title, fields }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <Button variant="secondary" onClick={onClose} type="button">
          Cerrar
        </Button>
      }
    >
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const vacio = f.value === null || f.value === undefined || f.value === ''
          return (
            <div key={f.label} className={f.full ? 'sm:col-span-2' : undefined}>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{f.label}</dt>
              <dd className="mt-1 break-words text-sm text-slate-700 dark:text-slate-200">
                {vacio ? <span className="text-slate-300 dark:text-slate-600">—</span> : f.value}
              </dd>
            </div>
          )
        })}
      </dl>
    </Modal>
  )
}
