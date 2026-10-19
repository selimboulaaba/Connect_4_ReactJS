import { CircleAlert, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Alert({ tone = 'danger', title, children, className }) {
  const Icon = tone === 'danger' ? CircleAlert : Info
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-btn border-2 p-3.5 text-sm font-medium',
        tone === 'danger' ? 'border-red/50 bg-red/10 text-red' : 'border-board/40 bg-board/10 text-foreground',
        className
      )}
    >
      <Icon className="mt-0.5 size-[18px] shrink-0" aria-hidden />
      <div>
        {title && <p className="font-extrabold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}

/** Empty states show an empty hole: nothing dropped here yet. */
export function EmptyState({ title, children, action, className }) {
  return (
    <div className={cn('flex flex-col items-start gap-1 py-6', className)}>
      <span className="board-hole mb-3 block size-12 rounded-full border-3 border-ink" aria-hidden />
      <p className="text-lg font-extrabold">{title}</p>
      {children && <p className="max-w-md text-muted-foreground">{children}</p>}
      {action && <div className="mt-4 flex flex-wrap gap-2">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-panel bg-muted', className)} aria-hidden />
}
