import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useGrupos,
  useGruposCatalogos,
  useAsignacion,
  useCrearGrupo,
  useActualizarGrupo,
  useEliminarGrupo,
  useAsignarGrupo,
  useDesasignarGrupo,
  useCrearGruposAutomatico,
  useAsignarLote,
  useRebalancear,
} from '../../hooks/useGrupos'
import type { Grupo } from '../../types'
import { GruposPageView } from './GruposPage.view'
import type { GrupoFormValues } from './components/GrupoFormModal.view'

export function GruposPage() {
  const { tienePermiso } = useAuth()
  const puedeCrear = tienePermiso('grupos.store')
  const puedeEditar = tienePermiso('grupos.update')
  const puedeEliminar = tienePermiso('grupos.destroy')
  const puedeAsignar = tienePermiso('grupos.asignar')

  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Grupo | null>(null)
  // Grupo seleccionado para el modal de SOLO LECTURA ("Ver").
  const [viendo, setViendo] = useState<Grupo | null>(null)
  const [aviso, setAviso] = useState<string | null>(null)

  const gruposQuery = useGrupos()
  const asignacionQuery = useAsignacion()
  const catalogosQuery = useGruposCatalogos(puedeCrear || puedeEditar)

  const crear = useCrearGrupo()
  const actualizar = useActualizarGrupo()
  const eliminar = useEliminarGrupo()
  const asignar = useAsignarGrupo()
  const desasignar = useDesasignarGrupo()
  const crearAuto = useCrearGruposAutomatico()
  const lote = useAsignarLote()
  const rebalancear = useRebalancear()

  const abrirNuevo = () => {
    setEditando(null)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }
  const abrirEditar = (g: Grupo) => {
    setEditando(g)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }
  const cerrarModal = () => setModalOpen(false)

  // Abrir/cerrar el modal de solo lectura.
  const abrirVer = (g: Grupo) => setViendo(g)
  const cerrarVer = () => setViendo(null)

  const handleSubmit = (values: GrupoFormValues) => {
    const payload = {
      sigla: values.sigla.trim(),
      nombre: values.nombre.trim(),
      turno: values.turno,
      capacidad_max: Number(values.capacidad_max),
      id_aula: values.id_aula ? Number(values.id_aula) : null,
    }
    if (editando) {
      actualizar.mutate({ id: editando.id_grupo, payload }, { onSuccess: cerrarModal })
    } else {
      crear.mutate(payload, { onSuccess: cerrarModal })
    }
  }

  const eliminarGrupo = (g: Grupo) => {
    if (window.confirm(`¿Eliminar el grupo "${g.sigla} — ${g.nombre}"? Las inscripciones quedarán sin grupo.`)) {
      eliminar.mutate(g.id_grupo)
    }
  }

  const cambiarAsignacion = (idInscripcion: number, idGrupo: number | null) => {
    setAviso(null)
    if (idGrupo === null) {
      desasignar.mutate(idInscripcion)
    } else {
      asignar.mutate({ idInscripcion, idGrupo })
    }
  }

  const totalElegibles = asignacionQuery.data?.resumen.total_inscritos ?? 0
  const crearGrupos = () => {
    setAviso(null)
    const necesarios = asignacionQuery.data?.resumen.grupos_necesarios ?? 0
    if (
      !window.confirm(
        `Se crearán los grupos necesarios para ${totalElegibles} inscrito(s) (${necesarios} grupo(s), máx. 70 c/u) ` +
          'y se repartirán los postulantes por turno. ¿Continuar?',
      )
    ) {
      return
    }
    crearAuto.mutate(undefined, { onSuccess: (r) => setAviso(r.message) })
  }

  const ejecutarLote = () => {
    setAviso(null)
    lote.mutate(undefined, { onSuccess: (r) => setAviso(r.message) })
  }
  const ejecutarRebalanceo = () => {
    setAviso(null)
    rebalancear.mutate(undefined, { onSuccess: (r) => setAviso(r.message) })
  }

  const mutacionGrupo = editando ? actualizar : crear
  const errorAccion =
    (asignar.isError ? extraerMensajeError(asignar.error) : null) ??
    (desasignar.isError ? extraerMensajeError(desasignar.error) : null) ??
    (crearAuto.isError ? extraerMensajeError(crearAuto.error) : null) ??
    (lote.isError ? extraerMensajeError(lote.error) : null) ??
    (rebalancear.isError ? extraerMensajeError(rebalancear.error) : null) ??
    (eliminar.isError ? extraerMensajeError(eliminar.error) : null)

  return (
    <GruposPageView
      grupos={gruposQuery.data ?? []}
      isLoading={gruposQuery.isLoading}
      asignacion={asignacionQuery.data}
      asignacionLoading={asignacionQuery.isLoading}
      catalogos={catalogosQuery.data}
      puedeCrear={puedeCrear}
      puedeEditar={puedeEditar}
      puedeEliminar={puedeEliminar}
      puedeAsignar={puedeAsignar}
      onCrearGrupos={crearGrupos}
      creandoGrupos={crearAuto.isPending}
      hayElegibles={totalElegibles > 0}
      modalOpen={modalOpen}
      editando={editando}
      viendo={viendo}
      onNuevo={abrirNuevo}
      onVer={abrirVer}
      onCerrarVer={cerrarVer}
      onEditar={abrirEditar}
      onCerrarModal={cerrarModal}
      onSubmit={handleSubmit}
      guardando={mutacionGrupo.isPending}
      errorForm={mutacionGrupo.isError ? extraerMensajeError(mutacionGrupo.error) : null}
      onEliminar={eliminarGrupo}
      eliminandoId={eliminar.isPending ? (eliminar.variables as number) : null}
      onCambiarAsignacion={cambiarAsignacion}
      asignando={asignar.isPending || desasignar.isPending}
      onAsignarLote={ejecutarLote}
      onRebalancear={ejecutarRebalanceo}
      procesandoLote={lote.isPending}
      procesandoRebalanceo={rebalancear.isPending}
      aviso={aviso}
      errorAccion={errorAccion}
    />
  )
}
