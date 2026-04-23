import { useState, useCallback, useRef, useEffect } from 'react'
import winSound from '../assets/siu.mp3'

/**
 * HTML5 Audio — avoids use-sound options freezing on first render (volume/mute never updating).
 * Unlocks after first user gesture if autoplay blocks the win sound.
 */
export function useGameSound() {
  const [muted, setMuted] = useState(() => localStorage.getItem('muted') === 'true')
  const audioRef = useRef(null)
  const unlockHandler = useRef(null)

  useEffect(() => {
    const a = new Audio(winSound)
    a.preload = 'auto'
    audioRef.current = a
    return () => {
      if (unlockHandler.current) {
        document.removeEventListener('pointerdown', unlockHandler.current)
        unlockHandler.current = null
      }
      a.pause()
      a.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (a) a.volume = muted ? 0 : 1
  }, [muted])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      localStorage.setItem('muted', String(next))
      return next
    })
  }, [])

  const play = useCallback(() => {
    const a = audioRef.current
    if (!a || muted) return
    a.volume = muted ? 0 : 1
    try {
      a.currentTime = 0
      const p = a.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          if (unlockHandler.current) return
          const once = () => {
            const el = audioRef.current
            if (el && !muted) {
              el.currentTime = 0
              el.play().catch(() => {})
            }
            document.removeEventListener('pointerdown', once)
            unlockHandler.current = null
          }
          unlockHandler.current = once
          document.addEventListener('pointerdown', once, { once: true })
        })
      }
    } catch {
      /* ignore */
    }
  }, [muted])

  return { play, muted, toggleMute }
}
