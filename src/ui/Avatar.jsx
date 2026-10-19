import { cn } from './cn'
import { normalizeAvatarId } from './avatarIds'

function palette(avatarId) {
  const n = parseInt(normalizeAvatarId(avatarId).slice(7), 10)
  const hue = ((n - 1) * 30 + 200) % 360
  return `linear-gradient(140deg, hsl(${hue} 80% 62%), hsl(${(hue + 40) % 360} 70% 42%))`
}

const SIZES = { xs: 'size-6 text-[10px]', sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg', xl: 'size-20 text-2xl' }
const DOT = { xs: 'size-2', sm: 'size-2.5', md: 'size-3', lg: 'size-3.5', xl: 'size-4' }

export function Avatar({ avatarId, name, size = 'md', online, className }) {
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn('inline-flex items-center justify-center rounded-full font-display font-bold uppercase text-white shadow-sm ring-2 ring-surface', SIZES[size])}
        style={{ background: palette(avatarId) }}
        aria-hidden
      >
        {(name || '?').slice(0, 1)}
      </span>
      {online !== undefined && (
        <span
          className={cn('absolute bottom-0 right-0 rounded-full ring-2 ring-surface', DOT[size], online ? 'bg-success' : 'bg-subtle')}
          title={online ? 'Online' : 'Offline'}
        />
      )}
    </span>
  )
}
