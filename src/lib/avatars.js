import { useEffect, useState } from 'react'

// Avatars are stored as "style:seed" and drawn with DiceBear. Must match back/src/utils/avatar.js.
// All six styles are CC0, MIT or free for commercial use: no attribution needed.
// Each style is a separate download, fetched the first time it's shown.
export const AVATAR_STYLES = [
  { id: 'bottts', label: 'Robots', load: () => import('@dicebear/bottts') },
  { id: 'avataaars', label: 'Cartoons', load: () => import('@dicebear/avataaars') },
  { id: 'open-peeps', label: 'Peeps', load: () => import('@dicebear/open-peeps') },
  { id: 'lorelei', label: 'Sketches', load: () => import('@dicebear/lorelei') },
  { id: 'pixel-art', label: 'Pixel art', load: () => import('@dicebear/pixel-art') },
  { id: 'thumbs', label: 'Blobs', load: () => import('@dicebear/thumbs') },
]
const BY_ID = Object.fromEntries(AVATAR_STYLES.map((s) => [s.id, s]))

// Toy-box backgrounds, so every avatar sits on a coloured disc.
const BACKGROUNDS = ['ffc72c', '9ed0ff', 'ff8a1f', '8cc63f', 'f0619a', 'b9a7ff', 'e8333c', '1f4fd8']
const SEAT_BG = { p1: ['e8333c'], p2: ['ffc72c'] }

const AVATAR_RE = /^([a-z-]+):([a-z0-9]{4,16})$/

/** { style, seed } for any stored value. Legacy "avatar_N" or empty values derive one from the name. */
export function parseAvatar(value, name = '') {
  const m = AVATAR_RE.exec(String(value ?? ''))
  if (m && BY_ID[m[1]]) return { style: m[1], seed: m[2] }
  const fallback = (String(name).toLowerCase().replace(/[^a-z0-9]/g, '') + 'player').slice(0, 12)
  return { style: 'bottts', seed: fallback }
}

export const randomSeed = () => Math.random().toString(36).slice(2, 10).padEnd(6, '0')

let corePromise = null
const loaded = {} // style id -> style module
const pending = {}
const uris = new Map()

function loadStyle(id) {
  corePromise ||= import('@dicebear/core')
  pending[id] ||= Promise.all([corePromise, BY_ID[id].load()]).then(([core, mod]) => {
    loaded[id] = { core, mod }
  })
  return pending[id]
}

function render(style, seed, seat) {
  const key = `${style}:${seed}:${seat || ''}`
  if (!uris.has(key)) {
    const { core, mod } = loaded[style]
    uris.set(key, core.createAvatar(mod, { seed, backgroundColor: seat ? SEAT_BG[seat] : BACKGROUNDS, backgroundType: ['solid'] }).toDataUri())
  }
  return uris.get(key)
}

/** Data URI for an avatar, or null while its style is still downloading. */
export function useAvatarUri(value, name, seat) {
  const { style, seed } = parseAvatar(value, name)
  const [, rerender] = useState(0)
  const ready = !!loaded[style]

  useEffect(() => {
    if (ready) return
    let alive = true
    loadStyle(style).then(() => alive && rerender((n) => n + 1)).catch(() => {})
    return () => { alive = false }
  }, [style, ready])

  return ready ? render(style, seed, seat) : null
}
