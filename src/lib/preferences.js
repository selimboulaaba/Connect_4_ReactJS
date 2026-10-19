import { useCallback, useEffect, useSyncExternalStore } from 'react'

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
  } catch { /* storage unavailable */ }
  listeners.forEach((l) => l())
}
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** pref: 'system' | 'light' | 'dark'. resolved: what is actually shown. */
export function useTheme() {
  const pref = useSyncExternalStore(subscribe, () => read('theme', 'system'))
  const resolved = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme || 'light')

  // Re-render when the device setting flips while on "system".
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => listeners.forEach((l) => l())
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const setPref = useCallback((value) => {
    write('theme', value)
    window.__applyTheme?.()
    listeners.forEach((l) => l())
  }, [])

  return { pref, resolved, setPref }
}

export const isMuted = () => read('muted', 'false') === 'true'

export function useMuted() {
  const muted = useSyncExternalStore(subscribe, isMuted)
  const toggle = useCallback(() => write('muted', String(!isMuted())), [])
  return { muted, toggle }
}
