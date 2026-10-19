import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { errorMessage, gamesApi, setUnauthorizedHandler, usersApi } from '../lib/api'
import { useSocketEvent } from '../lib/socketContext'
import { playChime } from '../lib/sound'
import { profilePatched, signedOut, userLoaded } from '../store/userSlice'
import { toast } from '../ui'

/** App-wide listeners: session restore, invites, XP/achievement updates. Renders nothing. */
export function GlobalEvents() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const token = useSelector((s) => s.user.token)

  const refreshMe = useCallback(
    () => usersApi.me().then((r) => dispatch(userLoaded(r.data.user))).catch(() => {}),
    [dispatch]
  )

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(signedOut())
      toast.info('Your session expired. Please sign in again.', { id: 'session' })
    })
  }, [dispatch])

  // Restore the saved session on load.
  useEffect(() => {
    if (!token) return
    usersApi
      .me()
      .then((r) => dispatch(userLoaded(r.data.user)))
      .catch((e) => {
        if (e.response?.status === 401) dispatch(signedOut())
        else dispatch(userLoaded(null))
      })
  }, [token, dispatch])

  useSocketEvent('gameInvite', ({ gameId, from }) => {
    refreshMe()
    playChime(true)
    toast.info(`${from.username} invited you to a game.`, {
      id: `invite-${gameId}`,
      title: 'Game invite',
      duration: 20000,
      action: [
        { label: 'Play', onClick: () => navigate(`/online/${gameId}`) },
        {
          label: 'Decline',
          primary: false,
          onClick: () => gamesApi.decline(gameId).then(refreshMe).catch((e) => toast.error(errorMessage(e))),
        },
      ],
    })
  })

  useSocketEvent('inviteAccepted', ({ gameId, username }) => {
    if (location.pathname === `/online/${gameId}`) return
    playChime(true)
    toast.success(`${username} joined your game. It's your move!`, {
      title: 'Ready to play',
      duration: 15000,
      action: { label: 'Join game', onClick: () => navigate(`/online/${gameId}`) },
    })
  })

  useSocketEvent('inviteDeclined', ({ username }) => {
    toast.info(`${username} declined your invite.`)
  })

  useSocketEvent('profileUpdate', (patch) => dispatch(profilePatched(patch)))

  useSocketEvent('achievementsUnlocked', ({ achievements }) => {
    achievements.forEach((a) => toast.success(a.desc, { title: `${a.icon} Achievement unlocked: ${a.label}`, duration: 6000 }))
  })

  return null
}
