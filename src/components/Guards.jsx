import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { LuWifiOff } from 'react-icons/lu'
import { usersApi } from '../lib/api'
import { signedOut, userLoaded } from '../store/userSlice'
import { Button, EmptyState, Page, PageSpinner } from '../ui'

export function AuthGuard() {
  const { token, user, status } = useSelector((s) => s.user)
  const location = useLocation()
  const dispatch = useDispatch()
  const [retrying, setRetrying] = useState(false)

  if (!token) return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  if (status === 'loading') return <PageSpinner />
  if (!user) {
    // Signed in, but the profile couldn't load (server asleep or offline).
    const retry = () => {
      setRetrying(true)
      usersApi
        .me()
        .then((r) => dispatch(userLoaded(r.data.user)))
        .catch((e) => e.response?.status === 401 && dispatch(signedOut()))
        .finally(() => setRetrying(false))
    }
    return (
      <Page size="sm">
        <EmptyState icon={LuWifiOff} title="Can't reach the server" action={<Button onClick={retry} loading={retrying}>Try again</Button>}>
          The game server may be waking up. This can take up to a minute on the first visit.
        </EmptyState>
      </Page>
    )
  }
  return <Outlet />
}

export function GuestGuard() {
  const token = useSelector((s) => s.user.token)
  const location = useLocation()
  return token ? <Navigate to={location.state?.from || '/'} replace /> : <Outlet />
}
