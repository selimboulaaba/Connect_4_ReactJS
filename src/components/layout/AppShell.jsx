import { NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { LuHome, LuUsers, LuTrophy, LuUser, LuSun, LuMoon, LuVolume2, LuVolumeX, LuEye, LuWifiOff } from 'react-icons/lu'
import { Avatar, Button, IconButton, cn } from '../../ui'
import { useMuted, useTheme } from '../../lib/preferences'
import { useSocket } from '../../lib/socketContext'
import { selectUser } from '../../store/userSlice'

export function Logo({ className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5 font-display text-lg font-bold tracking-tight', className)} aria-label="Connect 4 home">
      <span className="board-frame grid size-8 grid-cols-2 gap-[3px] rounded-lg p-[5px]" aria-hidden>
        <span className="board-hole rounded-full" />
        <span className="disc-p1 rounded-full" />
        <span className="disc-p2 rounded-full" />
        <span className="disc-p1 rounded-full" />
      </span>
      <span>
        Connect<span className="text-primary">4</span>
      </span>
    </Link>
  )
}

const NAV = [
  { to: '/', label: 'Play', icon: LuHome, end: true },
  { to: '/friends', label: 'Friends', icon: LuUsers, auth: true, badge: true },
  { to: '/leaderboard', label: 'Ranks', icon: LuTrophy, auth: true },
  { to: '/watch', label: 'Watch', icon: LuEye, auth: true, desktopOnly: true },
]

function CountBadge({ count, className }) {
  if (!count) return null
  return (
    <span className={cn('flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white ring-2 ring-surface', className)}>
      {count > 9 ? '9+' : count}
    </span>
  )
}

function Header() {
  const user = useSelector(selectUser)
  const signedIn = useSelector((s) => !!s.user.token)
  const loading = useSelector((s) => s.user.status === 'loading')
  const invites = user?.pendingGameInvites?.length || 0
  const { theme, toggle: toggleTheme } = useTheme()
  const { muted, toggle: toggleMute } = useMuted()
  const { socket, connected } = useSocket()

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.filter((n) => !n.auth || signedIn).map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn('relative flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition', isActive ? 'bg-raised text-fg' : 'text-muted hover:text-fg')
              }
            >
              <n.icon className="size-4" aria-hidden />
              {n.label}
              {n.badge && <CountBadge count={invites} />}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {socket && !connected && (
            <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning sm:flex" role="status">
              <LuWifiOff className="size-3.5" aria-hidden /> Reconnecting…
            </span>
          )}
          <IconButton icon={muted ? LuVolumeX : LuVolume2} label={muted ? 'Unmute sounds' : 'Mute sounds'} onClick={toggleMute} />
          <IconButton icon={theme === 'dark' ? LuSun : LuMoon} label={theme === 'dark' ? 'Light theme' : 'Dark theme'} onClick={toggleTheme} />
          {signedIn ? (
            <Link
              to="/profile"
              className="ml-1 hidden items-center gap-2.5 rounded-xl py-1 pl-1 pr-3 transition hover:bg-raised md:flex"
              aria-label="Your profile"
            >
              {loading || !user ? (
                <span className="size-8 animate-pulse rounded-full bg-raised" />
              ) : (
                <>
                  <Avatar avatarId={user.avatar} name={user.username} size="sm" />
                  <span className="leading-tight">
                    <span className="block max-w-[9rem] truncate text-sm font-semibold">{user.username}</span>
                    <span className="block text-xs text-subtle">Level {user.lvl}</span>
                  </span>
                </>
              )}
            </Link>
          ) : (
            <div className="ml-1 hidden gap-2 sm:flex">
              <Button to="/signin" variant="ghost" size="sm">Sign in</Button>
              <Button to="/signup" size="sm">Create account</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const user = useSelector(selectUser)
  const signedIn = useSelector((s) => !!s.user.token)
  const invites = user?.pendingGameInvites?.length || 0
  const items = [
    ...NAV.filter((n) => !n.desktopOnly && (!n.auth || signedIn)),
    signedIn ? { to: '/profile', label: 'Profile', icon: LuUser } : { to: '/signin', label: 'Sign in', icon: LuUser },
  ]
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl md:hidden" aria-label="Main">
      <div className="mx-auto flex max-w-md">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) => cn('relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold transition', isActive ? 'text-primary' : 'text-subtle')}
          >
            <span className="relative">
              <n.icon className="size-[22px]" aria-hidden />
              {n.badge && <CountBadge count={invites} className="absolute -right-2.5 -top-1.5" />}
            </span>
            {n.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <MobileNav />
    </div>
  )
}
