import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LogOut, Trophy, Swords, Crown, Target, Shield, Zap } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { errorMessage, gamesApi, usersApi } from '@/lib/api'
import { ACHIEVEMENTS, levelProgress } from '@/game/level'
import { selectUser, signedIn, signedOut } from '@/store/userSlice'
import { AVATAR_IDS, Alert, Avatar, Badge, Button, Card, CardHeader, EmptyState, Input, Page, Skeleton, XpSlots, toast } from '@/ui'
import { cn } from '@/lib/utils'

const ICONS = { first_win: Trophy, ten_wins: Swords, fifty_wins: Crown, giant_slayer: Target, shutout: Shield, speedrun: Zap }
const REASON = { timeout: 'on time', resign: 'by resignation' }

function Scoreline({ stats = {} }) {
  const total = (stats.wins || 0) + (stats.losses || 0) + (stats.draws || 0)
  const cells = [
    ['Wins', stats.wins || 0],
    ['Losses', stats.losses || 0],
    ['Draws', stats.draws || 0],
    ['Win rate', total ? `${Math.round(((stats.wins || 0) / total) * 100)}%` : 'None yet'],
  ]
  return (
    <Card padded={false} className="grid grid-cols-2 overflow-hidden sm:grid-cols-4">
      {cells.map(([label, value], i) => (
        <div key={label} className={cn('px-5 py-4', i % 2 === 1 && 'border-l-3 border-ink', i >= 2 && 'border-t-3 border-ink sm:border-t-0', i === 2 && 'sm:border-l-3')}>
          <p className="text-sm font-bold text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-display-sm tabular">{value}</p>
        </div>
      ))}
    </Card>
  )
}

function History() {
  const me = useSelector(selectUser)
  const [items, setItems] = useState(null)
  useEffect(() => {
    gamesApi.history().then((r) => setItems(r.data.history || [])).catch(() => setItems([]))
  }, [])

  return (
    <Card>
      <CardHeader title="Recent rounds" />
      {items === null ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-11" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No online rounds yet" action={<Button to="/online" size="sm">Play a friend</Button>}>Finished online rounds are listed here.</EmptyState>
      ) : (
        <ul>
          {items.map((h) => {
            const won = !h.draw && h.winner?._id === me._id
            const opp = h.winner?._id === me._id ? h.loser : h.winner
            return (
              <li key={h._id} className="flex items-center gap-3 border-t-2 border-ink/10 py-2.5 first:border-t-0">
                <Badge tone={h.draw ? 'neutral' : won ? 'green' : 'red'} className="w-14 justify-center">{h.draw ? 'Draw' : won ? 'Win' : 'Loss'}</Badge>
                <span className="min-w-0 flex-1 truncate">
                  against <span className="font-bold">{opp?.username || 'a deleted player'}</span>
                  {REASON[h.reason] && <span className="text-muted-foreground">, {REASON[h.reason]}</span>}
                </span>
                <time className="text-sm text-muted-foreground" dateTime={h.createdAt}>
                  {new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </time>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function Settings() {
  const me = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: me.username, password: '', confirm: '' })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savingAvatar, setSavingAvatar] = useState(null)

  useEffect(() => setForm((f) => ({ ...f, username: me.username })), [me.username])

  const pickAvatar = async (avatar) => {
    if (avatar === me.avatar) return
    setSavingAvatar(avatar)
    try {
      const { data } = await usersApi.update(me._id, { avatar })
      dispatch(signedIn(data))
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setSavingAvatar(null)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password && form.password !== form.confirm) return setError('The two new passwords are different.')
    const body = {}
    if (form.username.trim() !== me.username) body.username = form.username.trim()
    if (form.password) body.password = form.password
    if (!Object.keys(body).length) return setError('Change your username or password first.')
    setSaving(true)
    try {
      const { data } = await usersApi.update(me._id, body)
      dispatch(signedIn(data))
      setForm({ username: data.user.username, password: '', confirm: '' })
      toast.success('Changes saved')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <Card>
        <CardHeader title="Your disc" subtitle="This is how other players see you." />
        <div className="grid grid-cols-6 gap-3" role="radiogroup" aria-label="Avatar colour">
          {AVATAR_IDS.map((id, i) => {
            const active = (me.avatar || 'avatar_1') === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={`Colour ${i + 1}`}
                onClick={() => pickAvatar(id)}
                className={cn('flex aspect-square items-center justify-center rounded-full ring-offset-2 ring-offset-card transition', active ? 'ring-[3px] ring-board' : 'hover:ring-2 hover:ring-ink/30', savingAvatar === id && 'animate-pulse')}
              >
                <Avatar avatarId={id} name={me.username} size="md" />
              </button>
            )
          })}
        </div>
      </Card>
      <Card>
        <CardHeader title="Account" />
        <form onSubmit={save} className="space-y-4" noValidate>
          {error && <Alert>{error}</Alert>}
          <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" />
          <Input label="New password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" hint="Leave empty to keep your current password." />
          <Input label="Repeat new password" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" />
          <Button type="submit" loading={saving}>Save changes</Button>
        </form>
      </Card>
      <div>
        <Button variant="danger-ghost" icon={LogOut} onClick={() => { dispatch(signedOut()); navigate('/') }}>Sign out</Button>
      </div>
    </div>
  )
}

export default function Profile() {
  const me = useSelector(selectUser)
  const lp = levelProgress(me.xp, me.lvl)
  const unlocked = new Set(me.achievements || [])

  return (
    <Page>
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar avatarId={me.avatar} name={me.username} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-display-md sm:text-display-lg">{me.username}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-extrabold">Level {me.lvl}</span>
            <XpSlots value={lp.progress} label={`Progress to level ${me.lvl + 1}`} />
            <span className="text-muted-foreground">{lp.toNext} XP until level {me.lvl + 1}</span>
          </div>
        </div>
      </header>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <Scoreline stats={me.stats} />
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <Card>
              <CardHeader title="Achievements" subtitle={`${unlocked.size} of ${ACHIEVEMENTS.length} earned`} />
              <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
                {ACHIEVEMENTS.map((a) => {
                  const on = unlocked.has(a.id)
                  const Icon = ICONS[a.id]
                  return (
                    <li key={a.id} className="flex flex-col items-start">
                      <span className={cn('flex size-12 items-center justify-center rounded-full border-3 border-ink', on ? 'disc disc-yellow text-[hsl(var(--on-yellow))]' : 'board-hole text-muted-foreground/60')}>
                        <Icon className="relative z-[1] size-5" aria-hidden />
                      </span>
                      <p className={cn('mt-2 font-extrabold', !on && 'text-muted-foreground')}>{a.label}</p>
                      <p className="text-sm text-muted-foreground">{a.desc}</p>
                      <span className="sr-only">{on ? 'Earned' : 'Not earned yet'}</span>
                    </li>
                  )
                })}
              </ul>
            </Card>
            <History />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </Page>
  )
}
