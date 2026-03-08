export type Theme = 'light' | 'dark' | 'system'

const THEME_KEY = 'theme'

function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function getStoredTheme(): Theme {
  if (
    typeof window === 'undefined' ||
    !window.localStorage ||
    typeof window.localStorage.getItem !== 'function'
  )
    return 'system'
  const raw = window.localStorage.getItem(THEME_KEY)
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

export function setStoredTheme(value: Theme): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(THEME_KEY, value)
}

export function applyTheme(value: Theme): void {
  if (typeof document === 'undefined') return
  const isDark =
    value === 'dark' || (value === 'system' && getSystemDark())
  document.documentElement.classList.toggle('dark', isDark)
}

export function resolveTheme(): Theme {
  const stored = getStoredTheme()
  if (stored !== 'system') return stored
  return getSystemDark() ? 'dark' : 'light'
}
