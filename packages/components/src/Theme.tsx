import { MotionConfig } from 'motion/react'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isBrowser } from './internal/util'

export type ThemeChoice = 'dark' | 'light' | 'system'
type Ctx = { theme: ThemeChoice; resolved: 'dark' | 'light'; setTheme: (t: ThemeChoice) => void }

const ThemeContext = createContext<Ctx>({ theme: 'dark', resolved: 'dark', setTheme: () => {} })

const read = (key?: string): ThemeChoice | null => {
  if (!key || !isBrowser) return null
  try {
    const v = localStorage.getItem(key)
    return v === 'dark' || v === 'light' || v === 'system' ? v : null
  } catch {
    return null
  }
}

const systemDark = () => !isBrowser || matchMedia('(prefers-color-scheme: dark)').matches

/**
 * Sets `data-theme` on <html>, follows the OS when set to `system`, and tells Motion to
 * respect the user's reduced-motion setting. Components also work without it (dark theme).
 */
export function NoirProvider({ children, defaultTheme = 'system', storageKey }: { children: ReactNode; defaultTheme?: ThemeChoice; storageKey?: string }) {
  const [theme, setThemeState] = useState<ThemeChoice>(() => read(storageKey) ?? defaultTheme)
  const [dark, setDark] = useState(systemDark)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const on = () => setDark(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const resolved = theme === 'system' ? (dark ? 'dark' : 'light') : theme

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  const value = useMemo<Ctx>(
    () => ({
      theme,
      resolved,
      setTheme: (t) => {
        setThemeState(t)
        if (storageKey)
          try {
            localStorage.setItem(storageKey, t)
          } catch {
            /* storage unavailable */
          }
      },
    }),
    [theme, resolved, storageKey],
  )

  return (
    <ThemeContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
