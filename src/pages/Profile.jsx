import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LuLogOut, LuHistory, LuMedal, LuSettings, LuUser, LuLock } from 'react-icons/lu'
import { errorMessage, gamesApi, usersApi } from '../lib/api'
import { ACHIEVEMENTS, levelProgress } from '../game/level'
import { selectUser, signedIn, signedOut } from '../store/userSlice'
import { AVATAR_IDS, Alert, Avatar, Badge, Button, Card, CardHeader, EmptyState, Input, Page, ProgressRing, Skeleton, StatTile, cn, toast } from '../ui'

const REASON = { timeout: 'on time', resign: 'by resignation', draw: '', connect: '' }

function History() {
  const me = useSelector(selectUser)
  const [items, setItems] = useState(null)
  useEffect(() => {
    gamesApi.history().then((r) => setItems(r.data.history || [])).catch(() => setItems([]))
  }, [])

  return (
    <Card>
      <CardHeader icon={LuHistory} title="Recent rounds" />
      {items === null ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : items.length === 0 ? (
        <EmptyState title="No rounds yet">Play an online game and your results will show up here.</EmptyState>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((h) => {
            const won = !h.draw && h.winner?._id === me._id
            const opp = h.winner?._id === me._id ? h.loser : h.winner
            const result = h.draw ? 'Draw' : won ? 'Win' : 'Loss'
            return (
              <li key={h._id} className="flex items-center gap-3 py-2.5">
                <Badge tone={h.draw ? 'warning' : won ? 'success' : 'danger'} className="w-14 justify-center">{result}</Badge>
                <Avatar avatarId={opp?.avatar} name={opp?.username || '?'} size="xs" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  vs <span className="font-semibold">{opp?.username || 'deleted player'}</span>
                  {REASON[h.reason] && <span className="text-subtle"> · {REASON[h.reason]}</span>}
                </span>
                <time className="text-xs text-subtle" dateTime={h.createdAt}>{new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</time>
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
    if (form.password && form.password !== form.confirm) return setError("Passwords don't match.")
    const body = {}
    if (form.username.trim() !== me.username) body.username = form.username.trim()
    if (form.password) body.password = form.password
    if (!Object.keys(body).length) return setError('Nothing to update.')
    setSaving(true)
    try {
      const { data } = await usersApi.update(me._id, body)
      dispatch(signedIn(data))
      setForm({ username: data.user.username, password: '', confirm: '' })
      toast.success('Profile updated')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader icon={LuSettings} title="Settings" />
      <h3 className="mb-3 text-sm font-semibold">Avatar</h3>
      <div className="mb-6 grid grid-cols-6 gap-2 sm:gap-3" role="radiogroup" aria-label="Avatar">
        {AVATAR_IDS.map((id) => {
          const active = (me.avatar || 'avatar_1') === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`Avatar ${id.slice(7)}`}
              onClick={() => pickAvatar(id)}
              className={cn('flex aspect-square items-center justify-center rounded-full p-0.5 ring-2 transition', active ? 'ring-primary' : 'ring-transparent hover:ring-line', savingAvatar === id && 'animate-pulse')}
            >
              <Avatar avatarId={id} name={me.username} size="md" />
            </button>
          )
        })}
      </div>
      <form onSubmit={save} className="space-y-4" noValidate>
        <h3 className="text-sm font-semibold">Account</h3>
        {error && <Alert>{error}</Alert>}
        <Input label="Username" icon={LuUser} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} autoComplete="username" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="New password" icon={LuLock} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" hint="Leave empty to keep your current one" />
          <Input label="Confirm new password" icon={LuLock} type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} autoComplete="new-password" />
        </div>
        <Button type="submit" loading={saving}>Save changes</Button>
      </form>
    </Card>
  )
}

export default function Profile() {
  const me = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const lp = levelProgress(me.xp, me.lvl)
  const s = me.stats || {}
  const total = (s.wins || 0) + (s.losses || 0) + (s.draws || 0)
  const unlocked = new Set(me.achievements || [])

  const signOut = () => {
    dispatch(signedOut())
    navigate('/')
  }

  return (
    <Page>
      <Card className="mb-6 flex flex-col items-center gap-6 bg-gradient-to-br from-primary/10 via-surface to-surface sm:flex-row">
        <Avatar avatarId={me.avatar} name={me.username} size="xl" />
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h1 className="truncate text-3xl font-bold">{me.username}</h1>
          <p className="mt-1 text-sm text-muted">
            Member since {new Date(me.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge tone="primary">Level {me.lvl}</Badge>
            <Badge tone="warning">{unlocked.size}/{ACHIEVEMENTS.length} achievements</Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing value={lp.progress} size={96} stroke={8}>
            <span className="text-center leading-none">
              <span className="block font-display text-2xl font-bold tabular">{me.xp}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-subtle">XP</span>
            </span>
          </ProgressRing>
          <p className="max-w-[8rem] text-sm text-muted"><span className="font-semibold text-fg">{lp.toNext} XP</span> to level {me.lvl + 1}</p>
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Wins" value={s.wins || 0} tone="success" />
        <StatTile label="Losses" value={s.losses || 0} tone="danger" />
        <StatTile label="Draws" value={s.draws || 0} tone="warning" />
        <StatTile label="Win rate" value={total ? `${Math.round(((s.wins || 0) / total) * 100)}%` : '—'} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader icon={LuMedal} title="Achievements" subtitle={`${unlocked.size} of ${ACHIEVEMENTS.length} unlocked`} />
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ACHIEVEMENTS.map((a) => {
                const on = unlocked.has(a.id)
                return (
                  <li key={a.id} className={cn('rounded-2xl border p-3 text-center transition', on ? 'border-warning/40 bg-warning/10' : 'border-line opacity-60 grayscale')}>
                    <div className="text-3xl" aria-hidden>{a.icon}</div>
                    <p className="mt-1 text-sm font-semibold">{a.label}</p>
                    <p className="mt-0.5 text-xs text-muted">{a.desc}</p>
                    <span className="sr-only">{on ? 'Unlocked' : 'Locked'}</span>
                  </li>
                )
              })}
            </ul>
          </Card>
          <History />
        </div>
        <div className="space-y-6">
          <Settings />
          <Button variant="danger-ghost" icon={LuLogOut} onClick={signOut} block>Sign out</Button>
        </div>
      </div>
    </Page>
  )
}
