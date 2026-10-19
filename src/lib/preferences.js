import { useCallback, useSyncExternalStore } from 'react'

// Small persisted preferences (theme, sound) shared across components.
const listeners = new Set()
const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch { /* ignore */ }
  listeners.forEach((l) => l())
}
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || 'dark')
  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    write('theme', next)
  }, [theme])
  return { theme, toggle }
}

export const isMuted = () => read('muted', 'false') === 'true'

export function useMuted() {
  const muted = useSyncExternalStore(subscribe, isMuted)
  const toggle = useCallback(() => write('muted', String(!isMuted())), [])
  return { muted, toggle }
}
