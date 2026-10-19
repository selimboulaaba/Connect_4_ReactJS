import { cn } from '@/lib/utils'
import { Disc } from './Board'

/**
 * Result card over the board. `winner` ('p1' | 'p2' | 'draw') shows the winning disc,
 * or one of each for a draw.
 */
export function RoundOverlay({ winner, title, subtitle, children }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
      <div className="pointer-events-auto w-full max-w-[19rem] rounded-panel border-3 border-ink bg-card p-5 text-center shadow-plastic-lg animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="mb-3 flex justify-center gap-1.5" aria-hidden>
          {winner === 'draw' ? (
            <>
              <Disc player="p1" className="size-10 border-2 border-ink" />
              <Disc player="p2" className="size-10 border-2 border-ink" />
            </>
          ) : (
            winner && <Disc player={winner} className="size-12 border-2 border-ink" />
          )}
        </div>
        <h2 className="font-display text-display-sm">{title}</h2>
        {subtitle && <p className={cn('mt-1 text-muted-foreground')}>{subtitle}</p>}
        {children && <div className="mt-5 flex flex-col gap-2.5">{children}</div>}
      </div>
    </div>
  )
}
