/**
 * Mapeo de estados académicos de la inscripción a su presentación de cara al staff.
 * Compartido por la tabla y el modal de detalle de Postulantes.
 */
export const estadoTone: Record<string, 'brand' | 'success' | 'danger' | 'neutral'> = {
  PENDIENTE: 'neutral',
  ELEGIBLE: 'success',
  ADMITIDO: 'success',
  REPROBADO: 'danger',
  APROBADO_SIN_CUPO: 'brand',
}

/** Etiqueta de cara al staff: la revisión de postulantes habla de Aprobado/Rechazado. */
export const estadoLabel: Record<string, string> = {
  PENDIENTE: 'PENDIENTE',
  ELEGIBLE: 'APROBADO',
  ADMITIDO: 'ADMITIDO',
  REPROBADO: 'RECHAZADO',
  APROBADO_SIN_CUPO: 'APROBADO SIN CUPO',
}
