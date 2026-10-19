import { cn } from './cn'

export function Card({ as: Tag = 'section', className, padded = true, interactive = false, children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-2xl border border-line bg-surface shadow-card',
        padded && 'p-5 sm:p-6',
        interactive && 'transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-pop',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, action, icon: Icon, className }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
