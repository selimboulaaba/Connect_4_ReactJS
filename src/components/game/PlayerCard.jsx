import { Avatar, ProgressRing, cn } from '../../ui'
import { Disc } from './Board'

/**
 * One side of the scoreboard.
 * `timeLeft`/`turnMs` draw a countdown ring around the avatar while it's this player's turn.
 */
export function PlayerCard({ player, name, avatarId, score, active, isYou, online, subtitle, timeLeft, turnMs, align = 'left' }) {
  const showTimer = active && typeof timeLeft === 'number' && turnMs
  const urgent = showTimer && timeLeft <= 10
  const ringColor = player === 'p1' ? 'text-p1' : 'text-p2'

  return (
    <div
      className={cn(
        'relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border bg-surface p-3 transition-all sm:p-4',
        align === 'right' && 'flex-row-reverse text-right',
        active ? (player === 'p1' ? 'border-p1/60 shadow-[0_0_0_3px_hsl(var(--p1)/0.15)]' : 'border-p2/60 shadow-[0_0_0_3px_hsl(var(--p2)/0.18)]') : 'border-line'
      )}
    >
      <div className="relative shrink-0">
        {showTimer ? (
          <ProgressRing value={timeLeft / (turnMs / 1000)} size={52} stroke={4} barClass={urgent ? 'text-danger' : ringColor} trackClass="text-raised">
            <Avatar avatarId={avatarId} name={name} size="md" online={online} />
          </ProgressRing>
        ) : (
          <span className="flex size-[52px] items-center justify-center">
            <Avatar avatarId={avatarId} name={name} size="md" online={online} />
          </span>
        )}
        <Disc player={player} className={cn('absolute -bottom-0.5 size-4 ring-2 ring-surface', align === 'right' ? '-left-0.5' : '-right-0.5')} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">
          {name || 'Waiting…'}
          {isYou && <span className="ml-1.5 text-xs font-medium text-subtle">(you)</span>}
        </p>
        <p className={cn('truncate text-xs', urgent ? 'font-semibold text-danger' : active ? 'text-fg' : 'text-subtle')}>
          {showTimer ? `${Math.ceil(timeLeft)}s left` : subtitle}
        </p>
      </div>
      {typeof score === 'number' && <span className="font-display text-3xl font-bold tabular sm:text-4xl">{score}</span>}
    </div>
  )
}
