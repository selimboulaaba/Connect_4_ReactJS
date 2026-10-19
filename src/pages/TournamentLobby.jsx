import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Crown, Link2, Play, Eye, UserPlus } from 'lucide-react'
import { errorMessage, tournamentsApi } from '@/lib/api'
import { useSocketEvent } from '@/lib/socketContext'
import { selectUser } from '@/store/userSlice'
import { Disc } from '@/components/game/Board'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Input, Page, PageHeader, PageSpinner, toast } from '@/ui'
import { cn } from '@/lib/utils'

const sid = (x) => (x == null ? '' : typeof x === 'object' ? String(x._id ?? '') : String(x))

const STATUS = {
  waiting: { label: 'Waiting for players', tone: 'neutral' },
  semifinals: { label: 'Semifinals', tone: 'board' },
  final: { label: 'Final', tone: 'yellow' },
  complete: { label: 'Finished', tone: 'green' },
}

const STEPS = [
  'Create the tournament and send its link to three friends.',
  'Once all four have joined, start the bracket. Semifinal pairs are drawn at random.',
  'Each match is first to two round wins. The two winners meet in the final.',
]

function CreateTournament() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const create = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await tournamentsApi.create(name.trim() || 'Friday cup')
      navigate(`/tournament/${data.tournament._id}`, { replace: true })
      toast.success('Now send the link to three friends.', { title: 'Tournament created' })
    } catch (err) {
      toast.error(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <Page size="md">
      <PageHeader title="Host a tournament" subtitle="Four players, knockout format, one champion." />
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <Card>
          <form onSubmit={create} className="space-y-4">
            <Input label="Tournament name" placeholder="Friday cup" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
            <Button type="submit" size="lg" loading={loading}>Create tournament</Button>
          </form>
        </Card>
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-board font-display text-on-board">{i + 1}</span>
              <span className="pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </Page>
  )
}

function MatchCard({ title, game, meId, winnerId }) {
  if (!game) {
    return (
      <div className="rounded-panel border-2 border-dashed border-ink/30 p-5">
        <p className="font-extrabold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">Decided by the semifinals.</p>
      </div>
    )
  }
  const players = [['p1', game.p1], ['p2', game.p2]]
  const mine = players.some(([, p]) => sid(p) === meId)
  return (
    <Card padded={false} className={cn('p-4', mine && 'ring-4 ring-yellow')}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-extrabold">{title}</p>
        {winnerId && <Badge tone="green">Done</Badge>}
      </div>
      <ul>
        {players.map(([seat, p]) => {
          const won = winnerId && sid(p) === sid(winnerId)
          return (
            <li key={seat} className={cn('flex items-center gap-2.5 border-t-2 border-ink/10 py-2 first:border-t-0', winnerId && !won && 'opacity-55')}>
              <Disc player={seat} className="size-4 border-2 border-ink" />
              <span className={cn('min-w-0 flex-1 truncate', won ? 'font-extrabold' : 'font-medium')}>{p?.username}</span>
              <span className="font-display text-lg tabular">{game.score?.[seat] ?? 0}</span>
            </li>
          )
        })}
      </ul>
      {!winnerId && (
        <Button to={mine ? `/online/${game._id}` : `/watch/${game._id}`} variant={mine ? 'primary' : 'secondary'} size="sm" icon={mine ? Play : Eye} className="mt-3">
          {mine ? 'Play your match' : 'Watch'}
        </Button>
      )}
    </Card>
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
  // Match scores aren't pushed to the lobby, so check every 10 seconds while matches run.
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

  if (error && !t) return <Page size="md"><EmptyState title="This tournament doesn’t exist" action={<Button to="/tournament">Host a new one</Button>}>{error}</EmptyState></Page>
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
        title={t.name}
        subtitle={`Hosted by ${t.host.username}`}
        actions={
          <>
            <Badge tone={status.tone} className="px-3 py-1 text-sm">{status.label}</Badge>
            <Button variant="secondary" icon={Link2} onClick={() => navigator.clipboard.writeText(link).then(() => toast.success('Link copied'), () => toast.error('Copying is blocked in this browser.'))}>
              Copy invite link
            </Button>
          </>
        }
      />

      {champion && (
        <section className="mb-8 flex items-center gap-5 rounded-panel border-3 border-ink bg-yellow p-5 text-[hsl(var(--on-yellow))] shadow-plastic sm:p-6">
          <Avatar avatarId={champion.avatar} name={champion.username} size="lg" />
          <div className="min-w-0">
            <p className="font-bold">Champion</p>
            <p className="truncate font-display text-display-sm">{champion.username}</p>
          </div>
          <Crown className="ml-auto size-10 shrink-0" aria-hidden />
        </section>
      )}

      <div className="grid gap-10 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <Card>
          <CardHeader title="Players" subtitle={`${t.players.length} of 4 joined`} />
          <ul className="space-y-2">
            {slots.map((p, i) => (
              <li key={i} className="flex items-center gap-3 py-1">
                {p ? (
                  <>
                    <Avatar avatarId={p.avatar} name={p.username} size="sm" />
                    <span className="min-w-0 flex-1 truncate font-bold">{p.username}{sid(p) === me._id && <span className="ml-1 font-medium text-muted-foreground">(you)</span>}</span>
                    {sid(p) === sid(t.host) && <Crown className="size-4 text-muted-foreground" aria-label="Host" />}
                  </>
                ) : (
                  <>
                    <span className="board-hole size-8 rounded-full border-2 border-ink" aria-hidden />
                    <span className="text-muted-foreground">Open seat</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          {t.status === 'waiting' && (
            <div className="mt-5 space-y-2">
              {!joined && <Button block icon={UserPlus} loading={busy} disabled={t.players.length >= 4} onClick={() => run(() => tournamentsApi.join(id), 'You joined the tournament')}>Join tournament</Button>}
              {isHost && (
                <Button block variant={t.players.length === 4 ? 'primary' : 'secondary'} loading={busy} disabled={t.players.length !== 4} onClick={() => run(() => tournamentsApi.start(id), 'Bracket started')}>
                  {t.players.length === 4 ? 'Start the bracket' : `Waiting for ${4 - t.players.length} more`}
                </Button>
              )}
              {!isHost && joined && <p className="text-sm text-muted-foreground">{t.host.username} starts the bracket once all four seats are taken.</p>}
            </div>
          )}
        </Card>

        <div>
          <h2 className="mb-4 font-display text-display-sm">Bracket</h2>
          {t.status === 'waiting' ? (
            <EmptyState title="The bracket is drawn when the host starts">Semifinal pairs are picked at random.</EmptyState>
          ) : (
            <div className="grid items-center gap-5 md:grid-cols-[1fr_1.5rem_1fr]">
              <div className="space-y-5">
                <MatchCard title="Semifinal 1" game={semis[0]} meId={me._id} winnerId={t.semiWinners?.[0]} />
                <MatchCard title="Semifinal 2" game={semis[1]} meId={me._id} winnerId={t.semiWinners?.[1]} />
              </div>
              <div className="hidden h-1/2 rounded-r-xl border-y-3 border-r-3 border-ink md:block" aria-hidden />
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
