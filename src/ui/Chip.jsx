import { cn } from '@/lib/utils'

const TONES = {
  neutral: 'border-ink/20 bg-muted text-foreground',
  board: 'border-ink bg-board text-on-board',
  red: 'border-ink bg-red text-white',
  yellow: 'border-ink bg-yellow text-[hsl(var(--on-yellow))]',
  green: 'border-green/40 bg-green/10 text-green',
}

/** Small rounded label. Sentence case only. */
export function Badge({ tone = 'neutral', icon: Icon, className, children }) {
  return (
    <span className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full border-2 px-2.5 py-0.5 text-xs font-bold', TONES[tone], className)}>
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
    </span>
  )
}

export function LiveDot({ className }) {
  return (
    <span className={cn('relative flex size-2.5', className)} aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-red opacity-60" />
      <span className="relative inline-flex size-2.5 rounded-full bg-red" />
    </span>
  )
}
