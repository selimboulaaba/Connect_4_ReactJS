import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LuTrophy } from 'react-icons/lu'
import { usersApi } from '../lib/api'
import { selectUser } from '../store/userSlice'
import { Avatar, Badge, EmptyState, Page, PageHeader, Skeleton, cn } from '../ui'

const winRate = (s = {}) => {
  const total = (s.wins || 0) + (s.losses || 0) + (s.draws || 0)
  return total ? Math.round(((s.wins || 0) / total) * 100) : null
}

const MEDALS = [
  { ring: 'ring-[#f5c84c]', bg: 'from-[#f5c84c]/25', label: '🥇', h: 'sm:h-44' },
  { ring: 'ring-[#c3ccd8]', bg: 'from-[#c3ccd8]/25', label: '🥈', h: 'sm:h-36' },
  { ring: 'ring-[#d99a5b]', bg: 'from-[#d99a5b]/25', label: '🥉', h: 'sm:h-32' },
]

function Podium({ users, meId }) {
  // Display order 2nd, 1st, 3rd so the winner stands in the middle.
  const order = [1, 0, 2].filter((i) => users[i])
  return (
    <div className="mb-8 grid grid-cols-3 items-end gap-2 sm:gap-4">
      {order.map((i) => {
        const u = users[i]
        const m = MEDALS[i]
        return (
          <div key={u._id} className={cn('flex flex-col items-center rounded-2xl border border-line bg-gradient-to-b to-surface p-3 text-center sm:p-4', m.bg, m.h, u._id === meId && 'border-primary/60')}>
            <span className="text-2xl" aria-hidden>{m.label}</span>
            <Avatar avatarId={u.avatar} name={u.username} size="lg" className={cn('my-2 rounded-full ring-4', m.ring)} />
            <p className="w-full truncate text-sm font-semibold sm:text-base">{u.username}</p>
            <p className="text-xs text-subtle">Lvl {u.lvl} · <span className="font-semibold text-fg tabular">{u.xp}</span> XP</p>
          </div>
        )
      })}
    </div>
  )
}

export default function LeaderBoard() {
  const me = useSelector(selectUser)
  const [users, setUsers] = useState(null)

  useEffect(() => {
    usersApi.leaderboard().then((r) => setUsers(r.data.users || [])).catch(() => setUsers([]))
  }, [])

  const myRank = users?.findIndex((u) => u._id === me._id)

  return (
    <Page size="md">
      <PageHeader
        eyebrow="Rankings"
        title="Leaderboard"
        subtitle="Top players by XP. Win rounds, solve daily puzzles and climb."
        actions={myRank >= 0 && <Badge tone="primary" className="self-center text-sm">You&apos;re #{myRank + 1}</Badge>}
      />
      {users === null ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon={LuTrophy} title="No players yet">Be the first to play a round!</EmptyState>
      ) : (
        <>
          {users.length >= 3 && <Podium users={users} meId={me._id} />}
          <ol className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <li className="hidden grid-cols-[3rem_1fr_7rem_5rem_5rem] gap-3 border-b border-line px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-subtle sm:grid">
              <span>#</span><span>Player</span><span>W / L / D</span><span className="text-right">Win %</span><span className="text-right">XP</span>
            </li>
            {users.map((u, i) => {
              const rate = winRate(u.stats)
              const isMe = u._id === me._id
              return (
                <li key={u._id} className={cn('grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[3rem_1fr_7rem_5rem_5rem]', isMe && 'bg-primary/5')}>
                  <span className={cn('font-display text-lg font-bold tabular', i < 3 ? 'text-warning' : 'text-subtle')}>{i + 1}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar avatarId={u.avatar} name={u.username} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{u.username}{isMe && <span className="ml-1.5 text-xs font-medium text-primary">(you)</span>}</span>
                      <span className="block text-xs text-subtle sm:hidden">Lvl {u.lvl} · {rate ?? '—'}{rate != null && '%'} wins</span>
                      <span className="hidden text-xs text-subtle sm:block">Level {u.lvl}</span>
                    </span>
                  </span>
                  <span className="hidden text-sm tabular text-muted sm:block">
                    <span className="text-success">{u.stats?.wins ?? 0}</span> / <span className="text-danger">{u.stats?.losses ?? 0}</span> / {u.stats?.draws ?? 0}
                  </span>
                  <span className="hidden text-right text-sm tabular sm:block">{rate != null ? `${rate}%` : '—'}</span>
                  <span className="text-right font-display font-bold tabular">{u.xp}<span className="ml-1 text-xs font-medium text-subtle">XP</span></span>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </Page>
  )
}
