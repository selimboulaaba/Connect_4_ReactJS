import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { errorMessage, gamesApi } from '../lib/api'
import { useSocket, useSocketEvent } from '../lib/socketContext'
import { evaluate, landingPos } from './logic'
import { playChime, playDrop, playWin } from '../lib/sound'
import { toast } from '../ui'

const idOf = (u) => (u && typeof u === 'object' ? u._id : u) || null

/**
 * Live state of one online game. The server is authoritative: we apply its snapshots from HTTP
 * responses and socket pushes, with an optimistic disc while a move is in flight.
 * Pass `spectate` to watch without trying to join.
 */
export function useOnlineGame(gameId, me, { spectate = false } = {}) {
  const { socket } = useSocket()
  const [game, setGame] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | notFound | full | declined | error
  const [error, setError] = useState(null)
  const [online, setOnline] = useState({})
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const [now, setNow] = useState(Date.now())
  const offsetRef = useRef(0)
  const claimedRef = useRef(null)
  const meId = me?._id

  const apply = useCallback((g, serverTime) => {
    if (serverTime) offsetRef.current = serverTime - Date.now()
    setGame(g)
    setStatus('ready')
  }, [])

  const load = useCallback(async () => {
    try {
      const { data } = await gamesApi.get(gameId)
      let g = data.game
      const seated = [idOf(g.p1), idOf(g.p2)].includes(meId)
      if (!spectate && !seated) {
        if (g.p2 || g.tournamentId) {
          setStatus('full')
          setGame(g)
          return
        }
        const joined = await gamesApi.join(gameId)
        g = joined.data.game
        apply(g, joined.data.serverTime)
        return
      }
      apply(g, data.serverTime)
    } catch (e) {
      const code = e.response?.status
      if (code === 404) setStatus('notFound')
      else if (code === 403 || code === 409) { setStatus('full'); setError(errorMessage(e)) }
      else { setStatus((s) => (s === 'ready' ? s : 'error')); setError(errorMessage(e)) }
    }
  }, [gameId, meId, spectate, apply])

  useEffect(() => {
    setStatus('loading')
    setGame(null)
    setMessages([])
    load()
  }, [load])

  // Join the game's live room (again after every reconnect) and resync in case we missed updates.
  useEffect(() => {
    if (!socket) return
    const subscribe = () => {
      socket.emit('game:subscribe', gameId, (res) => res?.ok && setOnline(res.online || {}))
    }
    const onReconnect = () => { subscribe(); load() }
    if (socket.connected) subscribe()
    socket.on('connect', onReconnect)
    return () => {
      socket.off('connect', onReconnect)
      socket.emit('game:unsubscribe', gameId)
    }
  }, [socket, gameId, load])

  useEffect(() => {
    const onVisible = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [load])

  const seat = game ? (idOf(game.p1) === meId ? 'p1' : idOf(game.p2) === meId ? 'p2' : null) : null

  useSocketEvent('gameUpdate', (data) => {
    if (data.game === null && data.gameId === gameId) {
      setStatus('declined')
      return
    }
    if (data.game?._id !== gameId) return
    apply(data.game, data.serverTime)
    const ev = data.event || {}
    if (ev.by === me?.username && ev.type === 'move') return
    if (ev.type === 'move') playDrop()
    if (ev.type === 'roundEnd') {
      const w = data.game.roundEnd?.winner
      // The opponent's final disc; our own already clacked when we played it.
      if (ev.by !== me?.username && ['connect', 'draw'].includes(data.game.roundEnd?.reason)) playDrop()
      setTimeout(() => (w === 'draw' ? playChime() : w === seat ? playWin() : seat ? playChime(false) : playChime(true)), 300)
    }
    if (ev.type === 'rematchRequested' && ev.by !== me?.username) toast.info(`${ev.by} wants a rematch.`, { id: `rematch-${gameId}` })
  })

  useSocketEvent('chatMessage', (msg) => {
    if (msg.gameId === gameId) setMessages((m) => [...m.slice(-99), msg])
  })

  useSocketEvent('presence', ({ userId, online: isOn }) => {
    setOnline((o) => (userId in o || [idOf(game?.p1), idOf(game?.p2)].includes(userId) ? { ...o, [userId]: isOn } : o))
  })

  // Turn countdown, synced to the server clock.
  const turnMs = game?.turnMs || 30000
  const deadline = game?.turnStartedAt && !game.roundEnd && game.p2 ? new Date(game.turnStartedAt).getTime() + turnMs : null
  useEffect(() => {
    if (!deadline) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [deadline])
  const timeLeft = deadline ? Math.min(turnMs / 1000, Math.max(0, (deadline - (now + offsetRef.current)) / 1000)) : null

  // When the clock runs out, either player may claim it; the server decides who loses the round.
  useEffect(() => {
    if (!seat || timeLeft === null || timeLeft > 0 || claimedRef.current === game.turnStartedAt) return
    claimedRef.current = game.turnStartedAt
    gamesApi.forfeit(gameId, 'timeout').then((r) => apply(r.data.game, r.data.serverTime)).catch(() => {})
  }, [seat, timeLeft, game, gameId, apply])

  const turn = game ? (game.p1LastMove ? 'p2' : 'p1') : null
  const myTurn = !!(seat && game?.p2 && !game.roundEnd && turn === seat)

  const play = useCallback(
    async (col) => {
      if (!myTurn || busy) return
      const p = landingPos(game.p1_Moves, game.p2_Moves, col)
      if (!p) return
      const before = game
      setGame({ ...game, [`${seat}_Moves`]: [...game[`${seat}_Moves`], p], p1LastMove: seat === 'p1' })
      playDrop()
      setBusy(true)
      try {
        const { data } = await gamesApi.move(gameId, col)
        apply(data.game, data.serverTime)
      } catch (e) {
        setGame(before)
        toast.error(errorMessage(e))
        if (e.response?.status === 409) load()
      } finally {
        setBusy(false)
      }
    },
    [myTurn, busy, game, seat, gameId, apply, load]
  )

  const act = useCallback(
    async (fn) => {
      setBusy(true)
      try {
        const { data } = await fn()
        apply(data.game, data.serverTime)
      } catch (e) {
        toast.error(errorMessage(e))
      } finally {
        setBusy(false)
      }
    },
    [apply]
  )

  const rematch = useCallback(() => act(() => gamesApi.rematch(gameId)), [act, gameId])
  const resign = useCallback(() => act(() => gamesApi.forfeit(gameId, 'resign')), [act, gameId])

  const sendChat = useCallback((message) => socket?.emit('chatMessage', { gameId, message }), [socket, gameId])

  const derived = useMemo(() => {
    if (!game) return {}
    const result = evaluate(game.p1_Moves, game.p2_Moves)
    const lastSeat = game.p1LastMove ? 'p1' : 'p2'
    const lastMove = game[`${lastSeat}_Moves`].at(-1) || null
    return { winLine: result.line, lastMove }
  }, [game])

  return {
    game, status, error, seat, turn, myTurn, busy, online, messages, timeLeft, turnMs,
    ...derived, play, rematch, resign, sendChat, reload: load,
  }
}
