import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useAulas,
  useCrearAula,
  useActualizarAula,
  useEliminarAula,
} from '../../hooks/useAulas'
import type { Aula } from '../../types'
import { AulasPageView } from './AulasPage.view'
import type { AulaFormValues } from './components/AulaFormModal.view'

export function AulasPage() {
  const { tienePermiso } = useAuth()

  const [modalOpen, setModalOpen] = useState(false)
  const [aulaEditando, setAulaEditando] = useState<Aula | null>(null)
  // Aula seleccionada para el modal de solo lectura ("Ver").
  const [viendo, setViendo] = useState<Aula | null>(null)

  const aulasQuery = useAulas()
  const crear = useCrearAula()
  const actualizar = useActualizarAula()
  const eliminar = useEliminarAula()

  const abrirNueva = () => {
    setAulaEditando(null)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }
  const abrirEditar = (aula: Aula) => {
    setAulaEditando(aula)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }
  const cerrarModal = () => setModalOpen(false)

  // Handlers del modal de solo lectura ("Ver").
  const abrirVer = (aula: Aula) => setViendo(aula)
  const cerrarVer = () => setViendo(null)

  const submit = (values: AulaFormValues) => {
    const payload = {
      piso: Number(values.piso),
      numero: Number(values.numero),
      capacidad: Number(values.capacidad),
    }
    if (aulaEditando) {
      actualizar.mutate(
        { id: aulaEditando.id_aula, payload },
        { onSuccess: cerrarModal },
      )
    } else {
      crear.mutate(payload, { onSuccess: cerrarModal })
    }
  }

  const eliminarAula = (aula: Aula) => {
    if (window.confirm(`¿Eliminar el aula "${aula.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminar.mutate(aula.id_aula)
    }
  }

  const mutacion = aulaEditando ? actualizar : crear

  return (
    <AulasPageView
      aulas={aulasQuery.data ?? []}
      isLoading={aulasQuery.isLoading}
      puedeCrear={tienePermiso('aulas.store')}
      puedeEditar={tienePermiso('aulas.update')}
      puedeEliminar={tienePermiso('aulas.destroy')}
      modalOpen={modalOpen}
      aulaEditando={aulaEditando}
      viendo={viendo}
      onVer={abrirVer}
      onCerrarVer={cerrarVer}
      onNueva={abrirNueva}
      onEditar={abrirEditar}
      onCerrarModal={cerrarModal}
      onSubmit={submit}
      guardando={mutacion.isPending}
      error={mutacion.isError ? extraerMensajeError(mutacion.error) : null}
      onEliminar={eliminarAula}
      eliminandoId={eliminar.isPending ? (eliminar.variables as number) : null}
    />
  )
}
