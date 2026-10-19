import { LuRotateCcw } from 'react-icons/lu'
import { Board } from '../components/game/Board'
import { PlayerCard } from '../components/game/PlayerCard'
import { RoundOverlay } from '../components/game/RoundOverlay'
import { GameLayout, TurnStatus } from '../components/game/GameLayout'
import { useLocalMatch } from '../game/useLocalMatch'
import { Button, IconButton } from '../ui'

const NAMES = { p1: 'Red', p2: 'Yellow' }

export default function LocalGame() {
  const m = useLocalMatch()
  const over = m.result.winner

  return (
    <GameLayout
      title="Pass & play"
      actions={<IconButton icon={LuRotateCcw} label="Reset score" onClick={m.resetMatch} />}
      players={
        <>
          <PlayerCard player="p1" name={NAMES.p1} avatarId="avatar_1" score={m.score.p1} active={m.turn === 'p1'} subtitle={m.turn === 'p1' ? 'Your turn' : 'Player 1'} />
          <PlayerCard player="p2" name={NAMES.p2} avatarId="avatar_5" score={m.score.p2} active={m.turn === 'p2'} subtitle={m.turn === 'p2' ? 'Your turn' : 'Player 2'} align="right" />
        </>
      }
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
            tone={over === 'draw' ? 'draw' : 'win'}
            emoji={over === 'draw' ? '🤝' : '🎉'}
            title={over === 'draw' ? "It's a draw" : `${NAMES[over]} wins!`}
            subtitle={`Score ${m.score.p1} – ${m.score.p2}${m.score.draws ? ` · ${m.score.draws} draw${m.score.draws > 1 ? 's' : ''}` : ''}`}
          >
            <Button onClick={m.nextRound} data-autofocus>Next round</Button>
          </RoundOverlay>
        )
      }
      status={!over && <TurnStatus player={m.turn}>{NAMES[m.turn]} to play</TurnStatus>}
    />
  )
}
