/** CU05 — Tipos del módulo de pagos (pasarela PayPal + historial). */

export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'

/** Configuración pública del botón de PayPal (servida por el backend). */
export interface PagoConfig {
  client_id: string
  currency: string
  monto: number
  moneda: string
}

/** Deuda pendiente del postulante, localizada por su carnet (CI). */
export interface DeudaInscripcion {
  pagado: boolean
  concepto: string
  monto: number
  moneda: string
  postulante: {
    ci: string
    nombres: string
    apellidos: string
    codigo_tramite: number
  }
  inscripcion: {
    id_inscripcion: number
    estado_academico: string
    turno_preferencia: string | null
  }
}

/** Credenciales habilitadas tras el pago exitoso. */
export interface CredencialesAcceso {
  usuario: string
  contrasena: string
  esta_activo: boolean
}

/** Grupo asignado automáticamente al confirmarse el pago (si hubo cupo). */
export interface GrupoAsignado {
  id_grupo: number
  sigla: string
  nombre: string
  turno: string | null
}

/** Respuesta de la captura: comprobante + automatización del negocio. */
export interface ResultadoPago {
  message: string
  pago: Pago
  credenciales: CredencialesAcceso
  grupo: GrupoAsignado | null
  estado_academico: string
}

/* ----------------------- CU15 — Reportes de pagos ------------------------ */

export interface FilaPorEstado {
  estado: EstadoPago
  cantidad: number
  monto_total: number
}

export interface FilaPorMetodo {
  metodo: string
  cantidad: number
  monto_total: number
}

/** Postulante aprobado (ELEGIBLE) que aún no pagó. */
export interface PendientePago {
  id_inscripcion: number
  codigo_tramite: number | null
  ci: string | null
  nombres: string | null
  apellidos: string | null
  convocatoria: string | null
  fecha_inscripcion: string | null
  monto: number
}

export interface ReportePagos {
  resumen: {
    total_recaudado: number
    moneda: string
    cantidad_total: number
    cantidad_aprobados: number
    promedio_aprobado: number
    cantidad_pendientes_pago: number
    monto_por_cobrar: number
  }
  por_estado: FilaPorEstado[]
  por_metodo: FilaPorMetodo[]
  pendientes_pago: PendientePago[]
  catalogos: {
    estados: EstadoPago[]
    metodos: string[]
    convocatorias: { id_convocatoria: number; nombre: string }[]
  }
}

export interface ReportePagosFiltros {
  desde?: string
  hasta?: string
  estado?: string
  metodo?: string
  id_convocatoria?: number
}

/** Transacción de pago (historial). */
export interface Pago {
  id_pago: number
  monto: number
  moneda: string
  estado: EstadoPago
  metodo: string
  transaccion_id: string | null
  fecha: string | null
  inscripcion?: {
    id_inscripcion: number
    estado_academico: string
    postulante: {
      ci: string
      nombres: string
      apellidos: string
    } | null
  }
}
