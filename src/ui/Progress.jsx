import { cn } from '@/lib/utils'

/** XP progress as a row of seven holes filling with yellow discs, like a board's bottom row. */
export function XpSlots({ value, className, label }) {
  const v = Math.max(0, Math.min(1, value || 0))
  const filled = Math.floor(v * 7)
  return (
    <div className={cn('flex items-center gap-1.5', className)} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      {Array.from({ length: 7 }, (_, i) => (
        <span key={i} className="board-hole block size-4 rounded-full border-2 border-ink sm:size-5">
          {i < filled && <span className="disc disc-yellow block size-full" />}
        </span>
      ))}
    </div>
  )
}

/** Circular countdown. value 0–1. */
export function ProgressRing({ value, size = 64, stroke = 6, className, trackClass = 'text-muted', barClass = 'text-board', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(1, value || 0))
  return (
    <span className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke="currentColor" className={trackClass} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          stroke="currentColor"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          className={cn('transition-[stroke-dashoffset] duration-300 ease-linear', barClass)}
        />
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  )
}
