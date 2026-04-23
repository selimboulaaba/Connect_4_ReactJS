import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getActiveGames } from '../services/game.service'
import Loading from '../components/Loading'
import UserAvatar from '../components/UserAvatar'

function SpectateList() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getActiveGames()
      .then((res) => setGames(res.data.games || []))
      .catch(() => setGames([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className='grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-16 px-6'>
      <h1 className='font-bold text-[#646cff] mb-6 underline text-3xl sm:text-5xl'>Watch a game</h1>
      <p className='text-gray-400 text-sm mb-4'>Live matches with two players. Opens in read-only mode.</p>
      {loading ? (
        <Loading w='8' h='8' />
      ) : games.length === 0 ? (
        <p className='text-gray-500'>No active games right now.</p>
      ) : (
        <ul className='space-y-3'>
          {games.map((g) => (
            <li key={g._id}>
              <Link to={`/watch/${g._id}`}>
                <button className='w-full flex items-center justify-between gap-3 text-left py-3 px-4 rounded-lg border border-[#646cff]/40 hover:border-[#646cff]'>
                  <span className='flex items-center gap-2 min-w-0'>
                    <UserAvatar avatarId={g.p1?.avatar} sizePx={28} className='rounded-full' />
                    <span className='font-semibold truncate'>{g.p1?.username}</span>
                    <span className='text-gray-500'>vs</span>
                    <UserAvatar avatarId={g.p2?.avatar} sizePx={28} className='rounded-full' />
                    <span className='font-semibold truncate'>{g.p2?.username}</span>
                  </span>
                  <span className='text-[#646cff] text-sm shrink-0'>Spectate →</span>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SpectateList
