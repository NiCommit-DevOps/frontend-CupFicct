/* ===========================================================================
 * Auto-registro público de postulantes (landing FICCT)
 * Consume los endpoints públicos /public/postulacion/* (sin autenticación).
 * ========================================================================= */

export interface ConvocatoriaPublica {
  id_convocatoria: number
  nombre: string
  fecha_creacion: string | null
  fecha_limite_inscripcion: string | null
}

export interface CarreraOpcion {
  id_carrera: number
  nombre: string
  modalidad: string | null
}

export interface UnidadEducativaOpcion {
  id_unidad: number
  nombre: string
}

/**
 * Respuesta de /public/postulacion/convocatoria.
 * Si `convocatoria` es null, hoy no hay ventana de inscripción abierta: el front
 * oculta la sección y deshabilita el formulario. Los catálogos solo vienen
 * poblados cuando hay convocatoria.
 */
export interface PostulacionData {
  convocatoria: ConvocatoriaPublica | null
  carreras: CarreraOpcion[]
  unidades: UnidadEducativaOpcion[]
  turnos: string[]
}

/** Datos que envía el postulante (sin pago: el cobro se realiza luego, presencial). */
export interface PostulacionPayload {
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1: string
  telefono2?: string | null
  fecha_nacimiento: string
  sexo: string
  direccion: string
  id_unidad: number
  procedencia: string
  /** Documento del título de bachiller (PDF o imagen). Su presencia define titulo_bachiller. */
  titulo_archivo?: File | null
  anio_egreso?: number | null
  otros?: string | null
  id_carrera: number
  id_carrera_2?: number | null
  turno_preferencia: string
}

export interface PostulacionResultado {
  message: string
  codigo_tramite: number
}
