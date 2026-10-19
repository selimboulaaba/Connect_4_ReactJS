import { cn } from './cn'

const TONES = {
  neutral: 'bg-raised text-muted ring-line',
  primary: 'bg-primary/10 text-primary ring-primary/25',
  success: 'bg-success/10 text-success ring-success/25',
  danger: 'bg-danger/10 text-danger ring-danger/25',
  warning: 'bg-warning/10 text-warning ring-warning/25',
  p1: 'bg-p1/10 text-p1 ring-p1/25',
  p2: 'bg-p2/15 text-warning ring-p2/30',
}

export function Badge({ tone = 'neutral', icon: Icon, className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', TONES[tone], className)}>
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
    </span>
  )
}

export function LiveDot({ className }) {
  return (
    <span className={cn('relative flex size-2', className)} aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-danger opacity-60" />
      <span className="relative inline-flex size-2 rounded-full bg-danger" />
    </span>
  )
}
