import { LuAlertCircle, LuInfo } from 'react-icons/lu'
import { cn } from './cn'

export function Alert({ tone = 'danger', title, children, className }) {
  const Icon = tone === 'danger' ? LuAlertCircle : LuInfo
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex gap-3 rounded-xl border p-3.5 text-sm',
        tone === 'danger' ? 'border-danger/30 bg-danger/10 text-danger' : 'border-primary/25 bg-primary/10 text-primary',
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? 'opacity-90' : ''}>{children}</div>
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, children, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-10 text-center', className)}>
      {Icon && (
        <span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-raised text-subtle">
          <Icon className="size-6" aria-hidden />
        </span>
      )}
      <p className="font-semibold">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-raised', className)} aria-hidden />
}
