/* ===========================================================================
 * Modulo_Examenes
 * CU08 — Gestionar Cupos por Carrera
 * ========================================================================= */

export interface Carrera {
  id_carrera: number
  nombre: string
  modalidad: string | null
  codigo: string
  plan: string | null
  area: string | null
  cupos: number
}

/** Payload de creación/edición de una carrera. */
export interface CarreraPayload {
  nombre: string
  codigo: string
  modalidad: string
  area: string
  plan?: string | null
  cupos: number
}

/** Catálogos para los selectores (provistos por el backend). */
export interface CarreraCatalogos {
  modalidades: string[]
  areas: string[]
}

/* ===========================================================================
 * CU06 — Banco de preguntas (opción múltiple)
 * ========================================================================= */

export interface MateriaOption {
  id_materia: number
  nombre: string
}

/* ===========================================================================
 * CU06 — Notas por materia (carga manual)
 * ========================================================================= */

/** Notas de un examen (1..3): promedio del examen + nota por materia. */
export interface ExamenNotas {
  numero_examen: number
  promedio: number | null
  /** id_materia => nota (0-100 o null). */
  materias: Record<string, number | null>
}

/** Fila del staff: un postulante con sus 3 exámenes. */
export interface ResultadoFila {
  id_inscripcion: number
  postulante: { ci: string; nombres: string; apellidos: string } | null
  examenes: Record<string, ExamenNotas>
  promedio_final: number | null
  estado_academico: string
}

export interface ResultadosData {
  materias: MateriaOption[]
  inscripciones: ResultadoFila[]
}

/** Ítem de carga: nota de una materia en un examen. */
export interface NotaItem {
  numero_examen: number
  id_materia: number
  nota: number | null
}

export interface ResultadosFiltros {
  id_gestion?: number
  id_convocatoria?: number
  buscar?: string
}

/* --- CU06: Carga masiva de notas desde archivo --------------------------- */

export interface ErrorImportacionNota {
  fila: number
  ci: string
  motivo: string
}

export interface ResultadoImportacionNotas {
  message: string
  total: number
  /** Cantidad de postulantes a los que se les cargó notas. */
  creados: number
  errores: ErrorImportacionNota[]
}

/* --- CU06: Consulta del postulante (solo lectura) ------------------------- */

export interface MateriaNota {
  id_materia: number
  nombre: string
  nota: number | null
}

export interface ExamenAlumno {
  numero_examen: number
  promedio: number | null
  materias: MateriaNota[]
}

export interface MisResultados {
  materias: MateriaOption[]
  examenes: ExamenAlumno[]
  promedio_final: number | null
  estado_academico: string
}

/* --- CU07: Corte de admisión ---------------------------------------------- */

export interface CorteResumen {
  pendientes_examen: number
  aprobados: number
  admitidos: number
  aprobados_sin_cupo: number
  reprobados: number
}

export interface CortePorCarrera {
  id_carrera: number
  carrera: string
  cupos: number
  admitidos: number
}

export interface CorteData {
  resumen: CorteResumen
  por_carrera: CortePorCarrera[]
}

/* --- CU16: Historial académico -------------------------------------------- */

export interface HistorialFila {
  id_inscripcion: number
  codigo_tramite: number | null
  postulante: { ci: string; nombres: string; apellidos: string } | null
  gestion: string | null
  convocatoria: string | null
  notas: Record<string, number | null>
  promedio_final: number | null
  estado_academico: string
  carrera_admitida: string | null
}

/* --- CU12: Reportes oficiales --------------------------------------------- */

export interface ActaAdmitido {
  codigo_tramite: number | null
  ci: string | null
  nombres: string | null
  apellidos: string | null
  promedio_final: number | null
}

export interface ActaGrupo {
  carrera: string
  admitidos: ActaAdmitido[]
}

export interface ActaData {
  convocatoria: string
  gestion: string | null
  total: number
  por_carrera: ActaGrupo[]
}

export interface PadronFila {
  id_inscripcion: number
  codigo_tramite: number | null
  ci: string | null
  nombres: string | null
  apellidos: string | null
  carrera_1: string | null
  carrera_2: string | null
  notas: Record<string, number | null>
  promedio_final: number | null
  estado_academico: string
  carrera_admitida: string | null
}

export interface PadronData {
  convocatoria: string
  gestion: string | null
  total: number
  filas: PadronFila[]
}

export interface CertificadoFila extends PadronFila {
  gestion?: string | null
  convocatoria?: string | null
}

/* --- Reportes obligatorios adicionales ----------------------------------- */

export type FiltroLista = 'todos' | 'aprobados' | 'reprobados'

export interface ListaData {
  convocatoria: string
  gestion: string | null
  filtro: FiltroLista
  total: number
  filas: PadronFila[]
}

export interface PromediosGenerales {
  total_con_nota: number
  promedio_general: number
  promedio_maximo: number
  promedio_minimo: number
  aprobados: number
  reprobados: number
}

export interface EstadisticaMateria {
  materia: string
  registradas: number
  promedio: number
  aprobadas: number
  porcentaje_aprobacion: number
}

export interface GrupoAprobados {
  id_grupo: number
  sigla: string
  nombre: string
  inscritos: number
  aprobados: number
}

export interface GruposHabilitados {
  total: number
  manana: number
  tarde: number
}

export interface EstadisticasData {
  convocatoria: string
  gestion: string | null
  grupos_habilitados: GruposHabilitados
  promedios_generales: PromediosGenerales
  por_materia: EstadisticaMateria[]
  grupos_top_aprobados: GrupoAprobados[]
}

export interface DocenteGrupoFila {
  id_grupo: number
  sigla: string
  nombre: string
  turno: string | null
  inscritos: number
  aprobados: number
  docentes: { id_docente: number; nombre: string; profesion: string | null }[]
}
