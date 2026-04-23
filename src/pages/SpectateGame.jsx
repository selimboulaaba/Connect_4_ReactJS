import React, { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSocket } from '../contexts/socketInstance'
import { getGame } from '../services/game.service'
import Loading from '../components/Loading'
import UserAvatar from '../components/UserAvatar'
import { boardOuter, boardRow, boardCol, pieceClass } from '../game/boardLayout'

const rows = 6
const columns = 7

function SpectateGame() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!id) return
    getGame(id)
      .then((res) => setGame(res.data.game))
      .catch(() => setGame(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !id) return
    socket.emit('spectateGame', id)
    const onMove = (data) => {
      if (data?.newGame?._id && String(data.newGame._id) === String(id)) setGame(data.newGame)
    }
    socket.on('newMove', onMove)
    return () => {
      socket.emit('stopSpectating', id)
      socket.off('newMove', onMove)
    }
  }, [id])

  const color = (pos) => {
    if (!game?.p1_Moves) return 'border-opacity-20 border-white'
    if (game.p1_Moves.indexOf(pos) !== -1) {
      return 'border-opacity-50 border-blue-700 bg-blue-500'
    }
    if (game.p2_Moves.indexOf(pos) !== -1) {
      return 'border-opacity-50 border-red-700 bg-red-500'
    }
    return 'border-opacity-20 border-white'
  }

  if (loading) {
    return <Loading className='mt-24' w='8' h='8' />
  }
  if (!game?.p2) {
    return (
      <div className='mt-16 text-center'>
        <p className='text-gray-400 mb-4'>This game is not active for spectating.</p>
        <Link to='/watch'><button>Back to list</button></Link>
      </div>
    )
  }

  return (
    <div className='relative mx-auto mt-14 max-w-4xl border border-[#646cff] rounded-xl pb-16 pt-10 px-2 sm:px-6'>
      <Link to='/watch' className='absolute left-3 top-3 z-10 text-sm text-[#646cff] underline'>← Games</Link>
      <p className='text-center text-xs uppercase tracking-widest text-gray-500 mb-2'>Spectator</p>
      <div className='text-[#646cff] font-bold text-2xl md:text-4xl mt-6 flex flex-wrap items-center justify-center gap-2'>
        <UserAvatar avatarId={game.p1?.avatar} sizePx={40} className='rounded-full' />
        <span>{game.p1?.username}</span>
        <span className='text-gray-500'>—</span>
        <span>{game.p2?.username}</span>
        <UserAvatar avatarId={game.p2?.avatar} sizePx={40} className='rounded-full' />
      </div>
      <div className='text-[#646cff] font-bold text-2xl md:text-4xl mb-8 text-center'>
        {game.score?.p1 ?? 0} - {game.score?.p2 ?? 0}
      </div>
      <div className={`${boardOuter} pointer-events-none select-none`}>
        <div className={boardRow}>
        {[...Array(columns)].map((_, colIndex) => (
          <div key={colIndex} className={boardCol}>
            {[...Array(rows)].map((_, rowIndex) => {
              const pos = rowIndex.toString() + colIndex.toString()
              return (
                <div
                  key={rowIndex}
                  className={pieceClass(color(pos), '')}
                />
              )
            })}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default SpectateGame
