// Per-page <title>, description, canonical URL and indexing rules for this single-page app.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://connect4.skouza.xyz').replace(/\/$/, '')

const DEFAULT_DESC =
  'Play Connect 4 online for free. Challenge friends in real time, play the computer on three levels, pass one phone around, solve the daily puzzle and climb the leaderboard.'

// Public pages are indexable; anything per-user or private is not.
const PAGES = [
  { match: /^\/$/, title: 'Connect 4 Online: Play Four in a Row with Friends', desc: DEFAULT_DESC },
  { match: /^\/ai$/, title: 'Play Connect 4 Against the Computer', desc: 'Play Connect 4 against the computer on easy, medium or hard. Free, no sign-up needed.' },
  { match: /^\/local$/, title: 'Two-Player Connect 4 on One Device', desc: 'Pass and play Connect 4 with a friend on the same phone, tablet or computer. Free, no sign-up needed.' },
  { match: /^\/daily$/, title: 'Daily Connect 4 Puzzle', desc: 'A new Connect 4 puzzle every day: find the one winning move. Solve it to earn XP.' },
  { match: /^\/signup$/, title: 'Create a Free Account', desc: 'Create a free Connect 4 account to play friends online, earn XP, unlock achievements and join tournaments.' },
  { match: /^\/signin$/, title: 'Sign In', desc: 'Sign in to Connect 4 to play friends online and keep your progress.' },
  { match: /^\/online$/, title: 'Play a Friend Online', private: true },
  { match: /^\/online\//, title: 'Online Game', private: true },
  { match: /^\/friends$/, title: 'Friends', private: true },
  { match: /^\/profile$/, title: 'Your Profile', private: true },
  { match: /^\/leaderboard$/, title: 'Leaderboard', private: true },
  { match: /^\/watch/, title: 'Live Games', private: true },
  { match: /^\/tournament/, title: 'Tournament', private: true },
]

function setMeta(selector, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/)
    el.setAttribute(key, name)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export function applySeo(pathname) {
  const page = PAGES.find((p) => p.match.test(pathname))
  const notFound = !page
  const title = notFound ? 'Page not found' : page.title
  const fullTitle = pathname === '/' ? title : `${title} · Connect 4`
  const desc = page?.desc || DEFAULT_DESC
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`

  document.title = fullTitle
  setMeta('meta[name="description"]', 'content', desc)
  setMeta('meta[name="robots"]', 'content', notFound || page.private ? 'noindex, nofollow' : 'index, follow')
  setMeta('link[rel="canonical"]', 'href', url)
  setMeta('meta[property="og:title"]', 'content', fullTitle)
  setMeta('meta[property="og:description"]', 'content', desc)
  setMeta('meta[property="og:url"]', 'content', url)
  setMeta('meta[name="twitter:title"]', 'content', fullTitle)
  setMeta('meta[name="twitter:description"]', 'content', desc)
}
