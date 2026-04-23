import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  createTournament,
  getTournament,
  joinTournament,
  startTournament,
} from '../services/game.service'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

function TournamentLobby() {
  const { id } = useParams()
  const navigate = useNavigate()
  const me = useSelector((s) => s.user.user)
  const [name, setName] = useState('Bracket')
  const [t, setT] = useState(null)
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) {
      setT(null)
      setLoading(false)
      return
    }
    setLoading(true)
    getTournament(id)
      .then((res) => setT(res.data.tournament))
      .catch(() => toast.error('Could not load tournament'))
      .finally(() => setLoading(false))
  }, [id])

  const hostCreate = () => {
    createTournament({ name })
      .then((res) => {
        const newId = res.data.tournament._id
        navigate(`/tournament/${newId}`, { replace: true })
        toast.success('Tournament created — share this URL with three friends.')
      })
      .catch((e) => toast.error(e.response?.data?.message || 'Failed'))
  }

  const join = () => {
    if (!id) return
    joinTournament(id)
      .then((res) => {
        setT(res.data.tournament)
        toast.success('Joined!')
      })
      .catch((e) => toast.error(e.response?.data?.message || 'Join failed'))
  }

  const start = () => {
    if (!id) return
    startTournament(id)
      .then((res) => {
        setT(res.data.tournament)
        toast.success('Semifinals created — open your game links below.')
      })
      .catch((e) => toast.error(e.response?.data?.message || 'Cannot start'))
  }

  const sid = (x) => {
    if (x == null) return ''
    if (typeof x === 'string') return x
    if (x._id != null) return x._id.toString()
    return x.toString()
  }
  const isHost = t && me?._id && sid(t.host) === sid(me)
  const amIn = !!(me?._id && (t?.players || []).some((p) => sid(p) === sid(me)))

  const semiLink = (g) => {
    const gid = sid(g)
    return `/online/${gid}`
  }

  return (
    <div className='grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-12 px-6 max-w-2xl mx-auto'>
      <h1 className='font-bold text-[#646cff] underline text-3xl sm:text-5xl'>Tournament (4)</h1>
      <p className='text-gray-400 text-sm'>
        Four players join this lobby. The host starts the bracket: two semifinal games (first to <strong>2</strong> round wins each), then a final between the two winners.
      </p>

      {!id && (
        <div className='space-y-3'>
          <input
            className='w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-white'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Tournament name'
          />
          <button type='button' onClick={hostCreate} className='w-full'>
            Create tournament
          </button>
        </div>
      )}

      {id && (
        <div className='flex gap-2 flex-wrap'>
          <button type='button' onClick={join} disabled={amIn}>
            {amIn ? 'You are in' : 'Join this tournament'}
          </button>
          {isHost && (
            <button
              type='button'
              onClick={start}
              disabled={!t || t.players?.length !== 4 || t.status !== 'waiting'}
            >
              Start bracket
            </button>
          )}
        </div>
      )}

      {loading ? (
        <Loading w='6' h='6' />
      ) : id && t ? (
        <div className='text-sm space-y-2 border border-gray-700 rounded-lg p-4'>
          <div>
            <span className='text-gray-500'>Status:</span>{' '}
            <span className='text-[#646cff] font-semibold'>{t.status}</span>
          </div>
          <div>
            <span className='text-gray-500'>Players ({t.players?.length || 0}/4):</span>
            <ul className='mt-1'>
              {(t.players || []).map((p) => (
                <li key={sid(p)}>{p.username}</li>
              ))}
            </ul>
          </div>
          {t.status === 'semifinals' && t.semiGameIds?.length === 2 && (
            <div className='mt-4 space-y-2'>
              <div className='font-bold text-[#646cff]'>Semifinals</div>
              <Link to={semiLink(t.semiGameIds[0])}>
                <button className='w-full text-left' type='button'>
                  Semifinal A — open game
                </button>
              </Link>
              <Link to={semiLink(t.semiGameIds[1])}>
                <button className='w-full text-left' type='button'>
                  Semifinal B — open game
                </button>
              </Link>
            </div>
          )}
          {t.status === 'final' && t.finalGameId && (
            <div className='mt-4'>
              <div className='font-bold text-[#646cff] mb-2'>Final</div>
              <Link to={semiLink(t.finalGameId)}>
                <button className='w-full' type='button'>
                  Open final game
                </button>
              </Link>
            </div>
          )}
          {t.status === 'complete' && t.championId && (
            <p className='text-green-400 mt-2'>
              Champion: <strong>{t.championId.username}</strong>
            </p>
          )}
        </div>
      ) : null}

      <Link to='/'>
        <button type='button' className='text-gray-500'>
          Home
        </button>
      </Link>
    </div>
  )
}

export default TournamentLobby
