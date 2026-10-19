import { cn } from '@/lib/utils'

/** A moulded tray: the one container style. Use `quiet` for secondary areas with no ledge. */
export function Card({ as: Tag = 'section', className, quiet = false, padded = true, children, ...props }) {
  return (
    <Tag
      className={cn(
        'rounded-panel bg-card',
        quiet ? 'border-2 border-ink/15' : 'border-3 border-ink shadow-plastic',
        padded && 'p-5 sm:p-6',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2 className="text-lg font-extrabold leading-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
