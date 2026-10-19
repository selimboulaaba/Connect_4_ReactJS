import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuGlobe, LuBot, LuUsers, LuPuzzle, LuSwords, LuEye, LuLock, LuChevronRight, LuBell } from 'react-icons/lu'
import { Avatar, Badge, Button, Card, Page, ProgressBar, cn } from '../ui'
import { MiniBoard } from '../components/game/Board'
import { levelProgress } from '../game/level'
import { selectUser } from '../store/userSlice'

const MODES = [
  { to: '/online', title: 'Play online', desc: 'Create a game, share the code, and play a friend in real time.', icon: LuGlobe, auth: true, featured: true },
  { to: '/ai', title: 'Play vs CPU', desc: 'Three difficulty levels, from relaxed to ruthless.', icon: LuBot },
  { to: '/local', title: 'Pass & play', desc: 'Two players, one device. Take turns.', icon: LuUsers },
  { to: '/daily', title: 'Daily puzzle', desc: 'Find the winning move. New puzzle every day.', icon: LuPuzzle, tag: '+50 XP' },
  { to: '/tournament', title: 'Tournament', desc: 'Four-player bracket. First to two wins advances.', icon: LuSwords, auth: true },
  { to: '/watch', title: 'Watch live', desc: 'Spectate games happening right now.', icon: LuEye, auth: true },
]

const HERO_P1 = ['53', '52', '43', '33', '41', '55']
const HERO_P2 = ['54', '44', '42', '51', '34', '50']

function ModeCard({ mode, locked }) {
  const Icon = mode.icon
  return (
    <Link
      to={locked ? '/signin' : mode.to}
      state={locked ? { from: mode.to } : undefined}
      className={cn(
        'group flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-pop',
        mode.featured && 'bg-gradient-to-br from-primary/15 via-surface to-surface'
      )}
    >
      <div className="flex items-start justify-between">
        <span className={cn('flex size-11 items-center justify-center rounded-xl', mode.featured ? 'bg-primary text-primary-fg' : 'bg-primary/10 text-primary')}>
          <Icon className="size-5" aria-hidden />
        </span>
        {locked ? <Badge icon={LuLock}>Sign in</Badge> : mode.tag && <Badge tone="warning">{mode.tag}</Badge>}
      </div>
      <h2 className="mt-4 text-lg font-semibold">{mode.title}</h2>
      <p className="mt-1 text-sm text-muted">{mode.desc}</p>
      <span className="mt-auto inline-flex pt-4 items-center gap-1 text-sm font-semibold text-primary">
        {locked ? 'Sign in to play' : 'Play now'}
        <LuChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  )
}

function Welcome({ user }) {
  const lp = levelProgress(user.xp, user.lvl)
  const invites = user.pendingGameInvites?.length || 0
  return (
    <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
      <Link to="/profile" className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar avatarId={user.avatar} name={user.username} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">Welcome back,</p>
          <p className="truncate font-display text-xl font-bold">{user.username}</p>
          <div className="mt-2 flex items-center gap-3">
            <Badge tone="primary">Lvl {user.lvl}</Badge>
            <ProgressBar value={lp.progress} className="max-w-[12rem] flex-1" />
            <span className="whitespace-nowrap text-xs text-subtle">{lp.toNext} XP to go</span>
          </div>
        </div>
      </Link>
      {invites > 0 && (
        <Button to="/friends" variant="secondary" icon={LuBell}>
          {invites} game invite{invites > 1 ? 's' : ''}
        </Button>
      )}
    </Card>
  )
}

export default function Home() {
  const user = useSelector(selectUser)
  const signedIn = useSelector((s) => !!s.user.token)

  return (
    <Page>
      {user ? (
        <Welcome user={user} />
      ) : (
        !signedIn && (
          <section className="mb-10 grid items-center gap-8 pt-4 md:grid-cols-[1.1fr_1fr] md:pt-8">
            <div>
              <Badge tone="primary" className="mb-4">Free · No downloads</Badge>
              <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-6xl">
                Four in a row.
                <br />
                <span className="bg-gradient-to-r from-p1 to-p2 bg-clip-text text-transparent">Endless rivalries.</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted">
                Challenge friends online, sharpen your skills against the CPU, and climb the leaderboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/signup" size="lg">Create free account</Button>
                <Button to="/ai" size="lg" variant="secondary" icon={LuBot}>Play vs CPU</Button>
              </div>
            </div>
            <div className="hidden md:block">
              <MiniBoard p1Moves={HERO_P1} p2Moves={HERO_P2} className="mx-auto max-w-sm rotate-[-4deg] rounded-2xl p-3 shadow-pop" />
            </div>
          </section>
        )
      )}

      <h2 className="mb-4 text-xl font-semibold">Choose a mode</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map((m) => (
          <ModeCard key={m.to} mode={m} locked={m.auth && !signedIn} />
        ))}
      </div>
    </Page>
  )
}
