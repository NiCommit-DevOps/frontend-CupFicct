import { useState } from 'react'
import { useAuth } from '@/shared/auth/AuthContext'
import { extraerMensajeError } from '@/lib/apiClient'
import type { FiltroGestionConvocatoria } from '@/modules/administrativo/components/GestionConvocatoriaFilter'
import { useResultadosExamenes, useGuardarNotas, useImportarNotas } from '../../hooks/useResultados'
import type { NotaItem, ResultadoFila, ResultadoImportacionNotas } from '../../types'
import { ResultadosPageView } from './ResultadosPage.view'

export function ResultadosPage() {
  const { tienePermiso } = useAuth()
  const puedeEditar = tienePermiso('notas.update')

  const [filtro, setFiltro] = useState<FiltroGestionConvocatoria>({ id_gestion: null, id_convocatoria: null })
  const [buscar, setBuscar] = useState('')
  const [editando, setEditando] = useState<ResultadoFila | null>(null)
  const [resultadoImport, setResultadoImport] = useState<ResultadoImportacionNotas | null>(null)

  const resultadosQuery = useResultadosExamenes({
    id_gestion: filtro.id_gestion ?? undefined,
    id_convocatoria: filtro.id_convocatoria ?? undefined,
    buscar: buscar || undefined,
  })
  const guardarNotas = useGuardarNotas()
  const importar = useImportarNotas()

  const materias = resultadosQuery.data?.materias ?? []
  const filas = resultadosQuery.data?.inscripciones ?? []

  const importarArchivo = (archivo: File) => {
    if (filtro.id_convocatoria == null) {
      alert('Selecciona primero una convocatoria para cargar las notas.')
      return
    }
    importar.mutate(
      { archivo, idConvocatoria: filtro.id_convocatoria },
      {
        onSuccess: (res) => setResultadoImport(res),
        onError: (e) => alert(extraerMensajeError(e, 'No se pudo procesar el archivo.')),
      },
    )
  }

  // valores: clave `${numero_examen}_${id_materia}` => texto del input.
  const guardar = async (fila: ResultadoFila, valores: Record<string, string>) => {
    const notas: NotaItem[] = []
    for (const n of [1, 2, 3]) {
      for (const m of materias) {
        const raw = valores[`${n}_${m.id_materia}`] ?? ''
        notas.push({
          numero_examen: n,
          id_materia: m.id_materia,
          nota: raw === '' ? null : Number(raw),
        })
      }
    }
    await guardarNotas.mutateAsync({ id: fila.id_inscripcion, notas })
    setEditando(null)
  }

  return (
    <ResultadosPageView
      materias={materias}
      filas={filas}
      isLoading={resultadosQuery.isFetching}
      hayConvocatoria={filtro.id_convocatoria != null}
      filtro={filtro}
      onFiltroChange={setFiltro}
      buscar={buscar}
      onBuscarChange={setBuscar}
      puedeEditar={puedeEditar}
      editando={editando}
      onEditar={setEditando}
      onCerrarEditar={() => setEditando(null)}
      onGuardar={guardar}
      guardando={guardarNotas.isPending}
      error={guardarNotas.isError ? extraerMensajeError(guardarNotas.error) : null}
      onImportar={importarArchivo}
      importando={importar.isPending}
      resultadoImport={resultadoImport}
      onCerrarResultado={() => setResultadoImport(null)}
    />
  )
}
