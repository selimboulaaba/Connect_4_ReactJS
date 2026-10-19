import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { gamesApi } from '@/lib/api'
import { MiniBoard } from '@/components/game/Board'
import { Badge, Button, EmptyState, Page, PageHeader, Skeleton } from '@/ui'

function timeAgo(date) {
  const s = Math.max(0, Math.round((Date.now() - new Date(date).getTime()) / 1000))
  if (s < 60) return 'Last move just now'
  if (s < 3600) return `Last move ${Math.floor(s / 60)} min ago`
  return `Last move ${Math.floor(s / 3600)} h ago`
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
        title="Live games"
        subtitle="Open any match to watch it move by move."
        actions={<Button variant="secondary" icon={RefreshCw} onClick={load} loading={refreshing}>Refresh</Button>}
      />
      {games === null ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)}
        </div>
      ) : games.length === 0 ? (
        <EmptyState title="Nobody is playing right now" action={<Button to="/online">Start a game</Button>}>
          Games with a move in the last 30 minutes show up here.
        </EmptyState>
      ) : (
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <li key={g._id}>
              <Link to={`/watch/${g._id}`} className="group block rounded-panel outline-offset-4">
                <MiniBoard p1Moves={g.p1_Moves} p2Moves={g.p2_Moves} className="transition-transform group-hover:-translate-y-1" />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-lg font-extrabold">
                    <span className="text-red">{g.p1?.username}</span>
                    <span className="mx-1.5 font-medium text-muted-foreground">vs</span>
                    <span className="text-[hsl(var(--on-yellow))] dark:text-yellow">{g.p2?.username}</span>
                  </p>
                  <span className="font-display text-xl tabular">{g.score?.p1 ?? 0}–{g.score?.p2 ?? 0}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {timeAgo(g.updatedAt)}
                  {g.tournamentId && <Badge tone="yellow">Tournament</Badge>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}
