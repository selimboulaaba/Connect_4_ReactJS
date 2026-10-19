import { useCallback, useMemo, useState } from 'react'
import { evaluate, landingPos } from './logic'
import { playDrop, playWin, playChime } from '../lib/sound'

/**
 * State for an offline match (local or vs CPU): moves, turn, round result and running score.
 * The opening player alternates every round.
 */
export function useLocalMatch({ winSound = playWin, loseSound } = {}) {
  const [p1, setP1] = useState([])
  const [p2, setP2] = useState([])
  const [lastMove, setLastMove] = useState(null)
  const [score, setScore] = useState({ p1: 0, p2: 0, draws: 0 })
  const [round, setRound] = useState(0)

  const starter = round % 2 === 0 ? 'p1' : 'p2'
  const result = useMemo(() => evaluate(p1, p2), [p1, p2])
  const turn = result.winner ? null : p1.length === p2.length ? starter : starter === 'p1' ? 'p2' : 'p1'

  const play = useCallback(
    (col, player = turn) => {
      if (!player || player !== turn) return false
      const p = landingPos(p1, p2, col)
      if (!p) return false
      const next1 = player === 'p1' ? [...p1, p] : p1
      const next2 = player === 'p2' ? [...p2, p] : p2
      setP1(next1)
      setP2(next2)
      setLastMove(p)
      playDrop()
      const r = evaluate(next1, next2)
      if (r.winner) {
        setScore((s) => (r.winner === 'draw' ? { ...s, draws: s.draws + 1 } : { ...s, [r.winner]: s[r.winner] + 1 }))
        setTimeout(() => {
          if (r.winner === 'draw') playChime()
          else if (loseSound && r.winner === 'p2') loseSound()
          else winSound()
        }, 300)
      }
      return true
    },
    [p1, p2, turn, winSound, loseSound]
  )

  const nextRound = useCallback(() => {
    setP1([])
    setP2([])
    setLastMove(null)
    setRound((r) => r + 1)
  }, [])

  const resetMatch = useCallback(() => {
    setP1([])
    setP2([])
    setLastMove(null)
    setRound(0)
    setScore({ p1: 0, p2: 0, draws: 0 })
  }, [])

  return { p1, p2, lastMove, score, round, turn, result, play, nextRound, resetMatch }
}
