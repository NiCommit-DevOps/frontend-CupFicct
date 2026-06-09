/* ===========================================================================
 * Módulo Académico (oferta y recursos: carreras, aulas, docentes, grupos)
 * CU17 — Gestionar Aulas y Recursos Físicos
 * CU10 — Gestionar Docentes y Horarios
 * ========================================================================= */

import type { Sexo, Usuario } from '@/modules/acceso/types'

/* --- CU17: Aulas --------------------------------------------------------- */

/** Módulo/edificio fijo de la FICCT (constante en el nombre del aula). */
export const AULA_MODULO = '236'

/** Número máximo de aulas por piso. */
export const AULA_MAX = 8

export interface Aula {
  id_aula: number
  nombre: string
  capacidad: number
  ubicacion: string | null
  modulo: string
  piso: number | null
  numero: number | null
}

/** Payload de creación/edición: el backend compone nombre y ubicación. */
export interface AulaPayload {
  piso: number
  numero: number
  capacidad: number
}

/* --- CU06/CU10: Materias y docentes --------------------------------------- */

export interface Materia {
  id_materia: number
  nombre: string
  descripcion: string | null
  docentes_count?: number
}

export interface MateriaPayload {
  nombre: string
  descripcion?: string | null
}

/* --- CU06/CU10: Horario de clases ---------------------------------------- */

/** Una clase del horario: materia + días + rango de horas (HH:MM). */
export interface ClaseHorario {
  id_materia: number
  materia: string | null
  dias: string
  hora_inicio: string
  hora_fin: string
}

/** Horario general agrupado por turno (sección Horario de Materias). */
export interface TurnoHorario {
  turno: string
  clases: ClaseHorario[]
}

/** Un grupo con su horario y aula (vista de docente/postulante). */
export interface GrupoHorario {
  id_grupo: number
  sigla: string
  nombre: string
  turno: string | null
  aula: { nombre: string; ubicacion: string | null } | null
  clases: ClaseHorario[]
}

/** "Mi horario": el rol determina la presentación (docente vs. boleta). */
export interface MiHorario {
  rol: string
  grupos: GrupoHorario[]
}

/** Convocatoria asociada a un docente (subconjunto para listados/selectores). */
export interface DocenteConvocatoria {
  id_convocatoria: number
  nombre: string
  id_gestion: number
}

/** Grupo asignado a un docente (subconjunto para listados/selectores). */
export interface DocenteGrupo {
  id_grupo: number
  sigla: string
  nombre: string
  turno: string | null
}

export interface Docente {
  id_docente: number
  profesion: string | null
  carga_horaria: number | null
  especialidad: string | null
  tiene_maestria: boolean
  tiene_diplomado: boolean
  usuario?: Usuario | null
  materias?: Materia[]
  convocatorias?: DocenteConvocatoria[]
  grupos?: DocenteGrupo[]
}

/** Payload de creación: crea el Usuario base (rol Docente) + el perfil docente.
 *  La contraseña la genera el backend (inicial apellidos + "." + CI). */
export interface DocenteCreatePayload {
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1?: string | null
  telefono2?: string | null
  fecha_nacimiento: string
  sexo?: Sexo | null
  profesion?: string | null
  carga_horaria?: number | null
  especialidad?: string | null
  tiene_maestria?: boolean
  tiene_diplomado?: boolean
  materias?: number[]
  convocatorias?: number[]
  grupos?: number[]
}

/** Payload de actualización: solo perfil docente + materias (datos personales vía CU02/CU18). */
export interface DocenteUpdatePayload {
  profesion?: string | null
  carga_horaria?: number | null
  especialidad?: string | null
  tiene_maestria?: boolean
  tiene_diplomado?: boolean
  materias?: number[]
  convocatorias?: number[]
  grupos?: number[]
}

/* --- CU09: Grupos de examen y asignación ---------------------------------- */

export const GRUPO_TURNOS = ['Mañana', 'Tarde', 'Noche'] as const
export type GrupoTurno = (typeof GRUPO_TURNOS)[number]

export interface GrupoAula {
  id_aula: number
  nombre: string
  capacidad: number
}

export interface Grupo {
  id_grupo: number
  sigla: string
  nombre: string
  turno: string | null
  capacidad_max: number
  cupo_usado: number
  cupo_disponible: number
  aula?: GrupoAula | null
}

export interface GrupoPayload {
  sigla: string
  nombre: string
  turno: string
  capacidad_max: number
  id_aula: number | null
}

export interface GrupoCatalogos {
  aulas: GrupoAula[]
  turnos: string[]
}

/** Postulante ELEGIBLE para el panel de asignación de grupos. */
export interface PostulanteElegible {
  id_inscripcion: number
  turno_preferencia: string | null
  id_grupo: number | null
  grupo: { id_grupo: number; sigla: string } | null
  postulante: {
    id_postulante: number
    codigo_tramite: number
    nombres: string | null
    apellidos: string | null
    ci: string | null
  } | null
  carreras: { id_carrera: number; nombre: string }[]
}

/** Cálculo automático del módulo de asignación (capacidad 70 fija, sobre ELEGIBLE). */
export interface ResumenAsignacion {
  total_inscritos: number
  capacidad_grupo: number
  grupos_necesarios: number
  estudiantes_por_grupo: number[]
  grupos_creados: number
  asignados: number
  sin_asignar: number
}

export interface AsignacionData {
  convocatoria: { id_convocatoria: number; nombre: string } | null
  grupos: Grupo[]
  postulantes: PostulanteElegible[]
  resumen: ResumenAsignacion
}

export interface AsignacionResumen {
  message: string
  resumen: Record<string, number>
}
