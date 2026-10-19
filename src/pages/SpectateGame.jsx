import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Board } from '@/components/game/Board'
import { ScoreRail } from '@/components/game/ScoreRail'
import { RoundOverlay } from '@/components/game/RoundOverlay'
import { GameLayout, TurnStatus } from '@/components/game/GameLayout'
import { useOnlineGame } from '@/game/useOnlineGame'
import { selectUser } from '@/store/userSlice'
import { Badge, Button, EmptyState, LiveDot, Page, PageSpinner } from '@/ui'

const idOf = (u) => (u && typeof u === 'object' ? u._id : u) || null

export default function SpectateGame() {
  const { id } = useParams()
  const me = useSelector(selectUser)
  const g = useOnlineGame(id, me, { spectate: true })
  const game = g.game

  if (g.status === 'loading') return <PageSpinner />
  if (!game || !game.p2) {
    return (
      <Page size="md">
        <EmptyState title={g.status === 'notFound' ? 'This game has ended' : 'This game hasn’t started'} action={<Button to="/watch">See live games</Button>}>
          {g.status === 'notFound' ? 'Finished games are removed after a while.' : 'It’s still waiting for a second player.'}
        </EmptyState>
      </Page>
    )
  }

  const names = { p1: game.p1.username, p2: game.p2.username }
  const roundOver = !!game.roundEnd
  const side = (seat) => {
    const active = !roundOver && g.turn === seat
    return {
      player: seat,
      name: game[seat].username,
      avatarId: game[seat].avatar,
      score: game.score[seat],
      active,
      online: !!g.online[idOf(game[seat])],
      subtitle: active ? 'Thinking' : `Level ${game[seat].lvl ?? 1}`,
      timeLeft: active ? g.timeLeft : null,
      turnMs: g.turnMs,
    }
  }
  const end = game.roundEnd

  return (
    <GameLayout
      title={`${names.p1} vs ${names.p2}`}
      badge={<Badge tone="red" icon={LiveDot}>Live</Badge>}
      back="/watch"
      backLabel="Live games"
      rail={<ScoreRail left={side('p1')} right={side('p2')} />}
      board={<Board p1Moves={game.p1_Moves} p2Moves={game.p2_Moves} lastMove={g.lastMove} winLine={g.winLine} label="Board, watching" />}
      overlay={end && <RoundOverlay winner={end.winner} title={end.winner === 'draw' ? 'Board full' : `${names[end.winner]} wins the round`} subtitle="The next round starts when both players are ready." />}
      status={!roundOver && <TurnStatus player={g.turn}>{names[g.turn]} to play</TurnStatus>}
      controls={g.seat && <Button to={`/online/${id}`}>This is your game. Play it.</Button>}
    />
  )
}
