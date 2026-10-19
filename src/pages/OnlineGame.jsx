import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuCopy, LuFlag, LuLink, LuShare2, LuEye, LuMessageCircle, LuSwords } from 'react-icons/lu'
import { Board } from '../components/game/Board'
import { PlayerCard } from '../components/game/PlayerCard'
import { RoundOverlay } from '../components/game/RoundOverlay'
import { GameChat } from '../components/game/GameChat'
import { GameLayout, TurnStatus } from '../components/game/GameLayout'
import { useOnlineGame } from '../game/useOnlineGame'
import { selectUser } from '../store/userSlice'
import { Badge, Button, Card, CardHeader, EmptyState, IconButton, Modal, Page, PageSpinner, Spinner, toast } from '../ui'

const idOf = (u) => (u && typeof u === 'object' ? u._id : u) || null

async function copy(text, what) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${what} copied`)
  } catch {
    toast.error("Couldn't access the clipboard")
  }
}

function WaitingCard({ game, link }) {
  const invited = game.invitedUser
  const canShare = typeof navigator !== 'undefined' && !!navigator.share
  return (
    <Card className="text-center">
      <Spinner className="mx-auto mb-3 size-6 text-primary" />
      <h2 className="text-xl font-semibold">{invited ? `Waiting for ${invited.username}…` : 'Waiting for an opponent'}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
        {invited ? "We've sent them your invite. The game starts as soon as they join." : 'Share this link or game code with a friend. The game starts as soon as they join.'}
      </p>
      <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-xl border border-line bg-bg p-1.5 pl-3">
        <code className="min-w-0 flex-1 truncate text-left text-sm text-muted">{game._id}</code>
        <IconButton icon={LuCopy} label="Copy game code" size="sm" onClick={() => copy(game._id, 'Game code')} />
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Button icon={LuLink} onClick={() => copy(link, 'Invite link')}>Copy invite link</Button>
        {canShare && (
          <Button variant="secondary" icon={LuShare2} onClick={() => navigator.share({ title: 'Connect 4', text: 'Play Connect 4 with me!', url: link }).catch(() => {})}>
            Share
          </Button>
        )}
      </div>
    </Card>
  )
}

function resultCopy(game, seat, names) {
  const { winner, reason } = game.roundEnd
  const opp = seat === 'p1' ? 'p2' : 'p1'
  if (winner === 'draw') return { tone: 'draw', emoji: '🤝', title: "It's a draw", subtitle: 'The board is full.' }
  if (!seat) return { tone: 'neutral', emoji: '🏁', title: `${names[winner]} wins the round`, subtitle: reason === 'timeout' ? 'On time.' : reason === 'resign' ? 'By resignation.' : 'Four in a row.' }
  if (winner === seat) {
    const sub = reason === 'timeout' ? `${names[opp]} ran out of time.` : reason === 'resign' ? `${names[opp]} resigned the round.` : 'Four in a row. Nicely played.'
    return { tone: 'win', emoji: '🏆', title: 'You win!', subtitle: sub }
  }
  const sub = reason === 'timeout' ? 'You ran out of time.' : reason === 'resign' ? 'You resigned the round.' : `${names[winner]} connected four.`
  return { tone: 'lose', emoji: '😤', title: reason === 'timeout' ? "Time's up" : 'You lose', subtitle: sub }
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
      notFound: ['Game not found', 'This game may have expired or been declined.'],
      declined: ['Invite declined', 'Your friend declined this game. Try inviting someone else.'],
      full: ['This game is full', g.error || 'Two players are already in this game, but you can still watch.'],
      error: ["Couldn't load the game", g.error],
    }
    const [title, body] = copyMap[g.status] || copyMap.error
    return (
      <Page size="sm">
        <EmptyState
          icon={g.status === 'full' ? LuEye : LuSwords}
          title={title}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              {g.status === 'full' && <Button to={`/watch/${id}`} icon={LuEye}>Watch game</Button>}
              {g.status === 'error' && <Button onClick={g.reload}>Try again</Button>}
              <Button to="/online" variant="secondary">New game</Button>
            </div>
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

  const card = (seat) => {
    const p = game[seat]
    const active = !!game.p2 && !roundOver && g.turn === seat
    return (
      <PlayerCard
        player={seat}
        name={p?.username || (game.invitedUser && seat === 'p2' ? game.invitedUser.username : null)}
        avatarId={p?.avatar || game.invitedUser?.avatar}
        score={game.score[seat]}
        active={active}
        isYou={g.seat === seat}
        online={p ? !!g.online[idOf(p)] || g.seat === seat : undefined}
        subtitle={p ? (active ? (g.seat === seat ? 'Your turn' : 'Thinking…') : `Level ${p.lvl ?? 1}`) : 'Invited'}
        timeLeft={active ? g.timeLeft : null}
        turnMs={g.turnMs}
        align={seat === 'p2' ? 'right' : 'left'}
      />
    )
  }

  const overlay = roundOver && (() => {
    const c = resultCopy(game, g.seat, names)
    return (
      <RoundOverlay {...c} subtitle={`${c.subtitle} · Score ${game.score.p1}–${game.score.p2}`}>
        {decided ? (
          <>
            <p className="text-sm font-semibold text-fg">Match decided: {game.score.p1 >= 2 ? names.p1 : names.p2} advances.</p>
            <Button to={`/tournament/${game.tournamentId}`}>Back to tournament</Button>
          </>
        ) : rematchByOpp ? (
          <Button onClick={g.rematch} loading={g.busy}>Accept rematch</Button>
        ) : rematchByMe ? (
          <Button disabled><Spinner className="size-4" /> Waiting for {opp?.username}…</Button>
        ) : (
          <Button onClick={g.rematch} loading={g.busy}>Play next round</Button>
        )}
        <Button to="/online" variant="ghost">Leave game</Button>
      </RoundOverlay>
    )
  })()

  let status = null
  if (!game.p2) status = null
  else if (!roundOver) {
    status = g.myTurn ? (
      <TurnStatus player={g.seat}>Your turn{typeof g.timeLeft === 'number' ? ` · ${Math.ceil(g.timeLeft)}s` : ''}</TurnStatus>
    ) : (
      <TurnStatus player={g.turn}>
        {opp && !g.online[idOf(opp)] ? `${opp.username} is offline…` : `Waiting for ${names[g.turn]}…`}
      </TurnStatus>
    )
  }

  return (
    <>
      <GameLayout
        title={game.tournamentId ? 'Tournament match' : 'Online match'}
        badge={game.p2 && <Badge tone="primary">Round {roundNo}</Badge>}
        back={game.tournamentId ? `/tournament/${game.tournamentId}` : '/online'}
        backLabel={game.tournamentId ? 'Bracket' : 'Lobby'}
        actions={<IconButton icon={LuLink} label="Copy game link" onClick={() => copy(link, 'Game link')} />}
        players={<>{card('p1')}{card('p2')}</>}
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
              label={g.myTurn ? 'Board: your turn, choose a column' : 'Board'}
            />
          ) : (
            <WaitingCard game={game} link={link} />
          )
        }
        overlay={overlay}
        status={status}
        controls={
          game.p2 && !roundOver && g.seat && (
            <Button variant="danger-ghost" size="sm" icon={LuFlag} onClick={() => setConfirmResign(true)}>
              Resign round
            </Button>
          )
        }
        side={
          game.p2 && (
            <Card className="flex h-full flex-col lg:max-h-[38rem]">
              <CardHeader title="Chat" icon={LuMessageCircle} subtitle={opp ? `with ${opp.username}` : undefined} />
              <GameChat messages={g.messages} me={me.username} onSend={g.sendChat} disabled={!opp} />
            </Card>
          )
        }
      />
      <Modal
        open={confirmResign}
        onClose={() => setConfirmResign(false)}
        title="Resign this round?"
        description={`${opp?.username || 'Your opponent'} will get the point. The match continues with the next round.`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmResign(false)} data-autofocus>Keep playing</Button>
            <Button variant="danger" onClick={() => { setConfirmResign(false); g.resign() }}>Resign</Button>
          </>
        }
      />
    </>
  )
}
