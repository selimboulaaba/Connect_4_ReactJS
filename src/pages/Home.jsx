import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Bot, Users, Puzzle, Swords, Eye, ChevronRight, Globe } from 'lucide-react'
import { Badge, Button, Card } from '@/ui'
import { Board } from '@/components/game/Board'
import { TurnStatus } from '@/components/game/GameLayout'
import { useLocalMatch } from '@/game/useLocalMatch'
import { getBestMove } from '@/game/ai'
import { playChime } from '@/lib/sound'
import { selectUser } from '@/store/userSlice'

const MORE = [
  { to: '/ai', title: 'Play the computer', desc: 'Easy, medium or hard. Good practice before you face a friend.', icon: Bot },
  { to: '/local', title: 'Pass and play', desc: 'Two players sharing one screen. Take turns dropping discs.', icon: Users },
  { to: '/daily', title: 'Daily puzzle', desc: 'One winning move is hidden on the board. Find it for 50 XP.', icon: Puzzle, chip: '+50 XP' },
  { to: '/tournament', title: 'Tournament', desc: 'Four players, two semifinals, one final. First to two wins.', icon: Swords, auth: true },
  { to: '/watch', title: 'Watch live games', desc: 'See matches that are being played right now.', icon: Eye, auth: true },
]

const cpuWins = () => playChime(false)

/** The hero is a real board: a relaxed game against the easy bot, playable straight away. */
function HeroBoard() {
  const m = useLocalMatch({ loseSound: cpuWins })
  const { p1, p2, play, turn, result } = m

  useEffect(() => {
    if (turn !== 'p2') return
    const t = setTimeout(() => play(getBestMove(p1, p2, 'easy'), 'p2'), 500)
    return () => clearTimeout(t)
  }, [turn, p1, p2, play])

  const over = result.winner
  return (
    <div>
      <Board
        p1Moves={p1}
        p2Moves={p2}
        lastMove={m.lastMove}
        winLine={result.line}
        interactive={turn === 'p1'}
        previewPlayer="p1"
        onPlay={(col) => play(col, 'p1')}
        label="Try a quick game: you are red"
      />
      <div className="mt-4 flex min-h-11 flex-wrap items-center justify-center gap-3" aria-live="polite">
        {over ? (
          <>
            <span className="text-lg font-extrabold">
              {over === 'p1' ? 'You beat the bot.' : over === 'p2' ? 'The bot got you.' : 'A draw.'}
            </span>
            <Button size="sm" variant="secondary" onClick={m.nextRound}>Play again</Button>
          </>
        ) : turn === 'p1' ? (
          <TurnStatus player="p1">{p1.length === 0 ? 'You’re red. Drop a disc to start.' : 'Your turn'}</TurnStatus>
        ) : (
          <TurnStatus player="p2">The bot is thinking</TurnStatus>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const user = useSelector(selectUser)
  const signedIn = useSelector((s) => !!s.user.token)
  const invites = user?.pendingGameInvites?.length || 0

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-32 pt-8 sm:px-6 sm:pt-14 md:pb-20">
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-16">
        <div className="max-w-xl">
          <h1 className="font-display text-display-md sm:text-display-xl">
            {user ? `Your move, ${user.username}.` : 'Drop four in a row.'}
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg text-muted-foreground sm:text-xl">
            Play a friend online, take on the computer, or pass one phone around.
          </p>

          {invites > 0 && (
            <Link to="/friends" className="mt-6 flex items-center gap-3 rounded-btn border-3 border-ink bg-yellow px-4 py-3 font-bold text-[hsl(var(--on-yellow))] shadow-plastic-sm">
              <span className="flex size-7 items-center justify-center rounded-full border-2 border-ink bg-red text-sm text-white">{invites}</span>
              {invites === 1 ? 'A friend invited you to a game' : `${invites} friends invited you to games`}
              <ChevronRight className="ml-auto size-5" aria-hidden />
            </Link>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {signedIn ? (
              <>
                <Button to="/online" size="lg" icon={Globe} className="h-12 px-5 text-base sm:h-14 sm:px-7 sm:text-lg">Play a friend online</Button>
                <Button to="/online" size="lg" variant="secondary" className="h-12 px-5 text-base sm:h-14 sm:px-7 sm:text-lg">Join with a code</Button>
              </>
            ) : (
              <>
                <Button to="/signup" size="lg" className="h-12 px-5 text-base sm:h-14 sm:px-7 sm:text-lg">Create a free account</Button>
                <Button to="/signin" size="lg" variant="secondary" className="h-12 px-5 text-base sm:h-14 sm:px-7 sm:text-lg">Sign in</Button>
              </>
            )}
          </div>
          {!signedIn && <p className="mt-3 text-sm text-muted-foreground">An account lets you play friends online, earn XP and join tournaments.</p>}
        </div>

        <HeroBoard />
      </section>

      <section className="mt-20 max-w-3xl">
        <h2 className="font-display text-display-sm">More ways to play</h2>
        <Card padded={false} className="mt-5 overflow-hidden">
          <ul>
            {MORE.map((m, i) => {
              const locked = m.auth && !signedIn
              return (
                <li key={m.to} className={i > 0 ? 'border-t-2 border-ink/10' : undefined}>
                  <Link
                    to={locked ? '/signin' : m.to}
                    state={locked ? { from: m.to } : undefined}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted sm:px-6"
                  >
                    <span className="board-hole flex size-12 shrink-0 items-center justify-center rounded-full border-3 border-ink text-board">
                      <m.icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 font-extrabold">
                        {m.title}
                        {locked ? <Badge>Needs an account</Badge> : m.chip && <Badge tone="yellow">{m.chip}</Badge>}
                      </span>
                      <span className="mt-0.5 block text-muted-foreground">{m.desc}</span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              )
            })}
          </ul>
        </Card>
      </section>
    </div>
  )
}
