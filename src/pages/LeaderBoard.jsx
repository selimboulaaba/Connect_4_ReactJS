import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usersApi } from '@/lib/api'
import { selectUser } from '@/store/userSlice'
import { Avatar, Card, EmptyState, Page, PageHeader, Skeleton } from '@/ui'
import { cn } from '@/lib/utils'

const winRate = (s = {}) => {
  const total = (s.wins || 0) + (s.losses || 0) + (s.draws || 0)
  return total ? Math.round(((s.wins || 0) / total) * 100) : null
}

// Top three wear a disc: yellow, red, cobalt.
const RANK_DISC = ['disc disc-yellow text-[hsl(var(--on-yellow))]', 'disc disc-red text-white', 'disc bg-board text-on-board']

export default function LeaderBoard() {
  const me = useSelector(selectUser)
  const [users, setUsers] = useState(null)

  useEffect(() => {
    usersApi.leaderboard().then((r) => setUsers(r.data.users || [])).catch(() => setUsers([]))
  }, [])

  const myRank = users?.findIndex((u) => u._id === me._id) ?? -1

  return (
    <Page size="md">
      <PageHeader
        title="Leaderboard"
        subtitle={myRank >= 0 ? `You’re number ${myRank + 1}. Win rounds and solve puzzles to climb.` : 'Ranked by XP. Win rounds and solve puzzles to climb.'}
      />
      {users === null ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : users.length === 0 ? (
        <EmptyState title="No one has played yet">The first person to win a round tops the list.</EmptyState>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="hidden border-b-3 border-ink text-sm text-muted-foreground sm:table-header-group">
              <tr>
                <th scope="col" className="w-16 py-3 pl-5 font-bold">Rank</th>
                <th scope="col" className="py-3 font-bold">Player</th>
                <th scope="col" className="py-3 font-bold">Wins, losses, draws</th>
                <th scope="col" className="py-3 text-right font-bold">Win rate</th>
                <th scope="col" className="py-3 pr-5 text-right font-bold">XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const rate = winRate(u.stats)
                const isMe = u._id === me._id
                return (
                  <tr key={u._id} className={cn('border-t-2 border-ink/10 first:border-t-0', isMe && 'bg-yellow/20')}>
                    <td className="w-14 py-3 pl-4 sm:w-16 sm:pl-5">
                      {i < 3 ? (
                        <span className={cn('flex size-9 items-center justify-center border-2 border-ink font-display', RANK_DISC[i])}>
                          <span className="relative z-[1]">{i + 1}</span>
                        </span>
                      ) : (
                        <span className="flex size-9 items-center justify-center font-display text-muted-foreground">{i + 1}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="flex min-w-0 items-center gap-3">
                        <Avatar avatarId={u.avatar} name={u.username} size="sm" />
                        <span className="min-w-0">
                          <span className="block truncate font-extrabold">{u.username}{isMe && <span className="ml-1.5 font-medium text-muted-foreground">(you)</span>}</span>
                          <span className="block text-sm text-muted-foreground">Level {u.lvl}</span>
                        </span>
                      </span>
                    </td>
                    <td className="hidden py-3 tabular sm:table-cell">
                      {u.stats?.wins ?? 0} <span className="text-muted-foreground">/</span> {u.stats?.losses ?? 0} <span className="text-muted-foreground">/</span> {u.stats?.draws ?? 0}
                    </td>
                    <td className="hidden py-3 text-right tabular sm:table-cell">{rate != null ? `${rate}%` : 'None yet'}</td>
                    <td className="py-3 pr-4 text-right sm:pr-5">
                      <span className="font-display text-lg tabular">{u.xp}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </Page>
  )
}
