import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '@/shared/ui'
import type { Carrera, CarreraCatalogos } from '@/modules/examenes/types'

export interface CarreraFormValues {
  nombre: string
  codigo: string
  modalidad: string
  area: string
  plan: string
  cupos: string
}

const VACIO: CarreraFormValues = {
  nombre: '',
  codigo: '',
  modalidad: '',
  area: '',
  plan: '',
  cupos: '0',
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (values: CarreraFormValues) => void
  loading: boolean
  error: string | null
  carrera: Carrera | null
  catalogos: CarreraCatalogos
}

export function CarreraFormModal({
  open,
  onClose,
  onSubmit,
  loading,
  error,
  carrera,
  catalogos,
}: Props) {
  const editando = carrera != null
  const [values, setValues] = useState<CarreraFormValues>(VACIO)

  useEffect(() => {
    if (!open) return
    setValues(
      carrera
        ? {
            nombre: carrera.nombre,
            codigo: carrera.codigo,
            modalidad: carrera.modalidad ?? '',
            area: carrera.area ?? '',
            plan: carrera.plan ?? '',
            cupos: String(carrera.cupos),
          }
        : VACIO,
    )
  }, [open, carrera])

  const set = <K extends keyof CarreraFormValues>(key: K, value: CarreraFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ ...values, nombre: values.nombre.trim(), codigo: values.codigo.trim() })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editando ? 'Editar carrera' : 'Nueva carrera'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button form="carrera-form" type="submit" loading={loading}>
            {editando ? 'Guardar' : 'Crear'}
          </Button>
        </>
      }
    >
      <form id="carrera-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre de la carrera"
          className="sm:col-span-2"
          value={values.nombre}
          onChange={(e) => set('nombre', e.target.value)}
          placeholder="Ej: Ingeniería en Sistemas"
          required
          autoFocus
        />
        <Input
          label="Código"
          value={values.codigo}
          onChange={(e) => set('codigo', e.target.value)}
          placeholder="Ej: 187-3"
          required
        />
        <Input
          label="Plan"
          value={values.plan}
          onChange={(e) => set('plan', e.target.value)}
          placeholder="Ej: Plan 2015"
        />
        <Select
          label="Modalidad"
          value={values.modalidad}
          onChange={(e) => set('modalidad', e.target.value)}
          required
        >
          <option value="">— Seleccionar —</option>
          {catalogos.modalidades.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <Select
          label="Área"
          value={values.area}
          onChange={(e) => set('area', e.target.value)}
          required
        >
          <option value="">— Seleccionar —</option>
          {catalogos.areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>
        <Input
          label="Cupos / plazas disponibles"
          className="sm:col-span-2"
          type="number"
          min={0}
          value={values.cupos}
          onChange={(e) => set('cupos', e.target.value)}
          required
        />

        {error && (
          <div className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
