import { apiClient } from '@/lib/apiClient'
import type { Paginated } from '@/modules/acceso/types'
import type {
  DeudaInscripcion,
  Pago,
  PagoConfig,
  ReportePagos,
  ReportePagosFiltros,
  ResultadoPago,
} from '../types'

export interface ListarPagosParams {
  page?: number
  per_page?: number
  estado?: string
}

export const pagosService = {
  /** Configuración pública del botón de PayPal (client_id + divisa). */
  async config(): Promise<PagoConfig> {
    const { data } = await apiClient.get<PagoConfig>('/public/pagos/config')
    return data
  },

  /** Busca la deuda de inscripción del postulante por su carnet. */
  async buscar(ci: string): Promise<DeudaInscripcion> {
    const { data } = await apiClient.post<DeudaInscripcion>('/public/pagos/buscar', { ci })
    return data
  },

  /** Crea la orden de PayPal y devuelve su identificador. */
  async crearOrden(ci: string): Promise<string> {
    const { data } = await apiClient.post<{ order_id: string }>('/public/pagos/orden', { ci })
    return data.order_id
  },

  /** Captura el pago aprobado y dispara la habilitación del postulante. */
  async capturar(ci: string, orderId: string): Promise<ResultadoPago> {
    const { data } = await apiClient.post<ResultadoPago>('/public/pagos/capturar', {
      ci,
      order_id: orderId,
    })
    return data
  },

  /** Historial de pagos (propio o global según permisos). */
  async listar(params: ListarPagosParams = {}): Promise<Paginated<Pago>> {
    const { data } = await apiClient.get<Paginated<Pago>>('/pagos', { params })
    return data
  },

  /** CU15 — Reporte de conciliación de caja y recaudación (staff). */
  async reporte(filtros: ReportePagosFiltros = {}): Promise<ReportePagos> {
    const { data } = await apiClient.get<ReportePagos>('/pagos/reportes', { params: filtros })
    return data
  },
}
