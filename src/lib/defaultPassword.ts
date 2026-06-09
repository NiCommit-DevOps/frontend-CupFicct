/**
 * Contraseña por defecto generada al dar de alta a un usuario del staff
 * (docentes, postulantes…). Espejo de la lógica del backend
 * (DocenteService / PostulanteService::contrasenaPorDefecto).
 *
 * Formato: inicial del 1er apellido (mayúscula) + inicial del 2º apellido
 * (minúscula) + "." + CI. Ej: "Verduguez Teran" + 16109930 → "Vt.16109930".
 *
 * NOTA: es la contraseña INICIAL generada al crear la cuenta; si el usuario
 * la cambió luego, ya no coincide (las contraseñas se guardan hasheadas y no
 * pueden recuperarse).
 */
export function defaultPassword(apellidos: string, ci: string): string {
  const partes = apellidos.trim().split(/\s+/).filter(Boolean)
  const iniciales =
    (partes[0]?.charAt(0).toUpperCase() ?? '') + (partes[1]?.charAt(0).toLowerCase() ?? '')
  const ciLimpio = ci.trim()
  return iniciales && ciLimpio ? `${iniciales}.${ciLimpio}` : ''
}
