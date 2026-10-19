import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { AuthGuard, GuestGuard } from './components/Guards'
import { GlobalEvents } from './components/GlobalEvents'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SocketProvider } from './lib/socket'
import { PageSpinner, Toaster } from './ui'
import Home from './pages/Home'

// Pages load on demand to keep the first visit fast.
const LocalGame = lazy(() => import('./pages/LocalGame'))
const AIGame = lazy(() => import('./pages/AIGame'))
const SignIn = lazy(() => import('./pages/SignIn'))
const Signup = lazy(() => import('./pages/Signup'))
const OnlineMenu = lazy(() => import('./pages/OnlineMenu'))
const OnlineGame = lazy(() => import('./pages/OnlineGame'))
const Friends = lazy(() => import('./pages/Friends'))
const Profile = lazy(() => import('./pages/Profile'))
const LeaderBoard = lazy(() => import('./pages/LeaderBoard'))
const SpectateList = lazy(() => import('./pages/SpectateList'))
const SpectateGame = lazy(() => import('./pages/SpectateGame'))
const DailyChallenge = lazy(() => import('./pages/DailyChallenge'))
const TournamentLobby = lazy(() => import('./pages/TournamentLobby'))
const NotFound = lazy(() => import('./pages/NotFound'))

const TITLES = {
  '/': 'Play',
  '/local': 'Local game',
  '/ai': 'Play vs CPU',
  '/online': 'Online',
  '/friends': 'Friends',
  '/profile': 'Profile',
  '/leaderboard': 'Leaderboard',
  '/watch': 'Watch',
  '/daily': 'Daily puzzle',
  '/tournament': 'Tournament',
  '/signin': 'Sign in',
  '/signup': 'Create account',
}

function RoutedBoundary({ children }) {
  const { pathname } = useLocation()
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>
}

function RouteEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const base = '/' + (pathname.split('/')[1] || '')
    document.title = `${TITLES[base] || 'Connect 4'} · Connect 4`
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <SocketProvider>
        <RouteEffects />
        <GlobalEvents />
        <AppShell>
          <RoutedBoundary>
            <Suspense fallback={<PageSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/local" element={<LocalGame />} />
                <Route path="/ai" element={<AIGame />} />
                <Route path="/daily" element={<DailyChallenge />} />

                <Route element={<AuthGuard />}>
                  <Route path="/online" element={<OnlineMenu />} />
                  <Route path="/online/:id" element={<OnlineGame />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/friends" element={<Friends />} />
                  <Route path="/leaderboard" element={<LeaderBoard />} />
                  <Route path="/watch" element={<SpectateList />} />
                  <Route path="/watch/:id" element={<SpectateGame />} />
                  <Route path="/tournament" element={<TournamentLobby />} />
                  <Route path="/tournament/:id" element={<TournamentLobby />} />
                </Route>

                <Route element={<GuestGuard />}>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/signin" element={<SignIn />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </RoutedBoundary>
        </AppShell>
        <Toaster />
      </SocketProvider>
    </BrowserRouter>
  )
}
