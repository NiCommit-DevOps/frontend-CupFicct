import { useEffect, useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useUsuarios,
  useCrearUsuario,
  useActualizarUsuario,
  useAlternarEstadoUsuario,
  useHabilitarPostulante,
  useActivarTodosUsuarios,
} from '../../hooks/useUsuarios'
import { useRoles } from '../../hooks/useRoles'
import type { Usuario, UsuarioCreatePayload, UsuarioUpdatePayload } from '../../types'
import { UsuariosPageView } from './UsuariosPage.view'
import type { UsuarioFormValues } from './components/UsuarioFormModal.view'

export function UsuariosPage() {
  const { tienePermiso } = useAuth()

  const [buscarInput, setBuscarInput] = useState('')
  const [buscar, setBuscar] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [viendo, setViendo] = useState<Usuario | null>(null)

  // Debounce de la búsqueda.
  useEffect(() => {
    const t = setTimeout(() => {
      setBuscar(buscarInput)
      setPage(1)
    }, 350)
    return () => clearTimeout(t)
  }, [buscarInput])

  const usuariosQuery = useUsuarios({ page, per_page: 10, buscar: buscar || undefined })
  const rolesQuery = useRoles()

  const crear = useCrearUsuario()
  const actualizar = useActualizarUsuario()
  const alternar = useAlternarEstadoUsuario()
  const habilitar = useHabilitarPostulante()
  const activarTodos = useActivarTodosUsuarios()

  // CU02 — activación masiva de todas las cuentas inhabilitadas.
  const handleActivarTodos = () => {
    if (window.confirm('¿Activar TODAS las cuentas inhabilitadas? Quedarán habilitadas para iniciar sesión.')) {
      activarTodos.mutate(undefined, {
        onSuccess: (res) => alert(res.message),
        onError: (e) => alert(extraerMensajeError(e, 'No se pudo activar en lote.')),
      })
    }
  }

  // Activar/inhabilitar. Para un POSTULANTE inactivo, "Activar" no es un simple
  // toggle: dispara el flujo de ingreso sin pago (genera credenciales, activa la
  // cuenta y asigna grupo). Requiere que ya esté aprobado (ELEGIBLE). Para el
  // resto de cuentas (o al inhabilitar) se usa el toggle estándar.
  const handleToggleEstado = (u: Usuario) => {
    const esPostulanteInactivo = u.rol?.nombre === 'Postulante' && !u.esta_activo

    if (!esPostulanteInactivo) {
      alternar.mutate(u.id_usuario)
      return
    }

    if (
      !window.confirm(
        `¿Activar al postulante "${u.nombres} ${u.apellidos}"? Se generarán sus credenciales de acceso y podrá ingresar al sistema. Debe estar aprobado (ELEGIBLE).`,
      )
    ) {
      return
    }

    habilitar.mutate(u.id_usuario, {
      onSuccess: (resultado) => {
        alert(
          `✓ Postulante habilitado correctamente.\n\n📋 CREDENCIALES DE ACCESO:\n\n▸ Usuario (email):\n  ${resultado.credenciales.usuario}\n\n▸ Contraseña:\n  ${resultado.credenciales.contrasena}\n\n💡 También puede ingresar con su número de CI: ${u.ci}`,
        )
      },
      onError: (error) => {
        alert(extraerMensajeError(error))
      },
    })
  }

  const abrirNuevo = () => {
    setEditando(null)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }

  const abrirEditar = (usuario: Usuario) => {
    setEditando(usuario)
    crear.reset()
    actualizar.reset()
    setModalOpen(true)
  }

  const cerrarModal = () => setModalOpen(false)

  const abrirVer = (usuario: Usuario) => setViendo(usuario)
  const cerrarVer = () => setViendo(null)

  const handleSubmit = (values: UsuarioFormValues) => {
    const base = {
      id_rol: values.id_rol,
      ci: values.ci.trim(),
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      correo: values.correo.trim(),
      telefono1: values.telefono1.trim() || null,
      telefono2: values.telefono2.trim() || null,
      fecha_nacimiento: values.fecha_nacimiento,
      sexo: values.sexo || null,
    }

    if (editando) {
      const payload: UsuarioUpdatePayload = { ...base }
      if (values.contrasena) payload.contrasena = values.contrasena
      actualizar.mutate(
        { id: editando.id_usuario, payload },
        { onSuccess: cerrarModal },
      )
    } else {
      const payload: UsuarioCreatePayload = { ...base, contrasena: values.contrasena }
      crear.mutate(payload, { onSuccess: cerrarModal })
    }
  }

  const mutacionActiva = editando ? actualizar : crear

  return (
    <UsuariosPageView
      data={usuariosQuery.data}
      isLoading={usuariosQuery.isLoading}
      roles={rolesQuery.data ?? []}
      buscar={buscarInput}
      onBuscarChange={setBuscarInput}
      page={page}
      onPageChange={setPage}
      puedeCrear={tienePermiso('usuarios.store')}
      puedeEditar={tienePermiso('usuarios.update')}
      puedeToggle={tienePermiso('usuarios.update')}
      onActivarTodos={handleActivarTodos}
      activandoTodos={activarTodos.isPending}
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
      onToggleEstado={handleToggleEstado}
      toggleandoId={
        alternar.isPending
          ? (alternar.variables as number)
          : habilitar.isPending
            ? (habilitar.variables as number)
            : null
      }
    />
  )
}
