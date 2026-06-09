import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal } from '@/shared/ui'
import type { Rol } from '@/modules/acceso/types'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (nombre: string) => void
  loading: boolean
  error: string | null
  rol: Rol | null
}

export function RolFormModal({ open, onClose, onSubmit, loading, error, rol }: Props) {
  const editando = rol != null
  const [nombre, setNombre] = useState('')

  useEffect(() => {
    if (open) setNombre(rol?.nombre ?? '')
  }, [open, rol])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(nombre.trim())
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar rol' : 'Nuevo rol'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button form="rol-form" type="submit" loading={loading}>
            {editando ? 'Guardar' : 'Crear'}
          </Button>
        </>
      }
    >
      <form id="rol-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre del rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Coordinador Académico"
          required
          autoFocus
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
