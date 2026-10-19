import { cn } from '@/lib/utils'
import { AVATAR_COLORS, normalizeAvatarId } from './avatarIds'

const SIZES = { xs: 'size-6 text-[11px]', sm: 'size-8 text-sm', md: 'size-11 text-base', lg: 'size-14 text-xl', xl: 'size-24 text-4xl' }
const DOT = { xs: 'size-2.5', sm: 'size-3', md: 'size-3.5', lg: 'size-4', xl: 'size-5' }

const SEAT = { p1: ['hsl(var(--red))', '#fff'], p2: ['hsl(var(--yellow))', 'hsl(var(--on-yellow))'] }

/** Players are checkers: a coloured disc with their initial. `seat` paints it in that player's disc colour. */
export function Avatar({ avatarId, name, size = 'md', online, seat, className }) {
  const n = parseInt(normalizeAvatarId(avatarId).slice(7), 10)
  const [fill, text] = seat ? SEAT[seat] : AVATAR_COLORS[n - 1]
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn('disc flex items-center justify-center border-2 border-ink font-display leading-none', SIZES[size])}
        style={{ background: fill, color: text }}
        aria-hidden
      >
        <span className="relative z-[1]">{(name || '?').slice(0, 1).toUpperCase()}</span>
      </span>
      {online !== undefined && (
        <span
          className={cn('absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-ink', DOT[size], online ? 'bg-green' : 'bg-muted')}
          title={online ? 'Online' : 'Offline'}
        />
      )}
    </span>
  )
}
