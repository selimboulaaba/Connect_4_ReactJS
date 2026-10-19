import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuEye, LuMessageCircle } from 'react-icons/lu'
import { Board } from '../components/game/Board'
import { PlayerCard } from '../components/game/PlayerCard'
import { RoundOverlay } from '../components/game/RoundOverlay'
import { GameLayout, TurnStatus } from '../components/game/GameLayout'
import { useOnlineGame } from '../game/useOnlineGame'
import { selectUser } from '../store/userSlice'
import { Badge, Button, Card, CardHeader, EmptyState, LiveDot, Page, PageSpinner } from '../ui'

const idOf = (u) => (u && typeof u === 'object' ? u._id : u) || null

export default function SpectateGame() {
  const { id } = useParams()
  const me = useSelector(selectUser)
  const g = useOnlineGame(id, me, { spectate: true })
  const game = g.game

  if (g.status === 'loading') return <PageSpinner />
  if (!game || !game.p2) {
    return (
      <Page size="sm">
        <EmptyState icon={LuEye} title={g.status === 'notFound' ? 'Game not found' : 'Not started yet'} action={<Button to="/watch">Browse live games</Button>}>
          {g.status === 'notFound' ? 'This game has ended or expired.' : "This game is still waiting for a second player."}
        </EmptyState>
      </Page>
    )
  }

  const names = { p1: game.p1.username, p2: game.p2.username }
  const roundOver = !!game.roundEnd
  const isPlayer = !!g.seat

  const card = (seat) => {
    const active = !roundOver && g.turn === seat
    return (
      <PlayerCard
        player={seat}
        name={game[seat].username}
        avatarId={game[seat].avatar}
        score={game.score[seat]}
        active={active}
        online={!!g.online[idOf(game[seat])]}
        subtitle={active ? 'Thinking…' : `Level ${game[seat].lvl ?? 1}`}
        timeLeft={active ? g.timeLeft : null}
        turnMs={g.turnMs}
        align={seat === 'p2' ? 'right' : 'left'}
      />
    )
  }

  const end = game.roundEnd
  return (
    <GameLayout
      title={`${names.p1} vs ${names.p2}`}
      badge={<Badge tone="danger" icon={LiveDot}>Live</Badge>}
      back="/watch"
      backLabel="Live games"
      players={<>{card('p1')}{card('p2')}</>}
      board={<Board p1Moves={game.p1_Moves} p2Moves={game.p2_Moves} lastMove={g.lastMove} winLine={g.winLine} label="Board (spectating)" />}
      overlay={
        end && (
          <RoundOverlay
            tone={end.winner === 'draw' ? 'draw' : 'neutral'}
            emoji={end.winner === 'draw' ? '🤝' : '🏁'}
            title={end.winner === 'draw' ? 'Draw' : `${names[end.winner]} wins the round`}
            subtitle={`Score ${game.score.p1}–${game.score.p2} · waiting for the next round`}
          />
        )
      }
      status={!roundOver && <TurnStatus player={g.turn}>{names[g.turn]} to play</TurnStatus>}
      controls={isPlayer && <Button to={`/online/${id}`}>You’re in this game. Open it.</Button>}
      side={
        <Card>
          <CardHeader icon={LuMessageCircle} title="Spectating" />
          <p className="text-sm text-muted">You’re watching live. Moves appear instantly. Chat is private to the players.</p>
        </Card>
      }
    />
  )
}
