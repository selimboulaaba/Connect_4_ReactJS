import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, UserPlus, UserMinus, Swords } from 'lucide-react'
import { errorMessage, gamesApi, usersApi } from '@/lib/api'
import { useSocketEvent } from '@/lib/socketContext'
import { selectUser, userLoaded } from '@/store/userSlice'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, IconButton, Input, Modal, Page, PageHeader, Spinner, toast } from '@/ui'

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
  const [pending, setPending] = useState(null)
  const [removing, setRemoving] = useState(null)
  const q = useDebounced(query.trim(), 300)

  const friends = useMemo(
    () => [...(me.friends || [])].sort((a, b) => Number(!!online[b._id]) - Number(!!online[a._id]) || a.username.localeCompare(b.username)),
    [me.friends, online]
  )
  const friendIds = useMemo(() => new Set(friends.map((f) => f._id)), [friends])
  const invites = me.pendingGameInvites || []
  const onlineCount = friends.filter((f) => online[f._id]).length

  const refreshOnline = () => usersApi.onlineStatus().then((r) => setOnline(r.data.onlineFriends || {})).catch(() => {})

  useEffect(() => {
    usersApi.me().then((r) => dispatch(userLoaded(r.data.user))).catch(() => {})
    refreshOnline()
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
      toast.success(adding ? `${user.username} added to your friends` : `${user.username} removed from your friends`)
      if (adding) refreshOnline()
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

  const subtitle = friends.length === 0
    ? 'Add friends to invite them straight into a game.'
    : friends.length === 1
      ? `${friends[0].username} is ${online[friends[0]._id] ? 'online now' : 'offline right now'}.`
      : onlineCount > 0
      ? `${onlineCount} of your ${friends.length} friends ${onlineCount === 1 ? 'is' : 'are'} online now.`
      : `None of your ${friends.length} friends are online right now.`

  return (
    <Page>
      <PageHeader title="Friends" subtitle={subtitle} />

      {invites.length > 0 && (
        <section className="mb-8 rounded-panel border-3 border-ink bg-yellow p-5 text-[hsl(var(--on-yellow))] shadow-plastic sm:p-6">
          <h2 className="text-xl font-extrabold">{invites.length === 1 ? 'You have a game invite' : `You have ${invites.length} game invites`}</h2>
          <ul className="mt-3 space-y-2">
            {invites.map((inv) => {
              const gid = inv.game?._id || inv.game
              return (
                <li key={gid} className="flex flex-wrap items-center gap-3 rounded-btn border-2 border-ink bg-card px-4 py-3 text-foreground">
                  <span className="min-w-0 flex-1 font-bold">{inv.fromUsername} wants to play</span>
                  <Button size="sm" variant="ghost" loading={pending === gid} onClick={() => decline(gid)}>Decline</Button>
                  <Button size="sm" variant="board" icon={Swords} onClick={() => navigate(`/online/${gid}`)}>Play</Button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
        <Card>
          <CardHeader title="Your friends" />
          {friends.length === 0 ? (
            <EmptyState title="No friends yet">Search for a username on the right to add someone.</EmptyState>
          ) : (
            <ul className="-mx-2">
              {friends.map((f) => (
                <li key={f._id} className="flex items-center gap-3 rounded-btn px-2 py-2.5 transition-colors hover:bg-muted">
                  <Avatar avatarId={f.avatar} name={f.username} online={!!online[f._id]} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-extrabold">{f.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {online[f._id] ? <span className="font-bold text-green">Online</span> : 'Offline'}, level {f.lvl}
                    </p>
                  </div>
                  <Button size="sm" icon={Swords} loading={pending === f._id} onClick={() => invite(f)}>Invite</Button>
                  <IconButton icon={UserMinus} label={`Remove ${f.username}`} size="sm" onClick={() => setRemoving(f)} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card quiet>
          <CardHeader title="Find players" />
          <Input icon={Search} placeholder="Search by username" aria-label="Search players" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="mt-3 min-h-12">
            {searching ? (
              <div className="flex justify-center py-4 text-board"><Spinner /></div>
            ) : results === null ? (
              <p className="py-2 text-sm text-muted-foreground">Start typing a name.</p>
            ) : results.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">Nobody is called “{q}”.</p>
            ) : (
              <ul className="-mx-2">
                {results.map((u) => (
                  <li key={u._id} className="flex items-center gap-3 rounded-btn px-2 py-2">
                    <Avatar avatarId={u.avatar} name={u.username} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold">{u.username}</p>
                      <p className="text-sm text-muted-foreground">Level {u.lvl}</p>
                    </div>
                    {friendIds.has(u._id) ? (
                      <Badge tone="green">Friend</Badge>
                    ) : (
                      <Button size="sm" variant="secondary" icon={UserPlus} loading={pending === u._id} onClick={() => toggleFriend(u, true)}>Add</Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      <Modal
        open={!!removing}
        onClose={() => setRemoving(null)}
        title={`Remove ${removing?.username}?`}
        description="They won’t be told. You can add them again whenever you like."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRemoving(null)}>Keep</Button>
            <Button variant="danger" loading={pending === removing?._id} onClick={() => toggleFriend(removing, false)}>Remove</Button>
          </>
        }
      />
    </Page>
  )
}
