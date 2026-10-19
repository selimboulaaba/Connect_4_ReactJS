import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Copy, Flag, Link2, Share2 } from 'lucide-react'
import { Board } from '@/components/game/Board'
import { ScoreRail } from '@/components/game/ScoreRail'
import { RoundOverlay } from '@/components/game/RoundOverlay'
import { GameChat } from '@/components/game/GameChat'
import { GameLayout, TurnStatus } from '@/components/game/GameLayout'
import { useOnlineGame } from '@/game/useOnlineGame'
import { selectUser } from '@/store/userSlice'
import { Badge, Button, Card, CardHeader, EmptyState, IconButton, Modal, Page, PageSpinner, Spinner, toast } from '@/ui'

const idOf = (u) => (u && typeof u === 'object' ? u._id : u) || null

async function copy(text, what) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${what} copied`)
  } catch {
    toast.error('Copying is blocked in this browser. Select the text and copy it instead.')
  }
}

/** Shown in place of the board until the second player arrives. */
function WaitingTray({ game, link }) {
  const invited = game.invitedUser
  const canShare = typeof navigator !== 'undefined' && !!navigator.share
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <Spinner className="size-6 text-board" />
        <h2 className="font-display text-display-sm">{invited ? `Waiting for ${invited.username}` : 'Waiting for a second player'}</h2>
      </div>
      <p className="mt-3 max-w-[48ch] text-muted-foreground">
        {invited
          ? 'Your invite has been sent. The game starts the moment they open it.'
          : 'Send this link to a friend. The game starts the moment they open it.'}
      </p>
      <div className="mt-6 flex items-center gap-2 rounded-btn border-3 border-ink bg-background p-1.5 pl-4">
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">{link}</span>
        <IconButton icon={Copy} label="Copy the link" size="sm" onClick={() => copy(link, 'Link')} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button icon={Link2} onClick={() => copy(link, 'Link')}>Copy invite link</Button>
        {canShare && (
          <Button variant="secondary" icon={Share2} onClick={() => navigator.share({ title: 'Connect 4', text: 'Play Connect 4 with me', url: link }).catch(() => {})}>
            Share
          </Button>
        )}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Game code: <span className="font-bold text-foreground">{game._id}</span>
      </p>
    </Card>
  )
}

function resultCopy(game, seat, names) {
  const { winner, reason } = game.roundEnd
  const opp = seat === 'p1' ? 'p2' : 'p1'
  if (winner === 'draw') return { title: 'Board full', subtitle: 'Nobody connected four.' }
  if (!seat) return { title: `${names[winner]} wins`, subtitle: reason === 'timeout' ? 'The other player ran out of time.' : reason === 'resign' ? 'The other player resigned.' : 'Four in a row.' }
  if (winner === seat) {
    return { title: 'You win', subtitle: reason === 'timeout' ? `${names[opp]} ran out of time.` : reason === 'resign' ? `${names[opp]} resigned the round.` : 'Four in a row.' }
  }
  return { title: reason === 'timeout' ? 'Out of time' : 'You lose', subtitle: reason === 'timeout' ? 'Your 30 seconds ran out.' : reason === 'resign' ? 'You resigned the round.' : `${names[winner]} connected four.` }
}

export default function OnlineGame() {
  const { id } = useParams()
  const me = useSelector(selectUser)
  const g = useOnlineGame(id, me)
  const [confirmResign, setConfirmResign] = useState(false)
  const game = g.game
  const link = `${window.location.origin}/online/${id}`

  if (g.status === 'loading') return <PageSpinner />
  if (g.status !== 'ready' || !game) {
    const copyMap = {
      notFound: ['This game is gone', 'It may have expired or been declined. Start a new one.'],
      declined: ['Your invite was declined', 'Try inviting another friend, or share a link instead.'],
      full: ['Two players are already here', g.error || 'You can still watch the game.'],
      error: ['The game didn’t load', g.error],
    }
    const [title, body] = copyMap[g.status] || copyMap.error
    return (
      <Page size="md">
        <EmptyState
          title={title}
          action={
            <>
              {g.status === 'full' && <Button to={`/watch/${id}`}>Watch the game</Button>}
              {g.status === 'error' && <Button onClick={g.reload}>Try again</Button>}
              <Button to="/online" variant="secondary">Start a new game</Button>
            </>
          }
        >
          {body}
        </EmptyState>
      </Page>
    )
  }

  const names = { p1: game.p1?.username, p2: game.p2?.username }
  const oppSeat = g.seat === 'p1' ? 'p2' : 'p1'
  const opp = game[oppSeat]
  const roundOver = !!game.roundEnd
  const decided = game.tournamentId && (game.score.p1 >= 2 || game.score.p2 >= 2)
  const rematchByMe = idOf(game.rematchBy) === me._id
  const rematchByOpp = game.rematchBy && !rematchByMe
  const roundNo = game.score.p1 + game.score.p2 + (game.score.draws || 0) + (roundOver ? 0 : 1)

  const side = (seat) => {
    const p = game[seat]
    const active = !!game.p2 && !roundOver && g.turn === seat
    return {
      player: seat,
      name: p?.username || (seat === 'p2' ? game.invitedUser?.username : null),
      avatarId: p?.avatar || (seat === 'p2' ? game.invitedUser?.avatar : undefined),
      score: game.score[seat],
      active,
      isYou: g.seat === seat,
      online: p ? !!g.online[idOf(p)] || g.seat === seat : undefined,
      subtitle: !p ? 'Invited' : active ? (g.seat === seat ? 'Your turn' : 'Thinking') : `Level ${p.lvl ?? 1}`,
      timeLeft: active ? g.timeLeft : null,
      turnMs: g.turnMs,
    }
  }

  const overlay = roundOver && (() => {
    const c = resultCopy(game, g.seat, names)
    return (
      <RoundOverlay winner={game.roundEnd.winner} title={c.title} subtitle={c.subtitle}>
        {decided ? (
          <>
            <p className="font-bold">{game.score.p1 >= 2 ? names.p1 : names.p2} goes through to the next round.</p>
            <Button to={`/tournament/${game.tournamentId}`}>Back to the bracket</Button>
          </>
        ) : rematchByOpp ? (
          <Button onClick={g.rematch} loading={g.busy}>Accept rematch</Button>
        ) : rematchByMe ? (
          <Button variant="secondary" disabled><Spinner className="size-4 border-2" /> Waiting for {opp?.username}</Button>
        ) : (
          <Button onClick={g.rematch} loading={g.busy}>Play another round</Button>
        )}
        <Button to="/online" variant="ghost">Leave</Button>
      </RoundOverlay>
    )
  })()

  let status = null
  if (game.p2 && !roundOver) {
    status = g.myTurn ? (
      <TurnStatus player={g.seat}>Your turn</TurnStatus>
    ) : (
      <TurnStatus player={g.turn}>
        {opp && !g.online[idOf(opp)] ? `${opp.username} has disconnected` : `${names[g.turn]} is thinking`}
      </TurnStatus>
    )
  }

  return (
    <>
      <GameLayout
        title={game.tournamentId ? 'Tournament match' : 'Online game'}
        badge={game.p2 && <Badge tone="board">Round {roundNo}</Badge>}
        back={game.tournamentId ? `/tournament/${game.tournamentId}` : '/online'}
        backLabel={game.tournamentId ? 'Bracket' : 'Lobby'}
        actions={<IconButton icon={Link2} label="Copy the game link" onClick={() => copy(link, 'Link')} />}
        rail={game.p2 && <ScoreRail left={side('p1')} right={side('p2')} />}
        board={
          game.p2 ? (
            <Board
              p1Moves={game.p1_Moves}
              p2Moves={game.p2_Moves}
              lastMove={g.lastMove}
              winLine={g.winLine}
              interactive={g.myTurn && !g.busy}
              previewPlayer={g.seat}
              onPlay={g.play}
              label={g.myTurn ? 'Board, your turn: choose a column' : 'Board'}
            />
          ) : (
            <WaitingTray game={game} link={link} />
          )
        }
        overlay={overlay}
        status={status}
        controls={
          game.p2 && !roundOver && g.seat && (
            <Button variant="danger-ghost" size="sm" icon={Flag} onClick={() => setConfirmResign(true)}>
              Resign this round
            </Button>
          )
        }
        side={
          game.p2 && (
            <Card className="flex flex-col lg:sticky lg:top-24 lg:max-h-[38rem]">
              <CardHeader title="Chat" subtitle={opp ? `Only you and ${opp.username} can see this.` : undefined} />
              <GameChat messages={g.messages} me={me.username} onSend={g.sendChat} disabled={!opp} />
            </Card>
          )
        }
      />
      <Modal
        open={confirmResign}
        onClose={() => setConfirmResign(false)}
        title="Resign this round?"
        description={`${opp?.username || 'Your opponent'} gets the point. You keep playing the next round.`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmResign(false)}>Keep playing</Button>
            <Button variant="danger" onClick={() => { setConfirmResign(false); g.resign() }}>Resign round</Button>
          </>
        }
      />
    </>
  )
}
