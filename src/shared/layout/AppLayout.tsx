import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/auth/AuthContext'
import { ThemeToggle, Button } from '@/shared/ui'

interface NavItem {
  to: string
  label: string
  permiso?: string
  icon: React.ReactNode
}

interface NavModule {
  label: string
  icon: React.ReactNode
  items: NavItem[]
}

/* Iconos reutilizables para los CU. */
const iconUsuarios = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
)
const iconRoles = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
  </svg>
)
const iconPerfil = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
)
const iconConvocatoria = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
  </svg>
)
const iconAula = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9h.01M9 13h.01M9 17h.01" />
  </svg>
)
const iconCarrera = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.42A12 12 0 0112 21a12 12 0 01-6.16-10.42L12 14z" />
  </svg>
)
const iconDocente = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M9 7h6" />
  </svg>
)
const iconPostulante = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3M8 12h.01M8 16h.01" />
  </svg>
)
const iconGrupo = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a3 3 0 10-2.8-4M5 11a3 3 0 102.8-4" />
  </svg>
)
const iconHorario = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
  </svg>
)
const iconPago = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h20M2 7v10a2 2 0 002 2h16a2 2 0 002-2V7M2 7l2-3h16l2 3M6 15h4" />
  </svg>
)
const iconReportePago = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-4m3 4v-7m3 7v-2M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)
const iconBitacora = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
  </svg>
)
const iconPregunta = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

/* Iconos de cada módulo (encabezado del grupo). */
const modIconAcceso = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
  </svg>
)
const modIconRegistro = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" />
  </svg>
)
const modIconExamenes = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
)
const modIconAcademico = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.42A12 12 0 0112 21a12 12 0 01-6.16-10.42L12 14zM12 14v7" />
  </svg>
)
const modIconReportes = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6m4 6V7m4 10v-3M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)
const modIconAdministrativo = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 3.3a1 1 0 011.4 0l1 1a1 1 0 00.9.3l1.4-.2a1 1 0 011.1.7l.5 1.3a1 1 0 00.6.6l1.3.5a1 1 0 01.7 1.1l-.2 1.4a1 1 0 00.3.9l1 1a1 1 0 010 1.4l-1 1a1 1 0 00-.3.9l.2 1.4a1 1 0 01-.7 1.1l-1.3.5a1 1 0 00-.6.6l-.5 1.3a1 1 0 01-1.1.7l-1.4-.2a1 1 0 00-.9.3l-1 1a1 1 0 01-1.4 0l-1-1a1 1 0 00-.9-.3l-1.4.2a1 1 0 01-1.1-.7l-.5-1.3a1 1 0 00-.6-.6l-1.3-.5a1 1 0 01-.7-1.1l.2-1.4a1 1 0 00-.3-.9l-1-1a1 1 0 010-1.4l1-1a1 1 0 00.3-.9l-.2-1.4a1 1 0 01.7-1.1l1.3-.5a1 1 0 00.6-.6l.5-1.3a1 1 0 011.1-.7l1.4.2a1 1 0 00.9-.3l1-1z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

/**
 * Navegación organizada por módulos (paquetes), espejo de la documentación.
 * Cada CU pendiente queda comentado en su módulo para guiar su implementación.
 * Los módulos sin CU visible se ocultan automáticamente.
 */
const navModules: NavModule[] = [
  {
    label: 'Acceso',
    icon: modIconAcceso,
    items: [
      // CU01 — Gestionar Sesión: login/logout (no requiere ítem de menú).
      { to: '/usuarios', label: 'Usuarios', permiso: 'usuarios.index', icon: iconUsuarios }, // CU02
      { to: '/roles', label: 'Roles y permisos', permiso: 'roles.index', icon: iconRoles }, // CU03
      { to: '/perfil', label: 'Mi perfil', icon: iconPerfil }, // CU18
    ],
  },
  {
    label: 'Registro',
    icon: modIconRegistro,
    items: [
      { to: '/postulantes', label: 'Postulantes', permiso: 'postulantes.index', icon: iconPostulante }, // CU04
      // CU05 — Historial de pagos: sin permiso, cada usuario ve sus propias transacciones
      // (el staff con permiso 'pagos.index' ve el historial global desde el mismo módulo).
      { to: '/pagos', label: 'Historial de pagos', icon: iconPago },
      // CU14 Cargar Usuarios por Lotes (pendiente)
    ],
  },
  {
    label: 'Académico',
    icon: modIconAcademico,
    items: [
      // Oferta y recursos académicos: carreras, aulas, docentes (y a futuro grupos).
      { to: '/carreras', label: 'Carreras', permiso: 'carreras.index', icon: iconCarrera }, // CU08
      { to: '/materias', label: 'Materias', permiso: 'materias.index', icon: iconPregunta }, // CU06/CU10
      { to: '/aulas', label: 'Aulas', permiso: 'aulas.index', icon: iconAula }, // CU17
      { to: '/docentes', label: 'Docentes', permiso: 'docentes.index', icon: iconDocente }, // CU10
      { to: '/grupos', label: 'Grupos', permiso: 'grupos.index', icon: iconGrupo }, // CU09
      // CU06/CU10 — Horario propio: docente (sus grupos) y postulante (su boleta).
      { to: '/horario', label: 'Mi horario', permiso: 'horario.index', icon: iconHorario },
    ],
  },
  {
    label: 'Exámenes',
    icon: modIconExamenes,
    items: [
      { to: '/mis-examenes', label: 'Mis exámenes', permiso: 'examenes.rendir', icon: iconPregunta }, // CU06 (postulante)
      { to: '/resultados', label: 'Registro de notas', permiso: 'notas.index', icon: iconReportePago }, // CU06 (staff)
      { to: '/corte', label: 'Corte de admisión', permiso: 'admision.index', icon: iconCarrera }, // CU07
    ],
  },
  {
    label: 'Reportes',
    icon: modIconReportes,
    items: [
      { to: '/reportes/academicos', label: 'Reportes académicos', permiso: 'reportes.index', icon: iconReportePago }, // CU12
      { to: '/reportes/pagos', label: 'Reportes de pagos', permiso: 'pagos.reportes', icon: iconReportePago }, // CU15
      { to: '/historial', label: 'Historial académico', permiso: 'historial.index', icon: iconBitacora }, // CU16
    ],
  },
  {
    label: 'Administrativo',
    icon: modIconAdministrativo,
    items: [
      { to: '/dashboard', label: 'Dashboard', permiso: 'dashboard.index', icon: modIconReportes }, // CU13
      { to: '/convocatorias', label: 'Convocatorias', permiso: 'gestiones.index', icon: iconConvocatoria }, // CU19
      { to: '/bitacora', label: 'Bitácora', permiso: 'bitacora.index', icon: iconBitacora }, // CU11
    ],
  },
]

const chevron = (
  <svg className="h-4 w-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

export function AppLayout() {
  const { usuario, logout, tienePermiso } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  // Solo módulos con al menos un CU visible para el usuario.
  const modulosVisibles = navModules
    .map((mod) => ({
      ...mod,
      items: mod.items.filter((item) => !item.permiso || tienePermiso(item.permiso)),
    }))
    .filter((mod) => mod.items.length > 0)

  // Por defecto se expanden todos los módulos visibles para que el usuario vea
  // de una toda la navegación (sigue pudiendo colapsar cada uno manualmente).
  const [expandidos, setExpandidos] = useState<string[]>(() =>
    modulosVisibles.map((m) => m.label),
  )

  const toggleModulo = (label: string) =>
    setExpandidos((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )

  const iniciales = `${usuario?.nombres?.[0] ?? ''}${usuario?.apellidos?.[0] ?? ''}`.toUpperCase()

  return (
    <div className="flex min-h-screen bg-panel-bgLight dark:bg-panel-bgDark">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/60 bg-panel-light p-4 dark:border-slate-700/40 dark:bg-panel-dark md:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-bold text-white">
            C
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">CUP FICCT</p>
            <p className="text-xs text-slate-400">Sistema de Admisión</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {modulosVisibles.map((mod) => {
            const abierto = expandidos.includes(mod.label)
            return (
              <div key={mod.label} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => toggleModulo(mod.label)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  {mod.icon}
                  <span className="flex-1 text-left">{mod.label}</span>
                  <span className={abierto ? 'rotate-90' : ''}>{chevron}</span>
                </button>

                {abierto && (
                  <div className="mt-1 flex flex-col gap-1 pl-3">
                    {mod.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-brand-500 text-white'
                              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`
                        }
                      >
                        {item.icon}
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Contenido */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200/60 bg-panel-light px-6 py-3.5 dark:border-slate-700/40 dark:bg-panel-dark">
          <div className="md:hidden">
            <span className="font-semibold text-brand-500">CUP FICCT</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/60 px-3 py-1.5 dark:border-slate-700/40">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
                {iniciales || '··'}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {usuario?.nombres} {usuario?.apellidos}
                </p>
                <p className="text-[11px] text-slate-400">{usuario?.rol?.nombre ?? 'Sin rol'}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Salir
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
