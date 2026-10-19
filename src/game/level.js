// Mirrors back/src/utils/level.js.
export function levelThreshold(lvl) {
  if (lvl <= 1) return 0
  if (lvl === 2) return 100
  return 250 * 2 ** (lvl - 3)
}

/** { lvl, current, next, progress (0–1) } for an xp amount. */
export function levelProgress(xp = 0, lvl = 1) {
  const current = levelThreshold(lvl)
  const next = levelThreshold(lvl + 1)
  return { lvl, current, next, progress: next > current ? (xp - current) / (next - current) : 1, toNext: Math.max(0, next - xp) }
}
