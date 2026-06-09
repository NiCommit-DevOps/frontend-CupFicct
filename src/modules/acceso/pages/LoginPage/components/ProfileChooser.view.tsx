import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export type TipoCuenta = 'estudiante' | 'docente' | 'administrativo'

/** Etiqueta de la barra de la tarjeta (mayúsculas) y del encabezado del formulario. */
export const TIPO_LABELS: Record<TipoCuenta, { card: string; form: string }> = {
  estudiante: { card: 'ESTUDIANTE', form: 'Estudiantes' },
  docente: { card: 'DOCENTE', form: 'Docentes' },
  administrativo: { card: 'ADMINISTRATIVO', form: 'Administrativos' },
}

/* --- Pictogramas (silueta negra, estilo del portal) ---------------------- */

function PersonaBusto() {
  return (
    <>
      <circle cx="30" cy="29" r="11" />
      <path d="M11 70 C11 50 49 50 49 70 Z" />
    </>
  )
}

function IconEstudiante() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className="h-full w-full">
      <PersonaBusto />
      {/* pupitre */}
      <rect x="40" y="63" width="50" height="6" />
      <rect x="44" y="69" width="5" height="22" />
      <rect x="83" y="69" width="5" height="22" />
      {/* libro sobre el pupitre */}
      <path d="M48 61 l10 -3 10 3 -10 3 z" />
    </svg>
  )
}

function IconDocente() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className="h-full w-full">
      <PersonaBusto />
      {/* pizarra (contorno para respetar claro/oscuro) */}
      <rect x="50" y="12" width="44" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
      <text x="72" y="33" fontSize="11" fontFamily="serif" textAnchor="middle">
        v=⁴⁄₃πr
      </text>
      {/* base de la pizarra */}
      <rect x="56" y="44" width="3" height="10" />
      <rect x="85" y="44" width="3" height="10" />
    </svg>
  )
}

function IconAdministrativo() {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className="h-full w-full">
      <PersonaBusto />
      {/* monitor (contorno) */}
      <rect x="50" y="30" width="42" height="30" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="67" y="60" width="8" height="6" />
      <rect x="58" y="66" width="26" height="4" />
    </svg>
  )
}

const TARJETAS: { tipo: TipoCuenta; icon: ReactNode }[] = [
  { tipo: 'estudiante', icon: <IconEstudiante /> },
  { tipo: 'docente', icon: <IconDocente /> },
  { tipo: 'administrativo', icon: <IconAdministrativo /> },
]

interface Props {
  onSelect: (tipo: TipoCuenta) => void
}

export function ProfileChooser({ onSelect }: Props) {
  return (
    <div className="flex w-full flex-col items-center">
      <h1 className="mt-2 text-3xl font-bold text-accent-600 dark:text-accent-500">Bienvenido al Perfil</h1>
      <h2 className="mt-6 text-xl font-bold text-brand-600 dark:text-brand-400">Elige tu tipo de cuenta</h2>

      <div className="mt-8 flex items-start justify-center gap-4">
        {TARJETAS.map(({ tipo, icon }) => (
          <button
            key={tipo}
            type="button"
            onClick={() => onSelect(tipo)}
            className="group relative flex h-[150px] w-[150px] flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-sm transition-all duration-200 hover:z-10 hover:scale-110 hover:border-brand-300 hover:bg-panel-light hover:shadow-2xl dark:border-slate-700/40 dark:bg-slate-800/40 dark:hover:border-brand-700 dark:hover:bg-panel-dark"
          >
            <span className="flex flex-1 items-center justify-center p-7 text-slate-700 transition-all duration-200 group-hover:p-5 dark:text-slate-200">
              {icon}
            </span>
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-brand-500 py-2 text-center text-xs font-bold tracking-widest text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              {TIPO_LABELS[tipo].card}
            </span>
          </button>
        ))}
      </div>

      {/* Enlaces decorativos (sin acción por ahora) */}
      <button
        type="button"
        className="mt-12 text-sm font-bold text-brand-600 hover:underline dark:text-brand-400"
        onClick={(e) => e.preventDefault()}
      >
        ¿Olvidaste tu contraseña?
      </button>
      <Link
        to="/pagar"
        className="mt-6 text-sm font-bold text-brand-600 hover:underline dark:text-brand-400"
      >
        Habilitación de servicios de cobros para personas externas
      </Link>
    </div>
  )
}
