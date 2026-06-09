import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useGestiones,
  useCrearGestion,
  useActualizarGestion,
  useCambiarEstadoGestion,
  useEliminarGestion,
} from '../../hooks/useGestiones'
import {
  useConvocatorias,
  useCrearConvocatoria,
  useActualizarConvocatoria,
  useCambiarEstadoConvocatoria,
  useEliminarConvocatoria,
} from '../../hooks/useConvocatorias'
import type { Convocatoria, EstadoConvocatoria, Gestion } from '../../types'
import { ConvocatoriasPageView, type Tab } from './ConvocatoriasPage.view'
import type { GestionFormValues } from './components/GestionFormModal.view'
import type { ConvocatoriaFormValues } from './components/ConvocatoriaFormModal.view'

export function ConvocatoriasPage() {
  const { tienePermiso } = useAuth()
  const [tab, setTab] = useState<Tab>('gestiones')
  const [filtroGestion, setFiltroGestion] = useState<number | null>(null)

  // --- Gestiones ---
  const [gestionModalOpen, setGestionModalOpen] = useState(false)
  const [gestionEditando, setGestionEditando] = useState<Gestion | null>(null)
  // Detalle (solo lectura) de gestión
  const [viendoGestion, setViendoGestion] = useState<Gestion | null>(null)
  const abrirVerGestion = (g: Gestion) => setViendoGestion(g)
  const cerrarVerGestion = () => setViendoGestion(null)

  const gestionesQuery = useGestiones()
  const crearGestion = useCrearGestion()
  const actualizarGestion = useActualizarGestion()
  const cambiarEstadoGestion = useCambiarEstadoGestion()
  const eliminarGestion = useEliminarGestion()

  const abrirNuevaGestion = () => {
    setGestionEditando(null)
    crearGestion.reset()
    actualizarGestion.reset()
    setGestionModalOpen(true)
  }
  const abrirEditarGestion = (g: Gestion) => {
    setGestionEditando(g)
    crearGestion.reset()
    actualizarGestion.reset()
    setGestionModalOpen(true)
  }
  const cerrarGestionModal = () => setGestionModalOpen(false)

  const submitGestion = (values: GestionFormValues) => {
    if (gestionEditando) {
      actualizarGestion.mutate(
        { id: gestionEditando.id_gestion, payload: values },
        { onSuccess: cerrarGestionModal },
      )
    } else {
      crearGestion.mutate(values, { onSuccess: cerrarGestionModal })
    }
  }

  const activarGestion = (g: Gestion) =>
    cambiarEstadoGestion.mutate({ id: g.id_gestion, estado: 'ACTIVA' })

  const eliminarGestionFn = (g: Gestion) => {
    if (
      window.confirm(
        `¿Eliminar la gestión "${g.nombre}"? Se eliminarán también sus convocatorias. Esta acción no se puede deshacer.`,
      )
    ) {
      eliminarGestion.mutate(g.id_gestion)
    }
  }

  const mutacionGestion = gestionEditando ? actualizarGestion : crearGestion

  // --- Convocatorias ---
  const [convocatoriaModalOpen, setConvocatoriaModalOpen] = useState(false)
  const [convocatoriaEditando, setConvocatoriaEditando] = useState<Convocatoria | null>(null)
  // Detalle (solo lectura) de convocatoria
  const [viendoConvocatoria, setViendoConvocatoria] = useState<Convocatoria | null>(null)
  const abrirVerConvocatoria = (c: Convocatoria) => setViendoConvocatoria(c)
  const cerrarVerConvocatoria = () => setViendoConvocatoria(null)
  // Cupos por convocatoria (CU08/CU19)
  const [cuposConvocatoria, setCuposConvocatoria] = useState<Convocatoria | null>(null)
  const abrirCupos = (c: Convocatoria) => setCuposConvocatoria(c)
  const cerrarCupos = () => setCuposConvocatoria(null)

  const convocatoriasQuery = useConvocatorias(filtroGestion)
  const crearConvocatoria = useCrearConvocatoria()
  const actualizarConvocatoria = useActualizarConvocatoria()
  const cambiarEstadoConvocatoria = useCambiarEstadoConvocatoria()
  const eliminarConvocatoria = useEliminarConvocatoria()

  const abrirNuevaConvocatoria = () => {
    setConvocatoriaEditando(null)
    crearConvocatoria.reset()
    actualizarConvocatoria.reset()
    setConvocatoriaModalOpen(true)
  }
  const abrirEditarConvocatoria = (c: Convocatoria) => {
    setConvocatoriaEditando(c)
    crearConvocatoria.reset()
    actualizarConvocatoria.reset()
    setConvocatoriaModalOpen(true)
  }
  const cerrarConvocatoriaModal = () => setConvocatoriaModalOpen(false)

  const submitConvocatoria = (values: ConvocatoriaFormValues) => {
    if (convocatoriaEditando) {
      actualizarConvocatoria.mutate(
        {
          id: convocatoriaEditando.id_convocatoria,
          payload: {
            nombre: values.nombre,
            fecha_limite_inscripcion: values.fecha_limite_inscripcion,
          },
        },
        { onSuccess: cerrarConvocatoriaModal },
      )
    } else if (values.id_gestion != null) {
      crearConvocatoria.mutate(
        {
          id_gestion: values.id_gestion,
          nombre: values.nombre,
          fecha_limite_inscripcion: values.fecha_limite_inscripcion,
        },
        { onSuccess: cerrarConvocatoriaModal },
      )
    }
  }

  const cambiarEstadoConvocatoriaFn = (c: Convocatoria, estado: EstadoConvocatoria) =>
    cambiarEstadoConvocatoria.mutate({ id: c.id_convocatoria, estado })

  const eliminarConvocatoriaFn = (c: Convocatoria) => {
    if (window.confirm(`¿Eliminar la convocatoria "${c.nombre}"? Esta acción no se puede deshacer.`)) {
      eliminarConvocatoria.mutate(c.id_convocatoria)
    }
  }

  const mutacionConvocatoria = convocatoriaEditando ? actualizarConvocatoria : crearConvocatoria

  return (
    <ConvocatoriasPageView
      tab={tab}
      onTabChange={setTab}
      gestiones={gestionesQuery.data ?? []}
      convocatorias={convocatoriasQuery.data ?? []}
      cargandoGestiones={gestionesQuery.isLoading}
      cargandoConvocatorias={convocatoriasQuery.isLoading}
      puedeCrearGestion={tienePermiso('gestiones.store')}
      puedeEditarGestion={tienePermiso('gestiones.update')}
      puedeEliminarGestion={tienePermiso('gestiones.destroy')}
      puedeCrearConvocatoria={tienePermiso('convocatorias.store')}
      puedeEditarConvocatoria={tienePermiso('convocatorias.update')}
      puedeEliminarConvocatoria={tienePermiso('convocatorias.destroy')}
      filtroGestion={filtroGestion}
      onFiltroGestion={setFiltroGestion}
      // gestion
      onNuevaGestion={abrirNuevaGestion}
      onVerGestion={abrirVerGestion}
      viendoGestion={viendoGestion}
      onCerrarVerGestion={cerrarVerGestion}
      onEditarGestion={abrirEditarGestion}
      onActivarGestion={activarGestion}
      onEliminarGestion={eliminarGestionFn}
      cambiandoEstadoGestionId={
        cambiarEstadoGestion.isPending ? cambiarEstadoGestion.variables.id : null
      }
      eliminandoGestionId={eliminarGestion.isPending ? (eliminarGestion.variables as number) : null}
      gestionModalOpen={gestionModalOpen}
      gestionEditando={gestionEditando}
      onCerrarGestionModal={cerrarGestionModal}
      onSubmitGestion={submitGestion}
      guardandoGestion={mutacionGestion.isPending}
      errorGestion={mutacionGestion.isError ? extraerMensajeError(mutacionGestion.error) : null}
      // convocatoria
      onNuevaConvocatoria={abrirNuevaConvocatoria}
      onVerConvocatoria={abrirVerConvocatoria}
      viendoConvocatoria={viendoConvocatoria}
      onCerrarVerConvocatoria={cerrarVerConvocatoria}
      onEditarConvocatoria={abrirEditarConvocatoria}
      onCuposConvocatoria={abrirCupos}
      cuposConvocatoria={cuposConvocatoria}
      onCerrarCupos={cerrarCupos}
      onCambiarEstadoConvocatoria={cambiarEstadoConvocatoriaFn}
      onEliminarConvocatoria={eliminarConvocatoriaFn}
      cambiandoEstadoConvocatoriaId={
        cambiarEstadoConvocatoria.isPending ? cambiarEstadoConvocatoria.variables.id : null
      }
      eliminandoConvocatoriaId={
        eliminarConvocatoria.isPending ? (eliminarConvocatoria.variables as number) : null
      }
      convocatoriaModalOpen={convocatoriaModalOpen}
      convocatoriaEditando={convocatoriaEditando}
      onCerrarConvocatoriaModal={cerrarConvocatoriaModal}
      onSubmitConvocatoria={submitConvocatoria}
      guardandoConvocatoria={mutacionConvocatoria.isPending}
      errorConvocatoria={
        mutacionConvocatoria.isError ? extraerMensajeError(mutacionConvocatoria.error) : null
      }
    />
  )
}
