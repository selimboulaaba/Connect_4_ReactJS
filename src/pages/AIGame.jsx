import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RotateCcw } from 'lucide-react'
import { Board } from '@/components/game/Board'
import { ScoreRail } from '@/components/game/ScoreRail'
import { RoundOverlay } from '@/components/game/RoundOverlay'
import { GameLayout, TurnStatus } from '@/components/game/GameLayout'
import { useLocalMatch } from '@/game/useLocalMatch'
import { getBestMove } from '@/game/ai'
import { playChime } from '@/lib/sound'
import { selectUser } from '@/store/userSlice'
import { Button, IconButton, SegmentedControl } from '@/ui'

const LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const cpuWinsSound = () => playChime(false)

const readLevel = () => {
  try {
    return localStorage.getItem('cpu-level') || 'medium'
  } catch {
    return 'medium'
  }
}

export default function AIGame() {
  const user = useSelector(selectUser)
  const [level, setLevel] = useState(readLevel)
  const m = useLocalMatch({ loseSound: cpuWinsSound })
  const over = m.result.winner
  const cpuTurn = m.turn === 'p2'
  const levelLabel = LEVELS.find((l) => l.value === level).label

  // The computer plays yellow, after a short pause so its moves are easy to follow.
  const { p1, p2, play } = m
  useEffect(() => {
    if (!cpuTurn) return
    const t = setTimeout(() => play(getBestMove(p1, p2, level), 'p2'), 550)
    return () => clearTimeout(t)
  }, [cpuTurn, p1, p2, play, level])

  const changeLevel = (v) => {
    setLevel(v)
    try { localStorage.setItem('cpu-level', v) } catch { /* ignore */ }
    m.resetMatch()
  }

  return (
    <GameLayout
      title="Play the computer"
      actions={<IconButton icon={RotateCcw} label="Reset the score" onClick={m.resetMatch} />}
      rail={
        <ScoreRail
          left={{ player: 'p1', name: user?.username || 'You', avatarId: user?.avatar, score: m.score.p1, active: m.turn === 'p1', isYou: !!user, subtitle: 'Red' }}
          right={{ player: 'p2', name: 'Computer', avatarId: 'avatar_10', score: m.score.p2, active: cpuTurn, subtitle: `${levelLabel} level` }}
        />
      }
      board={
        <Board
          p1Moves={m.p1}
          p2Moves={m.p2}
          lastMove={m.lastMove}
          winLine={m.result.line}
          interactive={m.turn === 'p1'}
          previewPlayer="p1"
          onPlay={(col) => m.play(col, 'p1')}
        />
      }
      overlay={
        over && (
          <RoundOverlay
            winner={over}
            title={over === 'draw' ? 'Board full' : over === 'p1' ? 'You win' : 'The computer wins'}
            subtitle={over === 'p2' && level !== 'easy' ? `Try easy, or have another go at ${levelLabel.toLowerCase()}.` : `${m.score.p1} to ${m.score.p2} so far.`}
          >
            <Button onClick={m.nextRound}>Next round</Button>
          </RoundOverlay>
        )
      }
      status={!over && (cpuTurn ? <TurnStatus player="p2">The computer is thinking</TurnStatus> : <TurnStatus player="p1">Your turn</TurnStatus>)}
      controls={<SegmentedControl label="Computer level" options={LEVELS} value={level} onChange={changeLevel} />}
    />
  )
}
