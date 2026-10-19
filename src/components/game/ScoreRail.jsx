import { Avatar, ProgressRing } from '@/ui'
import { cn } from '@/lib/utils'

const TINT = { p1: 'bg-red/10', p2: 'bg-yellow/25' }
const RING = { p1: 'text-red', p2: 'text-yellow' }

/**
 * side: { player, name, avatarId, score, active, isYou, online, subtitle, timeLeft, turnMs }
 */
function Side({ side, align }) {
  const { player, name, avatarId, score, active, isYou, online, subtitle, timeLeft, turnMs } = side
  const timed = active && typeof timeLeft === 'number' && turnMs
  const urgent = timed && timeLeft <= 10
  const right = align === 'right'

  return (
    <div className={cn('flex min-w-0 flex-1 items-center gap-2.5 px-3 py-3 transition-colors sm:gap-3 sm:px-4', right && 'flex-row-reverse text-right', active && TINT[player])}>
      <span className="relative flex size-[52px] shrink-0 items-center justify-center">
        {timed ? (
          <ProgressRing value={timeLeft / (turnMs / 1000)} size={52} stroke={4} barClass={urgent ? 'text-red' : RING[player]} trackClass="text-ink/15">
            <Avatar avatarId={avatarId} name={name} size="md" online={online} seat={player} />
          </ProgressRing>
        ) : (
          <Avatar avatarId={avatarId} name={name} size="md" online={online} seat={player} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-extrabold leading-tight">
          {name || 'Waiting…'}
          {isYou && <span className="ml-1 text-sm font-medium text-muted-foreground">(you)</span>}
        </p>
        <p className={cn('truncate text-sm', urgent ? 'font-extrabold text-red' : 'text-muted-foreground')}>
          {timed ? `${Math.ceil(timeLeft)}s to move` : subtitle}
        </p>
      </div>
      {typeof score === 'number' && <span className="font-display text-display-sm leading-none tabular sm:text-display-md">{score}</span>}
    </div>
  )
}

export function ScoreRail({ left, right, className }) {
  return (
    <div className={cn('mb-5 flex overflow-hidden rounded-panel border-3 border-ink bg-card shadow-plastic', className)}>
      <Side side={left} />
      <span className="w-[3px] shrink-0 bg-ink" aria-hidden />
      <Side side={right} align="right" />
    </div>
  )
}
