import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/shared/ui'

const iconLogin = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
  </svg>
)

/** Barra superior pública: marca FICCT, tema e ingreso al sistema (login interno). */
export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-panel-bgLight/80 backdrop-blur dark:border-slate-700/40 dark:bg-panel-bgDark/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-base font-extrabold text-white">F</span>
          <span className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-tight text-brand-600 dark:text-brand-300">FICCT</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">UAGRM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <a href="#inicio" className="transition-colors hover:text-brand-600 dark:hover:text-white">Inicio</a>
          <a href="#convocatoria" className="transition-colors hover:text-brand-600 dark:hover:text-white">Convocatoria</a>
          <a href="#contacto" className="transition-colors hover:text-brand-600 dark:hover:text-white">Contacto</a>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-500/70 px-4 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white dark:border-brand-400/50 dark:text-brand-300 dark:hover:bg-brand-500 dark:hover:text-white"
          >
            {iconLogin} Iniciar sesión
          </Link>
        </div>
      </div>

      {/* Línea institucional tricolor. */}
      <div className="flex h-0.5 w-full">
        <span className="h-full flex-1 bg-brand-500" />
        <span className="h-full flex-1 bg-accent-500" />
        <span className="h-full flex-1 bg-emerald-500" />
      </div>
    </header>
  )
}
