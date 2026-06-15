import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useDocentes,
  useCrearDocente,
  useActualizarDocente,
  useEliminarDocente,
} from '../../hooks/useDocentes'
import { useMaterias } from '../../hooks/useMaterias'
import { useGrupos } from '../../hooks/useGrupos'
import { useConvocatorias } from '@/modules/administrativo/hooks/useConvocatorias'
import type { FiltroGestionConvocatoria } from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import type { Docente, DocenteCreatePayload, DocenteUpdatePayload } from '../../types'
import { DocentesPageView } from './DocentesPage.view'
import type { DocenteFormValues } from './components/DocenteFormModal.view'

export function DocentesPage() {
  const { tienePermiso } = useAuth()

  const puedeCrear = tienePermiso('docentes.store')
  const puedeEditar = tienePermiso('docentes.update')
  const puedeEliminar = tienePermiso('docentes.destroy')

  const [buscarInput, setBuscarInput] = useState('')
  const [buscar, setBuscar] = useState('')
  const [filtro, setFiltro] = useState<FiltroGestionConvocatoria>({
    id_gestion: null,
    id_convocatoria: null,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Docente | null>(null)
  // Docente seleccionado para el modal de solo lectura ("Ver").
  const [viendo, setViendo] = useState<Docente | null>(null)

  // Debounce de la búsqueda.
  useEffect(() => {
    const t = setTimeout(() => setBuscar(buscarInput), 350)
    return () => clearTimeout(t)
  }, [buscarInput])

  const docentesQuery = useDocentes({
    buscar: buscar || undefined,
    id_gestion: filtro.id_gestion ?? undefined,
    id_convocatoria: filtro.id_convocatoria ?? undefined,
  })
  // El catálogo de materias solo se necesita cuando el usuario puede crear/editar.
  const materiasQuery = useMaterias(undefined, puedeCrear || puedeEditar)
  // Convocatorias para el multi-select del formulario (solo si puede crear/editar).
  const convocatoriasQuery = useConvocatorias(null)
  // Grupos disponibles para asignar al docente (de 1 a 4).
  const gruposQuery = useGrupos()

  const crear = useCrearDocente()
  const actualizar = useActualizarDocente()
  const eliminar = useEliminarDocente()

  const abrirNuevo = () => {
    setEditando(null)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }

  const abrirEditar = (docente: Docente) => {
    setEditando(docente)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }

  const cerrarModal = () => setModalOpen(false)

  // Abrir/cerrar el modal de solo lectura.
  const abrirVer = (docente: Docente) => setViendo(docente)
  const cerrarVer = () => setViendo(null)

  const handleSubmit = (values: DocenteFormValues) => {
    // Solo carreras válidas: con nombre y al menos un área marcada.
    const carreras = values.carreras
      .map((c) => ({ carrera: c.carrera.trim(), areas: c.areas }))
      .filter((c) => c.carrera !== '' && c.areas.length > 0)

    const perfil = {
      profesion: values.profesion.trim() || null,
      carga_horaria: values.carga_horaria ? Number(values.carga_horaria) : null,
      especialidad: values.especialidad.trim() || null,
      tiene_maestria: values.tiene_maestria,
      tiene_diplomado: values.tiene_diplomado,
      carreras,
      materias: values.materias,
      convocatorias: values.convocatorias,
      grupos: values.grupos,
    }

    if (editando) {
      const payload: DocenteUpdatePayload = { ...perfil }
      actualizar.mutate({ id: editando.id_docente, payload }, { onSuccess: cerrarModal })
    } else {
      const payload: DocenteCreatePayload = {
        ...perfil,
        ci: values.ci.trim(),
        nombres: values.nombres.trim(),
        apellidos: values.apellidos.trim(),
        correo: values.correo.trim(),
        telefono1: values.telefono1.trim() || null,
        telefono2: values.telefono2.trim() || null,
        fecha_nacimiento: values.fecha_nacimiento,
        sexo: values.sexo || null,
      }
      crear.mutate(payload, { onSuccess: cerrarModal })
    }
  }

  const eliminarDocente = (docente: Docente) => {
    const nombre = docente.usuario
      ? `${docente.usuario.nombres} ${docente.usuario.apellidos}`
      : `#${docente.id_docente}`
    if (
      window.confirm(
        `¿Eliminar al docente "${nombre}"? Se eliminará también su cuenta de usuario. Esta acción no se puede deshacer.`,
      )
    ) {
      eliminar.mutate(docente.id_docente)
    }
  }

  const mutacionActiva = editando ? actualizar : crear

  return (
    <DocentesPageView
      docentes={docentesQuery.data ?? []}
      isLoading={docentesQuery.isLoading}
      materias={materiasQuery.data ?? []}
      convocatorias={convocatoriasQuery.data ?? []}
      grupos={gruposQuery.data ?? []}
      buscar={buscarInput}
      onBuscarChange={setBuscarInput}
      filtro={filtro}
      onFiltroChange={setFiltro}
      puedeCrear={puedeCrear}
      puedeEditar={puedeEditar}
      puedeEliminar={puedeEliminar}
      modalOpen={modalOpen}
      editando={editando}
      viendo={viendo}
      onNuevo={abrirNuevo}
      onEditar={abrirEditar}
      onVer={abrirVer}
      onCerrarVer={cerrarVer}
      onCerrarModal={cerrarModal}
      onSubmit={handleSubmit}
      guardando={mutacionActiva.isPending}
      errorForm={mutacionActiva.isError ? extraerMensajeError(mutacionActiva.error) : null}
      onEliminar={eliminarDocente}
      eliminandoId={eliminar.isPending ? (eliminar.variables as number) : null}
    />
  )
}
