export const AVATAR_IDS = Array.from({ length: 12 }, (_, i) => `avatar_${i + 1}`)

/** Accepts avatar_1 … avatar_12 (and legacy "1", 1, avatar-2); anything else → avatar_1. */
export function normalizeAvatarId(raw) {
  const m = /^(?:avatar[_-]?)?(\d{1,2})$/i.exec(String(raw ?? '').trim())
  const n = m ? Math.min(12, Math.max(1, parseInt(m[1], 10))) : 1
  return `avatar_${n}`
}
