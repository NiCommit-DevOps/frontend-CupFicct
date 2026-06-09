import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useCarreras,
  useCatalogosCarrera,
  useCrearCarrera,
  useActualizarCarrera,
  useEliminarCarrera,
} from '../../hooks/useCarreras'
import type { Carrera } from '../../types'
import { CarrerasPageView } from './CarrerasPage.view'
import type { CarreraFormValues } from './components/CarreraFormModal.view'

export function CarrerasPage() {
  const { tienePermiso } = useAuth()

  const [modalOpen, setModalOpen] = useState(false)
  const [carreraEditando, setCarreraEditando] = useState<Carrera | null>(null)
  // Carrera mostrada en el modal de solo lectura ("Ver").
  const [viendo, setViendo] = useState<Carrera | null>(null)

  const carrerasQuery = useCarreras()
  const catalogosQuery = useCatalogosCarrera()
  const crear = useCrearCarrera()
  const actualizar = useActualizarCarrera()
  const eliminar = useEliminarCarrera()

  const abrirNueva = () => {
    setCarreraEditando(null)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }
  const abrirEditar = (carrera: Carrera) => {
    setCarreraEditando(carrera)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }
  const cerrarModal = () => setModalOpen(false)

  // Handlers del modal de solo lectura.
  const abrirVer = (carrera: Carrera) => setViendo(carrera)
  const cerrarVer = () => setViendo(null)

  const submit = (values: CarreraFormValues) => {
    const payload = {
      nombre: values.nombre,
      codigo: values.codigo,
      modalidad: values.modalidad,
      area: values.area,
      plan: values.plan || null,
      cupos: Number(values.cupos),
    }
    if (carreraEditando) {
      actualizar.mutate(
        { id: carreraEditando.id_carrera, payload },
        { onSuccess: cerrarModal },
      )
    } else {
      crear.mutate(payload, { onSuccess: cerrarModal })
    }
  }

  const eliminarCarrera = (carrera: Carrera) => {
    if (window.confirm(`¿Eliminar la carrera "${carrera.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminar.mutate(carrera.id_carrera)
    }
  }

  const mutacion = carreraEditando ? actualizar : crear

  return (
    <CarrerasPageView
      carreras={carrerasQuery.data ?? []}
      isLoading={carrerasQuery.isLoading}
      catalogos={catalogosQuery.data ?? { modalidades: [], areas: [] }}
      puedeCrear={tienePermiso('carreras.store')}
      puedeEditar={tienePermiso('carreras.update')}
      puedeEliminar={tienePermiso('carreras.destroy')}
      modalOpen={modalOpen}
      carreraEditando={carreraEditando}
      viendo={viendo}
      onNueva={abrirNueva}
      onVer={abrirVer}
      onEditar={abrirEditar}
      onCerrarModal={cerrarModal}
      onCerrarVer={cerrarVer}
      onSubmit={submit}
      guardando={mutacion.isPending}
      error={mutacion.isError ? extraerMensajeError(mutacion.error) : null}
      onEliminar={eliminarCarrera}
      eliminandoId={eliminar.isPending ? (eliminar.variables as number) : null}
    />
  )
}
