export const AVATAR_IDS = Array.from({ length: 12 }, (_, i) => `avatar_${i + 1}`)

/** Accepts avatar_1 … avatar_12 (and legacy "1", 1, avatar-2); anything else → avatar_1. */
export function normalizeAvatarId(raw) {
  const m = /^(?:avatar[_-]?)?(\d{1,2})$/i.exec(String(raw ?? '').trim())
  const n = m ? Math.min(12, Math.max(1, parseInt(m[1], 10))) : 1
  return `avatar_${n}`
}

// Twelve toy-box plastics. [fill, text]
export const AVATAR_COLORS = [
  ['#E8333C', '#fff'], ['#FFC72C', '#0E2A7A'], ['#1F4FD8', '#fff'], ['#1E9E5A', '#fff'],
  ['#FF8A1F', '#fff'], ['#7A4BD8', '#fff'], ['#14A3A3', '#fff'], ['#F0619A', '#fff'],
  ['#8CC63F', '#0E2A7A'], ['#0E2A7A', '#fff'], ['#9ED0FF', '#0E2A7A'], ['#B5642B', '#fff'],
]
