import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { House, Users, Trophy, User, Eye, Volume2, VolumeX, LogOut, Sun, Moon, Monitor, WifiOff } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, Button, IconButton } from '@/ui'
import { cn } from '@/lib/utils'
import { useMuted, useTheme } from '@/lib/preferences'
import { useSocket } from '@/lib/socketContext'
import { selectUser, signedOut } from '@/store/userSlice'

export function Logo({ className, onBoard = true }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2.5', className)} aria-label="Connect 4, home">
      <span className="grid size-9 grid-cols-2 gap-[3px] rounded-[0.6rem] border-[2.5px] border-ink bg-board p-[4px]" aria-hidden>
        <span className="board-hole rounded-full" />
        <span className="disc disc-yellow" />
        <span className="disc disc-red" />
        <span className="disc disc-red" />
      </span>
      <span className={cn('whitespace-nowrap font-display text-[1.35rem] leading-none', onBoard ? 'text-on-board' : 'text-foreground')}>Connect 4</span>
    </Link>
  )
}

const NAV = [
  { to: '/', label: 'Play', icon: House, end: true },
  { to: '/friends', label: 'Friends', icon: Users, auth: true, badge: true },
  { to: '/leaderboard', label: 'Leaderboard', short: 'Ranks', icon: Trophy, auth: true },
  { to: '/watch', label: 'Watch', icon: Eye, auth: true, desktopOnly: true },
]

const THEMES = [
  { value: 'system', label: 'Match device', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

function CountBadge({ count, className }) {
  if (!count) return null
  return (
    <span className={cn('flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-ink bg-red px-1 text-[11px] font-extrabold leading-none text-white', className)}>
      {count > 9 ? '9+' : count}
    </span>
  )
}

function UserMenu({ user }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pref, setPref } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 text-on-board transition-colors hover:bg-white/10 sm:pr-3.5" aria-label="Account menu">
          <Avatar avatarId={user?.avatar} name={user?.username} size="sm" />
          <span className="hidden max-w-[9rem] truncate font-bold sm:block">{user?.username}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="px-2.5 py-2">
          <span className="block truncate font-extrabold">{user?.username}</span>
          <span className="block text-sm font-medium text-muted-foreground">Level {user?.lvl}, {user?.xp} XP</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate('/profile')}><User /> Profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate('/watch')}><Eye /> Watch live games</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="px-2.5 text-sm text-muted-foreground">Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={pref} onValueChange={setPref}>
          {THEMES.map((t) => (
            <DropdownMenuRadioItem key={t.value} value={t.value} className="rounded-btn py-2 text-sm font-medium">
              <t.icon className="mr-2 size-4" /> {t.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => { dispatch(signedOut()); navigate('/') }} className="text-red focus:text-red">
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Header() {
  const user = useSelector(selectUser)
  const signedIn = useSelector((s) => !!s.user.token)
  const invites = user?.pendingGameInvites?.length || 0
  const { muted, toggle: toggleMute } = useMuted()
  const { pref, setPref } = useTheme()
  const { socket, connected } = useSocket()
  const nextTheme = THEMES[(THEMES.findIndex((t) => t.value === pref) + 1) % THEMES.length]

  return (
    <header className="sticky top-0 z-40 border-b-3 border-ink bg-board">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Logo />
        <nav className={cn('ml-6 hidden items-center gap-1', signedIn && 'md:flex')} aria-label="Main">
          {NAV.filter((n) => !n.auth || signedIn).map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  'flex h-10 items-center gap-2 rounded-full border-2 px-4 font-bold transition-colors',
                  isActive ? 'border-ink bg-card text-foreground' : 'border-transparent text-on-board/85 hover:text-on-board'
                )
              }
            >
              {n.label}
              {n.badge && <CountBadge count={invites} />}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {socket && !connected && (
            <span className="mr-1 hidden items-center gap-1.5 rounded-full border-2 border-ink bg-yellow px-3 py-1 text-sm font-bold text-[hsl(var(--on-yellow))] sm:flex" role="status">
              <WifiOff className="size-4" aria-hidden /> Reconnecting
            </span>
          )}
          <IconButton icon={muted ? VolumeX : Volume2} label={muted ? 'Turn sounds on' : 'Turn sounds off'} onClick={toggleMute} className={cn('text-on-board hover:bg-white/10 hover:text-on-board', !signedIn && 'hidden sm:inline-flex')} />
          {signedIn ? (
            <UserMenu user={user} />
          ) : (
            <>
              <IconButton icon={nextTheme.icon} label={`Theme: ${THEMES.find((t) => t.value === pref)?.label}. Switch to ${nextTheme.label.toLowerCase()}`} onClick={() => setPref(nextTheme.value)} className="text-on-board hover:bg-white/10 hover:text-on-board" />
              <Button to="/signin" variant="secondary" size="sm" className="ml-1">Sign in</Button>
              <Button to="/signup" size="sm" className="ml-1 hidden sm:inline-flex">Create account</Button>
            </>
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
    signedIn ? { to: '/profile', label: 'Profile', icon: User } : { to: '/signin', label: 'Sign in', icon: User },
  ]
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t-3 border-ink bg-card md:hidden" aria-label="Main">
      <div className="mx-auto flex max-w-md">
        {items.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className="group flex flex-1 flex-col items-center gap-0.5 pb-2 pt-2 text-xs font-bold text-muted-foreground aria-[current=page]:text-foreground">
            <span className="relative flex h-8 w-14 items-center justify-center rounded-full transition-colors group-aria-[current=page]:bg-board group-aria-[current=page]:text-on-board">
              <n.icon className="size-[22px]" aria-hidden />
              {n.badge && <CountBadge count={invites} className="absolute -right-1 -top-1.5" />}
            </span>
            {n.short || n.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function AppShell({ children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:border-3 focus:border-ink focus:bg-yellow focus:px-4 focus:py-2 focus:font-bold">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <MobileNav />
    </div>
  )
}
