import { RotateCcw } from 'lucide-react'
import { Board } from '@/components/game/Board'
import { ScoreRail } from '@/components/game/ScoreRail'
import { RoundOverlay } from '@/components/game/RoundOverlay'
import { GameLayout, TurnStatus } from '@/components/game/GameLayout'
import { useLocalMatch } from '@/game/useLocalMatch'
import { Button, IconButton } from '@/ui'

const NAMES = { p1: 'Red', p2: 'Yellow' }

export default function LocalGame() {
  const m = useLocalMatch()
  const over = m.result.winner
  const side = (player, avatarId, align) => ({
    player,
    name: NAMES[player],
    avatarId,
    score: m.score[player],
    active: m.turn === player,
    subtitle: player === 'p1' ? 'Player 1' : 'Player 2',
    align,
  })

  return (
    <GameLayout
      title="Pass and play"
      actions={<IconButton icon={RotateCcw} label="Reset the score" onClick={m.resetMatch} />}
      rail={<ScoreRail left={side('p1', 'avatar_1')} right={side('p2', 'avatar_2')} />}
      board={
        <Board
          p1Moves={m.p1}
          p2Moves={m.p2}
          lastMove={m.lastMove}
          winLine={m.result.line}
          interactive={!over}
          previewPlayer={m.turn}
          onPlay={(col) => m.play(col)}
        />
      }
      overlay={
        over && (
          <RoundOverlay
            winner={over}
            title={over === 'draw' ? 'Board full' : `${NAMES[over]} wins`}
            subtitle={over === 'draw' ? 'Nobody connected four.' : `${m.score.p1} to ${m.score.p2} so far.`}
          >
            <Button onClick={m.nextRound}>Next round</Button>
          </RoundOverlay>
        )
      }
      status={!over && <TurnStatus player={m.turn}>{NAMES[m.turn]} to play</TurnStatus>}
    />
  )
}
