import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LuRotateCcw } from 'react-icons/lu'
import { Board } from '../components/game/Board'
import { PlayerCard } from '../components/game/PlayerCard'
import { RoundOverlay } from '../components/game/RoundOverlay'
import { GameLayout, TurnStatus } from '../components/game/GameLayout'
import { useLocalMatch } from '../game/useLocalMatch'
import { getBestMove } from '../game/ai'
import { playChime } from '../lib/sound'
import { selectUser } from '../store/userSlice'
import { Button, IconButton, SegmentedControl, Spinner } from '../ui'

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

  // CPU plays p2 after a short "thinking" pause so moves are easy to follow.
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

  const name = user?.username || 'You'

  return (
    <GameLayout
      title="Play vs CPU"
      actions={<IconButton icon={LuRotateCcw} label="Reset score" onClick={m.resetMatch} />}
      players={
        <>
          <PlayerCard player="p1" name={name} avatarId={user?.avatar} score={m.score.p1} active={m.turn === 'p1'} isYou subtitle={m.turn === 'p1' ? 'Your turn' : 'Waiting'} />
          <PlayerCard player="p2" name="CPU" avatarId="avatar_9" score={m.score.p2} active={cpuTurn} subtitle={`${LEVELS.find((l) => l.value === level).label} bot`} align="right" />
        </>
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
            tone={over === 'draw' ? 'draw' : over === 'p1' ? 'win' : 'lose'}
            emoji={over === 'draw' ? '🤝' : over === 'p1' ? '🏆' : '🤖'}
            title={over === 'draw' ? "It's a draw" : over === 'p1' ? 'You win!' : 'CPU wins'}
            subtitle={over === 'p2' ? 'Shake it off and try again.' : `Score ${m.score.p1} – ${m.score.p2}`}
          >
            <Button onClick={m.nextRound}>Next round</Button>
          </RoundOverlay>
        )
      }
      status={
        !over &&
        (cpuTurn ? (
          <TurnStatus player="p2"><Spinner className="size-3.5" /> CPU is thinking…</TurnStatus>
        ) : (
          <TurnStatus player="p1">Your turn</TurnStatus>
        ))
      }
      controls={<SegmentedControl label="Difficulty" options={LEVELS} value={level} onChange={changeLevel} />}
    />
  )
}
