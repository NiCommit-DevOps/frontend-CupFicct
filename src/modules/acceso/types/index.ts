export type Sexo = 'M' | 'F' | 'Otro'

export interface Permiso {
  id_permiso: number
  modulo: string
  descripcion: string | null
}

export interface Rol {
  id_rol: number
  nombre: string
  permisos_count?: number
  permisos?: Permiso[]
}

export interface Usuario {
  id_usuario: number
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1: string | null
  telefono2: string | null
  fecha_nacimiento: string | null
  sexo: Sexo | null
  esta_activo: boolean
  rol?: Rol | null
  permisos?: string[]
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  usuario: Usuario
}

/** Payload para crear un usuario (CU02). */
export interface UsuarioCreatePayload {
  id_rol: number | null
  ci: string
  nombres: string
  apellidos: string
  correo: string
  telefono1?: string | null
  telefono2?: string | null
  fecha_nacimiento: string
  sexo?: Sexo | null
  contrasena: string
}

/** Payload para actualizar un usuario (todos opcionales). */
export type UsuarioUpdatePayload = Partial<Omit<UsuarioCreatePayload, 'contrasena'>> & {
  contrasena?: string
}

export interface RolPayload {
  nombre: string
}

/** Estructura de paginación de Laravel (Resource::collection paginado). */
export interface Paginated<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
  }
}

/** Matriz de permisos agrupada por módulo: { 'usuarios.index': Permiso[], ... } */
export type MatrizPermisos = Record<string, Permiso[]>
