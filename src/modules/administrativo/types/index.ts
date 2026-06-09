/* ===========================================================================
 * CU19 — Gestionar Convocatoria (Módulo Administrativo)
 * ========================================================================= */

export type EstadoGestion = 'ACTIVA' | 'CERRADA'

export type EstadoConvocatoria = 'ABIERTA' | 'PROCESO_EVALUACION' | 'CONCLUIDA'

export interface Gestion {
  id_gestion: number
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  estado: EstadoGestion
  convocatorias_count?: number
}

export interface Convocatoria {
  id_convocatoria: number
  id_gestion: number
  nombre: string
  fecha_creacion: string
  fecha_limite_inscripcion: string
  estado: EstadoConvocatoria
  gestion?: Gestion
}

/** Payload para crear/actualizar una gestión. */
export interface GestionPayload {
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  estado?: EstadoGestion
}

/** Payload para aperturar una convocatoria. */
export interface ConvocatoriaCreatePayload {
  id_gestion: number
  nombre: string
  fecha_limite_inscripcion: string
}

/** Payload para actualizar datos de una convocatoria. */
export interface ConvocatoriaUpdatePayload {
  nombre: string
  fecha_limite_inscripcion: string
}

export const ESTADOS_CONVOCATORIA: { value: EstadoConvocatoria; label: string }[] = [
  { value: 'ABIERTA', label: 'Abierta' },
  { value: 'PROCESO_EVALUACION', label: 'En evaluación' },
  { value: 'CONCLUIDA', label: 'Concluida' },
]

/** CU08/CU19 — Cupo de una carrera dentro de una convocatoria. */
export interface CupoCarrera {
  id_carrera: number
  carrera: string
  codigo: string
  cupos: number
}

/** Ítem del payload para guardar cupos por convocatoria. */
export interface CupoCarreraPayload {
  id_carrera: number
  cupos: number
}

/** CU06 — Ventana (fecha/hora) de un examen de la convocatoria. */
/* --- CU13: Dashboard administrativo --------------------------------------- */

export interface DashboardKpis {
  total_inscritos: number
  total_aprobados: number
  total_reprobados: number
  total_grupos_habilitados: number
  porcentaje_aprobacion: number
  tasa_ausentismo: number
  recaudado_bs: number
}

export interface DashboardChartItem {
  etiqueta: string
  total: number
}

export interface DashboardData {
  kpis: DashboardKpis
  por_estado: Record<string, number>
  carreras_solicitadas: DashboardChartItem[]
  procedencia: DashboardChartItem[]
}

