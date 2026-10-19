import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuSwords, LuLink, LuCrown, LuPlay, LuEye, LuUserPlus } from 'react-icons/lu'
import { errorMessage, tournamentsApi } from '../lib/api'
import { useSocketEvent } from '../lib/socketContext'
import { selectUser } from '../store/userSlice'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Input, Page, PageHeader, PageSpinner, cn, toast } from '../ui'

const sid = (x) => (x == null ? '' : typeof x === 'object' ? String(x._id ?? '') : String(x))

const STATUS = {
  waiting: { label: 'Waiting for players', tone: 'neutral' },
  semifinals: { label: 'Semifinals', tone: 'primary' },
  final: { label: 'Final', tone: 'warning' },
  complete: { label: 'Complete', tone: 'success' },
}

function CreateTournament() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await tournamentsApi.create(name.trim() || 'Friday Cup')
      navigate(`/tournament/${data.tournament._id}`, { replace: true })
      toast.success('Share the link with three friends.', { title: 'Tournament created' })
    } catch (err) {
      toast.error(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <Page size="md">
      <PageHeader eyebrow="Tournament" title="Host a bracket" subtitle="Four players, knockout format. Semifinals and final are first to two round wins." />
      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader icon={LuSwords} title="New tournament" />
          <form onSubmit={create} className="space-y-3">
            <Input label="Name" placeholder="Friday Cup" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" block size="lg" loading={loading}>Create tournament</Button>
          </form>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted">
            {['Create the tournament and share its link.', 'Three friends open the link and join.', 'You start the bracket: two semifinals are drawn at random.', 'Winners meet in the final. Last one standing is champion.'].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </Page>
  )
}

function MatchCard({ title, game, meId, winnerId }) {
  if (!game) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{title}</p>
        <p className="mt-3 text-sm text-subtle">Waiting for semifinal winners</p>
      </div>
    )
  }
  const players = [['p1', game.p1], ['p2', game.p2]]
  const mine = players.some(([, p]) => sid(p) === meId)
  return (
    <div className={cn('rounded-2xl border bg-surface p-4 shadow-card', mine ? 'border-primary/50' : 'border-line')}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{title}</p>
        {winnerId && <Badge tone="success">Done</Badge>}
      </div>
      <ul className="space-y-2">
        {players.map(([seat, p]) => {
          const won = winnerId && sid(p) === sid(winnerId)
          return (
            <li key={seat} className={cn('flex items-center gap-2.5 rounded-xl px-2 py-1.5', won && 'bg-success/10')}>
              <span className={cn('size-2.5 rounded-full', seat === 'p1' ? 'disc-p1' : 'disc-p2')} aria-hidden />
              <Avatar avatarId={p?.avatar} name={p?.username} size="xs" />
              <span className={cn('min-w-0 flex-1 truncate text-sm', won ? 'font-bold' : 'font-medium', winnerId && !won && 'text-subtle')}>{p?.username}</span>
              <span className="font-display font-bold tabular">{game.score?.[seat] ?? 0}</span>
            </li>
          )
        })}
      </ul>
      {!winnerId && (
        <Button to={mine ? `/online/${game._id}` : `/watch/${game._id}`} variant={mine ? 'primary' : 'secondary'} size="sm" icon={mine ? LuPlay : LuEye} block className="mt-3">
          {mine ? 'Play your match' : 'Watch'}
        </Button>
      )}
    </div>
  )
}

function Lobby({ id }) {
  const me = useSelector(selectUser)
  const [t, setT] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    tournamentsApi.get(id).then((r) => setT(r.data.tournament)).catch((e) => setError(errorMessage(e)))
  }, [id])

  useEffect(() => { load() }, [load])
  useSocketEvent('tournamentUpdate', ({ tournamentId }) => tournamentId === id && load())
  // Match scores aren't pushed to the lobby, so poll lightly while matches are running.
  useEffect(() => {
    if (!t || !['semifinals', 'final'].includes(t.status)) return
    const timer = setInterval(load, 10000)
    return () => clearInterval(timer)
  }, [t, load])

  const run = async (fn, ok) => {
    setBusy(true)
    try {
      const { data } = await fn()
      setT(data.tournament)
      if (ok) toast.success(ok)
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }

  if (error && !t) return <Page size="sm"><EmptyState icon={LuSwords} title="Tournament not found" action={<Button to="/tournament">Create one</Button>}>{error}</EmptyState></Page>
  if (!t) return <PageSpinner />

  const isHost = sid(t.host) === me._id
  const joined = t.players.some((p) => sid(p) === me._id)
  const status = STATUS[t.status]
  const link = `${window.location.origin}/tournament/${t._id}`
  const slots = Array.from({ length: 4 }, (_, i) => t.players[i] || null)
  const semis = t.semiGameIds || []
  const champion = t.championId

  return (
    <Page>
      <PageHeader
        eyebrow="Tournament"
        title={t.name}
        subtitle={`Hosted by ${t.host.username}`}
        actions={
          <>
            <Badge tone={status.tone} className="self-center text-sm">{status.label}</Badge>
            <Button
              variant="secondary"
              icon={LuLink}
              onClick={() => navigator.clipboard.writeText(link).then(() => toast.success('Invite link copied'), () => toast.error("Couldn't copy"))}
            >
              Copy invite link
            </Button>
          </>
        }
      />

      {champion && (
        <Card className="mb-6 flex items-center gap-4 border-warning/40 bg-gradient-to-r from-warning/15 to-surface">
          <span className="text-4xl" aria-hidden>🏆</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">Champion</p>
            <p className="truncate font-display text-2xl font-bold">{champion.username}</p>
          </div>
          <Avatar avatarId={champion.avatar} name={champion.username} size="lg" />
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <Card>
          <CardHeader title="Players" subtitle={`${t.players.length} of 4`} />
          <ul className="space-y-2">
            {slots.map((p, i) => (
              <li key={i} className={cn('flex items-center gap-3 rounded-xl border p-2.5', p ? 'border-line' : 'border-dashed border-line')}>
                {p ? (
                  <>
                    <Avatar avatarId={p.avatar} name={p.username} size="sm" />
                    <span className="min-w-0 flex-1 truncate font-medium">{p.username}</span>
                    {sid(p) === sid(t.host) && <LuCrown className="size-4 text-warning" aria-label="Host" />}
                    {sid(p) === me._id && <Badge>You</Badge>}
                  </>
                ) : (
                  <span className="flex items-center gap-3 text-sm text-subtle">
                    <span className="size-8 rounded-full border-2 border-dashed border-line" /> Open slot
                  </span>
                )}
              </li>
            ))}
          </ul>
          {t.status === 'waiting' && (
            <div className="mt-4 space-y-2">
              {!joined && <Button block icon={LuUserPlus} loading={busy} disabled={t.players.length >= 4} onClick={() => run(() => tournamentsApi.join(id), "You're in!")}>Join tournament</Button>}
              {isHost && (
                <Button block variant={t.players.length === 4 ? 'primary' : 'secondary'} loading={busy} disabled={t.players.length !== 4} onClick={() => run(() => tournamentsApi.start(id), 'Bracket started. Good luck!')}>
                  {t.players.length === 4 ? 'Start bracket' : `Need ${4 - t.players.length} more`}
                </Button>
              )}
              {!isHost && joined && <p className="text-center text-sm text-muted">Waiting for {t.host.username} to start…</p>}
            </div>
          )}
        </Card>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Bracket</h2>
          {t.status === 'waiting' ? (
            <EmptyState icon={LuSwords} title="The bracket appears once the host starts">Semifinal pairings are drawn at random.</EmptyState>
          ) : (
            <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-4">
                <MatchCard title="Semifinal A" game={semis[0]} meId={me._id} winnerId={t.semiWinners?.[0]} />
                <MatchCard title="Semifinal B" game={semis[1]} meId={me._id} winnerId={t.semiWinners?.[1]} />
              </div>
              <div className="hidden h-full w-6 md:flex md:flex-col md:justify-center" aria-hidden>
                <div className="h-1/2 rounded-r-xl border-y-2 border-r-2 border-line" />
              </div>
              <MatchCard title="Final" game={t.finalGameId} meId={me._id} winnerId={t.championId} />
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

export default function TournamentLobby() {
  const { id } = useParams()
  return id ? <Lobby id={id} key={id} /> : <CreateTournament />
}
