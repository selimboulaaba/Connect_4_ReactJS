import React, { useEffect, useState } from 'react'
import { getLeaderBoard } from '../services/user.service'
import Loading from '../components/Loading'
import UserAvatar from '../components/UserAvatar'

const rankStyle = (index) => {
  if (index === 0) return 'bg-gradient-to-br from-amber-300 to-amber-600 text-black shadow-lg shadow-amber-500/20'
  if (index === 1) return 'bg-gradient-to-br from-slate-300 to-slate-500 text-black shadow-md'
  if (index === 2) return 'bg-gradient-to-br from-orange-400 to-amber-800 text-white shadow-md'
  return 'bg-[#2a2a35] text-[#a5b4fc] ring-1 ring-[#646cff]/30'
}

function LeaderBoard() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getLeaderBoard()
      .then((response) => setUsers(response.data.users || []))
      .catch(() => setUsers([]))
  }, [])

  return (
    <div className="mx-auto mt-8 max-w-4xl px-3 pb-20 sm:mt-12 sm:px-6">
      <div className="mb-8 rounded-2xl border border-[#646cff]/40 bg-gradient-to-b from-[#1a1a22] to-[#141418] px-5 py-8 sm:px-10">
        <h1 className="text-center text-3xl font-bold tracking-tight text-[#646cff] sm:text-4xl">
          Leaderboard
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-gray-400">
          Ranked by XP. Stats show wins, losses, draws, and win rate.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="flex justify-center py-16">
          <Loading w="8" h="8" />
        </div>
      ) : (
        <ul className="flex flex-col gap-3 sm:gap-4">
          {users.map((user, index) => {
            const w = user.stats?.wins ?? 0
            const l = user.stats?.losses ?? 0
            const d = user.stats?.draws ?? 0
            const total = w + l + d
            const pct = total > 0 ? Math.round((w / total) * 100) : null
            return (
              <li
                key={user._id || index}
                className="flex flex-col gap-4 rounded-2xl border border-[#646cff]/20 bg-[#1c1c24]/90 p-4 shadow-sm backdrop-blur-sm transition hover:border-[#646cff]/45 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-12 sm:w-12 sm:text-base ${rankStyle(index)}`}
                  >
                    {index + 1}
                  </div>
                  <UserAvatar avatarId={user.avatar} sizePx={48} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-white sm:text-lg">{user.username}</p>
                    <p className="text-xs text-gray-400 sm:text-sm">Level {user.lvl}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-3 sm:border-t-0 sm:pt-0 sm:justify-end">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold sm:text-sm">
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-emerald-300 ring-1 ring-emerald-500/25">
                      {w}W
                    </span>
                    <span className="rounded-full bg-rose-500/15 px-2.5 py-1 text-rose-300 ring-1 ring-rose-500/25">
                      {l}L
                    </span>
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-amber-200 ring-1 ring-amber-500/25">
                      {d}D
                    </span>
                    <span className="rounded-full bg-[#646cff]/15 px-2.5 py-1 text-[#b4c0ff] ring-1 ring-[#646cff]/30">
                      {pct != null ? `${pct}%` : '—'}
                    </span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-xl font-bold tabular-nums text-[#646cff] sm:text-2xl">{user.xp}</span>
                    <span className="ml-1 text-xs font-medium uppercase tracking-wide text-gray-500">XP</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default LeaderBoard
