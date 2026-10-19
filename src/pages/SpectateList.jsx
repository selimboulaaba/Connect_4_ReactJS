import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LuEye, LuRefreshCw } from 'react-icons/lu'
import { gamesApi } from '../lib/api'
import { MiniBoard } from '../components/game/Board'
import { Avatar, Badge, Button, EmptyState, LiveDot, Page, PageHeader, Skeleton } from '../ui'

function timeAgo(date) {
  const s = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 1000))
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  return `${Math.floor(s / 3600)} h ago`
}

export default function SpectateList() {
  const [games, setGames] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(() => {
    setRefreshing(true)
    gamesApi.active()
      .then((r) => setGames(r.data.games || []))
      .catch(() => setGames((g) => g || []))
      .finally(() => setRefreshing(false))
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [load])

  return (
    <Page>
      <PageHeader
        eyebrow="Spectate"
        title="Live games"
        subtitle="Watch matches as they happen. The list refreshes automatically."
        actions={<Button variant="secondary" icon={LuRefreshCw} onClick={load} loading={refreshing}>Refresh</Button>}
      />
      {games === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : games.length === 0 ? (
        <EmptyState icon={LuEye} title="No live games right now" action={<Button to="/online">Start a game</Button>}>
          Games played in the last 30 minutes show up here.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <li key={g._id}>
              <Link to={`/watch/${g._id}`} className="group block rounded-2xl border border-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-pop">
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-danger"><LiveDot /> Live</span>
                  <span className="flex items-center gap-2">
                    {g.tournamentId && <Badge tone="warning">Tournament</Badge>}
                    <span className="text-xs text-subtle">{timeAgo(g.updatedAt)}</span>
                  </span>
                </div>
                <MiniBoard p1Moves={g.p1_Moves} p2Moves={g.p2_Moves} />
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Avatar avatarId={g.p1?.avatar} name={g.p1?.username} size="sm" />
                  <span className="min-w-0 flex-1 truncate font-semibold">{g.p1?.username}</span>
                  <span className="font-display text-lg font-bold tabular">{g.score?.p1 ?? 0}–{g.score?.p2 ?? 0}</span>
                  <span className="min-w-0 flex-1 truncate text-right font-semibold">{g.p2?.username}</span>
                  <Avatar avatarId={g.p2?.avatar} name={g.p2?.username} size="sm" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}
