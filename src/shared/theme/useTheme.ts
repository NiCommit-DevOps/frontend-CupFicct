import { useCallback, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const THEME_KEY = 'cupficct.theme'

function aplicar(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

function inicial(): Theme {
  const guardado = localStorage.getItem(THEME_KEY) as Theme | null
  if (guardado) return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(inicial)

  useEffect(() => {
    aplicar(theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
