/* ===========================================================================
 * Módulo Registro (Modulo_Registro)
 * CU04 — Gestionar Postulantes
 * ========================================================================= */

import type { Sexo, Usuario } from '@/modules/acceso/types'

export interface UnidadEducativa {
  id_unidad: number
  nombre: string
}

export interface CarreraOpcion {
  id_carrera: number
  nombre: string
  modalidad: string | null
}

export interface ConvocatoriaVigente {
  id_convocatoria: number
  nombre: string
  fecha_limite_inscripcion: string | null
}

/** Catálogos para el formulario de alta de postulantes (staff). */
export interface InscripcionCatalogos {
  convocatoria: ConvocatoriaVigente | null
  carreras: CarreraOpcion[]
  unidades: UnidadEducativa[]
  turnos: string[]
}

/**
 * Payload del alta de postulante por el staff.
 * La contraseña la genera el backend (inicial apellidos + "." + CI).
 */
export interface PostulanteCreatePayload {
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1?: string | null
  telefono2?: string | null
  fecha_nacimiento: string
  sexo?: Sexo | null
  direccion?: string | null
  id_unidad?: number | null
  procedencia?: string | null
  /** Documento del título de bachiller (PDF o imagen). Su presencia define titulo_bachiller. */
  titulo_archivo?: File | null
  anio_egreso?: number | null
  otros?: string | null
  id_carrera: number
  id_carrera_2?: number | null
  turno_preferencia: string
}

/** Payload de modificación de datos del postulante (mismos campos que el alta). */
export type PostulanteUpdatePayload = PostulanteCreatePayload

export interface InscripcionResumen {
  id_inscripcion: number
  estado_academico: string
  turno_preferencia: string | null
  fecha_inscripcion: string | null
  promedio_final?: number | null
  convocatoria: { id_convocatoria: number; nombre: string } | null
  carreras: { id_carrera: number; nombre: string; orden?: number }[]
  carrera_admitida?: number | null
}

export interface Postulante {
  id_postulante: number
  codigo_tramite: number
  procedencia: string | null
  direccion: string | null
  titulo_bachiller: boolean
  tiene_titulo_archivo: boolean
  anio_egreso: number | null
  otros: string | null
  usuario?: Usuario | null
  unidad_educativa?: { id_unidad: number; nombre: string } | null
  inscripcion?: InscripcionResumen | null
}

/** CU14 — Resultado de la carga masiva de postulantes. */
export interface ErrorImportacion {
  fila: number
  ci: string
  motivo: string
}

export interface ResultadoImportacion {
  message: string
  total: number
  creados: number
  errores: ErrorImportacion[]
}
