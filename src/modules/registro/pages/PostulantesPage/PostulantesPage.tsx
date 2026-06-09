import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import { postulantesService } from '../../services'
import {
  usePostulantes,
  usePostulantesCatalogos,
  useCrearPostulante,
  useActualizarPostulante,
  useEliminarPostulante,
  useCambiarEstadoPostulante,
  useActivarPostulanteSinPago,
  useImportarPostulantes,
  useAprobarTodosPostulantes,
} from '../../hooks/usePostulantes'
import type {
  Postulante,
  PostulanteCreatePayload,
  PostulanteUpdatePayload,
  ResultadoImportacion,
} from '../../types'
import type { FiltroGestionConvocatoria } from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import { PostulantesPageView } from './PostulantesPage.view'
import type { PostulanteFormValues } from './components/PostulanteFormModal.view'

export function PostulantesPage() {
  const { tienePermiso } = useAuth()

  const puedeCrear = tienePermiso('postulantes.store')
  const puedeEditar = tienePermiso('postulantes.update')
  const puedeEliminar = tienePermiso('postulantes.destroy')

  const [buscarInput, setBuscarInput] = useState('')
  const [buscar, setBuscar] = useState('')
  const [filtro, setFiltro] = useState<FiltroGestionConvocatoria>({
    id_gestion: null,
    id_convocatoria: null,
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Postulante | null>(null)
  // Postulante mostrado en el modal de solo lectura ("Ver").
  const [viendo, setViendo] = useState<Postulante | null>(null)

  // Debounce de la búsqueda.
  useEffect(() => {
    const t = setTimeout(() => setBuscar(buscarInput), 350)
    return () => clearTimeout(t)
  }, [buscarInput])

  const postulantesQuery = usePostulantes({
    buscar: buscar || undefined,
    id_gestion: filtro.id_gestion ?? undefined,
    id_convocatoria: filtro.id_convocatoria ?? undefined,
  })
  // Los catálogos solo se necesitan cuando el usuario puede crear o editar.
  const catalogosQuery = usePostulantesCatalogos(puedeCrear || puedeEditar)

  const crear = useCrearPostulante()
  const actualizar = useActualizarPostulante()
  const eliminar = useEliminarPostulante()
  const cambiarEstado = useCambiarEstadoPostulante()
  const activar = useActivarPostulanteSinPago()
  const importar = useImportarPostulantes()

  // CU14 — carga masiva (importación).
  const [resultadoImport, setResultadoImport] = useState<ResultadoImportacion | null>(null)

  const importarArchivo = (archivo: File) => {
    importar.mutate(archivo, {
      onSuccess: (res) => setResultadoImport(res),
      onError: (e) => alert(extraerMensajeError(e, 'No se pudo procesar el archivo.')),
    })
  }

  // CU04 — aprobación masiva de pendientes.
  const aprobarTodos = useAprobarTodosPostulantes()
  const handleAprobarTodos = () => {
    if (window.confirm('¿Aprobar a TODOS los postulantes pendientes? Quedarán habilitados para el pago y la asignación de grupos.')) {
      aprobarTodos.mutate(undefined, {
        onSuccess: (res) => alert(res.message),
        onError: (e) => alert(extraerMensajeError(e, 'No se pudo aprobar en lote.')),
      })
    }
  }

  const abrirNuevo = () => {
    setEditando(null)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }

  const abrirEditar = (postulante: Postulante) => {
    setEditando(postulante)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }

  const cerrarModal = () => setModalOpen(false)

  // Abre/cierra el modal de solo lectura.
  const abrirVer = (postulante: Postulante) => setViendo(postulante)
  const cerrarVer = () => setViendo(null)

  // Abre el documento del título de bachiller en una pestaña nueva.
  const verTitulo = (id: number) => {
    postulantesService
      .verTitulo(id)
      .catch((e) => alert(extraerMensajeError(e, 'No se pudo abrir el documento del título.')))
  }

  const handleSubmit = (values: PostulanteFormValues) => {
    const base = {
      ci: values.ci.trim(),
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      correo: values.correo.trim(),
      telefono1: values.telefono1.trim() || null,
      telefono2: values.telefono2.trim() || null,
      fecha_nacimiento: values.fecha_nacimiento,
      sexo: values.sexo || null,
      direccion: values.direccion.trim() || null,
      id_unidad: values.id_unidad ? Number(values.id_unidad) : null,
      procedencia: values.procedencia.trim() || null,
      titulo_archivo: values.titulo_archivo,
      anio_egreso: values.anio_egreso ? Number(values.anio_egreso) : null,
      otros: values.otros.trim() || null,
      id_carrera: Number(values.id_carrera),
      id_carrera_2: values.id_carrera_2 ? Number(values.id_carrera_2) : null,
      turno_preferencia: values.turno_preferencia,
    }

    if (editando) {
      const payload: PostulanteUpdatePayload = base
      actualizar.mutate({ id: editando.id_postulante, payload }, { onSuccess: cerrarModal })
    } else {
      const payload: PostulanteCreatePayload = base
      crear.mutate(payload, { onSuccess: cerrarModal })
    }
  }

  const eliminarPostulante = (postulante: Postulante) => {
    const nombre = postulante.usuario
      ? `${postulante.usuario.nombres} ${postulante.usuario.apellidos}`
      : `#${postulante.id_postulante}`
    if (
      window.confirm(
        `¿Eliminar al postulante "${nombre}"? Se eliminará también su cuenta de usuario e inscripción. Esta acción no se puede deshacer.`,
      )
    ) {
      eliminar.mutate(postulante.id_postulante)
    }
  }

  // Revisión de la postulación: Aprobar (ELEGIBLE → habilitado para pagar y para
  // la asignación de grupos) o Rechazar (REPROBADO). El pago se gestiona aparte.
  // Ambas decisiones piden confirmación, como la eliminación.
  const cambiarEstadoPostulante = (postulante: Postulante, estado: string) => {
    const nombre = postulante.usuario
      ? `${postulante.usuario.nombres} ${postulante.usuario.apellidos}`
      : `#${postulante.id_postulante}`
    const mensaje =
      estado === 'ELEGIBLE'
        ? `¿Aprobar al postulante "${nombre}"? Quedará habilitado para el pago y la asignación de grupos.`
        : `¿Rechazar al postulante "${nombre}"? Su postulación quedará marcada como rechazada.`
    if (window.confirm(mensaje)) {
      cambiarEstado.mutate({ id: postulante.id_postulante, estado })
    }
  }

  const activarPostulante = (postulante: Postulante) => {
    const nombre = postulante.usuario
      ? `${postulante.usuario.nombres} ${postulante.usuario.apellidos}`
      : `#${postulante.id_postulante}`
    if (
      window.confirm(
        `¿Activar al postulante "${nombre}" sin pago? Se generarán credenciales de acceso. (Uso para pruebas únicamente)`,
      )
    ) {
      activar.mutate(postulante.id_postulante, {
        onSuccess: (resultado) => {
          const credencial = `✓ Postulante activado correctamente.\n\n📋 CREDENCIALES DE ACCESO:\n\n▸ Usuario (email):\n  ${resultado.credenciales.usuario}\n\n▸ Contraseña:\n  ${resultado.credenciales.contrasena}\n\n💡 El postulante puede ingresar con:\n• El email anterior, O\n• Su número de CI: ${postulante.usuario?.ci}\n\nAmbos funcionan como usuario.\n\nCódigo de trámite: ${postulante.codigo_tramite}\n(solo para referencia, no se usa en login)`
          alert(credencial)
        },
      })
    }
  }

  const mutacionActiva = editando ? actualizar : crear

  return (
    <PostulantesPageView
      postulantes={postulantesQuery.data ?? []}
      isLoading={postulantesQuery.isLoading}
      catalogos={catalogosQuery.data}
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
      onVerTitulo={verTitulo}
      onCerrarVer={cerrarVer}
      onCerrarModal={cerrarModal}
      onSubmit={handleSubmit}
      guardando={mutacionActiva.isPending}
      errorForm={mutacionActiva.isError ? extraerMensajeError(mutacionActiva.error) : null}
      onEliminar={eliminarPostulante}
      eliminandoId={eliminar.isPending ? (eliminar.variables as number) : null}
      onCambiarEstado={cambiarEstadoPostulante}
      cambiandoEstado={cambiarEstado.isPending && cambiarEstado.variables ? cambiarEstado.variables : null}
      onActivar={activarPostulante}
      activandoId={activar.isPending ? (activar.variables as number) : null}
      onImportar={importarArchivo}
      importando={importar.isPending}
      resultadoImport={resultadoImport}
      onCerrarResultado={() => setResultadoImport(null)}
      onAprobarTodos={handleAprobarTodos}
      aprobandoTodos={aprobarTodos.isPending}
    />
  )
}
