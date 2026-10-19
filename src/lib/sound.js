import winUrl from '../assets/siu.mp3'
import { isMuted } from './preferences'

let ctx = null
let winAudio = null

function audioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

/** Short synthesized "clack" when a disc lands. */
export function playDrop() {
  if (isMuted()) return
  const ac = audioContext()
  if (!ac) return
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(420, t)
  osc.frequency.exponentialRampToValueAtTime(140, t + 0.09)
  gain.gain.setValueAtTime(0.18, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + 0.13)
}

export function playWin() {
  if (isMuted()) return
  if (!winAudio) winAudio = new Audio(winUrl)
  winAudio.currentTime = 0
  winAudio.play().catch(() => {})
}

/** Gentle two-note chime for a loss or draw. */
export function playChime(up = false) {
  if (isMuted()) return
  const ac = audioContext()
  if (!ac) return
  const notes = up ? [523, 659] : [440, 349]
  notes.forEach((f, i) => {
    const t = ac.currentTime + i * 0.14
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = 'sine'
    osc.frequency.value = f
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.15, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    osc.connect(gain).connect(ac.destination)
    osc.start(t)
    osc.stop(t + 0.4)
  })
}
