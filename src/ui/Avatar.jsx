import { cn } from '@/lib/utils'
import { useAvatarUri } from '@/lib/avatars'

const SIZES = { xs: 'size-6', sm: 'size-8', md: 'size-11', lg: 'size-14', xl: 'size-24' }
const DOT = { xs: 'size-2.5', sm: 'size-3', md: 'size-3.5', lg: 'size-4', xl: 'size-5' }
const SEAT_BG = { p1: 'bg-red', p2: 'bg-yellow' }

/**
 * A player's generated avatar on a disc. `seat` ('p1' | 'p2') puts it on that player's
 * red or yellow disc during a game. Shows a plain disc while the avatar style downloads.
 */
export function Avatar({ avatarId, name, size = 'md', online, seat, className }) {
  const src = useAvatarUri(avatarId, name, seat)
  const box = cn('rounded-full border-2 border-ink', SIZES[size], seat ? SEAT_BG[seat] : 'bg-muted')
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {src ? <img src={src} alt="" aria-hidden draggable={false} className={box} /> : <span className={cn('block', box)} aria-hidden />}
      {online !== undefined && (
        <span
          className={cn('absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-ink', DOT[size], online ? 'bg-green' : 'bg-muted')}
          title={online ? 'Online' : 'Offline'}
        />
      )}
    </span>
  )
}
