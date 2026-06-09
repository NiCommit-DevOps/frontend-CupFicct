import { useTheme } from '@/shared/theme/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const esDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      className="rounded-xl p-2 text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-brand-300 dark:hover:bg-brand-950 dark:hover:text-brand-100"
      aria-label={esDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={esDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {esDark ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}
