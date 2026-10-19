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

export const ACHIEVEMENTS = [
  { id: 'first_win', label: 'First Blood', desc: 'Win your first round', icon: '🏆' },
  { id: 'ten_wins', label: 'Veteran', desc: 'Win 10 rounds', icon: '⚔️' },
  { id: 'fifty_wins', label: 'Champion', desc: 'Win 50 rounds', icon: '👑' },
  { id: 'giant_slayer', label: 'Giant Slayer', desc: 'Beat a player 5+ levels above you', icon: '🐉' },
  { id: 'shutout', label: 'Shutout', desc: 'Lead a match 3–0', icon: '🛡️' },
  { id: 'speedrun', label: 'Speedrun', desc: 'Win a round in 15 moves or fewer', icon: '⚡' },
]
