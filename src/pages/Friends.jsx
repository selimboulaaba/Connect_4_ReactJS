import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LuSearch, LuUserPlus, LuUserMinus, LuSwords, LuUsers, LuBell, LuTrophy } from 'react-icons/lu'
import { errorMessage, gamesApi, usersApi } from '../lib/api'
import { useSocketEvent } from '../lib/socketContext'
import { selectUser, userLoaded } from '../store/userSlice'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, IconButton, Input, Modal, Page, PageHeader, Spinner, toast } from '../ui'

function useDebounced(value, ms) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function Friends() {
  const me = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [online, setOnline] = useState({})
  const [pending, setPending] = useState(null) // id of the row with a request in flight
  const [removing, setRemoving] = useState(null)
  const q = useDebounced(query.trim(), 300)

  const friends = useMemo(
    () => [...(me.friends || [])].sort((a, b) => Number(!!online[b._id]) - Number(!!online[a._id]) || a.username.localeCompare(b.username)),
    [me.friends, online]
  )
  const friendIds = useMemo(() => new Set(friends.map((f) => f._id)), [friends])
  const invites = me.pendingGameInvites || []

  useEffect(() => {
    usersApi.me().then((r) => dispatch(userLoaded(r.data.user))).catch(() => {})
    usersApi.onlineStatus().then((r) => setOnline(r.data.onlineFriends || {})).catch(() => {})
  }, [dispatch])

  useSocketEvent('presence', ({ userId, online: isOn }) => setOnline((o) => ({ ...o, [userId]: isOn })))

  useEffect(() => {
    if (!q) return setResults(null)
    let cancelled = false
    setSearching(true)
    usersApi.search(q)
      .then((r) => !cancelled && setResults(r.data.users))
      .catch(() => !cancelled && setResults([]))
      .finally(() => !cancelled && setSearching(false))
    return () => { cancelled = true }
  }, [q])

  const toggleFriend = async (user, adding) => {
    setPending(user._id)
    try {
      const { data } = await usersApi.toggleFriend(user._id)
      dispatch(userLoaded(data.user))
      toast.success(adding ? `${user.username} added to your friends` : `${user.username} removed`)
      if (adding) usersApi.onlineStatus().then((r) => setOnline(r.data.onlineFriends || {})).catch(() => {})
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setPending(null)
      setRemoving(null)
    }
  }

  const invite = async (friend) => {
    setPending(friend._id)
    try {
      const { data } = await gamesApi.invite(friend._id)
      toast.success(`Invite sent to ${friend.username}`)
      navigate(`/online/${data.game._id}`)
    } catch (e) {
      toast.error(errorMessage(e))
      setPending(null)
    }
  }

  const decline = async (gameId) => {
    setPending(gameId)
    try {
      await gamesApi.decline(gameId).catch(() => usersApi.dismissInvite(gameId))
      const { data } = await usersApi.me()
      dispatch(userLoaded(data.user))
    } catch (e) {
      toast.error(errorMessage(e))
    } finally {
      setPending(null)
    }
  }

  const onlineCount = friends.filter((f) => online[f._id]).length

  return (
    <Page>
      <PageHeader
        eyebrow="Social"
        title="Friends"
        subtitle={friends.length ? `${friends.length} friend${friends.length > 1 ? 's' : ''} · ${onlineCount} online` : 'Add friends to invite them to games.'}
        actions={<Button to="/leaderboard" variant="secondary" icon={LuTrophy}>Leaderboard</Button>}
      />

      {invites.length > 0 && (
        <Card className="mb-6 border-primary/40 bg-primary/5">
          <CardHeader icon={LuBell} title="Game invites" subtitle="Friends waiting for you to join" />
          <ul className="divide-y divide-line">
            {invites.map((inv) => {
              const gid = inv.game?._id || inv.game
              return (
                <li key={gid} className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold">{inv.fromUsername}</span>
                    <span className="text-muted"> invited you to a game</span>
                  </span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" loading={pending === gid} onClick={() => decline(gid)}>Decline</Button>
                    <Button size="sm" icon={LuSwords} onClick={() => navigate(`/online/${gid}`)}>Play</Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader icon={LuUsers} title="Your friends" />
          {friends.length === 0 ? (
            <EmptyState icon={LuUserPlus} title="No friends yet">Search for a username to add your first friend.</EmptyState>
          ) : (
            <ul className="-mx-2">
              {friends.map((f) => (
                <li key={f._id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-raised/60">
                  <Avatar avatarId={f.avatar} name={f.username} online={!!online[f._id]} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{f.username}</p>
                    <p className="text-xs text-subtle">Level {f.lvl} · {online[f._id] ? <span className="text-success">Online</span> : 'Offline'}</p>
                  </div>
                  <Button size="sm" icon={LuSwords} loading={pending === f._id} onClick={() => invite(f)}>Invite</Button>
                  <IconButton icon={LuUserMinus} label={`Remove ${f.username}`} size="sm" onClick={() => setRemoving(f)} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="h-fit">
          <CardHeader icon={LuSearch} title="Add friends" />
          <Input icon={LuSearch} placeholder="Search by username" aria-label="Search players" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="mt-3 min-h-[3rem]">
            {searching ? (
              <div className="flex justify-center py-4 text-primary"><Spinner /></div>
            ) : results === null ? (
              <p className="py-2 text-sm text-subtle">Type at least one character to search.</p>
            ) : results.length === 0 ? (
              <p className="py-2 text-sm text-subtle">No players match &ldquo;{q}&rdquo;.</p>
            ) : (
              <ul className="-mx-2">
                {results.map((u) => {
                  const isFriend = friendIds.has(u._id)
                  return (
                    <li key={u._id} className="flex items-center gap-3 rounded-xl px-2 py-2">
                      <Avatar avatarId={u.avatar} name={u.username} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{u.username}</p>
                        <p className="text-xs text-subtle">Level {u.lvl}</p>
                      </div>
                      {isFriend ? (
                        <Badge tone="success">Friend</Badge>
                      ) : (
                        <Button size="sm" variant="secondary" icon={LuUserPlus} loading={pending === u._id} onClick={() => toggleFriend(u, true)}>Add</Button>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={`Remove ${removing?.username}?`}
        description="You can add them back any time."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoving(null)} data-autofocus>Cancel</Button>
            <Button variant="danger" loading={pending === removing?._id} onClick={() => toggleFriend(removing, false)}>Remove</Button>
          </>
        }
      />
    </Page>
  )
}
