import { cn } from '../../ui'

const TONES = {
  win: 'from-success/25 text-success',
  lose: 'from-danger/20 text-danger',
  draw: 'from-warning/20 text-warning',
  neutral: 'from-primary/20 text-primary',
}

/** Result card that floats over the board when a round ends. */
export function RoundOverlay({ tone = 'neutral', emoji, title, subtitle, children }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4">
      <div className={cn('pointer-events-auto w-full max-w-xs animate-scale-in rounded-3xl border border-line bg-gradient-to-b to-surface to-60% bg-surface p-5 text-center shadow-pop', TONES[tone])}>
        {emoji && <div className="mb-1 text-4xl" aria-hidden>{emoji}</div>}
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        {children && <div className="mt-4 flex flex-col gap-2">{children}</div>}
      </div>
    </div>
  )
}
