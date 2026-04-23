import React from 'react'

/** Normalize DB values: avatar_1, "1", 1, avatar-2, bad values → avatar_1 … avatar_12 */
export function normalizeAvatarId(raw) {
  if (raw == null || raw === '') return 'avatar_1'
  const s = String(raw).trim()
  const m =
    /^avatar[_-]?(\d{1,2})$/i.exec(s) ||
    /^(\d{1,2})$/.exec(s)
  if (m) {
    const n = Math.min(12, Math.max(1, parseInt(m[1], 10)))
    return `avatar_${n}`
  }
  return 'avatar_1'
}

/**
 * Preset avatars avatar_1 … avatar_12 — gradient discs (reliable in flex layouts).
 * @param {string} [sizePx] — width/height in pixels when layout strips Tailwind size classes
 */
function UserAvatar({ avatarId, className = '', sizePx = 36 }) {
  const id = normalizeAvatarId(avatarId)
  const n = parseInt(id.replace(/^avatar_/, ''), 10) || 1
  const hue = ((n - 1) * 31) % 360
  const hue2 = (hue + 48) % 360

  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden ${className}`}
      style={{
        width: sizePx,
        minWidth: sizePx,
        height: sizePx,
        minHeight: sizePx,
        borderRadius: '50%',
        aspectRatio: '1 / 1',
        background: `linear-gradient(145deg, hsl(${hue} 65% 52%), hsl(${hue2} 70% 38%))`,
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.25)',
      }}
      aria-hidden
    />
  )
}

export default UserAvatar
