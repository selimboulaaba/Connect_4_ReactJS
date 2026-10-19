import { cn } from './cn'

export function StatTile({ label, value, tone = 'fg', icon: Icon, className }) {
  const color = { fg: 'text-fg', success: 'text-success', danger: 'text-danger', warning: 'text-warning', primary: 'text-primary' }[tone]
  return (
    <div className={cn('rounded-2xl border border-line bg-bg/60 p-4', className)}>
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-subtle">
        {Icon && <Icon className="size-3.5" aria-hidden />}
        {label}
      </div>
      <div className={cn('mt-1 font-display text-3xl font-bold tabular', color)}>{value}</div>
    </div>
  )
}

/** Circular progress. value 0–1. */
export function ProgressRing({ value, size = 64, stroke = 6, className, trackClass = 'text-raised', barClass = 'text-primary', children }) {
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
          className={cn('transition-[stroke-dashoffset] duration-500 ease-out', barClass)}
        />
      </svg>
      {children && <span className="absolute inset-0 flex items-center justify-center">{children}</span>}
    </span>
  )
}

export function ProgressBar({ value, className, barClass = 'bg-primary' }) {
  const v = Math.max(0, Math.min(1, value || 0))
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-raised', className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <div className={cn('h-full rounded-full transition-[width] duration-500 ease-out', barClass)} style={{ width: `${v * 100}%` }} />
    </div>
  )
}
