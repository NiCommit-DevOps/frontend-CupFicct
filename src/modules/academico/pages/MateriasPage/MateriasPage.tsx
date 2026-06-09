import { useEffect, useState, type FormEvent } from 'react'
import { Badge, Button, Card, Input, LoadingState, Modal, PageHeader } from '@/shared/ui'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import {
  useMaterias,
  useCrearMateria,
  useActualizarMateria,
  useEliminarMateria,
} from '../../hooks/useMaterias'
import { useHorarioGeneral } from '../../hooks/useHorarios'
import { ClasesTable } from '../../components/ClasesTable'
import type { Materia } from '../../types'

/**
 * CU06/CU10 — Gestión del catálogo de materias (las que dictan los docentes y
 * se evalúan en los exámenes).
 */
export function MateriasPage() {
  const { tienePermiso } = useAuth()
  const puedeCrear = tienePermiso('materias.store')
  const puedeEditar = tienePermiso('materias.update')
  const puedeEliminar = tienePermiso('materias.destroy')

  const [buscar, setBuscar] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Materia | null>(null)

  const materiasQuery = useMaterias(buscar || undefined)
  const horarioQuery = useHorarioGeneral()
  const crear = useCrearMateria()
  const actualizar = useActualizarMateria()
  const eliminar = useEliminarMateria()

  const abrirNuevo = () => {
    setEditando(null)
    setModalOpen(true)
  }
  const abrirEditar = (m: Materia) => {
    setEditando(m)
    setModalOpen(true)
  }

  const materias = materiasQuery.data ?? []

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Materias"
        subtitle="Catálogo de materias evaluadas y que dictan los docentes (CU06/CU10)"
        actions={puedeCrear ? <Button onClick={abrirNuevo}>Nueva materia</Button> : undefined}
      />

      <Card>
        <div className="border-b border-slate-200/60 p-4 dark:border-slate-700/40">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Buscar materia…"
              value={buscar}
              onChange={(e) => setBuscar(e.target.value)}
            />
          </div>
        </div>

        {materiasQuery.isLoading ? (
          <LoadingState />
        ) : materias.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400">No hay materias registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700/40">
                  <th className="px-4 py-3 font-medium">Materia</th>
                  <th className="px-4 py-3 font-medium">Descripción</th>
                  <th className="px-4 py-3 text-center font-medium">Docentes</th>
                  {(puedeEditar || puedeEliminar) && <th className="px-4 py-3 text-right font-medium" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {materias.map((m) => (
                  <tr key={m.id_materia} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{m.nombre}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{m.descripcion ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge tone="neutral">{m.docentes_count ?? 0}</Badge>
                    </td>
                    {(puedeEditar || puedeEliminar) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          {puedeEditar && (
                            <Button variant="ghost" size="sm" onClick={() => abrirEditar(m)}>
                              Editar
                            </Button>
                          )}
                          {puedeEliminar && (
                            <Button
                              variant="danger"
                              size="sm"
                              loading={eliminar.isPending && eliminar.variables === m.id_materia}
                              onClick={() => eliminar.mutate(m.id_materia)}
                            >
                              Eliminar
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* CU06/CU10 — Horario de clases por turno (días y horas por materia). */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Horario de clases
        </h2>
        {horarioQuery.isLoading ? (
          <LoadingState />
        ) : (horarioQuery.data ?? []).length === 0 ? (
          <Card className="py-10 text-center text-sm text-slate-400">
            No hay horario de clases configurado.
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {horarioQuery.data!.map((t) => (
              <Card key={t.turno}>
                <div className="flex items-center gap-2 border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/40">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Turno {t.turno}
                  </h3>
                </div>
                <ClasesTable clases={t.clases} />
              </Card>
            ))}
          </div>
        )}
      </div>

      <MateriaFormModal
        open={modalOpen}
        materia={editando}
        onClose={() => setModalOpen(false)}
        guardando={crear.isPending || actualizar.isPending}
        error={
          crear.isError
            ? extraerMensajeError(crear.error)
            : actualizar.isError
              ? extraerMensajeError(actualizar.error)
              : null
        }
        onSubmit={(payload) => {
          const opts = { onSuccess: () => setModalOpen(false) }
          if (editando) actualizar.mutate({ id: editando.id_materia, payload }, opts)
          else crear.mutate(payload, opts)
        }}
      />
    </div>
  )
}

function MateriaFormModal({
  open,
  materia,
  onClose,
  onSubmit,
  guardando,
  error,
}: {
  open: boolean
  materia: Materia | null
  onClose: () => void
  onSubmit: (payload: { nombre: string; descripcion: string | null }) => void
  guardando: boolean
  error: string | null
}) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    if (open) {
      setNombre(materia?.nombre ?? '')
      setDescripcion(materia?.descripcion ?? '')
    }
  }, [open, materia])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit({ nombre: nombre.trim(), descripcion: descripcion.trim() || null })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={materia ? 'Editar materia' : 'Nueva materia'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="materia-form" loading={guardando}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="materia-form" onSubmit={submit} className="flex flex-col gap-4">
        <Input
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          maxLength={60}
        />
        <Input
          label="Descripción (opcional)"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={255}
        />
        {error && (
          <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:text-rose-300">
            {error}
          </div>
        )}
      </form>
    </Modal>
  )
}
